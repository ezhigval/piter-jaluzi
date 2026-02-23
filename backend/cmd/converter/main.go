package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
)

// InterskladMaterial из парсера
type InterskladMaterial struct {
	SupplierCode      string  `json:"supplierCode"`
	Name              string  `json:"name"`
	Category          string  `json:"category"`
	Color             string  `json:"color"`
	LightTransmission int     `json:"lightTransmission"`
	PricePerM2       float64 `json:"pricePerM2"`
	ImageURL          string  `json:"imageUrl"`
	Description       string  `json:"description"`
}

// MaterialData структура из парсера
type MaterialData struct {
	Materials []InterskladMaterial `json:"materials"`
	Source    string               `json:"source"`
	ParsedAt  string               `json:"parsedAt"`
}

// Material для API
type Material struct {
	ID                int64   `json:"id"`
	SupplierCode      string  `json:"supplierCode"`
	Name              string  `json:"name"`
	Category          string  `json:"category"`
	Color             string  `json:"color,omitempty"`
	LightTransmission int     `json:"lightTransmission"`
	PricePerM2       float64 `json:"pricePerM2"`
	ImageURL          string  `json:"imageUrl,omitempty"`
}

func main() {
	// Читаем файл с данными от парсера
	data, err := ioutil.ReadFile("intersklad_materials.json")
	if err != nil {
		log.Fatalf("Ошибка чтения файла: %v", err)
	}

	var materialData MaterialData
	err = json.Unmarshal(data, &materialData)
	if err != nil {
		log.Fatalf("Ошибка парсинга JSON: %v", err)
	}

	// Конвертируем в формат API
	var apiMaterials []Material
	for i, material := range materialData.Materials {
		apiMaterial := Material{
			ID:                int64(i + 1), // Временный ID
			SupplierCode:      material.SupplierCode,
			Name:              material.Name,
			Category:          material.Category,
			Color:             material.Color,
			LightTransmission: material.LightTransmission,
			PricePerM2:       material.PricePerM2,
			ImageURL:          material.ImageURL,
		}
		apiMaterials = append(apiMaterials, apiMaterial)
	}

	// Сохраняем в формате API
	outputData, err := json.MarshalIndent(apiMaterials, "", "  ")
	if err != nil {
		log.Fatalf("Ошибка сериализации: %v", err)
	}

	err = ioutil.WriteFile("api_materials.json", outputData, 0644)
	if err != nil {
		log.Fatalf("Ошибка записи файла: %v", err)
	}

	fmt.Printf("Конвертировано %d материалов в формат API\n", len(apiMaterials))
	fmt.Println("Файл сохранен: api_materials.json")

	// Показываем пример для загрузки
	if len(apiMaterials) > 0 {
		fmt.Println("\nПример загрузки одного материала:")
		material := apiMaterials[0]
		jsonData, _ := json.MarshalIndent(material, "", "  ")
		fmt.Println(string(jsonData))
	}
}
