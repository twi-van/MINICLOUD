# Đăng nhập Keycloak trên MiniHome

Phần tích hợp frontend của Hân dùng `keycloak-js` 26.2.5 với realm `minicloud`,
client public `web-frontend`, Authorization Code và PKCE S256. Các giá trị này
khớp `../authentication-identity-server/realm/minicloud-realm.json` do Lợi cung cấp.
Không có thay đổi tài liệu Word.

## Chạy qua gateway

DB, Keycloak, gateway và tài khoản thuộc phần các thành viên phụ trách chuẩn bị.
Khi các dịch vụ đó đã chạy, từ thư mục gốc chỉ build/cập nhật frontend:

```bash
docker compose build web-frontend-server
docker compose up -d --no-deps web-frontend-server
```

Kiểm tra endpoint realm trả JSON, rồi mở `http://localhost/login`:

```bash
curl http://localhost/auth/realms/minicloud/.well-known/openid-configuration
```

1. Bấm **Đăng nhập qua Keycloak**.
2. Nhập tài khoản thuộc realm `minicloud` trên trang Keycloak.
3. Quay về `/rooms` hoặc đường dẫn nội bộ trong tham số `redirect`.
4. Header hiển thị tên tài khoản. Tải lại trang vẫn khôi phục phiên bằng SSO.
5. Nút **Đăng xuất** cạnh tài khoản (hoặc trong menu di động) kết thúc phiên
   Keycloak và trở về trang chủ.

Realm hiện không cho tự đăng ký. Quản trị viên tạo tài khoản trong realm
`minicloud` tại `http://localhost:8082/admin/`, bật user, đặt mật khẩu với
Temporary = Off, hoàn tất các required actions trước khi demo. File import
chỉ tạo realm/client/role, không chứa user. Tài khoản `student_demo` ghi trong
handoff phải được tạo nếu realm đang chạy chưa có nó. Import không cập nhật
đè realm đã tồn tại; khi đó đối chiếu client trong Admin Console, không xóa volume.

## Cấu hình frontend

Dockerfile của frontend mặc định dùng API và Keycloak; không cần sửa Compose
gốc để bật đăng nhập. Khi dùng Vite, chép `.env.example` sang `.env.local`
trong thư mục `web-frontend-server`:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=/api
VITE_AUTH_MODE=keycloak
VITE_KEYCLOAK_URL=http://localhost/auth
VITE_KEYCLOAK_REALM=minicloud
VITE_KEYCLOAK_CLIENT_ID=web-frontend
```

Redirect URI và Web Origins của client cần khớp nơi mở frontend; file import
đã cho phép `http://localhost`, `http://localhost:8080`, `http://localhost:5173`.
Khi Lợi/Bảo cung cấp URL Keycloak khác, đặt `VITE_KEYCLOAK_URL` theo URL đó và
build lại frontend; việc cấu hình realm/client, redirect URI và gateway vẫn do
thành viên phụ trách thực hiện. Có thể truyền build argument riêng cho frontend:

```bash
docker compose build --build-arg VITE_KEYCLOAK_URL=https://ten-mien/auth web-frontend-server
```

`VITE_AUTH_MODE=mock` chỉ dùng offline/kiểm thử giả lập. Nếu không đặt auth mode,
nguồn dữ liệu API chọn Keycloak, nguồn mock chọn phiên demo cũ.

## Cách xử lý phiên

- Adapter khởi tạo một lần trước React Router để tiêu thụ callback OIDC.
- Trang công khai không buộc khách chưa đăng nhập chuyển hướng qua IdP.
- Sau đăng nhập, sessionStorage chỉ giữ cờ `minihome:keycloak-session=true`.
  Reload dùng `check-sso`; access token và refresh token chỉ nằm trong bộ nhớ.
- Mọi request qua `getJson` gọi `updateToken(30)` trước khi thêm Bearer token.
- Khi refresh lỗi, phiên frontend được xóa và thông báo yêu cầu đăng nhập lại.
- `redirect` chỉ nhận đường dẫn cùng origin, tránh chuyển hướng ra website ngoài.

Các API backend hiện chưa có guard/JWKS để xác minh token. Thay đổi này hoàn
thành phía frontend, không tự biến API công khai thành API được bảo vệ.
Đặt lịch và tích hợp ảnh MinIO là luồng riêng, không được thay bằng dữ liệu giả.

Tham khảo [Keycloak JavaScript adapter](https://www.keycloak.org/securing-apps/javascript-adapter).

## Kiểm thử đăng nhập thật

Cần Docker stack đang chạy, Chrome và tài khoản test trong realm minicloud
được Lợi cung cấp. Từ thư mục gốc:

```bash
cd web-frontend-server
AUTH_E2E_USER=student_demo AUTH_E2E_PASSWORD='<mat-khau-test>' pnpm test:auth
```

Có thể đặt `AUTH_E2E_BASE_URL=http://localhost:8080` để kiểm tra cổng web trực tiếp.
Kiểm thử gồm PKCE, chặn redirect ra ngoài, login/callback, reload, refresh token,
Bearer trên API, token không nằm trong storage, logout và chính sách đăng ký.
Trace được tắt để không ghi token trong lưu lượng OAuth ra artifact.
