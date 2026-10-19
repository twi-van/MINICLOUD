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



## Các sprint làm việc



### Sprint 1 — Build riêng từng server (demo cơ bản)

**Mục tiêu:** Mỗi người chạy được phần mình (chưa cần full cụm / chưa cần E2E hoàn chỉnh).


| Người   | Việc                                                                   |
| ------- | ---------------------------------------------------------------------- |
| **Hân** | React Hello/Home build được trong Nginx; DNS zone + `dig` OK           |
| **Vân** | NestJS health/`/hello` (hoặc tương đương) + Dockerfile; skeleton proxy |
| **Lợi** | Postgres lên + schema trống/mẫu; Keycloak admin; MinIO console         |
| **Bảo** | Prometheus + Node Exporter; Grafana `:3000`                            |


**Done khi:** Mỗi người có ảnh/log demo phần mình.

---



### Sprint 2 — Ghép cụm + đủ 5 điểm demo đề

**Mục tiêu:** `docker compose up` chạy **đủ 9 loại server**, test checklist đề (cổng/proxy/ping…).


| Người       | Việc                                                          |
| ----------- | ------------------------------------------------------------- |
| **Bảo**     | Merge `docker-compose.yml` + `cloud-net`; điều phối test full |
| **Hân**     | Gắn Web + DNS; web vào được qua proxy `/`                     |
| **Vân**     | Gắn App + Proxy; `/api/...`, `/`, `/auth/` OK                 |
| **Lợi**     | Gắn DB + Auth + MinIO; hỗ trợ login / token                   |
| **Cả nhóm** | Ping các server trong `cloud-net` (Bảo ghi log)               |


**Done khi:** Đủ demo 9 server + ping → **~5 điểm** đề.

---



### Sprint 3 — E2E app + mở rộng đề + deploy

**Mục tiêu:** Flow người dùng xuyên suốt; map đủ mục mở rộng đề; EC2.


| Người   | Việc                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------ |
| **Hân** | UI E2E (list + login + chi tiết/ảnh); DNS records mở rộng; hỗ trợ chứng minh mở rộng Web         |
| **Vân** | API nghiệp vụ + scale NestJS; LB Round Robin; route mở rộng (vd `/student/` nếu vẫn làm theo đề) |
| **Lợi** | Schema/data thật; Keycloak realm/client gắn web; MinIO buckets + URL ảnh; CRUD/map mở rộng DB    |
| **Bảo** | Loki/Promtail + Grafana dashboard; scrape thêm; **Docker Hub** + **EC2** + **video** E2E         |


**Done khi:** Ghi được **X/10** phần mở rộng đề; có video flow E2E; EC2 public IP chạy được.

---



### Sprint 4 — Báo cáo Word + nộp

**Mục tiêu:** Hoàn thiện báo cáo và nộp.


| Người   | Việc                                                                  |
| ------- | --------------------------------------------------------------------- |
| **Hân** | Khung Word + format; Ch.1, Ch.2, Ch.3–4 Web/DNS; format cuối          |
| **Vân** | Tự viết Ch.3–4 Proxy/App/LB + Ch.5 phần mình                          |
| **Lợi** | Tự viết Ch.3–4 DB/Auth/MinIO + Ch.5 phần mình                         |
| **Bảo** | Tự viết Ch.3–4 monitoring/log/EC2; điền Phụ lục (Hub, video, IP, log) |


**Done khi:** Word đủ Ch.1–5 + Phụ lục; Git + Docker Hub + video → nộp.

---



### Checklist nộp

- [ ] 9 loại server chạy (local + EC2)
- [ ] Mini app E2E demo được (ít nhất 1 flow người dùng)
- [ ] ≥ 1 image Docker Hub
- [ ] Video + log ping
- [ ] Word đủ Ch.1–5 + Phụ lục; mỗi người đã tự viết phần mình
- [ ] Format thống nhất (Hân)
- [ ] Ghi rõ số phần mở rộng đề đã làm (+ phần stack thêm: Redis/Loki/scale…)

---



