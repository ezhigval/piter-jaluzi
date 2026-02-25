package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ezhigval/piter-jaluzi/backend/configs"
	"github.com/ezhigval/piter-jaluzi/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Загружаем конфигурацию
	config := configs.LoadConfig()

	// Настраиваем роутер
	router := setupRouter(config)

	// Настраиваем graceful shutdown
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%s", config.ServerHost, config.ServerPort),
		Handler: router,
	}

	log.Printf("Starting server on %s:%s", config.ServerHost, config.ServerPort)

	// Запускаем сервер в горутине
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Ожидаем сигналы для graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	// Graceful shutdown с таймаутом
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited")
}

func setupRouter(config *configs.Config) *gin.Engine {
	gin.SetMode(config.ServerMode)

	router := gin.New()

	// Middleware
	router.Use(middleware.Logger())
	router.Use(middleware.Recovery())
	router.Use(middleware.CORS(config.CORSOrigins))
	router.Use(middleware.Security())
	router.Use(middleware.RateLimit())

	// API v1
	v1 := router.Group("/api/v1")
	{
		// Публичные роуты
		public := v1.Group("/")
		{
			// Health check
			public.GET("/health", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"status":    "ok",
					"timestamp": time.Now(),
				})
			})

			// Страницы
			public.GET("/pages", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"pages": []gin.H{
						{"id": 1, "slug": "/", "title": "Главная", "is_active": true, "is_in_navigation": true},
						{"id": 2, "slug": "/catalog", "title": "Каталог", "is_active": true, "is_in_navigation": true},
						{"id": 3, "slug": "/about", "title": "О нас", "is_active": true, "is_in_navigation": true},
						{"id": 4, "slug": "/reviews", "title": "Отзывы", "is_active": true, "is_in_navigation": true},
					},
				})
			})

			// Каталог
			public.GET("/categories", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{
					"categories": []gin.H{
						{"id": 1, "name": "Горизонтальные", "slug": "horizontal", "is_active": true},
						{"id": 2, "name": "Вертикальные", "slug": "vertical", "is_active": true},
						{"id": 3, "name": "Рулонные", "slug": "roller", "is_active": true},
					},
				})
			})

			// Заявки
			public.POST("/leads", func(c *gin.Context) {
				var lead map[string]interface{}
				if err := c.ShouldBindJSON(&lead); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}

				// Здесь будет логика сохранения заявки
				log.Printf("New lead: %+v", lead)

				c.JSON(http.StatusCreated, gin.H{
					"message": "Lead created successfully",
					"lead_id": 123,
				})
			})
		}
	}

	return router
}
