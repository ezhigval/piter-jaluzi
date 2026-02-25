package service

import (
	"errors"
	"fmt"

	"github.com/ezhigval/piter-jaluzi/backend/internal/models"
	"github.com/ezhigval/piter-jaluzi/backend/internal/repository"
)

// CategoryService содержит бизнес-логику для работы с категориями
type CategoryService struct {
	categoryRepo *repository.CategoryRepository
}

// NewCategoryService создает новый сервис категорий
func NewCategoryService(categoryRepo *repository.CategoryRepository) *CategoryService {
	return &CategoryService{
		categoryRepo: categoryRepo,
	}
}

// CreateCategory создает новую категорию
func (s *CategoryService) CreateCategory(category *models.Category) error {
	// Валидация
	if category.Name == "" {
		return errors.New("название категории обязательно")
	}
	if category.Slug == "" {
		return errors.New("slug категории обязателен")
	}

	// Проверка уникальности slug
	existing, err := s.categoryRepo.GetBySlug(category.Slug)
	if err == nil && existing != nil {
		return fmt.Errorf("категория с slug '%s' уже существует", category.Slug)
	}

	// Установка значений по умолчанию
	if category.Order == 0 {
		category.Order = 999
	}
	if !category.IsActive {
		category.IsActive = true
	}

	return s.categoryRepo.Create(category)
}

// GetAllCategories возвращает все активные категории
func (s *CategoryService) GetAllCategories() ([]models.Category, error) {
	categories, err := s.categoryRepo.GetAll()
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении категорий: %w", err)
	}
	return categories, nil
}

// GetCategoryByID возвращает категорию по ID
func (s *CategoryService) GetCategoryByID(id uint) (*models.Category, error) {
	category, err := s.categoryRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("категория с ID %d не найдена", id)
	}
	return category, nil
}

// GetCategoryBySlug возвращает категорию по slug
func (s *CategoryService) GetCategoryBySlug(slug string) (*models.Category, error) {
	if slug == "" {
		return nil, errors.New("slug обязателен")
	}

	category, err := s.categoryRepo.GetBySlug(slug)
	if err != nil {
		return nil, fmt.Errorf("категория с slug '%s' не найдена", slug)
	}
	return category, nil
}

// GetCategoryWithMaterials возвращает категорию с материалами
func (s *CategoryService) GetCategoryWithMaterials(slug string) (*models.Category, error) {
	if slug == "" {
		return nil, errors.New("slug обязателен")
	}

	category, err := s.categoryRepo.GetWithMaterials(slug)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении категории с материалами: %w", err)
	}
	return category, nil
}

// UpdateCategory обновляет категорию
func (s *CategoryService) UpdateCategory(category *models.Category) error {
	// Проверка существования
	existing, err := s.categoryRepo.GetByID(category.ID)
	if err != nil {
		return fmt.Errorf("категория с ID %d не найдена", category.ID)
	}

	// Валидация
	if category.Name == "" {
		return errors.New("название категории обязательно")
	}
	if category.Slug == "" {
		return errors.New("slug категории обязателен")
	}

	// Проверка уникальности slug (если изменился)
	if category.Slug != existing.Slug {
		duplicate, err := s.categoryRepo.GetBySlug(category.Slug)
		if err == nil && duplicate != nil {
			return fmt.Errorf("категория с slug '%s' уже существует", category.Slug)
		}
	}

	return s.categoryRepo.Update(category)
}

// DeleteCategory удаляет категорию
func (s *CategoryService) DeleteCategory(id uint) error {
	// Проверка существования
	_, err := s.categoryRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("категория с ID %d не найдена", id)
	}

	return s.categoryRepo.Delete(id)
}
