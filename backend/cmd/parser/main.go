package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
)

// ParsedMaterial представляет структуру материала после парсинга
type ParsedMaterial struct {
	SupplierCode      string  `json:"supplierCode"`
	Name              string  `json:"name"`
	Category          string  `json:"category"`
	Color             string  `json:"color"`
	LightTransmission int     `json:"lightTransmission"`
	PricePerM2       float64 `json:"pricePerM2"`
	ImageURL          string  `json:"imageUrl"`
}

// generateSampleData создает пример данных для парсинга
func generateSampleData() []ParsedMaterial {
	return []ParsedMaterial{
		{
			SupplierCode:      "VERT-WHITE-50",
			Name:              "Вертикальные шторы, белые",
			Category:          "Вертикальные жалюзи",
			Color:             "Белый",
			LightTransmission: 50,
			PricePerM2:       500,
			ImageURL:          "/images/materials/vertical-white-50.jpg",
		},
		{
			SupplierCode:      "HORIZ-BEIGE-70",
			Name:              "Горизонтальные шторы, бежевые",
			Category:          "Горизонтальные жалюзи",
			Color:             "Бежевый",
			LightTransmission: 70,
			PricePerM2:       600,
			ImageURL:          "/images/materials/horizontal-beige-70.jpg",
		},
		{
			SupplierCode:      "ROLLER-GREY-0",
			Name:              "Рулонные шторы блэкаут, серые",
			Category:          "Рулонные шторы",
			Color:             "Серый",
			LightTransmission: 0,
			PricePerM2:       800,
			ImageURL:          "/images/materials/roller-grey-0.jpg",
		},
		{
			SupplierCode:      "VERT-CREAM-60",
			Name:              "Вертикальные шторы, кремовые",
			Category:          "Вертикальные жалюзи",
			Color:             "Кремовый",
			LightTransmission: 60,
			PricePerM2:       550,
			ImageURL:          "/images/materials/vertical-cream-60.jpg",
		},
		{
			SupplierCode:      "HORIZ-WHITE-80",
			Name:              "Горизонтальные шторы, белые",
			Category:          "Горизонтальные жалюзи",
			Color:             "Белый",
			LightTransmission: 80,
			PricePerM2:       450,
			ImageURL:          "/images/materials/horizontal-white-80.jpg",
		},
	}
}

// saveMaterialsToFile сохраняет материалы в JSON файл
func saveMaterialsToFile(materials []ParsedMaterial, filename string) error {
	data, err := json.MarshalIndent(materials, "", "  ")
	if err != nil {
		return fmt.Errorf("ошибка сериализации: %v", err)
	}

	err = ioutil.WriteFile(filename, data, 0644)
	if err != nil {
		return fmt.Errorf("ошибка записи файла: %v", err)
	}

	fmt.Printf("Данные сохранены в файл: %s\n", filename)
	return nil
}

// parseFromCSV пример парсинга из CSV
func parseFromCSV(content string) []ParsedMaterial {
	lines := strings.Split(content, "\n")
	var materials []ParsedMaterial

	for i, line := range lines {
		if i == 0 || strings.TrimSpace(line) == "" {
			continue // Пропускаем заголовок и пустые строки
		}

		parts := strings.Split(line, ",")
		if len(parts) >= 6 {
			material := ParsedMaterial{
				SupplierCode:      strings.TrimSpace(parts[0]),
				Name:              strings.TrimSpace(parts[1]),
				Category:          strings.TrimSpace(parts[2]),
				Color:             strings.TrimSpace(parts[3]),
				LightTransmission: parseInt(strings.TrimSpace(parts[4])),
				PricePerM2:       parseFloat(strings.TrimSpace(parts[5])),
			}
			if len(parts) >= 7 {
				material.ImageURL = strings.TrimSpace(parts[6])
			}
			materials = append(materials, material)
		}
	}

	return materials
}

// parseInt безопасное преобразование строки в int
func parseInt(s string) int {
	var result int
	fmt.Sscanf(s, "%d", &result)
	return result
}

// parseFloat безопасное преобразование строки в float64
func parseFloat(s string) float64 {
	var result float64
	fmt.Sscanf(s, "%f", &result)
	return result
}

func main() {
	fmt.Println("Парсер материалов для Jaluxi")
	fmt.Println("=============================")

	// Генерируем пример данных
	materials := generateSampleData()
	
	// Сохраняем в JSON файл
	err := saveMaterialsToFile(materials, "materials.json")
	if err != nil {
		log.Fatalf("Ошибка: %v", err)
	}

	// Выводим статистику
	fmt.Printf("\nСгенерировано материалов: %d\n", len(materials))
	fmt.Println("\nПример материала:")
	if len(materials) > 0 {
		m := materials[0]
		fmt.Printf("  Артикул: %s\n", m.SupplierCode)
		fmt.Printf("  Название: %s\n", m.Name)
		fmt.Printf("  Категория: %s\n", m.Category)
		fmt.Printf("  Цвет: %s\n", m.Color)
		fmt.Printf("  Светопропускаемость: %d%%\n", m.LightTransmission)
		fmt.Printf("  Цена за м²: %.0f ₽\n", m.PricePerM2)
		fmt.Printf("  Изображение: %s\n", m.ImageURL)
	}

	fmt.Println("\nДля загрузки данных в БД используйте API эндпоинт POST /api/materials")
	fmt.Println("Пример curl команды:")
	fmt.Println("curl -X POST http://localhost:8080/api/materials \\")
	fmt.Println("  -H 'Content-Type: application/json' \\")
	fmt.Println("  -d @materials.json")
}
