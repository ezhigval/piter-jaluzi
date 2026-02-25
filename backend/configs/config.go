package configs

import (
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
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

	// Email
	SMTPHost     string
	SMTPPort     int
	SMTPUser     string
	SMTPPassword string
	SMTPFrom     string

	// CORS
	CORSOrigins []string

	// Logging
	LogLevel string
	LogFile  string

	// File Storage
	UploadPath  string
	MaxFileSize int64
}

// LoadConfig загружает конфигурацию из .env файла
func LoadConfig() *Config {
	// Загружаем .env файл
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found, using environment variables")
	}

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

		// Redis
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnvInt("REDIS_PORT", 6379),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvInt("REDIS_DB", 0),

		// JWT
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiration: getEnvDuration("JWT_EXPIRATION", 24*time.Hour),
		JWTRefreshExp: getEnvDuration("JWT_REFRESH_EXPIRATION", 168*time.Hour), // 7 days

		// Telegram
		TelegramBotToken: getEnv("TELEGRAM_BOT_TOKEN", ""),
		TelegramChatID:   getEnv("TELEGRAM_CHAT_ID", ""),

		// Email
		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnvInt("SMTP_PORT", 587),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		SMTPFrom:     getEnv("SMTP_FROM", "noreply@severnyj-kontur.ru"),

		// CORS
		CORSOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"https://severnyj-kontur.onrender.com",
		},

		// Logging
		LogLevel: getEnv("LOG_LEVEL", "info"),
		LogFile:  getEnv("LOG_FILE", "logs/app.log"),

		// File Storage
		UploadPath:  getEnv("UPLOAD_PATH", "./uploads"),
		MaxFileSize: getEnvInt64("MAX_FILE_SIZE", 10*1024*1024), // 10MB
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

// IsProduction проверяет, запущено ли приложение в production режиме
func (c *Config) IsProduction() bool {
	return c.ServerMode == "release"
}

// IsDevelopment проверяет, запущено ли приложение в development режиме
func (c *Config) IsDevelopment() bool {
	return c.ServerMode == "debug"
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

func getEnvInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
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
