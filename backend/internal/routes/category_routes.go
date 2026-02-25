package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ezhigval/piter-jaluzi/backend/internal/handler"
)

// SetupCategoryRoutes настраивает маршруты для категорий
func SetupCategoryRoutes(router *gin.Engine, categoryHandler *handler.CategoryHandler) {
	api := router.Group("/api/v1/categories")
	{
		// Public routes
		api.GET("", categoryHandler.GetAllCategories)
		api.GET("/:id", categoryHandler.GetCategoryByID)
		api.GET("/slug/:slug", categoryHandler.GetCategoryBySlug)
		api.GET("/slug/:slug/materials", categoryHandler.GetCategoryWithMaterials)

		// Admin routes (требуют аутентификацию)
		admin := api.Group("", gin.BasicAuth(gin.Accounts{
			"admin": "admin123", // В реальном проекте использовать JWT
		}))
		{
			admin.POST("", categoryHandler.CreateCategory)
			admin.PUT("/:id", categoryHandler.UpdateCategory)
			admin.DELETE("/:id", categoryHandler.DeleteCategory)
		}
	}
}
