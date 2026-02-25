package database

import (
	"log"

	"github.com/ezhigval/piter-jaluzi/backend/configs"
	"github.com/ezhigval/piter-jaluzi/backend/internal/models"
)

// Database содержит подключение к БД
type Database struct {
	// Mock данные для демонстрации
	categories []models.Category
	materials  []models.Material
}

// NewDatabase создает новое подключение к базе данных
func NewDatabase(config *configs.Config) (*Database, error) {
	log.Printf("Database connected successfully (Demo Mode)")

	// Создаем моковые данные
	db := &Database{
		categories: []models.Category{
			{
				BaseModel:   models.BaseModel{ID: 1},
				Name:        "Горизонтальные",
				Slug:        "horizontal",
				Description: "Классические горизонтальные жалюзи",
				IsActive:    true,
				Order:       1,
			},
			{
				BaseModel:   models.BaseModel{ID: 2},
				Name:        "Вертикальные",
				Slug:        "vertical",
				Description: "Вертикальные жалюзи для больших окон",
				IsActive:    true,
				Order:       2,
			},
			{
				BaseModel:   models.BaseModel{ID: 3},
				Name:        "Рулонные",
				Slug:        "roller",
				Description: "Рулонные жалюзи из ткани",
				IsActive:    true,
				Order:       3,
			},
			{
				BaseModel:   models.BaseModel{ID: 4},
				Name:        "Плиссе",
				Slug:        "plisse",
				Description: "Плиссе жалюзи с плиссировкой",
				IsActive:    true,
				Order:       4,
			},
		},
		materials: []models.Material{
			{
				BaseModel:    models.BaseModel{ID: 1},
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
				BaseModel:    models.BaseModel{ID: 2},
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
		},
	}

	return db, nil
}

// AutoMigrate выполняет миграции базы данных
func (db *Database) AutoMigrate() error {
	log.Println("Database migration completed successfully (Demo Mode)")
	return nil
}

// SeedData заполняет базу данных начальными данными
func (db *Database) SeedData() error {
	log.Println("Database seeding completed successfully (Demo Mode)")
	return nil
}

// Create создает запись
func (db *Database) Create(value interface{}) error {
	log.Printf("Create called with: %T", value)
	return nil
}

// Find находит записи
func (db *Database) Find(dest interface{}, conds ...interface{}) error {
	log.Printf("Find called with: %T", dest)
	return nil
}

// First находит первую запись
func (db *Database) First(dest interface{}, conds ...interface{}) error {
	log.Printf("First called with: %T", dest)
	return nil
}

// Where добавляет условие
func (db *Database) Where(query interface{}, args ...interface{}) *Database {
	log.Printf("Where called with: %v", query)
	return db
}

// Order добавляет сортировку
func (db *Database) Order(value interface{}) *Database {
	log.Printf("Order called with: %v", value)
	return db
}

// Preload добавляет preloading
func (db *Database) Preload(query string, args ...interface{}) *Database {
	log.Printf("Preload called with: %s", query)
	return db
}

// Save сохраняет запись
func (db *Database) Save(value interface{}) error {
	log.Printf("Save called with: %T", value)
	return nil
}

// Delete удаляет запись
func (db *Database) Delete(value interface{}, conds ...interface{}) error {
	log.Printf("Delete called with: %T", value)
	return nil
}

// Error возвращает ошибку
func (db *Database) Error() error {
	return nil
}

// Close закрывает подключение к базе данных
func (db *Database) Close() error {
	return nil
}

// Mock методы для категорий
func (db *Database) GetMockCategories() []models.Category {
	return db.categories
}

func (db *Database) GetMockCategoryBySlug(slug string) *models.Category {
	for _, cat := range db.categories {
		if cat.Slug == slug {
			return &cat
		}
	}
	return nil
}

func (db *Database) GetMockMaterialsByCategoryID(categoryID uint) []models.Material {
	var materials []models.Material
	for _, mat := range db.materials {
		if mat.CategoryID == categoryID {
			materials = append(materials, mat)
		}
	}
	return materials
}
