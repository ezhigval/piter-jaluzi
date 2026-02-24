package errors

import (
	"fmt"
	"net/http"
	"runtime"
	"time"
)

// AppError represents an application error
type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
	Status  int    `json:"-"`
}

// Error codes
const (
	ErrCodeValidation   = "VALIDATION_ERROR"
	ErrCodeNotFound     = "NOT_FOUND"
	ErrCodeDuplicate    = "DUPLICATE"
	ErrCodeDatabase     = "DATABASE_ERROR"
	ErrCodeInternal     = "INTERNAL_ERROR"
	ErrCodeUnauthorized = "UNAUTHORIZED"
	ErrCodeForbidden    = "FORBIDDEN"
	ErrCodeRateLimit    = "RATE_LIMIT"
	ErrCodeBadRequest   = "BAD_REQUEST"
)

// Error messages
const (
	MsgInvalidRequest     = "Invalid request format"
	MsgInvalidCredentials = "Invalid credentials"
	MsgResourceNotFound   = "Resource not found"
	MsgDatabaseError      = "Database operation failed"
	MsgInternalError      = "Internal server error"
	MsgRateLimitExceeded  = "Rate limit exceeded"
	MsgUnauthorized       = "Unauthorized access"
	MsgForbidden          = "Access forbidden"
)

// NewAppError creates a new application error
func NewAppError(code, message string, status int) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Status:  status,
	}
}

// WithDetails adds details to error
func (e *AppError) WithDetails(details string) *AppError {
	e.Details = details
	return e
}

// Common error constructors
func NewValidationError(message string) *AppError {
	return NewAppError(ErrCodeValidation, message, http.StatusBadRequest)
}

func NewNotFoundError(resource string) *AppError {
	return NewAppError(ErrCodeNotFound, fmt.Sprintf("%s not found", resource), http.StatusNotFound)
}

func NewDuplicateError(resource string) *AppError {
	return NewAppError(ErrCodeDuplicate, fmt.Sprintf("%s already exists", resource), http.StatusConflict)
}

func NewDatabaseError(message string) *AppError {
	return NewAppError(ErrCodeDatabase, message, http.StatusInternalServerError)
}

func NewInternalError(message string) *AppError {
	return NewAppError(ErrCodeInternal, message, http.StatusInternalServerError)
}

func NewUnauthorizedError() *AppError {
	return NewAppError(ErrCodeUnauthorized, MsgInvalidCredentials, http.StatusUnauthorized)
}

func NewForbiddenError() *AppError {
	return NewAppError(ErrCodeForbidden, MsgForbidden, http.StatusForbidden)
}

func NewRateLimitError() *AppError {
	return NewAppError(ErrCodeRateLimit, MsgRateLimitExceeded, http.StatusTooManyRequests)
}

// Error logging utility
func LogError(err error, context string) {
	if err != nil {
		_, file, line, ok := runtime.Caller(2)
		if ok {
			fmt.Printf("[%s] ERROR %s:%d:%d: %v\n", time.Now().Format("2006-01-02 15:04:05"), context, file, line, err)
		} else {
			fmt.Printf("[%s] ERROR %s: %v\n", time.Now().Format("2006-01-02 15:04:05"), context, err)
		}
	}
}

// Error response utility
func WriteErrorResponse(w http.ResponseWriter, err *AppError) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(err.Status)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":    err.Code,
			"message": err.Message,
		},
		"success": false,
	}

	if err.Details != "" {
		if errorMap, ok := response["error"].(map[string]interface{}); ok {
			errorMap["details"] = err.Details
		}
	}

	// Add request ID for tracking
	w.Header().Set("X-Request-ID", generateRequestID())

	// Log the error
	LogError(fmt.Errorf("API Error: %s", err.Message), fmt.Sprintf("Request ID: %s", w.Header().Get("X-Request-ID")))
}

// Generate unique request ID
func generateRequestID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
