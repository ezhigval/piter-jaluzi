package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger логирует запросы
func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return formatLogMessage(param)
	})
}

// Recovery восстанавливает работу после паники
func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		if err, ok := recovered.(string); ok {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Internal server error",
				"message": err,
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error",
			})
		}
	})
}

// CORS настраивает CORS
func CORS(origins []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Проверяем, разрешен ли origin
		allowed := false
		for _, allowedOrigin := range origins {
			if allowedOrigin == "*" || allowedOrigin == origin {
				allowed = true
				break
			}
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		// Обрабатываем preflight запросы
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// Security добавляет заголовки безопасности
func Security() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Защита от XSS
		c.Header("X-XSS-Protection", "1; mode=block")

		// Запрещает фреймы
		c.Header("X-Frame-Options", "DENY")

		// Защита от MIME type sniffing
		c.Header("X-Content-Type-Options", "nosniff")

		// HSTS
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		// CSP
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'")

		c.Next()
	}
}

// RateLimit ограничивает количество запросов
func RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Здесь будет реализация rate limiting
		// Временно просто пропускаем запросы
		c.Next()
	}
}

// JWTAuth проверяет JWT токен
func JWTAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header required",
			})
			c.Abort()
			return
		}

		// Здесь будет валидация JWT токена
		// Временно пропускаем все запросы
		c.Set("user_id", 1) // Заглушка
		c.Next()
	}
}

// Вспомогательная функция для форматирования логов
func formatLogMessage(param gin.LogFormatterParams) string {
	return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
		param.ClientIP,
		param.TimeStamp.Format(time.RFC1123),
		param.Method,
		param.Path,
		param.Request.Proto,
		param.StatusCode,
		param.Latency,
		param.Request.UserAgent(),
		param.ErrorMessage,
	)
}
