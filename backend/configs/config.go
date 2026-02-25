package configs

import (
	"os"
	"strconv"
	"time"
)

// Config содержит конфигурацию приложения
type Config struct {
	// Server
	ServerPort string
	ServerHost string
	ServerMode string

	// Database
	DatabaseHost     string
	DatabasePort     int
	DatabaseUser     string
	DatabasePassword string
	DatabaseName     string
	DatabaseSSLMode  string
	DatabaseTZ       string

	// JWT
	JWTSecret     string
	JWTExpiration time.Duration
	JWTRefreshExp time.Duration

	// Telegram
	TelegramBotToken string
	TelegramChatID   string

	// CORS
	CORSOrigins []string
}

// LoadConfig загружает конфигурацию из переменных окружения
func LoadConfig() *Config {
	return &Config{
		// Server
		ServerPort: getEnv("SERVER_PORT", "8080"),
		ServerHost: getEnv("SERVER_HOST", "localhost"),
		ServerMode: getEnv("GIN_MODE", "debug"),

		// Database
		DatabaseHost:     getEnv("DB_HOST", "localhost"),
		DatabasePort:     getEnvInt("DB_PORT", 5432),
		DatabaseUser:     getEnv("DB_USER", "postgres"),
		DatabasePassword: getEnv("DB_PASSWORD", ""),
		DatabaseName:     getEnv("DB_NAME", "jaluxi"),
		DatabaseSSLMode:  getEnv("DB_SSLMODE", "disable"),
		DatabaseTZ:       getEnv("DB_TZ", "UTC"),

		// JWT
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
		JWTExpiration: getEnvDuration("JWT_EXPIRATION", 24*time.Hour),
		JWTRefreshExp: getEnvDuration("JWT_REFRESH_EXPIRATION", 168*time.Hour), // 7 days

		// Telegram
		TelegramBotToken: getEnv("TELEGRAM_BOT_TOKEN", ""),
		TelegramChatID:   getEnv("TELEGRAM_CHAT_ID", ""),

		// CORS
		CORSOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"https://severnyj-kontur.onrender.com",
		},
	}
}

// GetDSN возвращает строку подключения к PostgreSQL
func (c *Config) GetDSN() string {
	return "host=" + c.DatabaseHost +
		" port=" + strconv.Itoa(c.DatabasePort) +
		" user=" + c.DatabaseUser +
		" password=" + c.DatabasePassword +
		" dbname=" + c.DatabaseName +
		" sslmode=" + c.DatabaseSSLMode +
		" TimeZone=" + c.DatabaseTZ
}

// Вспомогательные функции
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
