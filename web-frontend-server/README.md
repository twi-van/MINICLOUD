# MiniHome · MyMiniCloud frontend

Giao diện tìm phòng trọ dành cho sinh viên, xây dựng từ yêu cầu trong `docs/THONG_NHAT_FE_BE_HAN.md`, `PHAN_CONG_NHOM.md`, README gốc và đề bài `De_Bai_Cuoi_Ky.docx`.

React + TypeScript + Vite, **Tailwind CSS 4**, **Ant Design 6**, Ant Design Icons và **Motion for React**. Font tiếng Việt Be Vietnam Pro và ảnh minh họa được phục vụ từ dự án, không cần CDN khi chạy. Thương hiệu giao diện là MiniHome, thuộc MyMiniCloud.

## Chạy local

Yêu cầu Node.js 24+ và pnpm 12.6+.

```bash
cd web-frontend-server
pnpm install
pnpm dev
```

Mở URL Vite in ra, mặc định `http://localhost:5173`. **Không cần backend, database, Keycloak hay MinIO để dùng mock.** Có thể sao chép `.env.example` thành `.env.local`; nếu không tạo file, ứng dụng vẫn mặc định mock.

```bash
pnpm build
pnpm preview
pnpm lint
pnpm test:e2e
```

Kiểm thử E2E dùng Google Chrome đã cài. Có thể chọn Edge qua biến `PLAYWRIGHT_CHANNEL=msedge`. Playwright tự chạy hai Vite server trên cổng 4173 (mock) và 4174 (kiểm tra adapter API bằng response giả), sau đó dừng chúng.

## Trang và tính năng

| Route                 | Nội dung                                                                     |
| --------------------- | ---------------------------------------------------------------------------- |
| `/`                   | Trang chủ, tìm phòng theo khu vực/ngân sách/loại, phòng gợi ý, khu vực, blog |
| `/rooms`              | 8 phòng mẫu, tìm kiếm không dấu, bộ lọc kết hợp, sắp xếp, phân trang         |
| `/rooms?saved=true`   | Phòng yêu thích; lưu ID trong localStorage                                   |
| `/rooms/:id`          | Chi tiết, ảnh phóng to, lưu/chia sẻ, hẹn xem phòng demo                      |
| `/blog/`              | 3 bài đầy đủ, lọc chủ đề và tìm kiếm                                         |
| `/blog/:slug`         | Nội dung bài viết và bài liên quan                                           |
| `/login`, `/register` | Form có validation, phiên trải nghiệm trong bộ nhớ                           |
| `/students`           | 5 sinh viên đúng JSON mẫu, tìm tên, lọc ngành, sắp xếp GPA                   |

Có menu di động, bộ lọc responsive, trạng thái loading/error/empty, thử lại, ảnh dự phòng và trang 404. Các bộ lọc phòng nằm trên URL, dùng được khi tải lại/chia sẻ liên kết.

## Thiết kế và tương tác

Phong cách MiniHome Club: nền kem, tím điện, xanh lime, chữ lớn và chi tiết dạng sticker/polaroid. Màu dùng chung nằm trong `src/index.css` và Ant Design theme tại `app/providers/AppProviders.tsx`.

- **Vibe check:** bấm “Tìm gu của mình” hoặc “Làm vibe check”, trả lời 3 câu về loại phòng/ngân sách/khu vực. Có thể quay lại và sửa lựa chọn; kết quả mở `/rooms` với bộ lọc thật trên URL. Không phát sinh dữ liệu tài khoản hay thay đổi contract BE.
- **Tìm nhanh:** bấm kính lúp trên header hoặc `Ctrl K` / `⌘ K`. Gõ tên phòng/địa chỉ, dùng `↑` / `↓` để chọn, `Enter` để mở phòng, `Esc` để đóng. Danh sách vẫn lấy qua `roomsService` theo nguồn dữ liệu đang cấu hình.
- **Vibe tabs:** đổi nhóm phòng ngay trên trang chủ, có chuyển động giữa các nhóm và trạng thái nút được chọn.
- **Bộ lọc gợi ý:** một chạm để bật/tắt ngân sách, loại phòng hoặc tiện nghi trên trang danh sách.
- **Wishlist:** nút tim có phản hồi chuyển động, hiệu ứng hạt nhỏ và thông báo; ID phòng vẫn được lưu tại localStorage.
- **Motion:** chuyển trang, nội dung xuất hiện khi cuộn, thẻ phòng nổi khi hover, ảnh hero nghiêng theo con trỏ chuột, sticker nổi, chữ chạy và thanh tiến trình cuộn. Marquee có nút dừng và tự dừng khi hover/focus.

`MotionConfig reducedMotion="user"`, hook `useReducedMotion` và CSS `prefers-reduced-motion` giảm hoặc tắt chuyển động theo cài đặt hệ điều hành. Hiệu ứng nghiêng chỉ xử lý con trỏ chuột. Các hiệu ứng dùng transform/opacity; cập nhật pointer/scroll dùng MotionValue, tránh render lại trang ở mỗi frame.

15 kiểm thử E2E kiểm tra cả các luồng cũ và tương tác mới, bao gồm viewport 320px/390px, chế độ giảm chuyển động và adapter nhận JSON tối thiểu của BE.

## Cấu trúc feature based

```text
src/
├── app/
│   ├── layout/          # Header, footer, menu và Outlet
│   └── providers/       # Ant Design locale/theme và providers chung
├── features/
│   ├── home/            # pages và components/RoomMatchQuiz
│   ├── rooms/           # types, data, services, hooks, lib, components, pages
│   ├── blog/            # types, data nội dung, components, pages
│   ├── auth/            # types, adapter mock, context, provider, pages
│   └── students/        # types, data, service, pages
├── shared/
│   ├── components/      # Reveal, ScrollProgress, ảnh dự phòng, loading/error
│   ├── hooks/           # Request lifecycle có AbortController
│   └── lib/             # config, HTTP, localStorage an toàn
├── App.tsx              # Router, lazy load theo trang
├── index.css            # Tailwind, theme tokens, component utilities
└── App.css              # Bố cục riêng của thương hiệu
```

Luồng dữ liệu: **page → service → mock hoặc HTTP → DTO**. Components không import trực tiếp dữ liệu phòng/sinh viên mẫu. Blog là nội dung biên tập tĩnh theo yêu cầu đề bài, chưa có contract CMS. Auth và lịch hẹn là trải nghiệm giao diện; không coi là xác thực hay đặt lịch thật.

## Chuyển sang backend thật

Trong `.env.local`:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=/api
```

Khởi động lại Vite. Trong lúc dev, Vite chuyển `/api/*` đến `http://localhost:8085/*`, tránh yêu cầu đổi CORS của NestJS. Khi đi qua gateway chung, giữ `/api`. Có thể dùng `http://localhost:8085` làm base URL khi BE đã bật CORS.

| Service                | Request          | Trường bắt buộc                                      |
| ---------------------- | ---------------- | ---------------------------------------------------- |
| `roomsService.list`    | `GET /rooms`     | Mảng `{ id, title, address, price, area, imageUrl }` |
| `roomsService.get`     | `GET /rooms/:id` | Object cùng shape, thêm `description` nếu có         |
| `studentsService.list` | `GET /student`   | Mảng `{ id, name, major, gpa }`                      |

`id`, `price`, `area`, `gpa` là number; giá là VND/tháng. `imageUrl` dùng được trực tiếp với URL public MinIO. Các trường phòng `district`, `type`, `amenities`, `images`, `available` là **optional**, phục vụ mock giàu nội dung. Nếu BE chỉ trả contract tối thiểu, UI vẫn hiển thị; bộ lọc tiện nghi/loại/trạng thái chỉ khớp khi BE trả các trường tương ứng. Khu vực được suy từ địa chỉ khi chưa có `district`.

Hiện lọc/sắp xếp/phân trang ở frontend vì contract chỉ có mảng. Khi BE bổ sung query/pagination, mở rộng service và kiểu response tại feature, sau khi chốt contract với Vân. Chế độ API hiển thị lỗi thật và cho thử lại, **không tự trộn dữ liệu mock** khi gọi lỗi.

### Auth và lịch hẹn

`auth.service.ts` là điểm thay thế bằng Keycloak redirect/PKCE sau khi Lợi cung cấp realm, client và URL `/auth/`. Hiện không gọi Keycloak, không phát token, không lưu mật khẩu hay tạo user thật. Phiên demo chỉ nằm trong React state, mất khi tải lại trang. Trong chế độ API, form thông báo chưa tích hợp; thao tác hẹn xem phòng bị tắt vì chưa có contract đặt lịch.

Luồng demo: chi tiết → hẹn xem → login → quay lại chi tiết → điền lịch → xác nhận mô phỏng. Không có request gửi chủ nhà, không lưu số điện thoại hay lịch hẹn.

## Docker / Nginx

```bash
cd web-frontend-server
docker compose up -d --build
```

Truy cập `http://localhost:8080`, `/blog/`, `/rooms/1` đều được Nginx fallback về React khi refresh. Compose riêng chỉ chạy frontend, gắn `cloud-net`; không thay compose gốc của Bảo. Image build nhiều stage: Node build → Nginx phục vụ `dist`.

`VITE_*` được nhúng lúc **build**. Sau khi đổi nguồn dữ liệu cần `docker compose up -d --build`. `BACKEND_UPSTREAM` là biến **runtime** dùng bởi Nginx, mặc định `host.docker.internal:8085` cho backend trên máy host. Khi ghép full stack trên `cloud-net`, đặt `BACKEND_UPSTREAM=application-backend-server:8081`. Gateway hiện tại có thể tiếp tục route `/` đến frontend và `/api/` đến NestJS.

## Tài nguyên

Ảnh nội thất minh họa tải từ Unsplash (photo IDs trong `public/images/SOURCES.md`); toàn bộ tin phòng và thông tin thuê là dữ liệu mẫu, không phải tin đăng thực tế. Font Be Vietnam Pro được đóng gói bởi `@fontsource/be-vietnam-pro` (SIL Open Font License). Không cần tải ảnh/font từ mạng khi người dùng mở ứng dụng.
