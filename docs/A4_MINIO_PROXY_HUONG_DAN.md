# A4 — MinIO qua proxy `/minio/`

## Mục tiêu

Truy cập object MinIO qua cổng **80** (proxy), không chỉ `:9000`:

```
http://localhost/minio/rooms-images/room-1.jpg
```

Console admin vẫn có thể dùng `http://localhost:9001` (login `minioadmin` / `minioadmin`).

## Đã làm

| File | Thay đổi |
| ---- | -------- |
| `api-gateway-proxy-server/nginx.conf` | `location /minio/` → `object-storage-server:9000` (rewrite bỏ prefix) |
| `relational-database-server/init/001_schema.sql` | `image_url` dùng `/minio/...` |
| `object-storage-server/seed-rooms.sh` | `MINIO_PUBLIC_URL` mặc định `http://localhost/minio` |

## Test

```bash
docker compose build api-gateway-proxy-server
docker compose up -d api-gateway-proxy-server

curl -sI http://localhost/minio/rooms-images/room-1.jpg
# kỳ vọng: HTTP/1.1 200  (Content-Type: image/jpeg)

curl -s http://localhost/api/rooms | head
# imageUrl chứa http://localhost/minio/rooms-images/...
```

Cập nhật URL DB (nếu volume cũ còn `:9000`):

```bash
./object-storage-server/seed-rooms.sh
# hoặc
docker compose exec relational-database-server \
  psql -U minicloud -d minicloud -c \
  "UPDATE rooms SET image_url = 'http://localhost/minio/rooms-images/room-' || id || '.jpg' WHERE id IN (1,2);"
```
