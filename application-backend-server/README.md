# Application Backend Server (NestJS) — Vân

API: `GET /hello`, `GET /student`, `GET /rooms`, `GET /rooms/:id`.

`/hello` trả thêm `instance` (`app-1` / `app-2`) để minh chứng Load Balancer.

## Chạy qua Docker Compose (Sprint 2–3)

Từ **thư mục gốc** repo (`cloud/`):

```bash
# Nếu compose báo network external thiếu:
docker network create cloud-net

docker compose up -d --build \
  application-backend-server-1 \
  application-backend-server-2 \
  web-frontend-server \
  api-gateway-proxy-server

curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/rooms

# LB Round Robin — gọi nhiều lần, xem instance xen kẽ app-1 / app-2
curl -s http://localhost/api/hello
curl -s http://localhost/api/hello
curl -s http://localhost/api/hello
```

- Qua proxy: `http://localhost/api/...`
- App trực tiếp: `:8085` (app-1), `:8086` (app-2)

Rooms: `rooms.json` (khớp FE Hân); set `POSTGRES_HOST` thì đọc Postgres Lợi.

## Chạy local (npm, không Docker)

```bash
npm install
npm run start:dev
# http://localhost:8081/hello
```
