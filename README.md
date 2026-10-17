# MyMiniCloud

Mô phỏng hệ thống cloud thu nhỏ gồm 9 server (Docker), chung mạng `cloud-net`.

## Thành viên


| Họ tên | Phụ trách                                         |
| ------ | ------------------------------------------------- |
| Hân    | Web, DNS + khung/format Word                      |
| Vân    | Proxy, App, Load Balancing                        |
| Lợi    | DB, Auth, MinIO                                   |
| Bảo    | Prometheus, Grafana, EC2, Docker Hub, video, ping |


Chi tiết: xem `PHAN_CONG_NHOM.md`.

## Cấu trúc

```text
cloud/
├── README.md
├── PHAN_CONG_NHOM.md
├── .gitignore
├── web-frontend-server/html/blog/          ← Hân
├── internal-dns-server/                    ← Hân
├── api-gateway-proxy-server/               ← Vân
├── application-backend-server/             ← Vân
├── relational-database-server/init/        ← Lợi
├── authentication-identity-server/         ← Lợi
├── object-storage-server/data/             ← Lợi
├── monitoring-prometheus-server/           ← Bảo
├── monitoring-grafana-dashboard-server/    ← Bảo
└── docs/screenshots/
```



## Cổng dịch vụ


| Service             | Port host   |
| ------------------- | ----------- |
| Proxy (API Gateway) | 80          |
| Web                 | 8080        |
| Auth (Keycloak)     | 8081        |
| App API             | 8085        |
| Grafana             | 3000        |
| MinIO API / Console | 9000 / 9001 |
| Prometheus          | 9090        |
| Node Exporter       | 9100        |
| DNS                 | 1053/udp    |
| MariaDB             | 3306        |




## Tài khoản demo (mặc định lab)


| Dịch vụ  | User       | Password   |
| -------- | ---------- | ---------- |
| Keycloak | admin      | admin      |
| Grafana  | admin      | admin      |
| MinIO    | minioadmin | minioadmin |
| MariaDB  | root       | root       |




## Chạy local

Yêu cầu: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

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
# Web
curl -I http://localhost:8080/
curl -I http://localhost:8080/blog/

# App (trực tiếp + qua proxy)
curl http://localhost:8085/hello
curl http://localhost/api/hello

# Proxy
curl -I http://localhost/
curl -I http://localhost/auth/

# DNS
dig @127.0.0.1 -p 1053 web-frontend-server.cloud.local +short
```

- Prometheus: [http://localhost:9090](http://localhost:9090) → Status → Targets  
- Grafana: [http://localhost:3000](http://localhost:3000)  
- MinIO: [http://localhost:9001](http://localhost:9001)  
- Keycloak: [http://localhost:8081](http://localhost:8081)



## Phân công mở rộng (tóm tắt)

- **Hân (1,0đ):** blog 3 bài, DNS records  
- **Vân (1,5đ):** API `/student`, route `/student/`, LB Round Robin  
- **Lợi (1,5đ):** `studentdb`, Keycloak realm, MinIO buckets  
- **Bảo (1,0đ):** scrape Prometheus web, Grafana dashboard (+ EC2 / Hub / video)

