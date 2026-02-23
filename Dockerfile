FROM node:20-alpine AS frontend
WORKDIR /app/web

COPY web/package*.json ./
RUN npm ci

COPY web ./
RUN npm run build

FROM golang:1.23-alpine AS backend
WORKDIR /app/backend

COPY backend ./
RUN go build -o /app/server .

FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_PORT=8080

COPY --from=backend /app/server ./server

# Next standalone output
COPY --from=frontend /app/web/.next/standalone ./web
COPY --from=frontend /app/web/.next/static ./web/.next/static
COPY --from=frontend /app/web/public ./web/public

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]

