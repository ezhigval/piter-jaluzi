package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ezhigval/piter-jaluzi/backend/configs"
	"github.com/ezhigval/piter-jaluzi/backend/internal/models"
)

// Database содержит подключение к БД
type Database struct {
	*gorm.DB
}

// NewDatabase создает новое подключение к базе данных
func NewDatabase(config *configs.Config) (*Database, error) {
	dsn := config.GetDSN()
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}

	log.Printf("Database connected successfully")
	
	return &Database{DB: db}, nil
}

// AutoMigrate выполняет миграции базы данных
func (db *Database) AutoMigrate() error {
	models := []interface{}{
		&models.User{},
		&models.SiteConfig{},
		&models.PricingFormula{},
		&models.Category{},
		&models.Material{},
		&models.Page{},
		&models.Block{},
		&models.Review{},
		&models.GalleryWork{},
		&models.Image{},
		&models.Lead{},
	}
	
	err := db.AutoMigrate(models)
	
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}
	
	log.Println("Database migration completed successfully")
	return nil
}

// SeedData заполняет базу данных начальными данными
func (db *Database) SeedData() error {
	// Создаем администратора
	adminUser := &models.User{
		Email:        "admin@severnyj-kontur.ru",
		PasswordHash: "$2a$10$abcdefghijklmnopqrstuvwx", // пароль: admin123 (в реальном проекте нужно захешировать)
		FirstName:    "Admin",
		LastName:     "User",
		Role:         "admin",
		IsActive:     true,
	}
	
	if err := db.Create(adminUser).Error; err != nil {
		log.Printf("Failed to create admin user: %v", err)
	} else {
		log.Println("Admin user created successfully")
	}

	// Создаем категории
	categories := []models.Category{
		{
			Name:        "Горизонтальные",
			Slug:        "horizontal",
			Description: "Классические горизонтальные жалюзи",
			IsActive:    true,
			Order:       1,
		},
		{
			Name:        "Вертикальные",
			Slug:        "vertical",
			Description: "Вертикальные жалюзи для больших окон",
			IsActive:    true,
			Order:       2,
		},
		{
			Name:        "Рулонные",
			Slug:        "roller",
			Description: "Рулонные жалюзи из ткани",
			IsActive:    true,
			Order:       3,
		},
		{
			Name:        "Плиссе",
			Slug:        "plisse",
			Description: "Плиссе жалюзи с плиссировкой",
			IsActive:    true,
			Order:       4,
		},
	}
	
	for _, category := range categories {
		if err := db.Create(&category).Error; err != nil {
			log.Printf("Failed to create category %s: %v", category.Name, err)
		}
	}
	log.Println("Categories created successfully")

	// Создаем материалы
	materials := []models.Material{
		{
			CategoryID:   1,
			Name:         "Алюминиевые",
			Slug:         "aluminum",
			Description:  "Алюминиевые ламели с покрытием",
			PricePerM2:   1500.00,
			SupplierCode: "AL-001",
			Composition:  "Алюминий, полимерное покрытие",
			Density:      "0.7 мм",
			Width:        "25 мм, 50 мм",
			InStock:      true,
			MinOrder:     1.0,
			IsActive:     true,
		},
		{
			CategoryID:   1,
			Name:         "Деревянные",
			Slug:         "wood",
			Description:  "Натуральное дерево с защитным покрытием",
			PricePerM2:   2500.00,
			SupplierCode: "WD-001",
			Composition:  "Бук, ясень, лак",
			Density:      "1.2 мм",
			Width:        "25 мм, 50 мм",
			InStock:      true,
			MinOrder:     1.0,
			IsActive:     true,
		},
		{
			CategoryID:   2,
			Name:         "Тканевые",
			Slug:         "fabric",
			Description:  "Полиэстер или полиэстер с добавлением хлопка",
			PricePerM2:   1800.00,
			SupplierCode: "FB-001",
			Composition:  "100% полиэстер",
			Density:      "0.5 мм",
			Width:        "89 мм, 127 мм",
			InStock:      true,
			MinOrder:     1.0,
			IsActive:     true,
		},
		{
			CategoryID:   3,
			Name:         "Бамбуковые",
			Slug:         "bamboo",
			Description:  "Экологически чистые жалюзи из бамбука",
			PricePerM2:   2200.00,
			SupplierCode: "BB-001",
			Composition:  "100% бамбук",
			Density:      "0.4 мм",
			Width:        "50 мм, 89 мм",
			InStock:      true,
			MinOrder:     1.0,
			IsActive:     true,
		},
	}
	
	for _, material := range materials {
		if err := db.Create(&material).Error; err != nil {
			log.Printf("Failed to create material %s: %v", material.Name, err)
		}
	}
	log.Println("Materials created successfully")

	// Создаем страницы
	pages := []models.Page{
		{
			Slug:              "/",
			Title:             "Главная",
			Description:        "Главная страница сайта Северный Контур",
			IsActive:          true,
			IsInNavigation:    true,
			NavigationTitle:    "Главная",
			NavigationOrder:    1,
			SEO: models.PageSEO{
				Title:       "Северный Контур - Профессиональные жалюзи",
				Description: "Производство и установка горизонтальных, вертикальных и рулонных жалюзи в Санкт-Петербурге",
				Keywords:    "жалюзи, горизонтальные, вертикальные, рулонные, монтаж, ремонт, Санкт-Петербург",
				Robots:     "index,follow",
			},
		},
		{
			Slug:              "/catalog",
			Title:             "Каталог",
			Description:        "Каталог продукции с ценами и характеристиками",
			IsActive:          true,
			IsInNavigation:    true,
			NavigationTitle:    "Каталог",
			NavigationOrder:    2,
			SEO: models.PageSEO{
				Title:       "Каталог продукции - Северный Контур",
				Description: "Выберите идеальные жалюзи для вашего дома из нашего каталога",
				Keywords:    "каталог, жалюзи, цены, характеристики",
				Robots:     "index,follow",
			},
		},
		{
			Slug:              "/about",
			Title:             "О нас",
			Description:        "Информация о компании Северный Контур",
			IsActive:          true,
			IsInNavigation:    true,
			NavigationTitle:    "О нас",
			NavigationOrder:    3,
			SEO: models.PageSEO{
				Title:       "О компании - Северный Контур",
				Description: "Узнайте больше о компании Северный Контур и нашем опыте",
				Keywords:    "о компании, история, опыт, команда",
				Robots:     "index,follow",
			},
		},
		{
			Slug:              "/reviews",
			Title:             "Отзывы",
			Description:        "Отзывы наших клиентов о качестве работы",
			IsActive:          true,
			IsInNavigation:    true,
			NavigationTitle:    "Отзывы",
			NavigationOrder:    4,
			SEO: models.PageSEO{
				Title:       "Отзывы клиентов - Северный Контур",
				Description: "Читайте отзывы наших клиентов о качестве монтажа и обслуживания",
				Keywords:    "отзывы, клиенты, качество, монтаж",
				Robots:     "index,follow",
			},
		},
	}
	
	for _, page := range pages {
		if err := db.Create(&page).Error; err != nil {
			log.Printf("Failed to create page %s: %v", page.Title, err)
		}
	}
	log.Println("Pages created successfully")

	// Создаем конфигурацию сайта
	siteConfigs := []models.SiteConfig{
		{
			Key:         "site_name",
			Value:       "Северный Контур",
			Description: "Название сайта",
			Type:        "string",
		},
		{
			Key:         "site_phone",
			Value:       "+7 (812) 123-45-67",
			Description: "Телефон компании",
			Type:        "string",
		},
		{
			Key:         "site_email",
			Value:       "info@severnyj-kontur.ru",
			Description: "Email компании",
			Type:        "string",
		},
		{
			Key:         "site_address",
			Value:       "Санкт-Петербург, ул. Примерная, д. 1",
			Description: "Адрес компании",
			Type:        "string",
		},
		{
			Key:         "working_hours",
			Value:       "Пн-Пт: 9:00-18:00, Сб: 10:00-16:00",
			Description: "Время работы",
			Type:        "string",
		},
	}
	
	for _, config := range siteConfigs {
		if err := db.Create(&config).Error; err != nil {
			log.Printf("Failed to create config %s: %v", config.Key, err)
		}
	}
	log.Println("Site configs created successfully")

	// Создаем формулу расчета стоимости
	pricingFormula := &models.PricingFormula{
		Name:            "Основная формула",
		MaterialMarkup:   1.30,
		InstallationCost: 1500.00,
		MinOrderPrice:    3000.00,
		AdditionalCost:   0.00,
		IsActive:        true,
	}
	
	if err := db.Create(pricingFormula).Error; err != nil {
		log.Printf("Failed to create pricing formula: %v", err)
	} else {
		log.Println("Pricing formula created successfully")
	}

	log.Println("Database seeding completed successfully")
	return nil
}

// Close закрывает подключение к базе данных
func (db *Database) Close() error {
	sqlDB, err := db.GetDB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

// Ping проверяет подключение к базе данных
func (db *Database) Ping() error {
	sqlDB, err := db.GetDB()
	if err != nil {
		return err
	}
	return sqlDB.Ping()
}
