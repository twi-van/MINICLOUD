# MiniHome — Kết quả chỉnh giao diện

Đã chỉnh lớp presentation theo ảnh tham chiếu: topbar navy, header trắng, hero ảnh tràn ngang có overlay, search surface nổi, danh mục ảnh dùng lại bộ lọc hiện có, card và các surface đồng bộ. Giữ nguyên nội dung cũ, 3 phòng nổi bật, Vibe Quiz, khu vực, blog và CTA. Ảnh hero dùng `/images/room-1.jpg` local; không phải ảnh phòng trong mockup.

## Các file source đã chỉnh

- `src/index.css`: navy #183746, accent #BC7659, nền #F8F7F4, muted #69757B, border #E5E5E1.
- `src/App.css`: layout hero, search, danh mục, responsive, card, header/footer và surface.
- `src/app/providers/AppProviders.tsx`: Ant Design tokens, primary hover #254C5D, surface trắng, muted #EAE6E0, radius 11px.
- `src/features/home/pages/HomePage.tsx`: markup presentation; danh mục tái sử dụng category state/handler; di chuyển benefit strip; bỏ trang trí polaroid và tilt của ảnh hero.
- `src/features/rooms/components/RoomCard.tsx`: hover nâng 3px, scale ảnh 1.03.
- `src/features/home/components/RoomMatchQuiz.tsx`: màu progress navy/neutral.
- `src/shared/components/Reveal.tsx`: entrance 12px/400ms, giữ reduced motion.
- `src/shared/styles/motion.css`: hover khu vực nâng 3px.

## Kiểm tra

- `pnpm lint`: đạt.
- `pnpm build` (gồm TypeScript): đạt, đã chạy lại sau chỉnh sửa cuối.
- Chụp và xem giao diện 1440px, 768px, 390px; không tràn ngang.
- E2E hiện có: 11 ca báo đạt; 4 ca lỗi do kỳ vọng chữ/selector của giao diện khác: `Ở đúng gu.`, `Team mê gác`, `Tất cả vibe`, ticker và `Tìm gu của mình`. Không sửa nội dung app để đáp ứng những kỳ vọng cũ này.
- Các ca đạt gồm filter/sort/pagination, favorites qua reload, chi tiết, blog, students, register validation, login và lịch hẹn demo, responsive/menu/filter, quick search, adapter API DTO tối thiểu và retry API error.
- Kiểm tra Chrome riêng với selector hiện tại: search chọn Quận 7 mở đúng `/rooms?district=...`; tab Có gác trả 2 phòng; quiz Studio + 3–4 triệu + Quận 7 mở đúng URL `type=Studio&budget=3to4&district=...`.
- API được xác minh bằng response giả của bộ E2E, chưa xác minh backend thật.

Không sửa service/hooks/context logic, business types, mocks, auth logic, validation, routing, query params, API contracts, backend hoặc hạ tầng. Không cài dependency. Build tái tạo thư mục `dist`; công cụ kiểm thử có sinh artifacts trong `test-results`.

Không tìm thấy `docs/THONG_NHAT_FE_BE_HAN.md` trong workspace. Đã đối chiếu README và `DAC_TA_HIEN_TAI_NORMAL.md`. Workspace không có Git repository nên không thể xuất `git diff`.

## Bổ sung theo phản hồi: tăng điểm nhấn màu và chuyển động

- Ba thẻ thống kê: navy #183746, terracotta đậm #A65F44 và cát #EAD9C5; icon có nền riêng, số liệu lớn, hover nâng nhẹ và entrance so le bằng Reveal hiện có.
- Badge ngành học bỏ màu blue mặc định Ant Design, chuyển sang chữ navy trên nền xanh trầm nhạt. Avatar màu cát, tiêu đề bảng navy, hàng xen kẽ nền ấm.
- Thẻ phòng/blog, benefit strip, sidebar lọc, category và CTA có nền/viền/điểm nhấn màu rõ hơn.
- Bổ sung entrance tiêu đề và bảng, hàng xuất hiện so le; hover icon, badge và focus search. Tắt các chuyển động mới khi người dùng bật reduced motion.
- File bổ sung: `src/features/students/pages/StudentsPage.tsx`, `src/features/blog/components/BlogCard.tsx`, `src/App.css`, `src/shared/styles/motion.css`.
- Kiểm tra lại: lint và build/TypeScript đạt; Chrome kiểm tra `/students`, `/`, `/rooms`, `/blog`, `/login` ở 1440/768/390px đều không tràn ngang. Tìm sinh viên vẫn hoạt động; reduced motion trả animationName=none. Đã xem ảnh chụp sau khi animation kết thúc.
- Không đổi dữ liệu, API, auth, routing hoặc logic lọc/sắp xếp. Không chạy lại toàn bộ E2E ở lượt chỉnh presentation này.

## Điều chỉnh theo yêu cầu giữ nguyên kích thước

Khôi phục geometry về trước lượt tăng điểm nhấn: thẻ thống kê dùng lại `gap-5 rounded-xl border p-6`, số liệu `text-3xl`, icon theo kích thước benefit-icon cũ. Bỏ thay đổi padding/line-height/font/radius badge, padding toolbar bảng, padding và margin card blog, padding nội dung card phòng, khoảng cách benefit strip, và các kích thước responsive thêm ở lượt trước. Bỏ gạch trang trí dưới tiêu đề vốn làm tăng chiều cao. Điểm nhấn CTA/category dùng inset shadow để không chiếm diện tích. Giữ màu sắc và hiệu ứng; dùng Motion hiện có, không cài thêm thư viện. Không sửa logic nghiệp vụ.

## Bổ sung thư viện hiệu ứng theo yêu cầu mới

Đã cài `gsap@3.15.0` và cập nhật package.json/pnpm-lock.yaml. `VisualEffects.tsx` được gắn vào layout, quan sát trang lazy-load để chạy hiệu ứng tiêu đề mở dần khi vào viewport. GSAP matchMedia/context thu hồi animation khi unmount hoặc bật reduced motion. Không thay thư viện Motion hiện có.

Thêm ánh sáng theo vị trí con trỏ trên card/thống kê/CTA, vệt sáng lướt nút khi hover/focus và chuyển động icon. Các lớp ánh sáng dùng pseudo-element absolute và pointer-events:none, không thay đổi kích thước, padding, font hay bố cục. Không scroll-jacking, không đổi handlers nghiệp vụ.

Lint và build/TypeScript đạt. Chrome xác minh spotlight hoạt động cả sau chuyển route SPA, kích thước card trước/sau hover không đổi, tìm sinh viên vẫn hoạt động, không có pageerror; viewport 768/390 không overflow. CSS vô hiệu ánh sáng/chuyển động bổ sung khi reduced motion. Ảnh kiểm tra: `/private/tmp/minihome-gsap.png`.

## Sidebar bằng cột kết quả và chuyển động tại chỗ

Sidebar phòng trên desktop dùng align-self:stretch, không thay đổi chiều rộng hay spacing các control. GSAP tiêu đề bỏ clip reveal/slide, đổi thành dao động tại chỗ 2px với sine.inOut chu kỳ 6.4s; tạm dừng khi ra khỏi viewport, thu hồi tween khi route bị tháo. Reveal section và hero copy không còn trượt lên. Hologram ánh màu nhẹ chạy 10s trên thống kê và CTA, nằm trong pseudo-element không chiếm diện tích.

Lint/build đạt. Chrome đo hai cột `/rooms` đều 894px; tiêu đề opacity=1/clip-path=none; hologram chạy và tắt khi reduced motion. Bộ lọc mobile mở được, không tràn ngang, không pageerror. Không sửa logic filter/API.

## Hoàn tác theo phản hồi mới nhất

Đã bỏ quy tắc kéo giãn sidebar (align-self:stretch) để khung lọc trở lại chiều cao tự nhiên. Gỡ lớp phối màu tăng cường: thống kê ba màu, header bảng navy, nền sidebar đất, card nền kem, badge ngành custom và các inset màu. Khôi phục tokens màu ban đầu từ bản sao source trước khi chỉnh (#203b4b / #b66b43, màu phụ và Ant Design theme cũ); badge ngành blue và avatar cũ. Giữ bố cục trang chủ hiện tại, ảnh hero tràn ngang, overlay và thanh tìm kiếm nổi. Không thay API, dữ liệu hoặc logic. Hiệu ứng ánh sáng chuyển về phản chiếu trắng nhẹ để tránh đổi màu nền.

## Dọn nhãn trải nghiệm trên giao diện

Bỏ badge nguồn dữ liệu topbar/footer, banner phiên tài khoản, dòng tài khoản trải nghiệm trong dropdown, ghi chú minh họa trang sinh viên, alert giới thiệu demo trên trang auth, ghi chú lặp cạnh nút hẹn xem. Rút gọn lời chào và nhãn nút đăng nhập/đăng ký/hẹn xem. Giữ checkbox xác nhận vốn có và thông báo trong modal hẹn xem để không biểu thị sai rằng tài khoản/lịch hẹn đã được tạo/gửi thật. Không đổi service, validation, trạng thái hoặc handler.

## Căn đáy bộ lọc với hàng thẻ phòng (không tính phân trang)

Tách presentation của Pagination khỏi grid hai cột, giữ nguyên props/handler và query params. Sidebar desktop stretch theo vùng kết quả thẻ phòng; pagination nằm dưới, căn giữa cột phòng. Chrome 1440px đo đáy sidebar và đáy thẻ cuối cùng cùng 1277.17px; pagination bắt đầu sau 40px. Chuyển trang 2 hoạt động, mobile 390px mở bộ lọc và không overflow. Lint/build đạt. Giữ nguyên màu và kích thước thẻ/control.
