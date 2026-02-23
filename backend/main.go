package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httprate"
	"github.com/go-playground/validator/v10"
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

	storage *inMemoryStore
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
	LightTransmission int     `json:"lightTransmission"` // Светопропускаемость в процентах (0-100)
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
	FrameMarkup      float64 `json:"frameMarkup"`      // Коэффициент стоимости каркаса (30% = 0.3)
	ProductionMarkup float64 `json:"productionMarkup"` // Наценка производства (50% = 0.5)
	MinAreaM2        float64 `json:"minAreaM2"`        // Минимальная площадь в м²
}

type SiteContent struct {
	ID          int64  `json:"id"`
	Page        string `json:"page"`        // страница (home, about, contacts, etc.)
	Section     string `json:"section"`     // секция (hero, features, cta, etc.)
	ContentType string `json:"contentType"` // тип (text, color, block)
	Key         string `json:"key"`         // ключ (title, description, background, etc.)
	Value       string `json:"value"`       // значение
	IsActive    bool   `json:"isActive"`    // активен ли блок
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
	ID        int64     `json:"id"`
	Name      string    `json:"name" validate:"required,min=2,max=80"`
	Rating    int       `json:"rating" validate:"required,min=1,max=5"`
	Comment   string    `json:"comment" validate:"required,min=10,max=1000"`
	ImageURL  string    `json:"imageUrl,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
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

type inMemoryStore struct {
	mu            sync.RWMutex
	materials     []Material
	promotions    []Promotion
	reviews       []Review
	pricingConfig PricingConfig
	siteContent   []SiteContent
	siteConfig    SiteConfig
	nextID        int64
}

func newInMemoryStore() *inMemoryStore {
	s := &inMemoryStore{
		pricingConfig: PricingConfig{
			FrameMarkup:      0.3, // 30%
			ProductionMarkup: 0.5, // 50%
			MinAreaM2:        0.5, // Минимальная площадь
		},
		siteConfig: SiteConfig{
			PrimaryColor:   "#blue-600",
			SecondaryColor: "#blue-800",
			AccentColor:    "#pink-500",
			CompanyName:    "Jaluxi",
			CompanyPhone:   "+7 (495) 123-45-67",
			CompanyEmail:   "info@jaluxi.ru",
			CompanyAddress: "Москва, ул. Примерная, д. 123",
		},
		siteContent: []SiteContent{
			{
				ID:          1,
				Page:        "home",
				Section:     "hero",
				ContentType: "text",
				Key:         "title",
				Value:       "Жалюзи под ваш размер окна за 3–5 дней",
				IsActive:    true,
			},
			{
				ID:          2,
				Page:        "home",
				Section:     "hero",
				ContentType: "text",
				Key:         "subtitle",
				Value:       "Изготовление и ремонт жалюзи в Москве",
				IsActive:    true,
			},
			{
				ID:          3,
				Page:        "home",
				Section:     "hero",
				ContentType: "text",
				Key:         "description",
				Value:       "Подбираем материалы у надежных поставщиков, собираем жалюзи под ваш проем и выезжаем на замер и установку.",
				IsActive:    true,
			},
			{
				ID:          4,
				Page:        "about",
				Section:     "hero",
				ContentType: "text",
				Key:         "title",
				Value:       "О компании Jaluxi",
				IsActive:    true,
			},
			{
				ID:          5,
				Page:        "about",
				Section:     "hero",
				ContentType: "text",
				Key:         "subtitle",
				Value:       "Профессиональное производство и установка жалюзи с 2013 года",
				IsActive:    true,
			},
		},
		materials: []Material{
			{
				ID:                1,
				SupplierCode:      "INT-HOR-ALU-25-WHITE",
				Name:              "Горизонтальные алюминиевые 25 мм, белые",
				Category:          "Горизонтальные жалюзи",
				Color:             "Белый",
				LightTransmission: 70, // 70% светопропускаемость
				PricePerM2:        900,
				ImageURL:          "/images/materials/horizontal-white.jpg",
			},
			{
				ID:                2,
				SupplierCode:      "INT-VERT-TEXTURE-BEIGE",
				Name:              "Вертикальные тканевые, бежевые",
				Category:          "Вертикальные жалюзи",
				Color:             "Бежевый",
				LightTransmission: 50, // 50% светопропускаемость
				PricePerM2:        1100,
				ImageURL:          "/images/materials/vertical-beige.jpg",
			},
			{
				ID:                3,
				SupplierCode:      "INT-ROLLER-BLACKOUT-GREY",
				Name:              "Рулонные блэкаут, серые",
				Category:          "Рулонные шторы",
				Color:             "Серый",
				LightTransmission: 0, // 0% светопропускаемость (блэкаут)
				PricePerM2:        1300,
				ImageURL:          "/images/materials/roller-grey.jpg",
			},
		},
		promotions: []Promotion{
			{
				ID:          1,
				Title:       "Скидка 10% на второй комплект",
				Description: "При заказе жалюзи на два и более окна — скидка на каждый следующий комплект.",
				Badge:       "Акция",
			},
		},
		reviews: []Review{},
		nextID:  6, // Учитываем 5 начальных элементов контента
	}
	return s
}

func (s *inMemoryStore) addReview(r Review) Review {
	s.mu.Lock()
	defer s.mu.Unlock()
	r.ID = s.nextID
	s.nextID++
	s.reviews = append([]Review{r}, s.reviews...)
	return r
}

func (s *inMemoryStore) getMaterials() []Material {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Material(nil), s.materials...)
}

func (s *inMemoryStore) findMaterial(id int64) *Material {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for i := range s.materials {
		if s.materials[i].ID == id {
			m := s.materials[i]
			return &m
		}
	}
	return nil
}

func (s *inMemoryStore) getPromotions() []Promotion {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Promotion(nil), s.promotions...)
}

func (s *inMemoryStore) getReviews() []Review {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]Review(nil), s.reviews...)
}

func (s *inMemoryStore) getPricingConfig() PricingConfig {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.pricingConfig
}

func (s *inMemoryStore) updatePricingConfig(config PricingConfig) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.pricingConfig = config
}

func (s *inMemoryStore) addMaterial(material Material) Material {
	s.mu.Lock()
	defer s.mu.Unlock()
	material.ID = s.nextID
	s.nextID++
	s.materials = append(s.materials, material)
	return material
}

func (s *inMemoryStore) updateMaterial(material Material) *Material {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.materials {
		if s.materials[i].ID == material.ID {
			s.materials[i] = material
			return &s.materials[i]
		}
	}
	return nil
}

func (s *inMemoryStore) deleteMaterial(id int64) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.materials {
		if s.materials[i].ID == id {
			s.materials = append(s.materials[:i], s.materials[i+1:]...)
			return true
		}
	}
	return false
}

func (s *inMemoryStore) getSiteContent() []SiteContent {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]SiteContent(nil), s.siteContent...)
}

func (s *inMemoryStore) getSiteContentByPage(page string) []SiteContent {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var result []SiteContent
	for _, content := range s.siteContent {
		if content.Page == page && content.IsActive {
			result = append(result, content)
		}
	}
	return result
}

func (s *inMemoryStore) updateSiteContent(content SiteContent) *SiteContent {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.siteContent {
		if s.siteContent[i].ID == content.ID {
			s.siteContent[i] = content
			return &s.siteContent[i]
		}
	}
	return nil
}

func (s *inMemoryStore) addSiteContent(content SiteContent) SiteContent {
	s.mu.Lock()
	defer s.mu.Unlock()
	content.ID = s.nextID
	s.nextID++
	s.siteContent = append(s.siteContent, content)
	return content
}

func (s *inMemoryStore) getSiteConfig() SiteConfig {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.siteConfig
}

func (s *inMemoryStore) updateSiteConfig(config SiteConfig) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.siteConfig = config
}

func main() {
	cfg := AppConfig{
		Port: getEnv("BACKEND_PORT", getEnv("PORT", "8080")),
	}

	app := &App{
		Router:   chi.NewRouter(),
		Validate: validator.New(),
		Config:   cfg,
		storage:  newInMemoryStore(),
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

func (a *App) handleCatalog() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mats := a.storage.getMaterials()
		writeJSON(w, http.StatusOK, mats)
	}
}

func (a *App) handlePromotions() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		promos := a.storage.getPromotions()
		writeJSON(w, http.StatusOK, promos)
	}
}

func (a *App) handleReviews() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		reviews := a.storage.getReviews()
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
			Name:      in.Name,
			Rating:    in.Rating,
			Comment:   in.Comment,
			ImageURL:  in.ImageURL,
			CreatedAt: time.Now().UTC(),
		}
		created := a.storage.addReview(review)
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

		material := a.storage.findMaterial(in.MaterialID)
		if material == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "material not found"})
			return
		}

		config := a.storage.getPricingConfig()

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
		config := a.storage.getPricingConfig()
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

		a.storage.updatePricingConfig(config)
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

		created := a.storage.addMaterial(material)
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
		updated := a.storage.updateMaterial(material)
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

		if !a.storage.deleteMaterial(id) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "material not found"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
	}
}

func (a *App) handleGetSiteContent() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		content := a.storage.getSiteContent()
		writeJSON(w, http.StatusOK, content)
	}
}

func (a *App) handleGetSiteContentByPage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page := chi.URLParam(r, "page")
		content := a.storage.getSiteContentByPage(page)
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
		updated := a.storage.updateSiteContent(content)
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

		created := a.storage.addSiteContent(content)
		writeJSON(w, http.StatusCreated, created)
	}
}

func (a *App) handleGetSiteConfig() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		config := a.storage.getSiteConfig()
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

		a.storage.updateSiteConfig(config)
		writeJSON(w, http.StatusOK, config)
	}
}
