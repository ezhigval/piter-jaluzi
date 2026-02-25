package handler

import (
	"net/http"
	"strconv"

	"github.com/ezhigval/piter-jaluzi/backend/internal/models"
	"github.com/ezhigval/piter-jaluzi/backend/internal/service"
	"github.com/gin-gonic/gin"
)

// CategoryHandler содержит HTTP обработчики для категорий
type CategoryHandler struct {
	categoryService *service.CategoryService
}

// NewCategoryHandler создает новый обработчик категорий
func NewCategoryHandler(categoryService *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		categoryService: categoryService,
	}
}

// CreateCategoryRequest DTO для создания категории
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	Order       int    `json:"order"`
	IsActive    bool   `json:"is_active"`
}

// UpdateCategoryRequest DTO для обновления категории
type UpdateCategoryRequest struct {
	Name        *string `json:"name"`
	Slug        *string `json:"slug"`
	Description *string `json:"description"`
	Order       *int    `json:"order"`
	IsActive    *bool   `json:"is_active"`
}

// CategoryResponse DTO для ответа
type CategoryResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Order       int    `json:"order"`
	IsActive    bool   `json:"is_active"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// CreateCategory создает новую категорию
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category := &models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
		Order:       req.Order,
		IsActive:    req.IsActive,
	}

	if err := h.categoryService.CreateCategory(category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		Order:       category.Order,
		IsActive:    category.IsActive,
		CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:   category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusCreated, response)
}

// GetAllCategories возвращает все категории
func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	categories, err := h.categoryService.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []CategoryResponse
	for _, category := range categories {
		response = append(response, CategoryResponse{
			ID:          category.ID,
			Name:        category.Name,
			Slug:        category.Slug,
			Description: category.Description,
			Order:       category.Order,
			IsActive:    category.IsActive,
			CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z"),
			UpdatedAt:   category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetCategoryByID возвращает категорию по ID
func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	category, err := h.categoryService.GetCategoryByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		Order:       category.Order,
		IsActive:    category.IsActive,
		CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:   category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusOK, response)
}

// GetCategoryBySlug возвращает категорию по slug
func (h *CategoryHandler) GetCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "slug обязателен"})
		return
	}

	category, err := h.categoryService.GetCategoryBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	response := CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		Order:       category.Order,
		IsActive:    category.IsActive,
		CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:   category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusOK, response)
}

// GetCategoryWithMaterials возвращает категорию с материалами
func (h *CategoryHandler) GetCategoryWithMaterials(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "slug обязателен"})
		return
	}

	category, err := h.categoryService.GetCategoryWithMaterials(slug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Формируем ответ с материалами
	type MaterialResponse struct {
		ID           uint    `json:"id"`
		CategoryID   uint    `json:"category_id"`
		Name         string  `json:"name"`
		Slug         string  `json:"slug"`
		Description  string  `json:"description"`
		PricePerM2   float64 `json:"price_per_m2"`
		SupplierCode string  `json:"supplier_code"`
		Composition  string  `json:"composition"`
		Density      string  `json:"density"`
		Width        string  `json:"width"`
		InStock      bool    `json:"in_stock"`
		MinOrder     float64 `json:"min_order"`
		IsActive     bool    `json:"is_active"`
	}

	var materials []MaterialResponse
	for _, material := range category.Materials {
		materials = append(materials, MaterialResponse{
			ID:           material.ID,
			CategoryID:   material.CategoryID,
			Name:         material.Name,
			Slug:         material.Slug,
			Description:  material.Description,
			PricePerM2:   material.PricePerM2,
			SupplierCode: material.SupplierCode,
			Composition:  material.Composition,
			Density:      material.Density,
			Width:        material.Width,
			InStock:      material.InStock,
			MinOrder:     material.MinOrder,
			IsActive:     material.IsActive,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"id":          category.ID,
		"name":        category.Name,
		"slug":        category.Slug,
		"description": category.Description,
		"order":       category.Order,
		"is_active":   category.IsActive,
		"created_at":  category.CreatedAt.Format("2006-01-02T15:04:05Z"),
		"updated_at":  category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
		"materials":   materials,
	})
}

// UpdateCategory обновляет категорию
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем существующую категорию
	category, err := h.categoryService.GetCategoryByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Обновляем только переданные поля
	if req.Name != nil {
		category.Name = *req.Name
	}
	if req.Slug != nil {
		category.Slug = *req.Slug
	}
	if req.Description != nil {
		category.Description = *req.Description
	}
	if req.Order != nil {
		category.Order = *req.Order
	}
	if req.IsActive != nil {
		category.IsActive = *req.IsActive
	}

	if err := h.categoryService.UpdateCategory(category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := CategoryResponse{
		ID:          category.ID,
		Name:        category.Name,
		Slug:        category.Slug,
		Description: category.Description,
		Order:       category.Order,
		IsActive:    category.IsActive,
		CreatedAt:   category.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt:   category.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}

	c.JSON(http.StatusOK, response)
}

// DeleteCategory удаляет категорию
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный ID"})
		return
	}

	if err := h.categoryService.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "категория успешно удалена"})
}
