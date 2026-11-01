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



## 8. Deadline tổng (nộp **10/11/2026**)

> Chốt nội bộ **09/11 tối** (đệm trước hạn **10/11**).


| Mốc                               | Ngày            | Mục tiêu                             |
| --------------------------------- | --------------- | ------------------------------------ |
| **Thống nhất đề tài + trang Web** | **Trước 25/10** | Hân–Vân–Lợi chốt mục **§1–§2**       |
| **S1 xong**                       | **25/10**       | Demo riêng từng người + ảnh          |
| **S2 xong**                       | **28/10**       | Compose đủ 9 server + ping (~5 điểm) |
| **S3 xong**                       | **31/10**       | E2E + mở rộng + EC2 + Hub + video    |
| **Bổ sung A (parity mẫu)**        | **07/11**       | Register, booking, JWT, `/minio/`,…  |
| **S4 xong**                       | **09/11**       | Word đủ, sẵn sàng nộp                |
| **Nộp**                           | **10/11**       | Theo LMS / GV                        |




### Deadline theo người

**Hân**


| Deadline     | Việc                                                                |
| ------------ | ------------------------------------------------------------------- |
| **24/10**    | Chốt trang với Vân/Lợi; React Home → Nginx `:8080`; DNS `dig` + ảnh |
| **27/10**    | Web gắn compose; vào được qua proxy `/`                             |
| **30/10**    | UI E2E đủ trang §2; DNS records mở rộng                             |
| **01–07/11** | FE bổ sung A1 Register (+ A2 form booking); giữ UI MiniHome         |
| **08–09/11** | Word Ch.1–2, Ch.3–4 Web/DNS; format cuối                            |


**Vân**


| Deadline     | Việc                                                    |
| ------------ | ------------------------------------------------------- |
| **24/10**    | Push Git App+Proxy+ảnh; bảng API gửi Hân; `/student` OK |
| **27/10**    | Test `/api/hello`, `/api/student` qua proxy             |
| **30/10**    | API rooms (nếu Lợi sẵn); LB ≥ 2 NestJS; route mở rộng   |
| **01–07/11** | A2 bookings + A3 JWT + A4 `/minio/` + A7 push Git       |
| **08–09/11** | Word Ch.3–4 + Ch.5                                      |


**Lợi**


| Deadline     | Việc                                                                           |
| ------------ | ------------------------------------------------------------------------------ |
| **24/10**    | Postgres schema mẫu (rooms/SV); Keycloak admin; MinIO + ảnh; gửi Hân note Auth |
| **27/10**    | Gắn compose; `/auth/` OK                                                       |
| **30/10**    | Realm/client gắn UI; bucket ảnh phòng; CRUD                                    |
| **01–07/11** | A1 realm Register; A5 rooms seed; A6 avatar bucket                             |
| **08–09/11** | Word Ch.3–4 + Ch.5                                                             |


**Bảo**


| Deadline     | Việc                                                           |
| ------------ | -------------------------------------------------------------- |
| **24/10**    | Prometheus + Node Exporter + Grafana + ảnh                     |
| **26/10**    | Compose gắn thêm Web/App/Proxy/DB/Auth… (không chỉ monitoring) |
| **28/10**    | Full 9 server; ping; điều phối S2                              |
| **30–31/10** | Loki; Hub; **EC2**; **video**                                  |
| **01–07/11** | B1 scrape App; B2–B4 EC2 / video / Hub (chốt trước Word)       |
| **08–09/11** | Word + Phụ lục; checklist nộp                                  |


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



### Bổ sung chức năng



#### A. Bắt buộc — chức năng parity với mẫu (vẫn trong tiêu chí đề / E2E)


| #   | Chức năng (như mẫu)  | Ai                | Việc cụ thể                                                                                               | Done khi                  |
| --- | -------------------- | ----------------- | --------------------------------------------------------------------------------------------------------- | ------------------------- |
| A1  | **Register** + Login | **Lợi** + **Hân** | Lợi: bật `registrationAllowed` realm `minicloud`. Hân: nút Đăng ký → Keycloak `register()` (UI MiniHome). | User tự đăng ký → vào app |


**A1 — Register: cũ vs mới (chi tiết)** *(ngay dưới A1)*

**1. Keycloak (Lợi)**


|                       | Hiện tại (cũ)                        | A1 (mới)                           |
| --------------------- | ------------------------------------ | ---------------------------------- |
| `registrationAllowed` | `false` trong `minicloud-realm.json` | `true`                             |
| Ai tạo user           | Admin tạo tay (vd `student_demo`)    | User tự đăng ký trên form Keycloak |
| Giống bài mẫu         | Chưa (mẫu có Fig Registration)       | Giống mẫu                          |


**2. Frontend** `/register` **(Hân) — UI MiniHome giữ nguyên khung**


|                               | Hiện tại (cũ)                                                                       | A1 (mới)                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Mode **mock**                 | Form họ tên + email + mật khẩu → `authService.register` giả (không Keycloak)        | Có thể giữ cho offline                                                                  |
| Mode **Keycloak** (đang chạy) | Trang `/register` vẫn mở nhưng text: *“Tài khoản được cấp bởi quản trị viên”*       | Đổi copy + hành vi: **Đăng ký qua Keycloak**                                            |
| Nút chính khi `keycloak`      | Chỉ **“Đăng nhập qua Keycloak”** (`loginWithKeycloak`) — cả trang register cũng vậy | Thêm / đổi thành gọi `keycloak.register()` (hoặc URL registrations) khi `register=true` |
| `keycloak.ts`                 | Không có hàm register                                                               | Thêm `registerWithKeycloak(redirect)`                                                   |


→ **Cũ:** route `/register` gần như “login giả trang đăng ký”.  
→ **A1:** `/register` thật sự mở màn hình đăng ký Keycloak (như mẫu), UI bọc ngoài vẫn MiniHome.

**Flow**

```
Cũ (api/keycloak):  /register → nút → Keycloak LOGIN → cần user admin đã tạo
A1:                 /register → “Đăng ký qua Keycloak” → Keycloak REGISTER → redirect app
                    /login    → Keycloak LOGIN (giữ như hiện tại)
```

**Việc sửa:** Lợi bật `registrationAllowed`; Hân thêm `registerWithKeycloak` + đổi nút/copy trang register. Không đổi theme layout MiniHome.


| #   | Chức năng (như mẫu)                              | Ai                | Việc cụ thể                                                                                                                                                 | Done khi                                |
| --- | ------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| A2  | **Đặt lịch / booking** (mẫu: Nest xử lý booking) | **Vân** + **Hân** | Vân: bảng `bookings` + `POST /api/bookings` (JWT hoặc user id). Proxy location nếu cần. Hân: bật form hẹn xem ở mode `api`, gọi API (không đổi layout lớn). | Sau login đặt lịch được lưu DB          |
| A3  | **API có JWT** (mẫu: Nest validate OIDC)         | **Vân**           | Guard JWKS realm `minicloud` cho route cần bảo vệ (vd bookings; tuỳ chọn rooms ghi). FE đã gửi Bearer.                                                      | Call không token → 401                  |
| A4  | **MinIO qua proxy** (mẫu: `/minio/`)             | **Vân**           | `location /minio/` → object-storage (console hoặc rewrite API). Lợi: xác nhận URL ảnh vẫn public/ổn.                                                        | Vào MinIO qua `http://localhost/minio/` |
| A5  | **Rooms đủ dùng filter** (mẫu: search phòng)     | **Lợi** + **Vân** | Lợi: seed thêm field/`available`/nhiều phòng nếu thiếu. Vân: map JSON optional FE đã có.                                                                    | Filter FE API mode có dữ liệu thật      |
| A6  | **Avatar / object phụ** (mẫu: ảnh user + phòng)  | **Lợi**           | Bucket `profile-pics` (hoặc tương đương đề mở rộng avatar) + 1 ảnh demo; ghi URL trong note.                                                                | Upload/xem được qua MinIO               |
| A7  | **Push Git** phần seed/compose còn local         | **Vân**           | `seed-rooms.sh`, compose FE args, schema `image_url`, note Auth.                                                                                            | `main` remote đủ seed                   |




#### B. Vận hành / minh chứng — đề bắt buộc, mẫu nhóm trước làm rất rõ


| #   | Việc                                                                       | Ai                                            | Done khi                        |
| --- | -------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| B1  | Scrape Prometheus thêm **App** (`/metrics` hoặc health)                    | **Bảo** (+ **Vân** expose `/metrics` nếu cần) | Target app **UP**               |
| B2  | EC2 chạy đủ 9 loại + ảnh/log                                               | **Bảo**                                       | Phụ lục Word có minh chứng      |
| B3  | Video E2E: list → register/login → chi tiết/ảnh → (booking) → student/blog | **Bảo** (quay) + cả nhóm hỗ trợ               | Link YouTube/Drive trong README |
| B4  | Docker Hub ≥ 1 image (nên thêm web hoặc app như mẫu)                       | **Bảo** / **Vân**                             | Link Hub trong Phụ lục          |




#### C. Tuỳ chọn điểm cao (mẫu có — đề không bắt)


| #   | Việc                                   | Ai                             | Ghi chú                          |
| --- | -------------------------------------- | ------------------------------ | -------------------------------- |
| C1  | Scale App **3–4** instance Round Robin | **Vân** + **Bảo** (compose)    | Đề chỉ cần ≥ 2; mẫu dùng 4       |
| C2  | Alertmanager + rule CPU/mail           | **Bảo**                        | Mẫu Fig 4.12–4.23                |
| C3  | Ollama gợi ý phòng                     | **Vân** hoặc **Hân** (gọi API) | Mẫu dịch vụ 11 — nặng tài nguyên |
| C4  | Proxy `/grafana/` `/prometheus/`       | **Vân**                        | Tiện demo một cổng 80            |




#### Phân công tóm theo người (chỉ phần bổ sung)


| Người   | Việc bổ sung phụ trách                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Hân** | Nút Register; nối form hẹn xem → API booking; **không** đổi lại UI theo Airbnb mẫu; giữ Blog + Student                        |
| **Vân** | `POST /bookings` + JWT guard; proxy `/minio/` (+ tuỳ chọn grafana); map rooms mở rộng; push Git seed/compose; (C1/C4 nếu làm) |
| **Lợi** | Bật Register realm; schema/seed booking + rooms field; bucket avatar/`profile-pics`; note Auth/MinIO cập nhật                 |
| **Bảo** | Scrape app; EC2; video E2E đủ flow mới; Hub; (C2 Alertmanager nếu làm)                                                        |


---



### Sprint 4 — Báo cáo — **09/11** (nộp **10/11**)


| Người   | Việc                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| **Hân** | Khung Word + format; Ch.1–2; Ch.3–4 Web/DNS; ảnh Register + hẹn xem + Blog/Student |
| **Vân** | Ch.3–4 Proxy/App/LB + Ch.5; ảnh JWT, bookings, `/minio/`, LB                       |
| **Lợi** | Ch.3–4 DB/Auth/MinIO + Ch.5; ảnh realm Register, schema, MinIO buckets             |
| **Bảo** | Ch.3–4 monitoring/EC2; Phụ lục Hub, IP, video, ping, Prometheus targets            |


---



### Checklist nộp (chốt **09/11**; nộp **10/11**)

**Theo đề**

- [ ] 9 loại server chạy (local + EC2)
- [ ] Mini app E2E: list → auth → chi tiết/ảnh MinIO
- [ ] Blog ≥ 3 bài
- [ ] API `/student` có minh chứng
- [ ] ≥ 1 image Docker Hub
- [ ] Video + log ping
- [ ] Word Ch.1–5 + Phụ lục
- [ ] Ghi rõ phần mở rộng đề đã làm

**Bổ sung chức năng sát mẫu (nhóm chốt)**

- [ ] Register Keycloak trên UI MiniHome
- [ ] Booking/hẹn xem lưu qua API (mode api)
- [ ] Nest JWT cho route bảo vệ
- [ ] Proxy `/minio/`
- [ ] Rooms/seed đủ phục vụ filter (hoặc ghi rõ giới hạn)
- [ ] Bucket avatar / profile-pics demo
- [ ] Seed MinIO + FE compose đã push Git
- [ ] Prometheus có target App *(khuyến nghị)*
- [ ] *(Tuỳ chọn)* Alertmanager / Ollama / scale ≥ 3

---

