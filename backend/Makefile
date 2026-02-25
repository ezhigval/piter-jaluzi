.PHONY: help build run dev test clean docker-up docker-down docker-logs

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build the application"
	@echo "  run       - Run the application"
	@echo "  dev       - Run with hot reload (air)"
	@echo "  test      - Run tests"
	@echo "  clean     - Clean build artifacts"
	@echo "  docker-up - Start development environment with Docker"
	@echo "  docker-down - Stop development environment"
	@echo "  docker-logs - Show Docker logs"

# Build the application
build:
	@echo "Building application..."
	go build -o ./tmp/main ./cmd/server

# Run the application
run: build
	@echo "Running application..."
	./tmp/main

# Run with hot reload
dev:
	@echo "Running with hot reload..."
	air -c .air.toml

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf ./tmp
	go clean

# Start development environment
docker-up:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-down:
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.dev.yml down

# Show Docker logs
docker-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod download
	go mod tidy

# Install air for hot reload
install-air:
	@echo "Installing air..."
	go install github.com/cosmtrek/air@latest
