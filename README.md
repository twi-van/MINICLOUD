# MyMiniCloud

Mô phỏng hạ tầng cloud thu nhỏ (**9 loại server**) bằng Docker, mạng chung `cloud-net`, gắn **ứng dụng mini E2E** (list → login → API → DB → ảnh).

**Stack:** React + NestJS + PostgreSQL + Keycloak + MinIO + Bind9 + Prometheus + Grafana/Loki + Nginx Proxy/LB.

## Thành viên

| Họ tên | Phụ trách |
| ------ | --------- |
| Hân | Web (**React**) + DNS + khung/format Word |
| Vân | Proxy + App (**NestJS**) + Load Balancing |
| Lợi | DB (**PostgreSQL**) + Auth (Keycloak) + MinIO |
| Bảo | Prometheus + Grafana + Loki/Promtail + EC2 + Docker Hub + video + ping |

Chi tiết: xem `PHAN_CONG_NHOM.md`.

## Stack nhanh

| Server | Công nghệ |
| ------ | --------- |
| Web | React build → Nginx |
| App | NestJS (scale ≥ 2 instance) |
| Database | PostgreSQL |
| Auth | Keycloak (login trên UI) |
| Object storage | MinIO |
| DNS | Bind9 (`cloud.local`) |
| Monitoring | Prometheus + Node Exporter |
| Visualization | Grafana + Loki + Promtail |
| Proxy / LB | Nginx (route + Round Robin app) |
| Thêm (tuỳ chọn) | Redis, Alertmanager… |

## Cấu trúc

```text
cloud/
├── README.md
├── PHAN_CONG_NHOM.md
├── docker-compose.yml              ← Bảo merge
├── web-frontend-server/            ← Hân (React)
├── internal-dns-server/            ← Hân
├── api-gateway-proxy-server/       ← Vân
├── application-backend-server/     ← Vân (NestJS)
├── relational-database-server/     ← Lợi (Postgres)
├── authentication-identity-server/ ← Lợi
├── object-storage-server/          ← Lợi
├── monitoring-prometheus-server/   ← Bảo
├── monitoring-grafana-dashboard-server/ ← Bảo
└── docs/screenshots/
```

## Cổng dịch vụ

| Service | Port host |
| ------- | --------- |
| Proxy (API Gateway) | 80 |
| Web | 8080 |
| Auth (Keycloak) | 8081 |
| App API | 8085 (container 8081) |
| Grafana | 3000 |
| MinIO API / Console | 9000 / 9001 |
| Prometheus | 9090 |
| Node Exporter | 9100 |
| DNS | 1053/udp |
| PostgreSQL | 5432 |

## Tài khoản demo (mặc định)

| Dịch vụ | User | Password |
| ------- | ---- | -------- |
| Keycloak | admin | admin |
| Grafana | admin | admin |
| MinIO | minioadmin | minioadmin |
| PostgreSQL | *(theo compose / `.env`)* | *(theo compose / `.env`)* |

## Chạy local

Yêu cầu: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Sprint 2–3 — App × 2 (LB) + Proxy + Web:** từ thư mục gốc repo:

```bash
docker network create cloud-net   # nếu chưa có (compose dùng external network)

docker compose up -d --build \
  application-backend-server-1 \
  application-backend-server-2 \
  web-frontend-server \
  api-gateway-proxy-server

curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/rooms

# LB: gọi vài lần — instance xen kẽ app-1 / app-2
curl -s http://localhost/api/hello; echo
curl -s http://localhost/api/hello; echo
```

Chạy cả stack (khi đã merge đủ service):

```bash
docker compose up -d --build
docker compose ps
```

Dừng:

```bash
docker compose down
```

## Kiểm thử nhanh

```bash
# Qua proxy (S2)
curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/rooms
curl -I http://localhost/
curl -I http://localhost/auth/

# Web / App trực tiếp
curl -I http://localhost:8080/
curl -s http://localhost:8085/hello

# DNS
dig @127.0.0.1 -p 1053 web-frontend-server.cloud.local +short
```

- Prometheus: http://localhost:9090 → Status → Targets  
- Grafana: http://localhost:3000  
- MinIO: http://localhost:9001  
- Keycloak: http://localhost:8081  

## Phân công mở rộng / E2E (tóm tắt)

- **Hân (1,0đ):** UI React E2E + DNS records (+ map mở rộng Web nếu cần)  
- **Vân (1,5đ):** NestJS API + proxy routes + LB Round Robin nhiều app  
- **Lợi (1,5đ):** Postgres schema/CRUD + Keycloak realm gắn UI + MinIO ảnh  
- **Bảo (1,0đ):** scrape/dashboard/Loki + EC2 + Docker Hub + video  

## Link nộp

- **Docker Hub:** [baomache/myminicloud-prometheus:v1](https://hub.docker.com/repository/docker/baomache/myminicloud-prometheus/tags)
- **AWS EC2 Public IP:** `13.250.19.3`
- **Video demo:** *[Đang cập nhật / Chèn link YouTube hoặc Drive vào đây]*
