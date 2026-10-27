# Hướng dẫn cấu hình Keycloak (Auth) cho FE — Sprint 2 & 3

> **Người gửi:** Lợi (chủ trì Database + Auth + MinIO)  
> **Người nhận:** Hân (Frontend React) & Vân (Backend / Proxy)  
> **Ngày cập nhật:** 27/10/2026

---

## 1. Thông tin kết nối Keycloak

- **Endpoint qua Proxy (URL Public chuẩn):** `http://localhost/auth/`
- **Endpoint trực tiếp (Host port demo):** `http://localhost:8082`
- **Admin Console:** `http://localhost:8082/admin/` (hoặc `http://localhost/auth/admin/`)
- **Tài khoản quản trị Master:**
  - Username: `admin`
  - Password: `admin`

---

## 2. Thông số Realm & Client cho ứng dụng Web React (FE)

Khi Hân tích hợp thư viện OIDC / Keycloak client (như `keycloak-js`, `@react-keycloak/web`):

| Thuộc tính | Giá trị cấu hình | Ghi chú |
| :--- | :--- | :--- |
| **URL (Authority)** | `http://localhost/auth/` (hoặc `http://localhost:8082`) | URL gốc của Keycloak |
| **Realm** | `minicloud` (hoặc dùng `master` để demo nhanh) | Realm chứa user của app |
| **Client ID** | `web-frontend` | Client dạng Public (không secret) |
| **Client Authentication** | `Off` (Public Client) | Chuẩn cho Single Page App (SPA) |
| **Valid Redirect URIs** | `http://localhost/*`, `http://localhost:8080/*` | Cho phép callback về FE |
| **Web Origins** | `*` (hoặc `http://localhost`, `http://localhost:8080`) | Tránh lỗi CORS |

---

## 3. Tài khoản test đăng nhập (Demo E2E)

- **User:** `student_demo` (hoặc `user@minicloud.local`)
- **Password:** `123456`
- **Role:** `student` / `user`

---

## 4. Flow tích hợp cho Hân ở Frontend

1. **Sprint 2:**
   - Kiểm tra route proxy: truy cập `http://localhost/auth/` thấy màn hình chào hoặc console Keycloak là đạt chuẩn Sprint 2.
   - Form Login UI trên React có thể để nút: *"Đăng nhập qua Keycloak"* chuyển hướng tới URL Login của Keycloak.

2. **Sprint 3 (E2E hoàn thiện):**
   - FE dùng `keycloak-js`:
     ```javascript
     import Keycloak from 'keycloak-js';

     const keycloak = new Keycloak({
       url: 'http://localhost/auth',
       realm: 'minicloud',
       clientId: 'web-frontend',
     });

     keycloak.init({ onLoad: 'check-sso' }).then(authenticated => {
       console.log(authenticated ? 'Đã đăng nhập' : 'Chưa đăng nhập');
     });
     ```
   - Sau khi login, lấy access token đính kèm Header: `Authorization: Bearer <token>` khi gọi API `/api/rooms`, `/api/student`.

---

## 5. Trạng thái MinIO & Ảnh phòng (Làm rõ cho Sprint 3)

- MinIO Console: `http://localhost:9001` (user: `minioadmin` / pass: `minioadmin`).
- S2 đã hoàn thành: Container MinIO chạy trong `cloud-net`, bucket `demo` đã tạo và upload thành công.
- **Sprint 3:** Lợi sẽ tạo bucket `rooms-images`, upload toàn bộ ảnh phòng thật và cập nhật cột `image_url` trong bảng `rooms` (Postgres) thành URL MinIO (hoặc public static URL) để FE hiển thị trọn vẹn E2E.


