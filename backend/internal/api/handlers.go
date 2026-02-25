package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Handlers содержит обработчики API
type Handlers struct{}

// NewHandlers создает новый экземпляр обработчиков
func NewHandlers() *Handlers {
	return &Handlers{}
}

// GetPublicPages возвращает список страниц
func (h *Handlers) GetPublicPages(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"pages": []gin.H{
			{"id": 1, "slug": "/", "title": "Главная", "is_active": true, "is_in_navigation": true},
			{"id": 2, "slug": "/catalog", "title": "Каталог", "is_active": true, "is_in_navigation": true},
			{"id": 3, "slug": "/about", "title": "О нас", "is_active": true, "is_in_navigation": true},
			{"id": 4, "slug": "/reviews", "title": "Отзывы", "is_active": true, "is_in_navigation": true},
		},
	})
}

// GetPublicPageBySlug возвращает страницу по slug
func (h *Handlers) GetPublicPageBySlug(c *gin.Context) {
	slug := c.Param("slug")
	c.JSON(http.StatusOK, gin.H{
		"slug": slug,
		"title": "Страница " + slug,
		"content": "Контент страницы " + slug,
	})
}

// GetCategories возвращает категории
func (h *Handlers) GetCategories(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"categories": []gin.H{
			{"id": 1, "name": "Горизонтальные", "slug": "horizontal", "is_active": true},
			{"id": 2, "name": "Вертикальные", "slug": "vertical", "is_active": true},
			{"id": 3, "name": "Рулонные", "slug": "roller", "is_active": true},
		},
	})
}

// GetMaterialsByCategory возвращает материалы категории
func (h *Handlers) GetMaterialsByCategory(c *gin.Context) {
	slug := c.Param("slug")
	c.JSON(http.StatusOK, gin.H{
		"category": slug,
		"materials": []gin.H{
			{"id": 1, "name": "Плиссе", "price_per_m2": 1500, "in_stock": true},
			{"id": 2, "name": "Фактура", "price_per_m2": 1200, "in_stock": true},
		},
	})
}

// GetMaterialBySlug возвращает материал по slug
func (h *Handlers) GetMaterialBySlug(c *gin.Context) {
	slug := c.Param("slug")
	c.JSON(http.StatusOK, gin.H{
		"slug": slug,
		"name": "Материал " + slug,
		"price_per_m2": 1500,
	})
}

// GetPublicReviews возвращает отзывы
func (h *Handlers) GetPublicReviews(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"reviews": []gin.H{
			{"id": 1, "author": "Иван Петров", "rating": 5, "text": "Отличная работа!", "is_published": true},
			{"id": 2, "author": "Мария Иванова", "rating": 5, "text": "Профессиональный подход", "is_published": true},
		},
	})
}

// CreateReview создает новый отзыв
func (h *Handlers) CreateReview(c *gin.Context) {
	var review map[string]interface{}
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Review created successfully",
		"review_id": 123,
	})
}

// GetGallery возвращает галерею
func (h *Handlers) GetGallery(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"gallery": []gin.H{
			{"id": 1, "title": "Работа 1", "category": "horizontal", "images": []gin.H{
				{"src": "/images/work1.jpg", "alt": "Горизонтальные жалюзи"},
				{"src": "/images/work2.jpg", "alt": "Монтаж"},
			}},
		},
	})
}

// CreateLead создает новую заявку
func (h *Handlers) CreateLead(c *gin.Context) {
	var lead map[string]interface{}
	if err := c.ShouldBindJSON(&lead); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Lead created successfully",
		"lead_id": 123,
	})
}

// GetSiteConfig возвращает конфигурацию сайта
func (h *Handlers) GetSiteConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"config": gin.H{
			"site_name": "Северный Контур",
			"phone": "+7 (812) 123-45-67",
			"email": "info@severnyj-kontur.ru",
			"address": "Санкт-Петербург, ул. Примерная, д. 1",
		},
	})
}

// HealthCheck проверяет здоровье сервера
func (h *Handlers) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"timestamp": time.Now(),
		"version": "1.0.0",
	})
}
