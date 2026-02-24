package middleware

import (
	"context"
	"net/http"
	"strings"
	"time"

	"jaluxi/internal/errors"
)

// SecurityMiddleware adds security headers and logging
func SecurityMiddleware(next http.Handler) http.Handler http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Add security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'")
		w.Header().Set("X-Request-ID", generateRequestID())
		
		// Log request
		logRequest(r, start)
		
		// Call next handler
		next.ServeHTTP(w, r)
		
		// Log response
		logResponse(w, start)
	})
}

// LoggingMiddleware logs all requests and responses
func LoggingMiddleware(next http.Handler) http.Handler http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Create response writer wrapper to capture status code
		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}
		
		next.ServeHTTP(rw, r)
		
		// Log the request and response
		duration := time.Since(start)
		logRequest(r, start)
		logResponse(rw, start, duration)
	})
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(statusCode int, header map[string][]string) {
	rw.statusCode = statusCode
	rw.ResponseWriter.WriteHeader(statusCode, header)
}

func (rw *responseWriter) Write(data []byte) (int, error) {
	return rw.ResponseWriter.Write(data)
}

// Log request details
func logRequest(r *http.Request, start time.Time) {
	clientIP := getClientIP(r)
	userAgent := r.Header.Get("User-Agent")
	method := r.Method
	path := r.URL.Path
	
	// Log in structured format
	timestamp := start.Format("2006-01-02 15:04:05")
	
	// Skip logging for health checks and static assets
	if shouldSkipLogging(path) {
		return
	}
	
	// Log to console (in production, this would go to structured logging)
	_ = userAgent // Suppress unused warning
	
	// TODO: Replace with proper logging (ELK, etc.)
	// For now, we'll use structured console output
	// Example: {"timestamp":"2024-01-01T12:00:00Z","level":"info","method":"GET","path":"/api/catalog","ip":"192.168.1.1","user_agent":"Mozilla/5.0","duration_ms":150}
}

// Log response details
func logResponse(rw *responseWriter, start time.Time, duration time.Duration) {
	if shouldSkipLogging(rw.ResponseWriter.(*responseWriter).Header().Get("X-Request-ID")) {
		return
	}
	
	// Log response with status code and duration
	// TODO: Replace with proper logging service
}

// Get client IP from request
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header first (for proxies)
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		// Take the first IP from comma-separated list
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}
	
	// Check X-Real-IP header
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return xri
	}
	
	// Fall back to RemoteAddr
	ip := r.RemoteAddr
	if colon := strings.LastIndex(ip, ":"); colon != -1 {
		ip = ip[:colon]
	}
	
	return ip
}

// shouldSkipLogging determines if request should be logged
func shouldSkipLogging(path string) bool {
	skipPaths := []string{
		"/api/health",
		"/static/",
		"/_next/",
		"/favicon.ico",
		"/robots.txt",
		"/sitemap.xml",
	}
	
	for _, skip := range skipPaths {
		if strings.HasPrefix(path, skip) {
			return true
		}
	}
	
	return false
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	return time.Now().Format("20060102150405") + "-" + time.Now().Format("000000")
}
