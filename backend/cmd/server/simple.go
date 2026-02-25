package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Mock данные для демонстрации
type Category struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	IsActive    bool   `json:"is_active"`
	Order       int    `json:"order"`
}

type Material struct {
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

// Mock данные
var categories = []Category{
	{ID: 1, Name: "Горизонтальные", Slug: "horizontal", Description: "Классические горизонтальные жалюзи", IsActive: true, Order: 1},
	{ID: 2, Name: "Вертикальные", Slug: "vertical", Description: "Вертикальные жалюзи для больших окон", IsActive: true, Order: 2},
	{ID: 3, Name: "Рулонные", Slug: "roller", Description: "Рулонные жалюзи из ткани", IsActive: true, Order: 3},
	{ID: 4, Name: "Плиссе", Slug: "plisse", Description: "Плиссе жалюзи с плиссировкой", IsActive: true, Order: 4},
}

var materials = []Material{
	{
		ID: 1, CategoryID: 1, Name: "Алюминиевые", Slug: "aluminum", Description: "Алюминиевые ламели с покрытием",
		PricePerM2: 1500.00, SupplierCode: "AL-001", Composition: "Алюминий, полимерное покрытие",
		Density: "0.7 мм", Width: "25 мм, 50 мм", InStock: true, MinOrder: 1.0, IsActive: true,
	},
	{
		ID: 2, CategoryID: 1, Name: "Деревянные", Slug: "wood", Description: "Натуральное дерево с защитным покрытием",
		PricePerM2: 2500.00, SupplierCode: "WD-001", Composition: "Бук, ясень, лак",
		Density: "1.2 мм", Width: "25 мм, 50 мм", InStock: true, MinOrder: 1.0, IsActive: true,
	},
	{
		ID: 3, CategoryID: 2, Name: "Тканевые", Slug: "fabric", Description: "Полиэстер или полиэстер с добавлением хлопка",
		PricePerM2: 1800.00, SupplierCode: "FB-001", Composition: "100% полиэстер",
		Density: "0.5 мм", Width: "89 мм, 127 мм", InStock: true, MinOrder: 1.0, IsActive: true,
	},
	{
		ID: 4, CategoryID: 3, Name: "Бамбуковые", Slug: "bamboo", Description: "Экологически чистые жалюзи из бамбука",
		PricePerM2: 2200.00, SupplierCode: "BB-001", Composition: "100% бамбук",
		Density: "0.4 мм", Width: "50 мм, 89 мм", InStock: true, MinOrder: 1.0, IsActive: true,
	},
}

func main() {
	// Настройка Gin
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"timestamp": time.Now().Format(time.RFC3339),
			"service":   "jaluxi-backend",
			"version":   "1.0.0-demo",
		})
	})

	// API Routes
	api := router.Group("/api/v1")
	{
		// Categories
		api.GET("/categories", getAllCategories)
		api.GET("/categories/:id", getCategoryByID)
		api.GET("/categories/slug/:slug", getCategoryBySlug)
		api.GET("/categories/slug/:slug/materials", getCategoryWithMaterials)

		// Materials
		api.GET("/materials", getAllMaterials)
		api.GET("/materials/:id", getMaterialByID)
		api.GET("/materials/category/:categoryId", getMaterialsByCategory)

		// Admin routes (с базовой аутентификацией)
		admin := api.Group("", gin.BasicAuth(gin.Accounts{
			"admin": "admin123",
		}))
		{
			admin.POST("/categories", createCategory)
			admin.PUT("/categories/:id", updateCategory)
			admin.DELETE("/categories/:id", deleteCategory)
		}
	}

	// Запуск сервера
	log.Println("🚀 Server starting on http://localhost:8080")
	log.Println("📚 API Documentation:")
	log.Println("  GET  /health                    - Health check")
	log.Println("  GET  /api/v1/categories         - Get all categories")
	log.Println("  GET  /api/v1/categories/:id      - Get category by ID")
	log.Println("  GET  /api/v1/categories/slug/:slug - Get category by slug")
	log.Println("  GET  /api/v1/categories/slug/:slug/materials - Get category with materials")
	log.Println("  GET  /api/v1/materials           - Get all materials")
	log.Println("  GET  /api/v1/materials/:id      - Get material by ID")
	log.Println("  GET  /api/v1/materials/category/:categoryId - Get materials by category")
	log.Println("")
	log.Println("🔐 Admin routes (admin:admin123):")
	log.Println("  POST /api/v1/categories         - Create category")
	log.Println("  PUT  /api/v1/categories/:id      - Update category")
	log.Println("  DELETE /api/v1/categories/:id   - Delete category")

	if err := router.Run(":8081"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// Handlers
func getAllCategories(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
		"count":   len(categories),
	})
}

func getCategoryByID(c *gin.Context) {
	id := c.Param("id")
	for _, cat := range categories {
		if string(rune(cat.ID)) == id {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"data":    cat,
			})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"error":   "Category not found",
	})
}

func getCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")
	for _, cat := range categories {
		if cat.Slug == slug {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"data":    cat,
			})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"error":   "Category not found",
	})
}

func getCategoryWithMaterials(c *gin.Context) {
	slug := c.Param("slug")
	var categoryMaterials []Material

	for _, cat := range categories {
		if cat.Slug == slug {
			for _, mat := range materials {
				if mat.CategoryID == cat.ID {
					categoryMaterials = append(categoryMaterials, mat)
				}
			}
			c.JSON(http.StatusOK, gin.H{
				"success":   true,
				"category":  cat,
				"materials": categoryMaterials,
				"count":     len(categoryMaterials),
			})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"error":   "Category not found",
	})
}

func getAllMaterials(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    materials,
		"count":   len(materials),
	})
}

func getMaterialByID(c *gin.Context) {
	id := c.Param("id")
	for _, mat := range materials {
		if string(rune(mat.ID)) == id {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"data":    mat,
			})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{
		"success": false,
		"error":   "Material not found",
	})
}

func getMaterialsByCategory(c *gin.Context) {
	categoryId := c.Param("categoryId")
	var categoryMaterials []Material

	for _, mat := range materials {
		if string(rune(mat.CategoryID)) == categoryId {
			categoryMaterials = append(categoryMaterials, mat)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categoryMaterials,
		"count":   len(categoryMaterials),
	})
}

// Admin handlers
func createCategory(c *gin.Context) {
	var category Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// В реальном приложении здесь была бы запись в БД
	category.ID = uint(len(categories) + 1)
	categories = append(categories, category)

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    category,
		"message": "Category created successfully",
	})
}

func updateCategory(c *gin.Context) {
	_ = c.Param("id")
	var updatedCategory Category
	if err := c.ShouldBindJSON(&updatedCategory); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	// В реальном приложении здесь было бы обновление в БД
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    updatedCategory,
		"message": "Category updated successfully",
	})
}

func deleteCategory(c *gin.Context) {
	_ = c.Param("id")

	// В реальном приложении здесь было бы удаление из БД
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Category deleted successfully",
	})
}
