# Phân công nhóm MyMiniCloud (4 thành viên) — Stack E2E

---

## 1. Đề tài & nội dung ứng dụng (chốt chung)

**Hạ tầng (theo đề):** MyMiniCloud — 9 loại server Docker, mạng `cloud-net`, local + AWS EC2.

**Ứng dụng E2E (theo hướng bài mẫu + map đề):** mini app **xem / quản lý phòng trọ + sinh viên**  
(giống tinh thần Airbnb mẫu, đơn giản hơn; vẫn đủ Blog + `/student` theo đề).


| Nguồn            | Web / App cần có                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Đề lab           | Home + **Blog ≥ 3 bài**; API kiểu `/student`; đủ 9 server                                                   |
| Bài mẫu điểm cao | List phòng → login → chi tiết + ảnh MinIO → API + DB                                                        |
| **Nhóm chốt**    | Home, list/chi tiết **phòng trọ**, **Blog 3 bài**, **Login**, (tuỳ chọn) trang **sinh viên** gọi `/student` |


**Câu mô tả dùng trong báo cáo Ch.1:**  
*“Xây dựng MyMiniCloud 9 server và mini app quản lý/xem phòng trọ kết hợp thông tin sinh viên.”*

---

## 2. Nội dung Web (Hân làm FE) — danh sách trang


| Trang                    | Mục đích              | Liên kết BE / dịch vụ                 |
| ------------------------ | --------------------- | ------------------------------------- |
| **Home**                 | Trang chủ, điều hướng | —                                     |
| **Danh sách phòng**      | E2E giống mẫu         | API rooms (Vân) + data (Lợi)          |
| **Chi tiết phòng**       | Xem mô tả + ảnh       | API + **MinIO** (Lợi)                 |
| **Blog** (≥ 3 bài)       | Mở rộng đề Web        | Tĩnh hoặc route React                 |
| **Login / Register**     | Auth E2E              | **Keycloak** (Lợi) qua proxy `/auth/` |
| **Sinh viên** (tuỳ chọn) | Map đề `/student`     | API `/student` (Vân) đã có            |


Proxy (Vân): `/` → Web, `/api/` → NestJS, `/auth/` → Keycloak.

---

## 3.  thống nhất nội dung Web 


| Người       | Thống nhất gì với Hân                                             | Khi nào                             |
| ----------- | ----------------------------------------------------------------- | ----------------------------------- |
| **Vân**     | Contract API: path, JSON (`/hello`, `/student`, sau `/rooms`…)    | **S1 sớm** + chỉnh S2–S3            |
| **Lợi**     | Login Keycloak (realm/client/URL); schema phòng/SV; URL ảnh MinIO | **S1** nghe chốt; **S3** E2E đầy đủ |
| **Bảo**     | Tên service / port trong compose (ít đụng nội dung trang)         | S2 ghép cụm                         |
| **Cả nhóm** | 1 lần chốt đề tài + danh sách trang ở trên                        | **Trước hết S1 (trước 25/10)**      |

**File gửi Hân (có sẵn tin Zalo copy):** `docs/THONG_NHAT_FE_BE_HAN.md`

---

## 4. Stack kỹ thuật


| Thành phần      | Công nghệ                              |
| --------------- | -------------------------------------- |
| Web             | **React** build → Nginx                |
| App             | **NestJS** (scale ≥ 2 instance khi LB) |
| Database        | **PostgreSQL**                         |
| Auth            | Keycloak (login trên UI)               |
| Object storage  | MinIO                                  |
| DNS             | Bind9 (`cloud.local`)                  |
| Monitoring      | Prometheus + Node Exporter             |
| Visualization   | Grafana + Loki + Promtail              |
| Proxy / LB      | Nginx                                  |
| Thêm (tuỳ chọn) | Redis, Alertmanager…                   |


---

## 5. Tổng quan vai trò


| Họ tên  | MSSV    | Server phụ trách                     | Điểm mở rộng | Nhiệm vụ thêm                                                 |
| ------- | ------- | ------------------------------------ | ------------ | ------------------------------------------------------------- |
| **Hân** | `[...]` | Web (React) + DNS                    | **1,0**      | **Khung & format Word**                                       |
| **Vân** | `[...]` | Proxy + App (NestJS) + LB            | **1,5**      | Tự vào Word viết Ch.3–4 phần mình; **thống nhất API với Hân** |
| **Lợi** | `[...]` | DB (Postgres) + Auth + MinIO         | **1,5**      | Tự vào Word viết Ch.3–4; **thống nhất Auth/data/ảnh với Hân** |
| **Bảo** | `[...]` | Prometheus + Grafana + Loki/Promtail | **1,0**      | EC2 + video + Docker Hub + ping; merge compose                |


---

## 6. Chi tiết từng người

### Hân — Web (React) + DNS + khung/format Word


| Server | Folder                 | Demo cơ bản                     | Mở rộng / E2E                                                             |
| ------ | ---------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| Web    | `web-frontend-server/` | React → Nginx `:8080`; **Home** | Đủ trang mục **§2**; flow list → login → chi tiết + ảnh; **Blog ≥ 3 bài** |
| DNS    | `internal-dns-server/` | `dig` zone `cloud.local`        | Thêm A: `app-backend`, `minio`, `keycloak`                                |


**Thống nhất:** nhận danh sách trang + API từ Vân/Lợi (mục **§3**); không tự đổi đề tài một mình.

**Word:** khung + format; Ch.1 (ghi rõ đề tài phòng trọ + SV); Ch.2 sơ đồ; Ch.3–4 Web/DNS.

---

### Vân — Proxy + Application (NestJS) + LB


| Server | Folder                        | Demo cơ bản                  | Mở rộng / E2E                                     |
| ------ | ----------------------------- | ---------------------------- | ------------------------------------------------- |
| App    | `application-backend-server/` | `/hello`, port **8085→8081** | `/student` (JSON); sau API **rooms** đọc DB/MinIO |
| Proxy  | `api-gateway-proxy-server/`   | `/`, `/api/`, `/auth/`       | Route thêm (vd `/student/`); strip `/api/`        |
| LB     | compose + nginx upstream      | —                            | Round Robin **≥ 2** NestJS                        |


**Thống nhất với Hân:** gửi/chốt bảng API (path → JSON mẫu) trước khi Hân code sâu FE.

**Word:** Ch.3–4 Proxy/App/LB + Ch.5.

---

### Lợi — Database + Auth + MinIO


| Server | Folder                            | Demo cơ bản                                        | Mở rộng / E2E                                 |
| ------ | --------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| DB     | `relational-database-server/`     | Postgres + schema mẫu (**rooms**, users/students…) | CRUD / map `studentdb` đề; volume bền         |
| Auth   | `authentication-identity-server/` | Keycloak admin/admin                               | Realm + client cho React; login UI; token API |
| MinIO  | `object-storage-server/`          | Console upload                                     | Bucket ảnh phòng / avatar / documents         |


**Thống nhất với Hân:** URL login, field form; cấu trúc phòng + cách lấy URL ảnh.

**Word:** Ch.3–4 DB/Auth/MinIO + Ch.5.

---

### Bảo — Monitoring + logging + deploy


| Server                     | Folder / việc                          | Demo cơ bản           | Mở rộng / E2E                     |
| -------------------------- | -------------------------------------- | --------------------- | --------------------------------- |
| Prometheus + Node Exporter | `monitoring-prometheus-server/`        | Targets **UP**        | Scrape web/app                    |
| Grafana + Loki/Promtail    | `monitoring-grafana-dashboard-server/` | Datasource Prometheus | Dashboard System Health; log Loki |
| Redis (tuỳ chọn)           | compose                                | Cache                 | —                                 |
| EC2 / Hub / Ping / Video   | —                                      | Deploy                | Public IP + video E2E             |


**Compose:** merge đủ 9 server (+ monitoring); ưu tiên gắn App/Proxy của Vân khi có trên Git.

**Word:** Ch.3–4 monitoring/EC2; Phụ lục (Hub, video, IP, log).

---

## 7. Báo cáo Word


| Chương  | Ai viết / trình bày                                     |
| ------- | ------------------------------------------------------- |
| Ch.1    | **Hân** (nêu đề tài + 9 server + mini app phòng trọ/SV) |
| Ch.2    | Hân dựng sơ đồ; cả nhóm bổ sung flow E2E                |
| Ch.3–4  | **Mỗi người** phần server của mình                      |
| Ch.5    | **Mỗi người** đánh giá phần mình                        |
| Phụ lục | **Mỗi người** điền link/log phần mình; Hân format       |


---

## 8. Deadline tổng (nộp trước **03/11/2026**)

> Chốt nội bộ **02/11 tối** (đệm trước hạn 03/11).


| Mốc                               | Ngày            | Mục tiêu                             |
| --------------------------------- | --------------- | ------------------------------------ |
| **Thống nhất đề tài + trang Web** | **Trước 25/10** | Hân–Vân–Lợi chốt mục **§1–§2**       |
| **S1 xong**                       | **25/10**       | Demo riêng từng người + ảnh          |
| **S2 xong**                       | **28/10**       | Compose đủ 9 server + ping (~5 điểm) |
| **S3 xong**                       | **31/10**       | E2E + mở rộng + EC2 + Hub + video    |
| **S4 xong**                       | **02/11**       | Word đủ, sẵn sàng nộp                |
| **Nộp**                           | **Trước 03/11** | Theo LMS / GV                        |


### Deadline theo người

**Hân**


| Deadline     | Việc                                                                |
| ------------ | ------------------------------------------------------------------- |
| **24/10**    | Chốt trang với Vân/Lợi; React Home → Nginx `:8080`; DNS `dig` + ảnh |
| **27/10**    | Web gắn compose; vào được qua proxy `/`                             |
| **30/10**    | UI E2E đủ trang §2; DNS records mở rộng                             |
| **01–02/11** | Word Ch.1–2, Ch.3–4 Web/DNS; format cuối                            |


**Vân**


| Deadline     | Việc                                                    |
| ------------ | ------------------------------------------------------- |
| **24/10**    | Push Git App+Proxy+ảnh; bảng API gửi Hân; `/student` OK |
| **27/10**    | Test `/api/hello`, `/api/student` qua proxy             |
| **30/10**    | API rooms (nếu Lợi sẵn); LB ≥ 2 NestJS; route mở rộng   |
| **01–02/11** | Word Ch.3–4 + Ch.5                                      |


**Lợi**


| Deadline     | Việc                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| **24/10**    | Postgres schema mẫu (rooms/SV); Keycloak admin; MinIO + ảnh; gửi Hân note Auth |
| **27/10**    | Gắn compose; `/auth/` OK                                                       |
| **30/10**    | Realm/client gắn UI; bucket ảnh phòng; CRUD                                    |
| **01–02/11** | Word Ch.3–4 + Ch.5                                                             |


**Bảo**


| Deadline     | Việc                                                           |
| ------------ | -------------------------------------------------------------- |
| **24/10**    | Prometheus + Node Exporter + Grafana + ảnh                     |
| **26/10**    | Compose gắn thêm Web/App/Proxy/DB/Auth… (không chỉ monitoring) |
| **28/10**    | Full 9 server; ping; điều phối S2                              |
| **30–31/10** | Loki; Hub; **EC2**; **video**                                  |
| **01–02/11** | Word + Phụ lục; checklist nộp                                  |


---

## 9. Sprint & chỗ thống nhất nội dung

### Sprint 1 — Build riêng — **25/10**

**Làm song song** từng server.  
**Thống nhất (bắt buộc, đầu S1):** đề tài + danh sách trang + API tạm (**§1–§3**).


| Người   | Việc kỹ thuật                                             |
| ------- | --------------------------------------------------------- |
| **Hân** | React skeleton các trang §2 (có thể mock data); DNS       |
| **Vân** | NestJS `/hello` + `/student`; Proxy; **gửi contract API** |
| **Lợi** | Postgres + Keycloak + MinIO lên; **note Auth cho Hân**    |
| **Bảo** | Prometheus + Node Exporter + Grafana                      |


**Done khi:** Ảnh demo riêng + đã chốt nội dung Web.

---

### Sprint 2 — Ghép cụm ~5 điểm — **28/10**

**Thống nhất:** FE gọi đúng `/api/`, `/auth/` qua proxy; sửa lệch JSON/path.


| Người       | Việc                        |
| ----------- | --------------------------- |
| **Bảo**     | Merge compose + `cloud-net` |
| **Hân**     | Web qua proxy `/`           |
| **Vân**     | App + Proxy; `/api/...`     |
| **Lợi**     | DB + Auth + MinIO           |
| **Cả nhóm** | Ping mạng                   |


---

### Sprint 3 — E2E + mở rộng + deploy — **31/10**

**Thống nhất sâu:** list/chi tiết phòng thật + login UI + ảnh MinIO.


| Người   | Việc                      |
| ------- | ------------------------- |
| **Hân** | UI E2E đủ flow            |
| **Vân** | API rooms + LB            |
| **Lợi** | Schema/OIDC/MinIO gắn app |
| **Bảo** | Loki + Hub + EC2 + video  |


---

### Sprint 4 — Báo cáo — **02/11** (nộp trước 03/11)


| Người   | Việc                                        |
| ------- | ------------------------------------------- |
| **Hân** | Khung Word + format; Ch.1–2; Ch.3–4 Web/DNS |
| **Vân** | Ch.3–4 Proxy/App/LB + Ch.5                  |
| **Lợi** | Ch.3–4 DB/Auth/MinIO + Ch.5                 |
| **Bảo** | Ch.3–4 monitoring/EC2; Phụ lục              |


---

### Checklist nộp (chốt **02/11**)

- [ ] 9 loại server chạy (local + EC2)
- [ ] Mini app E2E: list phòng → login → chi tiết/ảnh (hoặc flow tương đương đã chốt)
- [ ] Blog ≥ 3 bài (mở rộng Web)
- [ ] API `/student` (hoặc tương đương) có minh chứng
- [ ] ≥ 1 image Docker Hub
- [ ] Video + log ping
- [ ] Word Ch.1–5 + Phụ lục
- [ ] Ghi rõ số phần mở rộng đề đã làm

---

