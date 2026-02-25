package repository

import (
	"github.com/ezhigval/piter-jaluzi/backend/internal/database"
	"github.com/ezhigval/piter-jaluzi/backend/internal/models"
)

// CategoryRepository содержит методы для работы с категориями
type CategoryRepository struct {
	db *database.Database
}

// NewCategoryRepository создает новый репозиторий категорий
func NewCategoryRepository(db *database.Database) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

// Create создает новую категорию
func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category)
}

// GetAll возвращает все категории
func (r *CategoryRepository) GetAll() ([]models.Category, error) {
	// Используем моковые данные
	return r.db.GetMockCategories(), nil
}

// GetByID возвращает категорию по ID
func (r *CategoryRepository) GetByID(id uint) (*models.Category, error) {
	categories := r.db.GetMockCategories()
	for _, cat := range categories {
		if cat.ID == id {
			return &cat, nil
		}
	}
	return nil, nil
}

// GetBySlug возвращает категорию по slug
func (r *CategoryRepository) GetBySlug(slug string) (*models.Category, error) {
	return r.db.GetMockCategoryBySlug(slug), nil
}

// Update обновляет категорию
func (r *CategoryRepository) Update(category *models.Category) error {
	return r.db.Save(category)
}

// Delete удаляет категорию
func (r *CategoryRepository) Delete(id uint) error {
	return r.db.Delete(&models.Category{}, id)
}

// GetWithMaterials возвращает категорию с материалами
func (r *CategoryRepository) GetWithMaterials(slug string) (*models.Category, error) {
	category := r.db.GetMockCategoryBySlug(slug)
	if category == nil {
		return nil, nil
	}

	// Добавляем материалы
	_ = r.db.GetMockMaterialsByCategoryID(category.ID)
	// В реальном приложении здесь был бы Preload
	// Для демонстрации просто возвращаем категорию

	return category, nil
}
