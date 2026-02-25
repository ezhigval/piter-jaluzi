package main

import (
	"log"

	"github.com/ezhigval/piter-jaluzi/backend/configs"
	"github.com/ezhigval/piter-jaluzi/backend/internal/database"
	"github.com/ezhigval/piter-jaluzi/backend/internal/handler"
	"github.com/ezhigval/piter-jaluzi/backend/internal/repository"
	"github.com/ezhigval/piter-jaluzi/backend/internal/routes"
	"github.com/ezhigval/piter-jaluzi/backend/internal/service"
	"github.com/gin-gonic/gin"
)

func main() {
	// Загрузка конфигурации
	config := configs.LoadConfig()

	// Подключение к базе данных
	db, err := database.NewDatabase(config)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Миграции
	if err := db.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Seed данные
	if err := db.SeedData(); err != nil {
		log.Printf("Warning: Failed to seed database: %v", err)
	}

	// Repository слой
	categoryRepo := repository.NewCategoryRepository(db)

	// Service слой
	categoryService := service.NewCategoryService(categoryRepo)

	// Handler слой
	categoryHandler := handler.NewCategoryHandler(categoryService)

	// Настройка Gin
	if config.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// CORS
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

	// Routes
	routes.SetupCategoryRoutes(router, categoryHandler)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Запуск сервера
	addr := config.ServerHost + ":" + config.ServerPort
	log.Printf("Server starting on %s", addr)
	log.Fatal(router.Run(addr))
}
