# MyMiniCloud – Internal DNS Server (Bind9)

## Cấu trúc

```
internal-dns-server/
├── Dockerfile
├── named.conf            # Entry point: include options + local
├── named.conf.options    # Listen, allow-query, forwarders
├── named.conf.local      # Khai báo zone cloud.local
└── zones/
    └── db.cloud.local    # Zone file chứa tất cả bản ghi A
```

## Zone `cloud.local` — Bản ghi đã cấu hình

| Tên miền nội bộ | IP (Docker subnet 172.20.0.0/16) |
| --- | --- |
| `web-frontend-server.cloud.local` | 172.20.0.10 |
| `application-backend-server.cloud.local` | 172.20.0.11 |
| `relational-database-server.cloud.local` | 172.20.0.12 |
| `authentication-identity-server.cloud.local` | 172.20.0.13 |
| `object-storage-server.cloud.local` | 172.20.0.14 |
| `monitoring-prometheus-server.cloud.local` | 172.20.0.15 |
| `monitoring-grafana-dashboard-server.cloud.local` | 172.20.0.16 |
| `api-gateway-proxy-server.cloud.local` | 172.20.0.17 |
| `app-backend.cloud.local` *(alias ngắn)* | 172.20.0.11 |
| `minio.cloud.local` *(alias ngắn)* | 172.20.0.14 |
| `keycloak.cloud.local` *(alias ngắn)* | 172.20.0.13 |

## Chạy Docker

```bash
docker compose up -d --build internal-dns-server
docker compose logs -f internal-dns-server
```

## Kiểm thử (sau khi container up)

```bash
# Demo cơ bản
dig @127.0.0.1 -p 1053 web-frontend-server.cloud.local +short

# Mở rộng
dig @127.0.0.1 -p 1053 app-backend.cloud.local +short
dig @127.0.0.1 -p 1053 minio.cloud.local +short
dig @127.0.0.1 -p 1053 keycloak.cloud.local +short
```

## Port

| Protocol | Port host | Port container |
| -------- | --------- | -------------- |
| UDP      | **1053**  | 53             |
| TCP      | **1053**  | 53             |
