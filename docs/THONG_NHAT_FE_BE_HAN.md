# Thống nhất FE (Hân) ↔ BE (Vân) — Sprint 1

> Người gửi: **Vân** | Người nhận: **Hân** (cc Lợi nếu cần Auth)  
> Ngày chốt mục tiêu: trước **25/10**  
> Đề tài mini app: **phòng trọ + sinh viên** trên MyMiniCloud

---

## 1. Đề tài (đã chốt)

Mini app: xem / quản lý **phòng trọ** kết hợp thông tin **sinh viên**, chạy trên hạ tầng 9 server Docker.

---

## 2. Danh sách trang FE Hân cần làm


| #   | Trang                       | Sprint                | Ghi chú                                 |
| --- | --------------------------- | --------------------- | --------------------------------------- |
| 1   | **Home**                    | S1                    | Điều hướng sang list phòng, blog, login |
| 2   | **Danh sách phòng**         | S1 mock → S3 API thật | Card: tên, giá, địa chỉ, ảnh thumbnail  |
| 3   | **Chi tiết phòng**          | S1 mock → S3          | Mô tả + ảnh lớn (MinIO — Lợi)           |
| 4   | **Blog** (≥ 3 bài)          | S1–S2                 | Bắt buộc theo đề mở rộng Web            |
| 5   | **Login / Register**        | S1 UI → S3 Keycloak   | Lợi cung cấp realm/client               |
| 6   | **Sinh viên** (khuyến nghị) | S1–S2                 | Gọi API `/student` của Vân (đã có)      |


Khi dev local chưa có proxy: gọi thẳng `http://localhost:8085/...`  
Khi có compose: gọi qua proxy `http://localhost/api/...`

---



## 3. API Vân đã có 

Base (Docker map đề): `http://localhost:8085`  
Qua proxy (sau S2): `http://localhost/api`

### GET `/hello`

**Mục đích:** health / demo App sống.

**Response 200:**

```json
{ "message": "Hello from App Server!" }
```



### GET `/student`

**Mục đích:** danh sách sinh viên (mở rộng đề — đọc file JSON; sau có thể thêm đọc DB).

**Response 200:**

```json
[
  { "id": 1, "name": "Nguyen A", "major": "CNTT", "gpa": 3.2 },
  { "id": 2, "name": "Tran B", "major": "CNTT", "gpa": 3.5 },
  { "id": 3, "name": "Le C", "major": "KTPM", "gpa": 3.1 },
  { "id": 4, "name": "Pham D", "major": "CNTT", "gpa": 2.9 },
  { "id": 5, "name": "Hoang E", "major": "KHMT", "gpa": 3.7 }
]
```

**FE gợi ý:** trang “Sinh viên” — table/card: name, major, gpa.

---



## 4. API sẽ làm tiếp (S2–S3) — Hân mock trước được

Vân sẽ bổ sung (khi Lợi có Postgres). Hân **S1 có thể hard-code / mock** cùng shape:

### GET `/rooms` (dự kiến)

```json
[
  {
    "id": 1,
    "title": "Phòng trọ gần ĐH",
    "address": "Quận 7, TP.HCM",
    "price": 3500000,
    "area": 25,
    "imageUrl": "https://..."
  }
]
```



### GET `/rooms/:id` (dự kiến)

```json
{
  "id": 1,
  "title": "Phòng trọ gần ĐH",
  "address": "Quận 7, TP.HCM",
  "price": 3500000,
  "area": 25,
  "description": "...",
  "imageUrl": "https://..."
}
```

Nếu Hân muốn đổi tên field (`name` thay `title`…) → **nhắn Vân trước 25/10** để hai bên cùng shape.

---



## 5. Auth (Lợi chủ trì — Hân cần biết)


| Mục                  | Thống nhất tạm S1                    |
| -------------------- | ------------------------------------ |
| UI Login/Register    | Hân làm form trước                   |
| Keycloak             | Lợi cấu hình; vào qua proxy `/auth/` |
| Token gọi API bảo vệ | S3 (chưa bắt buộc S1)                |


Hân S1: trang login có thể chưa nối Keycloak thật.

---



## 6. Việc mỗi người sau tin này


| Người   | Việc                                                                       |
| ------- | -------------------------------------------------------------------------- |
| **Hân** | Xác nhận OK danh sách trang §2; làm React theo đó; S1 mock list phòng      |
| **Vân** | Giữ `/hello`, `/student` ổn định; không đổi JSON đã chốt nếu không báo Hân |
| **Lợi** | Schema `rooms` + students gần với JSON trên; note Keycloak cho Hân         |


---





