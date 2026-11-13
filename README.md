# MyMiniCloud

Mô phỏng hạ tầng cloud thu nhỏ (**9 loại server**) bằng Docker, mạng chung `cloud-net`, gắn **ứng dụng mini E2E** (list → login → API → DB → ảnh).

**Stack:** React + NestJS + PostgreSQL + Keycloak + MinIO + Bind9 + Prometheus + Grafana/Loki + Nginx Proxy/LB.

## Thành viên


| Họ tên | Phụ trách                                                              |
| ------ | ---------------------------------------------------------------------- |
| Hân    | Web (**React**) + DNS + khung/format Word                              |
| Vân    | Proxy + App (**NestJS**) + Load Balancing                              |
| Lợi    | DB (**PostgreSQL**) + Auth (Keycloak) + MinIO                          |
| Bảo    | Prometheus + Grafana + Loki/Promtail + EC2 + Docker Hub + video + ping |


## Stack nhanh


| Server          | Công nghệ                       |
| --------------- | ------------------------------- |
| Web             | React build → Nginx (MPA + SPA) |
| App             | NestJS (scale ≥ 2 instance)     |
| Database        | PostgreSQL                      |
| Auth            | Keycloak (login trên UI)        |
| Object storage  | MinIO                           |
| DNS             | Bind9 (`cloud.local`)           |
| Monitoring      | Prometheus + Node Exporter      |
| Visualization   | Grafana + Loki + Promtail       |
| Proxy / LB      | Nginx (route + Round Robin app & web) |
| Cache (thêm)    | Redis                           |




## Cấu trúc

```text
MINICLOUD/
├── README.md
├── docker-compose.yml                      ← Bảo merge (toàn bộ 9+ service)
├── web-frontend-server/                    ← Hân (React + Vite, build MPA)
├── internal-dns-server/                    ← Hân (Bind9)
├── api-gateway-proxy-server/               ← Vân (Nginx proxy + LB)
├── application-backend-server/             ← Vân (NestJS)
├── relational-database-server/             ← Lợi (Postgres)
│   └── init/                               ← SQL init + studentdb shell
├── authentication-identity-server/         ← Lợi (Keycloak)
│   └── realm/                              ← realm_52400211.json + minicloud-realm.json
├── object-storage-server/                  ← Lợi (MinIO)
│   └── seed/                               ← ảnh phòng mẫu (room-1..6.jpg, avatar)
├── monitoring-prometheus-server/           ← Bảo
├── monitoring-grafana-dashboard-server/    ← Bảo (Grafana + Loki + Promtail)
└── docs/                                   ← báo cáo Word
```



## Cổng dịch vụ


| Service                   | Port host                                     |
| ------------------------- | --------------------------------------------- |
| Proxy (API Gateway)       | **80**                                        |
| Web (instance 1)          | 8080                                          |
| Web (instance 2)          | 8083                                          |
| Auth (Keycloak)           | 8081 (host) → container 8080                  |
| App API (instance 1 / 2)  | 8085 / 8086 (container 8081)                  |
| Grafana                   | 3000                                          |
| Loki                      | 3100                                          |
| MinIO API / Console       | 9000 / 9001                                   |
| Prometheus                | 9090                                          |
| Node Exporter             | 9100                                          |
| Redis                     | 6379                                          |
| DNS                       | 1053/udp · 1053/tcp                           |
| PostgreSQL                | 5432                                          |




## Tài khoản demo (mặc định)


| Dịch vụ                       | User                                                | Password      |
| ----------------------------- | --------------------------------------------------- | ------------- |
| Keycloak admin                | admin                                               | admin         |
| Grafana                       | admin                                               | admin         |
| MinIO                         | minioadmin                                          | minioadmin    |
| PostgreSQL (`minicloud`)      | minicloud                                           | minicloud_dev |
| Keycloak realm `realm_52400211` | sv01, sv02, student_demo                          | 123456        |
| Keycloak client               | `web-frontend` (React), `flask-app` (đề lab)        | —             |




## Chạy local

Yêu cầu: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Sprint 2–3 — App × 2 (LB) + Proxy + Web × 2:** từ thư mục gốc repo:

`docker-compose.yml` tự tạo mạng `cloud-net` (`172.20.0.0/16`, khớp zone Bind9). Máy sạch chỉ cần `compose up`. Nếu máy đã có `cloud-net` tạo tay và Compose báo lỗi mạng, chạy `docker compose down` rồi `docker network rm cloud-net` trước khi `up` lại.

```bash
docker compose up -d --build \
  application-backend-server-1 \
  application-backend-server-2 \
  web-frontend-server \
  web-frontend-server-2 \
  api-gateway-proxy-server

curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/students-db
curl http://localhost/student/
curl http://localhost/api/rooms

# LB app: xen kẽ app-1 / app-2
curl -s http://localhost/api/hello; echo
curl -s http://localhost/api/hello; echo

# LB web (đề): xen kẽ web-frontend-server-1 / web-frontend-server-2
curl -s http://localhost/lb-demo
curl -s http://localhost/lb-demo

# Đề Auth: realm realm_52400211 + client flask-app → /secure
TOKEN=$(curl -s -X POST http://localhost/auth/realms/realm_52400211/protocol/openid-connect/token \
  -d 'client_id=flask-app' -d 'grant_type=password' \
  -d 'username=sv01' -d 'password=123456' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["access_token"])')
curl -s http://localhost/secure -H "Authorization: Bearer $TOKEN"; echo
```

Chạy cả stack (khi đã merge đủ service):

```bash
docker compose up -d --build
docker compose ps

# Seed ảnh phòng (rooms-images bucket) và avatar (profile-pics bucket) vào MinIO
bash object-storage-server/seed-rooms.sh
```

Dừng:

```bash
docker compose down
```



## Kiểm thử nhanh

```bash
# Qua proxy — dùng http://localhost/ (không dùng localhost.cloud)
curl http://localhost/api/hello
curl http://localhost/api/student
curl http://localhost/api/students-db
curl http://localhost/student/
curl http://localhost/api/rooms
curl -I http://localhost/
curl -I http://localhost/auth/
curl -I http://localhost/minio/
curl -I http://localhost:8080/metrics
curl -s http://localhost/lb-demo; echo

# Web / App trực tiếp
curl -I http://localhost:8080/
curl -s http://localhost:8085/hello

# Blog tĩnh (4 bài + index)
curl -I http://localhost/blog/
curl -I http://localhost/blog/blog1.html   # Lần đầu tìm trọ
curl -I http://localhost/blog/blog2.html   # Checklist đồ dùng
curl -I http://localhost/blog/blog3.html   # Ngân sách sinh viên
curl -I http://localhost/blog/blog4.html   # Hướng dẫn thuê trọ lần đầu

# DNS (kỳ vọng trùng IP tĩnh compose, vd web → 172.20.0.10)
dig @127.0.0.1 -p 1053 web-frontend-server.cloud.local +short
dig @127.0.0.1 -p 1053 app-backend.cloud.local +short
dig @127.0.0.1 -p 1053 minio.cloud.local +short
dig @127.0.0.1 -p 1053 keycloak.cloud.local +short
```

- App / Login / Register: http://localhost/ · http://localhost/login · http://localhost/register
- Danh sách phòng: http://localhost/rooms · Chi tiết: http://localhost/rooms/:id
- Sinh viên: http://localhost/students
- Blog tĩnh (đề — 4 bài):
  - http://localhost/blog/ (trang danh sách)
  - http://localhost/blog/blog1.html · /blog/blog2.html · /blog/blog3.html · /blog/blog4.html
- Keycloak admin: http://localhost:8081/auth/admin/master/console/
- Keycloak qua proxy: http://localhost/auth/ — realm đề: `realm_52400211` (client `flask-app`, user `sv01`/`sv02`); client React: `web-frontend`
- Prometheus: http://localhost:9090 → Status → Targets (jobs: `web`, `application-backend`, `node`, `grafana`, `loki`, `prometheus`)
- Grafana: http://localhost:3000 — dashboard `System Health of 52400102`
- MinIO Console: http://localhost:9001
- MinIO qua proxy: http://localhost/minio/rooms-images/room-1.jpg
- Database đề `studentdb`: bảng `students` (`student_id`, `fullname`, `dob`, `major`). App `/api/students-db` đọc Postgres `studentdb`; `/api/student` đọc `students.json` (file tĩnh).
- Database chính `minicloud`: bảng `rooms`, `users`, `students`, `bookings`.

## Link nộp

- **Docker Hub:** https://hub.docker.com/r/baomache/myminicloud-prometheus/tags
- **AWS EC2:** http://13.250.19.3/ · http://13.250.19.3/api/hello · IP `13.250.19.3`
- **Video demo:** https://youtu.be/phD1_GaNqho

