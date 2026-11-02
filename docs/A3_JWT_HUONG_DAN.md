# A3 — JWT Guard: hướng dẫn làm + giải thích

## 1. Bearer / JWT là gì?

Sau khi đăng nhập Keycloak, FE nhận **access token** (chuỗi JWT).  
Mỗi lần gọi API cần bảo vệ, FE gửi header:

```http
Authorization: Bearer <access_token>
```

- **Bearer** = “mang thẻ này thì được phép”.
- **JWT** = thẻ có 3 phần `header.payload.signature`, chữ ký của Keycloak.
- Nest **không** tin payload mù quáng — phải kiểm tra chữ ký qua **JWKS** (public keys của realm).

---

## 2. Mục tiêu A3 (acceptance)

| Endpoint | Hành vi |
| -------- | ------- |
| `GET /api/rooms` | **Public** — không cần login (vẫn 200) |
| `GET /api/me` | **Protected** — thiếu/sai token → **401**; token hợp lệ → **200** + claim user |
| (sau) `POST /api/bookings` | Cùng `JwtAuthGuard` |

```
Client ──Authorization: Bearer …──► Proxy ──► Nest JwtAuthGuard
                                              ├─ OK  → controller (/me)
                                              └─ fail → 401 Unauthorized
```

---

## 3. Các bước làm (checklist Vân)

### Bước 1 — Dependency

Trong `application-backend-server`:

```bash
npm install jose
```

`jose` dùng để `createRemoteJWKSet` + `jwtVerify` (không cần passport-jwt).

### Bước 2 — Guard

File `src/auth/jwt-auth.guard.ts`:

1. Đọc `Authorization`.
2. Bắt buộc dạng `Bearer <token>`.
3. `jwtVerify(token, JWKS, { issuer })`.
4. Gắn `request.user = payload` (có `sub`, `preferred_username`, `email`…).
5. Lỗi → `UnauthorizedException` (401).

**Hai URL quan trọng:**

| Env | Giá trị | Vì sao |
| --- | ------- | ------ |
| `KEYCLOAK_ISSUER` | `http://localhost/auth/realms/minicloud` | Phải **khớp claim `iss` trong token** (FE login qua proxy `:80`) |
| `KEYCLOAK_JWKS_URI` | `http://authentication-identity-server:8080/realms/minicloud/protocol/openid-connect/certs` | Nest **trong Docker** gọi Keycloak bằng tên service, không qua localhost |

### Bước 3 — Module

`src/auth/auth.module.ts` — `providers` + `exports: [JwtAuthGuard]`.  
`app.module.ts` — `imports: [AuthModule]`.

### Bước 4 — Route thử

Trong `app.controller.ts`:

```ts
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Req() req) {
  const u = req.user ?? {};
  return {
    sub: u.sub,
    preferred_username: u.preferred_username,
    email: u.email,
    realm: 'minicloud',
  };
}
```

### Bước 5 — Proxy giữ header

`api-gateway-proxy-server/nginx.conf` — location `= /api/me` (giống `/api/rooms`), **không** strip `Authorization`.

### Bước 6 — Compose env

Cả `application-backend-server-1` và `-2`:

```yaml
- KEYCLOAK_ISSUER=http://localhost/auth/realms/minicloud
- KEYCLOAK_JWKS_URI=http://authentication-identity-server:8080/realms/minicloud/protocol/openid-connect/certs
```

### Bước 7 — Rebuild

```bash
docker compose build application-backend-server-1 api-gateway-proxy-server
docker compose up -d --no-deps \
  application-backend-server-1 application-backend-server-2 api-gateway-proxy-server
```

(Image `minicloud-app:dev` dùng chung cho app-1 và app-2.)

---

## 4. Cách test

```bash
# Public — vẫn 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost/api/rooms

# Protected — không token → 401
curl -s http://localhost/api/me

# Có token: login MiniHome → F12 → Network → copy header Authorization
curl -s http://localhost/api/me -H "Authorization: Bearer $TOKEN"
```

Kết quả đã verify trên máy local:

- `rooms` → **200**
- `/me` không token → **401** (`Thiếu Authorization Bearer…`)
- `/me` token giả → **401** (`Token không hợp lệ…`)
- `/me` + Bearer Keycloak hợp lệ → **200**  
  `{"sub":"…","preferred_username":"student_demo","email":"…","realm":"minicloud"}`

---

## 5. Dùng lại cho A2 Booking

```ts
@Post('bookings')
@UseGuards(JwtAuthGuard)
create(@Req() req, @Body() body) {
  const userId = req.user.sub; // id Keycloak
  // lưu booking với userId
}
```

FE đã gửi Bearer sau login — chỉ cần gắn Guard lên route mới.

---

## 6. File liên quan

| File | Vai trò |
| ---- | ------- |
| `application-backend-server/src/auth/jwt-auth.guard.ts` | Verify JWT |
| `application-backend-server/src/auth/auth.module.ts` | Export Guard |
| `application-backend-server/src/app.controller.ts` | `GET /me` |
| `application-backend-server/src/app.module.ts` | Import AuthModule |
| `docker-compose.yml` | Issuer + JWKS env |
| `api-gateway-proxy-server/nginx.conf` | `/api/me` + giữ Authorization |
