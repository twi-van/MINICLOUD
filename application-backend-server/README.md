# Application Backend Server (NestJS) — Vân

API: `GET /hello`, `GET /student`, `GET /rooms`, `GET /rooms/:id`.

## Chạy qua Docker Compose (Sprint 2)

Từ **thư mục gốc** repo (`cloud/`):

```bash
docker compose up -d --build application-backend-server web-frontend-server api-gateway-proxy-server
curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/rooms
```

- Qua proxy: `http://localhost/api/...`
- App trực tiếp: `http://localhost:8085/hello`

Rooms: đọc `rooms.json`; nếu set `POSTGRES_HOST` (trong compose) thì đọc bảng Postgres của Lợi.

## Chạy local (npm, không Docker)

```bash
npm install
npm run start:dev
# http://localhost:8081/hello
```
