# Jaluxi — сайт для жалюзи

Полноценный сервис для небольшого бизнеса по изготовлению и ремонту жалюзи.

## Стек

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend**: Go, chi, validator, httprate
- **Деплой**: Render.com (один Docker-сервис, Go + статический билд Next)

## Запуск локально

### 1. Frontend

```bash
cd web
npm install        # один раз
npm run dev
```

Приложение будет доступно на `http://localhost:3000`. Для продакшн‑бандла:

```bash
npm run build
```

Статический экспорт лежит в `web/out` и используется Go‑сервером.

### 2. Backend

```bash
cd backend
go run .
```

По умолчанию сервер слушает `http://localhost:8080` и:

- отдает статику Next (если есть `web/out`)
- обрабатывает API под `/api/*`

Основные эндпоинты:

- `GET /api/health` — health‑check
- `GET /api/catalog` — каталог материалов (локальная копия)
- `POST /api/estimate` — расчет ориентировочной стоимости
- `GET /api/promotions` — акции
- `GET /api/reviews`, `POST /api/reviews` — отзывы

## Деплой на Render

1. Залить репозиторий на GitHub.
2. В Render создать **Web Service**, выбрать репозиторий.
3. Render автоматически подхватит `render.yaml` и `Dockerfile`.
4. После билда сервис будет доступен по одному URL; фронт и API живут в одном контейнере.

## Дальнейшее развитие

- Подключить PostgreSQL и вынести каталог/отзывы/акции в БД.
- Добавить периодическую синхронизацию с сайтом поставщика (`intersklad.ru`) и административную панель.
- Включить антиспам (reCAPTCHA/Turnstile) на формах отзывов и заявок.

