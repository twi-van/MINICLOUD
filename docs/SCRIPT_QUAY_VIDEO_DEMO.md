# Script quay video demo MyMiniCloud

**Mục tiêu:** minh chứng E2E + 9 server (đề) + chức năng sát mẫu (Register, booking, MinIO, LB)  
**Độ dài gợi ý:** 8–12 phút  
**Trước khi quay:** `docker compose up -d` · port 80 = proxy · FE bản api/Keycloak · realm Register + seed MinIO/rooms

---

## Phân công tổng

| Vai | Người | Việc |
| --- | ----- | ---- |
| **Quay + dựng + upload** | **Bảo** | Record màn hình, cắt ghép, up YouTube/Drive, dán link README + Phụ lục Word |
| **Lời thoại / dẫn** | **Bảo** (hoặc lần lượt từng người theo cảnh) | Đọc script; có thể để Hân/Vân/Lợi nói đúng phần mình |
| **Sẵn sàng stack** | **Cả nhóm** | Trước giờ quay 15–30 phút: compose Up, không XAMPP chiếm :80 |
| **Chuẩn bị Auth + MinIO + DB** | **Lợi** | Realm Register/user demo, bucket ảnh, DB rooms/bookings |
| **Chuẩn bị Proxy / App / LB** | **Vân** | `/api/*`, `/auth/`, LB 2 app, `/minio/` (A4), booking API (A2) |
| **Chuẩn bị FE MiniHome** | **Hân** | Build api+Keycloak, Register/Login UI, Blog, Student, form hẹn xem |

---

## Checklist trước quay

| Việc | Người |
| ---- | ----- |
| Browser ≥ 1280×720, mic, tắt thông báo | **Bảo** |
| `docker compose ps` đủ service | **Bảo** (+ **Vân** nếu proxy lỗi) |
| FE Keycloak + Register/Login OK | **Hân** xác nhận |
| Realm / user test OK | **Lợi** xác nhận |
| Ảnh MinIO + `/api/rooms` OK | **Lợi** + **Vân** |
| Booking API (nếu quay cảnh 4) | **Vân** + **Hân** |
| EC2 / Hub (nếu quay cảnh 9) | **Bảo** |

**URL**

| Mục | URL |
| --- | --- |
| App | http://localhost/ |
| Rooms | http://localhost/rooms |
| Login / Register | http://localhost/login · http://localhost/register |
| Blog / Student | http://localhost/blog · http://localhost/student |
| Keycloak admin | http://localhost:8082/admin/ |
| MinIO | http://localhost:9001/ hoặc http://localhost/minio/ |
| Prometheus / Grafana | http://localhost:9090/ · http://localhost:3000/ |

---

## Thứ tự quay (theo cảnh)

### Cảnh 0 — Mở đầu (15–30s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** |
| **Chuẩn bị** | — |

1. Nói: *“Demo MyMiniCloud — 9 server Docker, app MiniHome phòng trọ + sinh viên.”*  
2. Hiện Home MiniHome 1 giây.

---

### Cảnh 1 — Stack / 9 server (45–60s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** |
| **Chuẩn bị compose** | **Bảo** (điều phối) + cả nhóm nếu thiếu container |

```bash
docker compose ps
```

1. Scroll: Web, App×2, Proxy, DB, Keycloak, MinIO, DNS, Prometheus, Grafana/Loki…  
2. (Tuỳ chọn) `docker network inspect cloud-net`.

---

### Cảnh 2 — Home + list phòng + ảnh MinIO (60–90s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Hân** dẫn UI)* |
| **Chuẩn bị FE** | **Hân** |
| **Chuẩn bị API/DB/ảnh** | **Vân** (API rooms) + **Lợi** (DB + MinIO) |

1. http://localhost/ → http://localhost/rooms.  
2. Chỉ dữ liệu API + ảnh MinIO.  
3. Vào **chi tiết** phòng.

---

### Cảnh 3 — Register / Login Keycloak (90–120s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Hân** + **Lợi**)* |
| **Chuẩn bị FE** | **Hân** (nút Register/Login) |
| **Chuẩn bị realm** | **Lợi** (`registrationAllowed`, user demo) |
| **Chuẩn bị proxy `/auth/`** | **Vân** |

**Ưu tiên Register (A1):** `/register` → Đăng ký qua Keycloak → về app.  

**Fallback Login:** `/login` → `student_demo` / `123456` → reload SSO → Đăng xuất.

---

### Cảnh 4 — Booking / hẹn xem (45–60s) *(khi A2 xong)*

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Hân**)* |
| **Chuẩn bị API** | **Vân** (`POST /api/bookings`) |
| **Chuẩn bị FE form** | **Hân** |
| **Chuẩn bị bảng DB** | **Lợi** (schema) + **Vân** |

1. Chi tiết phòng (đã login) → Hẹn xem → submit.  
2. Network/`psql` xác nhận **201** nếu cần.

*Chưa A2: bỏ cảnh — không bịa.*

---

### Cảnh 5 — Blog + Sinh viên (60s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Hân**)* |
| **Chuẩn bị Blog/UI SV** | **Hân** |
| **Chuẩn bị `/api/student`** | **Vân** |

1. `/blog` ≥ 3 bài.  
2. `/student` + (tuỳ chọn) `curl http://localhost/api/student`.

---

### Cảnh 6 — Proxy / LB / MinIO path (60–90s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Vân**)* |
| **Chuẩn bị** | **Vân** (proxy, LB, `/minio/`) |
| **Bucket demo** | **Lợi** |

```bash
curl -s http://localhost/api/hello
curl -s http://localhost/api/hello
curl -s http://localhost/api/hello
curl -sI http://localhost/auth/ | head -5
```

1. `app-1` / `app-2` Round Robin.  
2. `/auth/` OK.  
3. MinIO qua `/minio/` hoặc `:9001` — bucket `rooms-images`.

---

### Cảnh 7 — Monitoring (45s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** |
| **Chuẩn bị** | **Bảo** (Prometheus/Grafana; B1 scrape App nếu có) |
| **Expose `/metrics` App** | **Vân** *(nếu B1 cần)* |

1. `:9090/targets` — UP.  
2. Grafana `:3000` — 1 dashboard.

---

### Cảnh 8 — DNS (20–30s) *(tuỳ chọn)*

| | |
| - | - |
| **Quay / thoại** | **Bảo** *(hoặc **Hân**)* |
| **Chuẩn bị** | **Hân** (Bind9 zone) |

```bash
dig @127.0.0.1 -p 1053 web-frontend-server.cloud.local +short
dig @127.0.0.1 -p 1053 keycloak.cloud.local +short
```

---

### Cảnh 9 — EC2 / Hub (30–60s)

| | |
| - | - |
| **Quay / thoại + bằng chứng** | **Bảo** |
| **Image Hub app/web** *(tuỳ chọn)* | **Vân** / **Hân** build · **Bảo** push/link |

1. EC2 IP + `docker ps`.  
2. Docker Hub tags.  
3. Chưa có: quay local + ghi “chi tiết Phụ lục Word”.

---

### Cảnh 10 — Kết (15s)

| | |
| - | - |
| **Quay / thoại** | **Bảo** |

1. Về Home → tóm tắt 1 câu → fade out.

---

## Bảng tóm tắt theo người

| Người | Cảnh chính (chuẩn bị / dẫn) | Sau video |
| ----- | --------------------------- | --------- |
| **Bảo** | Quay tất cả; cảnh 0, 1, 7, 9, 10; điều phối giờ quay | Upload + README + Phụ lục |
| **Hân** | Chuẩn bị 2, 3, 4, 5, 8 (FE/DNS); có thể dẫn thoại UI | Ảnh chụp Word Ch. Web |
| **Vân** | Chuẩn bị 2, 4, 5, 6 (API/Proxy/LB); có thể dẫn thoại curl/LB | Ảnh Word Proxy/App |
| **Lợi** | Chuẩn bị 2, 3, 4, 6 (Auth/DB/MinIO); có thể dẫn thoại Keycloak/MinIO | Ảnh Word DB/Auth/MinIO |

---

## Thứ tự rút gọn (~6 phút)

| # | Cảnh | Người quay | Người sẵn sàng phần kỹ thuật |
| - | ---- | ---------- | ------------------------------ |
| 1 | `docker compose ps` | Bảo | Bảo |
| 2 | Rooms + chi tiết MinIO | Bảo | Hân + Vân + Lợi |
| 3 | Register/Login | Bảo | Hân + Lợi + Vân |
| 4 | Blog + Student | Bảo | Hân + Vân |
| 5 | curl LB + Prometheus | Bảo | Vân + Bảo |
| 6 | Kết | Bảo | — |

---

## Lời thoại mẫu (rút) — **Bảo** đọc

> Đây là hệ thống MyMiniCloud gồm 9 loại server chạy Docker trên mạng cloud-net.  
> Ứng dụng MiniHome: xem phòng từ API và Postgres, ảnh trên MinIO.  
> Đăng ký/đăng nhập qua Keycloak phía sau proxy `/auth`.  
> Blog và trang sinh viên đáp ứng mở rộng đề.  
> Hai instance NestJS cân bằng Round Robin qua Nginx.  
> Prometheus/Grafana giám sát. Cảm ơn thầy/cô đã xem.

---

## Sau khi quay

| Việc | Người |
| ---- | ----- |
| Upload YouTube/Drive | **Bảo** |
| Dán link `README.md` | **Bảo** |
| Phụ lục Word | **Bảo** |
| Backup file gốc | **Bảo** |
| Xem lại đủ checklist đề | **Cả nhóm** |
