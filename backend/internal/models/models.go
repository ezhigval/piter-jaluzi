package models

import (
	"time"
)

// BaseModel содержит общие поля для всех моделей
type BaseModel struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt *time.Time     `json:"-" gorm:"index"`
}

// Page представляет страницу сайта
type Page struct {
	BaseModel
	Slug          string    `json:"slug" gorm:"uniqueIndex;not null"`
	Title         string    `json:"title" gorm:"not null"`
	Description    string    `json:"description" gorm:"type:text"`
	Content       string    `json:"content" gorm:"type:text"`
	IsActive      bool      `json:"is_active" gorm:"default:true;index"`
	IsInNavigation bool      `json:"is_in_navigation" gorm:"default:true"`
	NavigationTitle string   `json:"navigation_title"`
	NavigationOrder int     `json:"navigation_order" gorm:"default:999"`
	SEO           PageSEO  `json:"seo" gorm:"embedded;embeddedPrefix:seo_"`
	Blocks        []Block   `json:"blocks" gorm:"foreignKey:PageID"`
}

// PageSEO содержит SEO мета-данные страницы
type PageSEO struct {
	Title       string `json:"title" gorm:"size:255"`
	Description string `json:"description" gorm:"size:500"`
	Keywords    string `json:"keywords" gorm:"size:500"`
	OgImage     string `json:"og_image" gorm:"size:500"`
	Canonical   string `json:"canonical" gorm:"size:500"`
	Robots     string `json:"robots" gorm:"size:100;default:'index,follow'"`
}

// Block представляет блок контента на странице
type Block struct {
	BaseModel
	PageID    uint   `json:"page_id" gorm:"not null;index"`
	Type      string `json:"type" gorm:"size:50;not null"`
	Content   string `json:"content" gorm:"type:json;not null"`
	Order     int    `json:"order" gorm:"default:0"`
	IsActive   bool   `json:"is_active" gorm:"default:true"`
	Styles     string `json:"styles" gorm:"type:json"`
	SEO        BlockSEO `json:"seo" gorm:"embedded;embeddedPrefix:seo_"`
}

// BlockSEO содержит SEO мета-данные блока
type BlockSEO struct {
	Title       string `json:"title" gorm:"size:255"`
	Description string `json:"description" gorm:"size:500"`
	OgImage     string `json:"og_image" gorm:"size:500"`
}

// Category представляет категорию жалюзи
type Category struct {
	BaseModel
	Name        string      `json:"name" gorm:"size:100;not null;uniqueIndex"`
	Slug        string      `json:"slug" gorm:"size:100;not null;uniqueIndex"`
	Description string      `json:"description" gorm:"type:text"`
	Image       string      `json:"image" gorm:"size:500"`
	IsActive    bool        `json:"is_active" gorm:"default:true;index"`
	Order       int         `json:"order" gorm:"default:0"`
	Materials   []Material  `json:"materials" gorm:"foreignKey:CategoryID"`
}

// Material представляет материал жалюзи
type Material struct {
	BaseModel
	CategoryID    uint    `json:"category_id" gorm:"not null;index"`
	Name          string  `json:"name" gorm:"size:200;not null"`
	Slug          string  `json:"slug" gorm:"size:200;not null;uniqueIndex"`
	Description   string  `json:"description" gorm:"type:text"`
	Image         string  `json:"image" gorm:"size:500"`
	PricePerM2    float64 `json:"price_per_m2" gorm:"type:decimal(10,2);not null"`
	SupplierCode  string  `json:"supplier_code" gorm:"size:100"`
	Composition   string  `json:"composition" gorm:"size:500"`
	Density       string  `json:"density" gorm:"size:100"`
	Width         string  `json:"width" gorm:"size:100"`
	Features      string  `json:"features" gorm:"type:json"`
	InStock       bool    `json:"in_stock" gorm:"default:true;index"`
	MinOrder      float64 `json:"min_order" gorm:"type:decimal(10,2);default:1.0"`
	IsActive      bool    `json:"is_active" gorm:"default:true;index"`
}

// Review представляет отзыв клиента
type Review struct {
	BaseModel
	Author      string  `json:"author" gorm:"size:200;not null"`
	Rating      int     `json:"rating" gorm:"check:rating >= 1 AND rating <= 5;not null"`
	Text        string  `json:"text" gorm:"type:text;not null"`
	Response    string  `json:"response" gorm:"type:text"`
	ImageURL    string  `json:"image_url" gorm:"size:500"`
	IsPublished bool    `json:"is_published" gorm:"default:false;index"`
	IsApproved  bool    `json:"is_approved" gorm:"default:false;index"`
}

// GalleryWork представляет работу в галерее
type GalleryWork struct {
	BaseModel
	Title       string   `json:"title" gorm:"size:300;not null"`
	Description string   `json:"description" gorm:"type:text"`
	IsActive    bool     `json:"is_active" gorm:"default:true;index"`
	Order       int      `json:"order" gorm:"default:0"`
	Category    string   `json:"category" gorm:"size:100"` // Тип жалюзи в работе
}

// Image представляет изображение
type Image struct {
	BaseModel
	GalleryWorkID uint   `json:"gallery_work_id" gorm:"not null;index"`
	Src           string `json:"src" gorm:"size:500;not null"`
	Alt           string `json:"alt" gorm:"size:300"`
	Caption       string `json:"caption" gorm:"size:500"`
	Order         int    `json:"order" gorm:"default:0"`
}

// Lead представляет заявку клиента
type Lead struct {
	BaseModel
	Name         string    `json:"name" gorm:"size:200;not null"`
	Phone        string    `json:"phone" gorm:"size:20;not null"`
	Email        string    `json:"email" gorm:"size:200"`
	WindowWidth  float64   `json:"window_width" gorm:"type:decimal(10,2)"`
	WindowHeight float64   `json:"window_height" gorm:"type:decimal(10,2)"`
	MaterialID   *uint     `json:"material_id" gorm:"index"`
	CategoryID   *uint     `json:"category_id" gorm:"index"`
	Message      string    `json:"message" gorm:"type:text"`
	Status       string    `json:"status" gorm:"size:50;default:'new'"`
	Source       string    `json:"source" gorm:"size:50;default:'website'"`
	TotalPrice   float64   `json:"total_price" gorm:"type:decimal(10,2)"`
}

// SiteConfig представляет конфигурацию сайта
type SiteConfig struct {
	BaseModel
	Key         string `json:"key" gorm:"size:100;not null;uniqueIndex"`
	Value       string `json:"value" gorm:"type:text;not null"`
	Description string `json:"description" gorm:"size:500"`
	Type        string `json:"type" gorm:"size:50;default:'string'"`
}

// User представляет пользователя админ-панели
type User struct {
	BaseModel
	Email        string     `json:"email" gorm:"size:200;not null;uniqueIndex"`
	PasswordHash string     `json:"-" gorm:"size:255;not null"`
	FirstName    string     `json:"first_name" gorm:"size:100;not null"`
	LastName     string     `json:"last_name" gorm:"size:100;not null"`
	Role         string     `json:"role" gorm:"size:50;default:'admin'"`
	IsActive     bool       `json:"is_active" gorm:"default:true;index"`
	LastLogin    *time.Time `json:"last_login"`
}

// PricingFormula представляет формулу расчета стоимости
type PricingFormula struct {
	BaseModel
	Name             string  `json:"name" gorm:"size:200;not null"`
	MaterialMarkup   float64 `json:"material_markup" gorm:"type:decimal(5,2);default:1.30"` // Наценка на материал
	InstallationCost  float64 `json:"installation_cost" gorm:"type:decimal(10,2);default:1500"` // Стоимость установки
	MinOrderPrice    float64 `json:"min_order_price" gorm:"type:decimal(10,2);default:3000"` // Минимальная стоимость заказа
	AdditionalCost   float64 `json:"additional_cost" gorm:"type:decimal(10,2);default:0"` // Дополнительные расходы
	IsActive         bool    `json:"is_active" gorm:"default:true;index"`
}
