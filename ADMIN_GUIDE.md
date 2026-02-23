# Руководство по администрированию Jaluxi

## Обзор

Система управления жалюзи включает:
- **Каталог материалов** с ценообразованием
- **Систему отзывов** с фото
- **Калькулятор стоимости** с настраиваемыми коэффициентами
- **Админ-панель** для управления контентом

## Структура БД

### Материалы
```json
{
  "id": 1,
  "supplierCode": "VERT-WHITE-50",
  "name": "Вертикальные шторы, белые",
  "category": "Вертикальные жалюзи",
  "color": "Белый",
  "lightTransmission": 50,
  "pricePerM2": 500,
  "imageUrl": "/images/materials/vertical-white-50.jpg"
}
```

### Отзывы
```json
{
  "id": 1,
  "name": "Иван Петров",
  "rating": 5,
  "comment": "Отличные жалюзи, очень довольны!",
  "imageUrl": "/images/reviews/review1.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Конфигурация ценообразования
```json
{
  "frameMarkup": 0.3,
  "productionMarkup": 0.5,
  "minAreaM2": 0.5
}
```

## Формула расчета стоимости

```
Базовая стоимость = Площадь × Цена м² материала
Стоимость каркаса = Базовая стоимость × Коэффициент каркаса (30%)
Себестоимость = Базовая стоимость + Стоимость каркаса
Наценка производства = Себестоимость × Коэффициент производства (50%)
Итоговая стоимость = Себестоимость + Наценка производства
```

## API Эндпоинты

### Публичные
- `GET /api/catalog` - Получить каталог материалов
- `GET /api/reviews` - Получить отзывы
- `POST /api/estimate` - Рассчитать стоимость
- `GET /api/promotions` - Получить акции

### Админские
- `GET /api/pricing` - Получить конфигурацию ценообразования
- `PUT /api/pricing` - Обновить конфигурацию ценообразования
- `POST /api/materials` - Добавить материал
- `PUT /api/materials/{id}` - Обновить материал
- `DELETE /api/materials/{id}` - Удалить материал

## Админ-панель

Доступна по адресу: `/admin`

Функциональность:
- **Управление материалами**: просмотр, удаление
- **Управление отзывами**: просмотр всех отзывов с фото
- **Настройки ценообразования**: изменение коэффициентов в реальном времени

## Парсер данных

Для заполнения начальной БД используйте парсер:

```bash
# Запуск парсера
cd backend
go run ./cmd/parser

# Загрузка данных в БД
curl -X POST http://localhost:8080/api/materials \
  -H 'Content-Type: application/json' \
  -d @materials.json
```

## Ручное редактирование vs CMS

### Рекомендуемый подход: Конфигурационные файлы + автодеплой

1. **Данные хранятся в JSON файлах**
2. **Изменения через Git**
3. **Автоматический деплой при коммите**

Преимущества:
- Версионность всех изменений
- Отсутствие необходимости в БД на продакшене
- Простота бэкапа
- Быстрое восстановление

### Структура конфигурационных файлов

```
/data/
  materials.json
  reviews.json
  pricing.json
  site.json      # тексты, контакты, цвета
```

## Пример использования калькулятора

```javascript
const request = {
  widthMm: 1500,
  heightMm: 1200,
  productType: "vertical",
  materialId: 1
};

fetch('/api/estimate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
})
.then(response => response.json())
.then(data => {
  console.log(`Стоимость: ${data.price} ${data.currency}`);
  console.log(`Расчет: ${data.breakdown}`);
});
```

## Управление изображениями

1. **Материалы**: `/public/images/materials/`
2. **Отзывы**: `/public/images/reviews/`
3. **Наши работы**: `/public/images/portfolio/`

Рекомендуемый размер:
- Материалы: 800×600px
- Отзывы: 400×300px
- Портфолио: 1200×800px

## Резервное копирование

```bash
# Экспорт всех данных
curl -s http://localhost:8080/api/catalog > backup-materials.json
curl -s http://localhost:8080/api/reviews > backup-reviews.json
curl -s http://localhost:8080/api/pricing > backup-pricing.json

# Восстановление
curl -X POST http://localhost:8080/api/materials -d @backup-materials.json
```

## Мониторинг

Проверка здоровья системы:
```bash
curl http://localhost:8080/api/health
```

Ответ: `{"status":"ok"}`
