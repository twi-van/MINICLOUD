# Phân công nhóm MyMiniCloud (4 thành viên)

---

## Tổng quan vai trò


| Họ tên  | MSSV    | Server phụ trách                     | Điểm mở rộng | Nhiệm vụ thêm                                               |
| ------- | ------- | ------------------------------------ | ------------ | ----------------------------------------------------------- |
| **Hân** | `[...]` | Web + DNS                            | **1,0**      | **Khung & format Word**                                     |
| **Vân** | `[...]` | Proxy + App                          | **1,5**      | Tự vào Word viết Ch.3–4 phần mình                           |
| **Lợi** | `[...]` | DB + Auth + MinIO                    | **1,5**      | Tự vào Word viết Ch.3–4 phần mình                           |
| **Bảo** | `[...]` | Prometheus + Node Exporter + Grafana | **1,0**      | EC2 + video + Docker Hub + ping; tự vào Word viết phần mình |


---



## Hân — Web + DNS + khung/format Word



### Kỹ thuật


| Server | Folder                 | Demo cơ bản                   | Mở rộng                                    |
| ------ | ---------------------- | ----------------------------- | ------------------------------------------ |
| Web    | `web-frontend-server/` | `index` + `/blog/`, port 8080 | Blog ≥ 3 bài HTML + ảnh + link             |
| DNS    | `internal-dns-server/` | `dig` → `10.10.10.10`         | Thêm A: `app-backend`, `minio`, `keycloak` |




### Word — chỉ phần của Hân + khung/format

- [ ] Tạo khung: bìa, mục lục, heading, style thống nhất
- [ ] Viết **Ch.1** (giới thiệu & mục tiêu)
- [ ] Viết / ghép **Ch.2** sơ đồ tổng
- [ ] Tự viết **Ch.3–4: Web + DNS**
- [ ] Cuối cùng: **format lại** toàn bài cho đồng bộ

---



## Vân — Proxy + Application



### Kỹ thuật


| Server         | Folder                        | Demo cơ bản                  | Mở rộng                          |
| -------------- | ----------------------------- | ---------------------------- | -------------------------------- |
| Proxy          | `api-gateway-proxy-server/`   | Route `/`, `/api/`, `/auth/` | Route `/student/` → backend      |
| App            | `application-backend-server/` | `/hello` (8085 + qua proxy)  | API `/student` + `students.json` |
| Load Balancing | (compose + nginx)             | —                            | 2 web Round Robin                |




### Word

Vân tự vào file → viết + ảnh **Ch.3–4: Proxy + App + LB**.  
Góp **Ch.5** bullet phần mình (tự gõ vào mục Ch.5 đã có sẵn).

**Điểm mở rộng: 1,5**

---



## Lợi — Database + Auth + MinIO



### Kỹ thuật


| Server | Folder                            | Demo cơ bản           | Mở rộng                           |
| ------ | --------------------------------- | --------------------- | --------------------------------- |
| DB     | `relational-database-server/`     | `minicloud` / `notes` | `studentdb` + `students` ≥ 3 dòng |
| Auth   | `authentication-identity-server/` | Keycloak admin/admin  | Realm, user, client, `/secure`    |
| MinIO  | `object-storage-server/`          | Console upload        | `profile-pics` + `documents`      |




### Word

Lợi tự vào file → viết + ảnh **Ch.3–4: DB + Auth + MinIO** (+ bullet Ch.5 phần mình).

**Điểm mở rộng: 1,5**

---



## Bảo — Monitoring + deploy



### Kỹ thuật


| Server                          | Folder                                 | Demo cơ bản             | Mở rộng                         |
| ------------------------------- | -------------------------------------- | ----------------------- | ------------------------------- |
| Prometheus                      | `monitoring-prometheus-server/`        | Target Node Exporter UP | Scrape `web-frontend-server:80` |
| Node Exporter                   | (trong compose)                        | Metrics                 | —                               |
| Grafana                         | `monitoring-grafana-dashboard-server/` | Datasource Prometheus   | Dashboard System Health of MSSV |
| EC2 / Docker Hub / Ping / Video | —                                      | Deploy + minh chứng     | —                               |




### Word

Bảo tự vào file → viết + ảnh **Ch.3–4: Prometheus + Grafana + EC2**; tự điền link video / Docker Hub / IP vào **Phụ lục**.

**Compose:** Bảo merge `docker-compose.yml` chạy được trên EC2.

**Điểm mở rộng: 1,0** (+ EC2, Hub, video, ping)

---


| Chương  | Ai viết / trình bày nội dung                    |
| ------- | ----------------------------------------------- |
| Ch.1    | **Hân**                                         |
| Ch.2    | Hân dựng khung/sơ đồ; cả nhóm bổ sung nếu cần   |
| Ch.3    | **Mỗi người tự viết mục server của mình**       |
| Ch.4    | **Mỗi người tự viết + chèn ảnh demo phần mình** |
| Ch.5    | **Mỗi người tự viết** đoạn đánh giá phần mình   |
| Phụ lục | **Mỗi người tự điền** link/log phần mình        |


---



## Các sprint làm việc



### Sprint 1 — Build riêng từng server (demo cơ bản)

**Mục tiêu:** Mỗi người chạy được phần mình (chưa cần full cụm).


| Người   | Việc                                                                         |
| ------- | ---------------------------------------------------------------------------- |
| **Hân** | Web: `index` + `/blog/` + Dockerfile; DNS: zone `cloud.local` + `dig` OK     |
| **Vân** | App: `/hello` + Dockerfile; Proxy: `nginx.conf` route `/`, `/api/`, `/auth/` |
| **Lợi** | DB: init `minicloud`/`notes`; Keycloak admin/admin; MinIO console upload     |
| **Bảo** | Prometheus + `prometheus.yml`; Node Exporter; Grafana `:3000`                |


**Done khi:** Mỗi người có ảnh/log demo phần mình.

---



### Sprint 2 — Ghép cụm + đủ 5 điểm demo

**Mục tiêu:** `docker compose up` chạy **9 server**, test đủ checklist đề.


| Người       | Việc                                                          |
| ----------- | ------------------------------------------------------------- |
| **Bảo**     | Merge `docker-compose.yml` + `cloud-net`; điều phối test full |
| **Hân**     | Gắn Web + DNS vào compose; hỗ trợ test web qua proxy          |
| **Vân**     | Gắn App + Proxy; test `/api/hello`, `/`, `/auth/`             |
| **Lợi**     | Gắn DB + Auth + MinIO; hỗ trợ Vân test `/auth/`               |
| **Cả nhóm** | Ping các server trong `cloud-net` (Bảo ghi log)               |


**Done khi:** Đủ demo 9 server + ping → **~5 điểm**.

---



### Sprint 3 — Mở rộng (+5 điểm) + deploy

**Mục tiêu:** Làm mở rộng theo phân công; lên EC2.


| Người   | Việc                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| **Hân** | Blog ≥ 3 bài; DNS A records (`app-backend`, `minio`, `keycloak`)                   |
| **Vân** | API `/student` + JSON; route `/student/`; LB 2 web Round Robin (Hân hỗ trợ web2)   |
| **Lợi** | `studentdb` + `students`; Keycloak realm/user/client + `/secure`; MinIO 2 bucket   |
| **Bảo** | Scrape Prometheus web; Grafana System Health; **Docker Hub** + **EC2** + **video** |


**Done khi:** Ghi được **X/10** phần mở rộng; EC2 public IP chạy được.

---



### Sprint 4 — Báo cáo Word + nộp

**Mục tiêu:** Hoàn thiện báo cáo và nộp.


| Người   | Việc                                                              |
| ------- | ----------------------------------------------------------------- |
| **Hân** | Khung Word + format; viết Ch.1, Ch.2, Ch.3–4 Web/DNS; format cuối |
| **Vân** | Tự viết Ch.3–4 Proxy/App/LB + Ch.5 phần mình                      |
| **Lợi** | Tự viết Ch.3–4 DB/Auth/MinIO + Ch.5 phần mình                     |
| **Bảo** | Tự viết Ch.3–4 monitoring/EC2; điền Phụ lục (Hub, video, IP, log) |


**Done khi:** Word đủ Ch.1–5 + Phụ lục; Git + Docker Hub + video → nộp.

---



### Checklist nộp

- [ ] 9 server chạy (local + EC2)
- [ ] ≥ 1 image Docker Hub
- [ ] Video + log ping
- [ ] Word đủ Ch.1–5 + Phụ lục; mỗi người đã tự viết phần mình
- [ ] Format thống nhất 
- [ ] Ghi rõ số phần mở rộng đã làm