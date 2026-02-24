package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httprate"
	"github.com/go-playground/validator/v10"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/unrolled/secure"
)

type AppConfig struct {
	Port string
}

type App struct {
	Router   *chi.Mux
	Validate *validator.Validate
	Config   AppConfig
	Storage  *DatabaseStore
}

type ProductType string

const (
	ProductTypeHorizontal ProductType = "horizontal"
	ProductTypeVertical   ProductType = "vertical"
	ProductTypeRoller     ProductType = "roller"
)

type Material struct {
	ID                int64   `json:"id"`
	SupplierCode      string  `json:"supplierCode"`
	Name              string  `json:"name"`
	Category          string  `json:"category"`
	Color             string  `json:"color,omitempty"`
	LightTransmission int     `json:"lightTransmission"`
	PricePerM2        float64 `json:"pricePerM2"`
	ImageURL          string  `json:"imageUrl,omitempty"`
}

type Promotion struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Badge       string `json:"badge,omitempty"`
}

type PricingConfig struct {
	FrameMarkup       float64  `json:"frameMarkup"`
	ProductionMarkup  float64  `json:"productionMarkup"`
	MinAreaM2         float64  `json:"minAreaM2"`
	InstallationFee   *float64 `json:"installationFee,omitempty"`
	MeasurementFee    *float64 `json:"measurementFee,omitempty"`
	MaterialBasePrice *float64 `json:"materialBasePrice,omitempty"`
	ComplexityFactor  *float64 `json:"complexityFactor,omitempty"`
}

type SiteContent struct {
	ID          int64  `json:"id"`
	Page        string `json:"page"`
	Section     string `json:"section"`
	ContentType string `json:"contentType"`
	Key         string `json:"key"`
	Value       string `json:"value"`
	IsActive    bool   `json:"isActive"`
	Order       int    `json:"order,omitempty"`
}

type SiteConfig struct {
	PrimaryColor   string `json:"primaryColor"`
	SecondaryColor string `json:"secondaryColor"`
	AccentColor    string `json:"accentColor"`
	CompanyName    string `json:"companyName"`
	CompanyPhone   string `json:"companyPhone"`
	CompanyEmail   string `json:"companyEmail"`
	CompanyAddress string `json:"companyAddress"`
}

type Review struct {
	ID              int64     `json:"id"`
	Name            string    `json:"name"`
	Rating          int       `json:"rating"`
	Comment         string    `json:"comment"`
	ImageURL        string    `json:"imageUrl,omitempty"`
	CompanyResponse string    `json:"companyResponse,omitempty"`
	CreatedAt       time.Time `json:"createdAt"`
}

type PriceEstimateRequest struct {
	WidthMm     int         `json:"widthMm" validate:"required,gt=0,lte=4000"`
	HeightMm    int         `json:"heightMm" validate:"required,gt=0,lte=3000"`
	ProductType ProductType `json:"productType" validate:"required,oneof=horizontal vertical roller"`
	MaterialID  int64       `json:"materialId" validate:"required,gt=0"`
}

type PriceEstimateResponse struct {
	Price     float64 `json:"price"`
	Currency  string  `json:"currency"`
	AreaM2    float64 `json:"areaM2"`
	Breakdown string  `json:"breakdown"`
}

type DatabaseStore struct {
	db       *sql.DB
	validate *validator.Validate
}

func newDatabaseStore(dbURL string) (*DatabaseStore, error) {
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	store := &DatabaseStore{
		db:       db,
		validate: validator.New(),
	}

	// Run migrations
	if err := store.runMigrations(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	return store, nil
}

func (s *DatabaseStore) runMigrations() error {
	migrationFile := "migrations/001_initial_schema.sql"
	content, err := os.ReadFile(migrationFile)
	if err != nil {
		return fmt.Errorf("failed to read migration file: %w", err)
	}

	_, err = s.db.Exec(string(content))
	if err != nil {
		return fmt.Errorf("failed to execute migration: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}

func (s *DatabaseStore) Close() error {
	return s.db.Close()
}

// Materials
func (s *DatabaseStore) getMaterials() ([]Material, error) {
	rows, err := s.db.Query(`
		SELECT id, supplier_code, name, category, color, light_transmission, price_per_m2, image_url 
		FROM materials 
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var materials []Material
	for rows.Next() {
		var m Material
		err := rows.Scan(
			&m.ID, &m.SupplierCode, &m.Name, &m.Category, &m.Color,
			&m.LightTransmission, &m.PricePerM2, &m.ImageURL,
		)
		if err != nil {
			return nil, err
		}
		materials = append(materials, m)
	}
	return materials, nil
}

func (s *DatabaseStore) findMaterial(id int64) (*Material, error) {
	var m Material
	err := s.db.QueryRow(`
		SELECT id, supplier_code, name, category, color, light_transmission, price_per_m2, image_url 
		FROM materials WHERE id = $1
	`, id).Scan(
		&m.ID, &m.SupplierCode, &m.Name, &m.Category, &m.Color,
		&m.LightTransmission, &m.PricePerM2, &m.ImageURL,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &m, err
}

func (s *DatabaseStore) addMaterial(material Material) (Material, error) {
	err := s.db.QueryRow(`
		INSERT INTO materials (supplier_code, name, category, color, light_transmission, price_per_m2, image_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, material.SupplierCode, material.Name, material.Category, material.Color,
		material.LightTransmission, material.PricePerM2, material.ImageURL).Scan(&material.ID)
	return material, err
}

func (s *DatabaseStore) updateMaterial(material Material) (*Material, error) {
	_, err := s.db.Exec(`
		UPDATE materials 
		SET supplier_code = $2, name = $3, category = $4, color = $5, 
		    light_transmission = $6, price_per_m2 = $7, image_url = $8, updated_at = NOW()
		WHERE id = $1
	`, material.ID, material.SupplierCode, material.Name, material.Category, material.Color,
		material.LightTransmission, material.PricePerM2, material.ImageURL)
	if err != nil {
		return nil, err
	}
	return &material, nil
}

func (s *DatabaseStore) deleteMaterial(id int64) error {
	_, err := s.db.Exec("DELETE FROM materials WHERE id = $1", id)
	return err
}

// Promotions
func (s *DatabaseStore) getPromotions() ([]Promotion, error) {
	rows, err := s.db.Query(`
		SELECT id, title, description, badge 
		FROM promotions 
		WHERE is_active = true 
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var promotions []Promotion
	for rows.Next() {
		var p Promotion
		err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.Badge)
		if err != nil {
			return nil, err
		}
		promotions = append(promotions, p)
	}
	return promotions, nil
}

// Reviews
func (s *DatabaseStore) getReviews() ([]Review, error) {
	rows, err := s.db.Query(`
		SELECT id, name, rating, comment, image_url, company_response, created_at 
		FROM reviews 
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []Review
	for rows.Next() {
		var r Review
		err := rows.Scan(&r.ID, &r.Name, &r.Rating, &r.Comment, &r.ImageURL, &r.CompanyResponse, &r.CreatedAt)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, r)
	}
	return reviews, nil
}

func (s *DatabaseStore) addReview(review Review) (Review, error) {
	err := s.db.QueryRow(`
		INSERT INTO reviews (name, rating, comment, image_url, company_response)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`, review.Name, review.Rating, review.Comment, review.ImageURL, review.CompanyResponse).Scan(&review.ID, &review.CreatedAt)
	return review, err
}

// Pricing Config
func (s *DatabaseStore) getPricingConfig() (PricingConfig, error) {
	var config PricingConfig
	err := s.db.QueryRow(`
		SELECT frame_markup, production_markup, min_area_m2, installation_fee, measurement_fee, material_base_price, complexity_factor
		FROM pricing_config 
		ORDER BY id DESC 
		LIMIT 1
	`).Scan(
		&config.FrameMarkup, &config.ProductionMarkup, &config.MinAreaM2,
		&config.InstallationFee, &config.MeasurementFee, &config.MaterialBasePrice, &config.ComplexityFactor,
	)
	if err == sql.ErrNoRows {
		// Return default values if no config exists
		return PricingConfig{
			FrameMarkup:      0.3,
			ProductionMarkup: 0.5,
			MinAreaM2:        0.5,
		}, nil
	}
	return config, err
}

func (s *DatabaseStore) updatePricingConfig(config PricingConfig) error {
	_, err := s.db.Exec(`
		INSERT INTO pricing_config (frame_markup, production_markup, min_area_m2, installation_fee, measurement_fee, material_base_price, complexity_factor)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, config.FrameMarkup, config.ProductionMarkup, config.MinAreaM2,
		config.InstallationFee, config.MeasurementFee, config.MaterialBasePrice, config.ComplexityFactor)
	return err
}

// Site Content
func (s *DatabaseStore) getSiteContent() ([]SiteContent, error) {
	rows, err := s.db.Query(`
		SELECT id, page, section, content_type, key_name, value, is_active, order_index
		FROM site_content 
		ORDER BY page, section, order_index
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var content []SiteContent
	for rows.Next() {
		var c SiteContent
		err := rows.Scan(&c.ID, &c.Page, &c.Section, &c.ContentType, &c.Key, &c.Value, &c.IsActive, &c.Order)
		if err != nil {
			return nil, err
		}
		content = append(content, c)
	}
	return content, nil
}

func (s *DatabaseStore) getSiteContentByPage(page string) ([]SiteContent, error) {
	rows, err := s.db.Query(`
		SELECT id, page, section, content_type, key_name, value, is_active, order_index
		FROM site_content 
		WHERE page = $1 AND is_active = true
		ORDER BY order_index
	`, page)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var content []SiteContent
	for rows.Next() {
		var c SiteContent
		err := rows.Scan(&c.ID, &c.Page, &c.Section, &c.ContentType, &c.Key, &c.Value, &c.IsActive, &c.Order)
		if err != nil {
			return nil, err
		}
		content = append(content, c)
	}
	return content, nil
}

func (s *DatabaseStore) updateSiteContent(content SiteContent) (*SiteContent, error) {
	_, err := s.db.Exec(`
		UPDATE site_content 
		SET page = $2, section = $3, content_type = $4, key_name = $5, value = $6, is_active = $7, order_index = $8, updated_at = NOW()
		WHERE id = $1
	`, content.ID, content.Page, content.Section, content.ContentType, content.Key, content.Value, content.IsActive, content.Order)
	if err != nil {
		return nil, err
	}
	return &content, nil
}

func (s *DatabaseStore) addSiteContent(content SiteContent) (SiteContent, error) {
	err := s.db.QueryRow(`
		INSERT INTO site_content (page, section, content_type, key_name, value, is_active, order_index)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, content.Page, content.Section, content.ContentType, content.Key, content.Value, content.IsActive, content.Order).Scan(&content.ID)
	return content, err
}

// Site Config
func (s *DatabaseStore) getSiteConfig() (SiteConfig, error) {
	var config SiteConfig
	err := s.db.QueryRow(`
		SELECT primary_color, secondary_color, accent_color, company_name, company_phone, company_email, company_address
		FROM site_config 
		ORDER BY id DESC 
		LIMIT 1
	`).Scan(&config.PrimaryColor, &config.SecondaryColor, &config.AccentColor, &config.CompanyName, &config.CompanyPhone, &config.CompanyEmail, &config.CompanyAddress)
	if err == sql.ErrNoRows {
		// Return default values if no config exists
		return SiteConfig{
			PrimaryColor:   "#blue-600",
			SecondaryColor: "#blue-800",
			AccentColor:    "#pink-500",
			CompanyName:    "Северный Контур",
			CompanyPhone:   "+7 (812) 123-45-67",
			CompanyEmail:   "info@severnyj-kontur.ru",
			CompanyAddress: "Санкт-Петербург, ул Боровая, д. 52",
		}, nil
	}
	return config, err
}

func (s *DatabaseStore) updateSiteConfig(config SiteConfig) error {
	_, err := s.db.Exec(`
		INSERT INTO site_config (primary_color, secondary_color, accent_color, company_name, company_phone, company_email, company_address)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, config.PrimaryColor, config.SecondaryColor, config.AccentColor, config.CompanyName, config.CompanyPhone, config.CompanyEmail, config.CompanyAddress)
	return err
}

// Telegram Subscribers
func (s *DatabaseStore) getTelegramSubscribers() ([]int64, error) {
	rows, err := s.db.Query("SELECT chat_id FROM telegram_subscribers ORDER BY subscribed_at")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscribers []int64
	for rows.Next() {
		var chatID int64
		if err := rows.Scan(&chatID); err != nil {
			return nil, err
		}
		subscribers = append(subscribers, chatID)
	}
	return subscribers, nil
}

func (s *DatabaseStore) addTelegramSubscriber(chatID int64) error {
	_, err := s.db.Exec(`
		INSERT INTO telegram_subscribers (chat_id) 
		VALUES ($1) 
		ON CONFLICT (chat_id) DO NOTHING
	`, chatID)
	return err
}

func (s *DatabaseStore) removeTelegramSubscriber(chatID int64) error {
	_, err := s.db.Exec("DELETE FROM telegram_subscribers WHERE chat_id = $1", chatID)
	return err
}

func main() {
	cfg := AppConfig{
		Port: getEnv("BACKEND_PORT", getEnv("PORT", "8080")),
	}

	// Initialize database
	dbURL := getEnv("DATABASE_URL", "postgres://user:password@localhost/jaluxi?sslmode=disable")
	storage, err := newDatabaseStore(dbURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer storage.Close()

	app := &App{
		Router:   chi.NewRouter(),
		Validate: validator.New(),
		Config:   cfg,
		Storage:  storage,
	}

	app.setupMiddleware()
	app.registerRoutes()

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           app.Router,
		ReadHeaderTimeout: 10 * time.Second,
	}

	log.Printf("Jaluxi backend listening on :%s", cfg.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}

func getEnv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if payload == nil {
		return
	}
	_ = json.NewEncoder(w).Encode(payload)
}

func (a *App) setupMiddleware() {
	secureMiddleware := secure.New(secure.Options{
		FrameDeny:             true,
		BrowserXssFilter:      true,
		ContentTypeNosniff:    true,
		ReferrerPolicy:        "strict-origin-when-cross-origin",
		ContentSecurityPolicy: "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';",
	})

	a.Router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if err := secureMiddleware.Process(w, r); err != nil {
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// Basic global rate limit (per IP)
	a.Router.Use(httprate.LimitByIP(200, time.Minute))

	// CORS – adapted at deploy time if needed
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: false,
	})
	a.Router.Use(corsMiddleware.Handler)
}

func (a *App) registerRoutes() {
	a.Router.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	a.Router.Route("/api", func(r chi.Router) {
		// Lightweight rate limiting on write endpoints.
		r.Group(func(r chi.Router) {
			r.Use(httprate.LimitByIP(20, time.Minute))
			r.Post("/reviews", a.handleCreateReview())
		})

		// Admin endpoints with stricter rate limiting
		r.Group(func(r chi.Router) {
			r.Use(httprate.LimitByIP(10, time.Minute))
			r.Get("/pricing", a.handleGetPricingConfig())
			r.Put("/pricing", a.handleUpdatePricingConfig())
			r.Post("/materials", a.handleCreateMaterial())
			r.Put("/materials/{id}", a.handleUpdateMaterial())
			r.Delete("/materials/{id}", a.handleDeleteMaterial())

			// Site content management
			r.Get("/content", a.handleGetSiteContent())
			r.Get("/content/{page}", a.handleGetSiteContentByPage())
			r.Put("/content/{id}", a.handleUpdateSiteContent())
			r.Post("/content", a.handleCreateSiteContent())

			// Site config
			r.Get("/config", a.handleGetSiteConfig())
			r.Put("/config", a.handleUpdateSiteConfig())

			// Telegram subscribers management
			r.Get("/telegram/subscribers", a.handleGetTelegramSubscribers())
			r.Post("/telegram/subscribers/{chatId}", a.handleAddTelegramSubscriber())
			r.Delete("/telegram/subscribers/{chatId}", a.handleRemoveTelegramSubscriber())
		})

		r.Get("/catalog", a.handleCatalog())
		r.Get("/promotions", a.handlePromotions())
		r.Get("/reviews", a.handleReviews())
		r.Post("/estimate", a.handleEstimate())
	})

	// Static frontend bundle (Next.js export) – path can be overridden via env.
	staticDir := getEnv("FRONTEND_DIR", "./web/out")
	fileServer := http.FileServer(http.Dir(staticDir))
	a.Router.Handle("/*", fileServer)
}

// Handlers
func (a *App) handleCatalog() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		materials, err := a.Storage.getMaterials()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, materials)
	}
}

func (a *App) handlePromotions() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		promotions, err := a.Storage.getPromotions()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, promotions)
	}
}

func (a *App) handleReviews() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		reviews, err := a.Storage.getReviews()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, reviews)
	}
}

func (a *App) handleCreateReview() http.HandlerFunc {
	type input struct {
		Name     string `json:"name" validate:"required,min=2,max=80"`
		Rating   int    `json:"rating" validate:"required,min=1,max=5"`
		Comment  string `json:"comment" validate:"required,min=10,max=1000"`
		ImageURL string `json:"imageUrl,omitempty"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		var in input
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		review := Review{
			Name:     in.Name,
			Rating:   in.Rating,
			Comment:  in.Comment,
			ImageURL: in.ImageURL,
		}
		created, err := a.Storage.addReview(review)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusCreated, created)
	}
}

func (a *App) handleEstimate() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var in PriceEstimateRequest
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(in); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		material, err := a.Storage.findMaterial(in.MaterialID)
		if err != nil || material == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "material not found"})
			return
		}

		config, err := a.Storage.getPricingConfig()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}

		widthM := float64(in.WidthMm) / 1000.0
		heightM := float64(in.HeightMm) / 1000.0
		area := widthM * heightM
		if area < config.MinAreaM2 {
			area = config.MinAreaM2
		}

		// Базовая стоимость: площадь × стоимость м² материала
		materialCost := area * material.PricePerM2

		// Добавляем стоимость каркаса (30% от стоимости материала)
		frameCost := materialCost * config.FrameMarkup

		// Себестоимость: материал + каркас
		costPrice := materialCost + frameCost

		// Добавляем наценку производства (50% от себестоимости)
		productionCost := costPrice * config.ProductionMarkup

		// Итоговая стоимость: себестоимость + наценка производства
		total := costPrice + productionCost

		// Округляем до 10 рублей
		total = math.Round(total/10) * 10

		resp := PriceEstimateResponse{
			Price:    total,
			Currency: "₽",
			AreaM2:   area,
			Breakdown: fmt.Sprintf("Площадь: %.2f м² × %d ₽/м² = %.0f ₽ (материал) + %.0f ₽ (каркас %.0f%%) + %.0f ₽ (наценка %.0f%%) = %.0f ₽",
				area, int(material.PricePerM2), materialCost, frameCost, config.FrameMarkup*100,
				productionCost, config.ProductionMarkup*100, total),
		}

		writeJSON(w, http.StatusOK, resp)
	}
}

func (a *App) handleGetPricingConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		config, err := a.Storage.getPricingConfig()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, config)
	}
}

func (a *App) handleUpdatePricingConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var config PricingConfig
		if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(config); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		if err := a.Storage.updatePricingConfig(config); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, config)
	}
}

func (a *App) handleCreateMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var material Material
		if err := json.NewDecoder(r.Body).Decode(&material); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(material); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		created, err := a.Storage.addMaterial(material)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusCreated, created)
	}
}

func (a *App) handleUpdateMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid material ID"})
			return
		}

		var material Material
		if err := json.NewDecoder(r.Body).Decode(&material); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(material); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		material.ID = id
		updated, err := a.Storage.updateMaterial(material)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		if updated == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "material not found"})
			return
		}

		writeJSON(w, http.StatusOK, updated)
	}
}

func (a *App) handleDeleteMaterial() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid material ID"})
			return
		}

		if err := a.Storage.deleteMaterial(id); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
	}
}

func (a *App) handleGetSiteContent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		content, err := a.Storage.getSiteContent()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, content)
	}
}

func (a *App) handleGetSiteContentByPage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page := chi.URLParam(r, "page")
		content, err := a.Storage.getSiteContentByPage(page)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, content)
	}
}

func (a *App) handleUpdateSiteContent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid content ID"})
			return
		}

		var content SiteContent
		if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		content.ID = id
		updated, err := a.Storage.updateSiteContent(content)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		if updated == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "content not found"})
			return
		}

		writeJSON(w, http.StatusOK, updated)
	}
}

func (a *App) handleCreateSiteContent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var content SiteContent
		if err := json.NewDecoder(r.Body).Decode(&content); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Validate.Struct(content); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "validation failed"})
			return
		}

		created, err := a.Storage.addSiteContent(content)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusCreated, created)
	}
}

func (a *App) handleGetSiteConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		config, err := a.Storage.getSiteConfig()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, config)
	}
}

func (a *App) handleUpdateSiteConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var config SiteConfig
		if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
			return
		}

		if err := a.Storage.updateSiteConfig(config); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, config)
	}
}

func (a *App) handleGetTelegramSubscribers() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		subscribers, err := a.Storage.getTelegramSubscribers()
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"subscribers": subscribers,
			"count":       len(subscribers),
		})
	}
}

func (a *App) handleAddTelegramSubscriber() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		chatIDStr := chi.URLParam(r, "chatId")
		chatID, err := strconv.ParseInt(chatIDStr, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid chat ID"})
			return
		}

		if err := a.Storage.addTelegramSubscriber(chatID); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "subscribed"})
	}
}

func (a *App) handleRemoveTelegramSubscriber() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		chatIDStr := chi.URLParam(r, "chatId")
		chatID, err := strconv.ParseInt(chatIDStr, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid chat ID"})
			return
		}

		if err := a.Storage.removeTelegramSubscriber(chatID); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "unsubscribed"})
	}
}
