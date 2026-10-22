# Phân công nhóm MyMiniCloud (4 thành viên) — Stack E2E

---

## Tổng quan vai trò


| Họ tên  | MSSV    | Server phụ trách                     | Điểm mở rộng | Nhiệm vụ thêm                                               |
| ------- | ------- | ------------------------------------ | ------------ | ----------------------------------------------------------- |
| **Hân** | `[...]` | Web (React) + DNS                    | **1,0**      | **Khung & format Word**                                     |
| **Vân** | `[...]` | Proxy + App (NestJS) + LB            | **1,5**      | Tự vào Word viết Ch.3–4 phần mình                           |
| **Lợi** | `[...]` | DB (Postgres) + Auth + MinIO         | **1,5**      | Tự vào Word viết Ch.3–4 phần mình                           |
| **Bảo** | `[...]` | Prometheus + Grafana + Loki/Promtail | **1,0**      | EC2 + video + Docker Hub + ping; tự vào Word viết phần mình |


---



## Hân — Web (React) + DNS + khung/format Word



### Kỹ thuật


| Server | Folder                 | Demo cơ bản                                                              | Mở rộng / E2E                                                                                                          |
| ------ | ---------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Web    | `web-frontend-server/` | React app build → Nginx; port **8080**; trang Home + list dữ liệu từ API | UI đủ flow: xem list → login → xem chi tiết + ảnh; (map đề) có nội dung blog/trang tĩnh bổ sung nếu cần đủ mở rộng Web |
| DNS    | `internal-dns-server/` | `dig` resolve tên nội bộ (vd web / app)                                  | Thêm A: `app-backend`, `minio`, `keycloak` (và tên app nếu có)                                                         |




### Word — chỉ phần của Hân + khung/format

- [ ] Tạo khung: bìa, mục lục, heading, style thống nhất
- [ ] Viết **Ch.1** (giới thiệu & mục tiêu — nêu rõ stack E2E + mini app)
- [ ] Viết / ghép **Ch.2** sơ đồ tổng (layers + request flow User → Proxy → React → Nest → …)
- [ ] Tự viết **Ch.3–4: Web + DNS**
- [ ] Cuối cùng: **format lại** toàn bài cho đồng bộ

---



## Vân — Proxy + Application (NestJS) + LB



### Kỹ thuật


| Server         | Folder                        | Demo cơ bản                                                        | Mở rộng / E2E                                                                                |
| -------------- | ----------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| App            | `application-backend-server/` | NestJS API (vd rooms/list, health); port **8085→8081**; Dockerfile | API nghiệp vụ + (map đề) endpoint kiểu `/student` hoặc tương đương; đọc DB/MinIO qua service |
| Proxy          | `api-gateway-proxy-server/`   | Route `/` → web, `/api/` → app, `/auth/` → Keycloak                | Route thêm path nghiệp vụ; strip `/api/` đúng                                                |
| Load Balancing | (compose + nginx upstream)    | —                                                                  | Round Robin **≥ 2 NestJS instance** (ideal 4 như bài mẫu)                                    |




### Word

Vân tự vào file → viết + ảnh **Ch.3–4: Proxy + App + LB**.  
Góp **Ch.5** bullet phần mình.

**Điểm mở rộng: 1,5**  
**Lưu ý:** NestJS nặng — Sprint 1 có thể skeleton + 1 instance; Sprint 2–3 mới scale.

---



## Lợi — Database (PostgreSQL) + Auth + MinIO



### Kỹ thuật


| Server | Folder                            | Demo cơ bản                                      | Mở rộng / E2E                                                                                          |
| ------ | --------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| DB     | `relational-database-server/`     | PostgreSQL lên; schema + data mẫu (rooms/users…) | (map đề) thêm DB/bảng kiểu `studentdb`/`students` **hoặc** chứng minh CRUD trên schema app; volume bền |
| Auth   | `authentication-identity-server/` | Keycloak admin/admin                             | Realm + client cho web/app; login/register trên UI; token gọi API bảo vệ                               |
| MinIO  | `object-storage-server/`          | Console upload                                   | Bucket ảnh phòng / avatar; policy URL để web/API lấy được; (map đề) `profile-pics` + `documents`       |




### Word

Lợi tự vào file → viết + ảnh **Ch.3–4: DB + Auth + MinIO** (+ bullet Ch.5).

**Điểm mở rộng: 1,5**

---



## Bảo — Monitoring + logging + deploy



### Kỹ thuật


| Server                          | Folder                                 | Demo cơ bản                 | Mở rộng / E2E                                         |
| ------------------------------- | -------------------------------------- | --------------------------- | ----------------------------------------------------- |
| Prometheus                      | `monitoring-prometheus-server/`        | Target Node Exporter **UP** | Scrape thêm web/app nếu được; (tuỳ chọn) Alertmanager |
| Node Exporter                   | (trong compose)                        | Metrics                     | —                                                     |
| Grafana                         | `monitoring-grafana-dashboard-server/` | Datasource Prometheus       | Dashboard System Health of MSSV; datasource **Loki**  |
| Loki + Promtail                 | (compose / folder log stack)           | Thu log container           | Panel log trên Grafana                                |
| Redis (tuỳ chọn điểm cộng)      | (compose)                              | Cache cho NestJS            | —                                                     |
| EC2 / Docker Hub / Ping / Video | —                                      | Deploy + minh chứng         | Máy EC2 đủ RAM cho stack nặng                         |




### Word

Bảo tự vào file → viết + ảnh **Ch.3–4: Prometheus + Grafana (+ Loki) + EC2**; tự điền Phụ lục (Hub, video, IP, log).

**Compose:** Bảo merge `docker-compose.yml` chạy được trên EC2 (nhiều service hơn lab).

**Điểm mở rộng: 1,0** (+ EC2, Hub, video, ping, log stack)

---


| Chương  | Ai viết / trình bày nội dung                    |
| ------- | ----------------------------------------------- |
| Ch.1    | **Hân**                                         |
| Ch.2    | Hân dựng khung/sơ đồ; cả nhóm bổ sung flow E2E  |
| Ch.3    | **Mỗi người tự viết mục server của mình**       |
| Ch.4    | **Mỗi người tự viết + chèn ảnh demo phần mình** |
| Ch.5    | **Mỗi người tự viết** đoạn đánh giá phần mình   |
| Phụ lục | **Mỗi người tự điền** link/log phần mình        |


---



## Deadline tổng (nộp trước **03/11/2026**)

> Hôm nay: **22/10**. Còn **~12 ngày** → chốt nội bộ **02/11 tối** (đệm 1 ngày trước hạn 03/11).


| Mốc         | Ngày            | Mục tiêu cả nhóm                                                       |
| ----------- | --------------- | ---------------------------------------------------------------------- |
| **S1 xong** | **25/10 (CN)**  | Mỗi người demo riêng + ảnh; Vân App/Proxy đã xong → người khác bắt kịp |
| **S2 xong** | **28/10 (T4)**  | `compose up` đủ 9 server + ping → **~5 điểm**                          |
| **S3 xong** | **31/10 (T7)**  | E2E + mở rộng chính + EC2 + Hub + video quay xong                      |
| **S4 xong** | **02/11 (CN)**  | Word đủ Ch.1–5 + Phụ lục, format xong, sẵn sàng nộp                    |
| **Nộp**     | **Trước 03/11** | Theo LMS / GV                                                          |


---



## Deadline theo từng người



### Hân


| Deadline  | Việc                                                                       |
| --------- | -------------------------------------------------------------------------- |
| **24/10** | React Home build → Nginx chạy `:8080`; DNS `dig` OK + ảnh                  |
| **27/10** | Web gắn compose; vào được qua proxy `/`                                    |
| **30/10** | UI E2E (list → login → chi tiết/ảnh); DNS records mở rộng; map mở rộng Web |
| **01/11** | Khung Word + Ch.1, Ch.2, Ch.3–4 Web/DNS (nháp)                             |
| **02/11** | Format cuối toàn bài                                                       |




### Vân 


| Deadline | Việc |
| -------- | ---- |
| **24/10** | Push Git App+Proxy+screenshot; API `/student` + ảnh |
| **27/10** | Test qua proxy `/api/hello`, `/api/student` khi có compose |
| **30/10** | LB ≥ 2 NestJS Round Robin; route mở rộng; API gắn DB nếu Lợi sẵn |
| **01/11** | Viết Ch.3–4 App/Proxy/LB + Ch.5 (nháp vào Word) |
| **02/11** | Chỉnh sửa theo feedback Hân format |




### Lợi


| Deadline  | Việc                                                        |
| --------- | ----------------------------------------------------------- |
| **24/10** | Postgres + schema mẫu; Keycloak admin; MinIO upload + ảnh   |
| **27/10** | Gắn compose; `/auth/` OK; hỗ trợ token                      |
| **30/10** | Realm/client gắn UI; MinIO buckets ảnh; CRUD/map mở rộng DB |
| **01/11** | Ch.3–4 DB/Auth/MinIO + Ch.5 nháp                            |
| **02/11** | Chỉnh sửa cuối                                              |




### Bảo


| Deadline     | Việc                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| **24/10**    | Prometheus + Node Exporter + Grafana lên + ảnh                              |
| **26/10**    | `docker-compose.yml` **xương** gắn đủ service (ưu tiên App/Proxy Vân đã có) |
| **28/10**    | Compose full 9 server; log ping; điều phối test S2                          |
| **30–31/10** | Loki; dashboard; **Docker Hub**; **EC2** public IP; **quay video**          |
| **01/11**    | Ch.3–4 monitoring/EC2; điền Phụ lục (Hub, video, IP, log)                   |
| **02/11**    | Check list nộp với cả nhóm                                                  |


---



## Các sprint làm việc



### Sprint 1 — Build riêng — **deadline 25/10**

**Mục tiêu:** Mỗi người chạy được phần mình (chưa cần full cụm).


| Người   | Việc                                                          |
| ------- | ------------------------------------------------------------- |
| **Hân** | React Hello/Home → Nginx; DNS + `dig`                         |
| **Vân** | NestJS `/hello` + Dockerfile; Proxy nginx *(ưu tiên đã xong)* |
| **Lợi** | Postgres + Keycloak admin + MinIO console                     |
| **Bảo** | Prometheus + Node Exporter + Grafana `:3000`                  |


**Done khi:** Mỗi người có ảnh/log demo phần mình.

---



### Sprint 2 — Ghép cụm ~5 điểm — **deadline 28/10**

**Mục tiêu:** `docker compose up` đủ 9 server + checklist đề.


| Người       | Việc                                                        |
| ----------- | ----------------------------------------------------------- |
| **Bảo**     | Merge compose + `cloud-net` (**compose xương trước 26/10**) |
| **Hân**     | Gắn Web + DNS; proxy `/`                                    |
| **Vân**     | Gắn App + Proxy; `/api/...`, `/`, `/auth/`                  |
| **Lợi**     | Gắn DB + Auth + MinIO                                       |
| **Cả nhóm** | Ping `cloud-net` (Bảo ghi log)                              |


**Done khi:** Demo 9 server + ping → **~5 điểm**.

---



### Sprint 3 — E2E + mở rộng + deploy — **deadline 31/10**

**Mục tiêu:** Flow E2E; mở rộng; EC2 + Hub + video.


| Người   | Việc                                     |
| ------- | ---------------------------------------- |
| **Hân** | UI E2E; DNS mở rộng                      |
| **Vân** | API + LB Round Robin; route `/student/`… |
| **Lợi** | Schema/OIDC/MinIO thật                   |
| **Bảo** | Loki + Hub + **EC2** + **video**         |


**Done khi:** Ghi **X/10** mở rộng; video + EC2 IP chạy được.

---



### Sprint 4 — Báo cáo — **deadline 02/11** (nộp trước 03/11)


| Người   | Việc                                                     |
| ------- | -------------------------------------------------------- |
| **Hân** | Khung Word + format; Ch.1–2; Ch.3–4 Web/DNS; format cuối |
| **Vân** | Ch.3–4 Proxy/App/LB + Ch.5                               |
| **Lợi** | Ch.3–4 DB/Auth/MinIO + Ch.5                              |
| **Bảo** | Ch.3–4 monitoring/EC2; Phụ lục                           |


**Done khi:** Word đủ + Git + Hub + video → nộp.

---



### Checklist nộp (chốt **02/11**)

- [ ] 9 loại server chạy (local + EC2)
- [ ] Mini app E2E demo được
- [ ] ≥ 1 image Docker Hub
- [ ] Video + log ping
- [ ] Word Ch.1–5 + Phụ lục; mỗi người tự viết phần mình
- [ ] Format thống nhất (Hân)
- [ ] Ghi rõ số phần mở rộng đã làm

---

