-- Initial schema for Jaluxi application

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id BIGSERIAL PRIMARY KEY,
    supplier_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    color VARCHAR(100),
    light_transmission INTEGER NOT NULL CHECK (light_transmission >= 0 AND light_transmission <= 100),
    price_per_m2 DECIMAL(10,2) NOT NULL CHECK (price_per_m2 > 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    badge VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    image_url TEXT,
    company_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing configuration table
CREATE TABLE IF NOT EXISTS pricing_config (
    id SERIAL PRIMARY KEY,
    frame_markup DECIMAL(5,4) NOT NULL DEFAULT 0.3000 CHECK (frame_markup >= 0),
    production_markup DECIMAL(5,4) NOT NULL DEFAULT 0.5000 CHECK (production_markup >= 0),
    min_area_m2 DECIMAL(5,2) NOT NULL DEFAULT 0.50 CHECK (min_area_m2 > 0),
    installation_fee DECIMAL(10,2),
    measurement_fee DECIMAL(10,2),
    material_base_price DECIMAL(10,2),
    complexity_factor DECIMAL(5,4),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site content table
CREATE TABLE IF NOT EXISTS site_content (
    id BIGSERIAL PRIMARY KEY,
    page VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site configuration table
CREATE TABLE IF NOT EXISTS site_config (
    id SERIAL PRIMARY KEY,
    primary_color VARCHAR(20) DEFAULT '#blue-600',
    secondary_color VARCHAR(20) DEFAULT '#blue-800',
    accent_color VARCHAR(20) DEFAULT '#pink-500',
    company_name VARCHAR(100) DEFAULT 'Jaluxi',
    company_phone VARCHAR(20) DEFAULT '+7 (495) 123-45-67',
    company_email VARCHAR(100) DEFAULT 'info@jaluxi.ru',
    company_address TEXT DEFAULT 'Москва, ул. Примерная, д. 123',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Telegram subscribers table
CREATE TABLE IF NOT EXISTS telegram_subscribers (
    id BIGSERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_supplier_code ON materials(supplier_code);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_content_page_section ON site_content(page, section);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active) WHERE is_active = true;

-- Insert default data
INSERT INTO materials (supplier_code, name, category, color, light_transmission, price_per_m2, image_url) VALUES
('INT-HOR-ALU-25-WHITE', 'Горизонтальные алюминиевые 25 мм, белые', 'Горизонтальные жалюзи', 'Белый', 70, 900.00, '/images/materials/horizontal-white.jpg'),
('INT-VERT-TEXTURE-BEIGE', 'Вертикальные тканевые, бежевые', 'Вертикальные жалюзи', 'Бежевый', 50, 1100.00, '/images/materials/vertical-beige.jpg'),
('INT-ROLLER-BLACKOUT-GREY', 'Рулонные блэкаут, серые', 'Рулонные шторы', 'Серый', 0, 1300.00, '/images/materials/roller-grey.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO promotions (title, description, badge) VALUES
('Скидка 10% на второй комплект', 'При заказе жалюзи на два и более окна — скидка на каждый следующий комплект.', 'Акция')
ON CONFLICT DO NOTHING;

INSERT INTO pricing_config (frame_markup, production_markup, min_area_m2) VALUES
(0.3000, 0.5000, 0.50)
ON CONFLICT DO NOTHING;

INSERT INTO site_content (page, section, content_type, key_name, value, order_index) VALUES
('home', 'hero', 'text', 'title', 'Жалюзи под ваш размер окна за 3–5 дней', 1),
('home', 'hero', 'text', 'subtitle', 'Изготовление и ремонт жалюзи в Санкт-Петербурге', 2),
('home', 'hero', 'text', 'description', 'Подбираем материалы у надежных поставщиков, собираем жалюзи под ваш проем и выезжаем на замер и установку.', 3),
('about', 'hero', 'text', 'title', 'О компании Северный Контур', 1),
('about', 'hero', 'text', 'subtitle', 'Профессиональное производство и установка жалюзи с 2013 года', 2)
ON CONFLICT DO NOTHING;

INSERT INTO site_config (primary_color, secondary_color, accent_color, company_name, company_phone, company_email, company_address) VALUES
('#blue-600', '#blue-800', '#pink-500', 'Северный Контур', '+7 (812) 123-45-67', 'info@severnyj-kontur.ru', 'Санкт-Петербург, ул Боровая, д. 52')
ON CONFLICT DO NOTHING;
