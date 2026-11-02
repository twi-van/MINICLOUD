-- Parity upgrade (A2, A5, A6 — Lợi):
-- 1. Mở rộng bảng rooms với district, type, amenities, available, images và seed đủ 8 phòng khớp bộ lọc FE.
-- 2. Bổ sung cột avatar_url cho users trỏ bucket profile-pics trên MinIO.
-- 3. Tạo bảng bookings (đặt lịch hẹn xem phòng) và seed mẫu.
-- Idempotent: chạy an toàn nhiều lần trên volume cũ hoặc mới.

ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS district TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'Phòng trọ',
    ADD COLUMN IF NOT EXISTS amenities TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS available BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';

INSERT INTO rooms (id, title, address, district, price, area, type, amenities, available, description, image_url, images)
VALUES
    (
        1,
        'Studio ngập nắng, một góc bình yên',
        'Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
        'Quận 7',
        3500000,
        28,
        'Studio',
        ARRAY['Nội thất', 'Máy lạnh', 'Wifi', 'Bếp riêng'],
        TRUE,
        'Một căn studio nhỏ xinh với cửa sổ lớn đón ánh sáng tự nhiên, dành cho bạn thích không gian yên tĩnh sau những giờ học.',
        'http://localhost:9000/rooms-images/room-1.jpg',
        ARRAY[
            'http://localhost:9000/rooms-images/room-1.jpg',
            'http://localhost:9000/rooms-images/room-3.jpg',
            'http://localhost:9000/rooms-images/room-4.jpg'
        ]
    ),
    (
        2,
        'Gác nhỏ ấm áp, đủ đầy tiện nghi',
        'Đường D5, Bình Thạnh, TP.HCM',
        'Bình Thạnh',
        2800000,
        22,
        'Có gác',
        ARRAY['Có gác', 'Wifi', 'Chỗ để xe'],
        TRUE,
        'Phòng có gác xinh xắn, đủ tiện nghi cơ bản.',
        'http://localhost:9000/rooms-images/room-2.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-2.jpg']
    ),
    (
        3,
        'Phòng xinh cho những khởi đầu mới',
        'Đường Võ Văn Ngân, Thủ Đức, TP.HCM',
        'Thủ Đức',
        2200000,
        20,
        'Phòng trọ',
        ARRAY['Máy lạnh', 'Wifi', 'Chỗ để xe'],
        TRUE,
        'Phòng trọ gần các trường đại học khu Thủ Đức.',
        'http://localhost:9000/rooms-images/room-3.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-3.jpg']
    ),
    (
        4,
        'Không gian xanh giữa lòng thành phố',
        'Đường Lê Văn Sỹ, Quận 3, TP.HCM',
        'Quận 3',
        4200000,
        32,
        'Studio',
        ARRAY['Nội thất', 'Ban công', 'Bếp riêng'],
        TRUE,
        'Studio rộng, có ban công xanh.',
        'http://localhost:9000/rooms-images/room-4.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-4.jpg']
    ),
    (
        5,
        'Căn phòng tối giản, sống thật thoải mái',
        'Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
        'Quận 5',
        3000000,
        25,
        'Phòng trọ',
        ARRAY['Nội thất', 'Wifi', 'Máy lạnh'],
        TRUE,
        'Phòng tối giản, đầy đủ nội thất.',
        'http://localhost:9000/rooms-images/room-5.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-5.jpg']
    ),
    (
        6,
        'Chốn về dịu dàng bên ô cửa sổ',
        'Đường Lê Văn Việt, Thủ Đức, TP.HCM',
        'Thủ Đức',
        2600000,
        24,
        'Có gác',
        ARRAY['Có gác', 'Wifi', 'Bếp riêng'],
        FALSE,
        'Phòng có gác, gần Lê Văn Việt.',
        'http://localhost:9000/rooms-images/room-6.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-6.jpg']
    ),
    (
        7,
        'Studio thoáng sáng gần trường đại học',
        'Đường Nguyễn Hữu Thọ, Quận 7, TP.HCM',
        'Quận 7',
        3800000,
        30,
        'Studio',
        ARRAY['Nội thất', 'Ban công', 'Wifi'],
        TRUE,
        'Studio gần ĐH, thoáng sáng.',
        'http://localhost:9000/rooms-images/room-3.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-3.jpg']
    ),
    (
        8,
        'Một góc riêng để học và lớn lên',
        'Đường Ung Văn Khiêm, Bình Thạnh, TP.HCM',
        'Bình Thạnh',
        2400000,
        21,
        'Phòng trọ',
        ARRAY['Wifi', 'Chỗ để xe'],
        TRUE,
        'Phòng học yên tĩnh khu Bình Thạnh.',
        'http://localhost:9000/rooms-images/room-5.jpg',
        ARRAY['http://localhost:9000/rooms-images/room-5.jpg']
    )
ON CONFLICT (id) DO UPDATE SET
    title       = EXCLUDED.title,
    address     = EXCLUDED.address,
    district    = EXCLUDED.district,
    price       = EXCLUDED.price,
    area        = EXCLUDED.area,
    type        = EXCLUDED.type,
    amenities   = EXCLUDED.amenities,
    available   = EXCLUDED.available,
    description = EXCLUDED.description,
    image_url   = EXCLUDED.image_url,
    images      = EXCLUDED.images;

SELECT setval(
    pg_get_serial_sequence('rooms', 'id'),
    COALESCE(MAX(id), 1),
    MAX(id) IS NOT NULL
)
FROM rooms;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'http://localhost:9000/profile-pics/avatar-demo.jpg';

INSERT INTO users (email, full_name, avatar_url)
VALUES ('demo@minicloud.local', 'Demo User', 'http://localhost:9000/profile-pics/avatar-demo.jpg')
ON CONFLICT (email) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url;

CREATE TABLE IF NOT EXISTS bookings (
    id          BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    room_id     BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id     TEXT,
    user_email  TEXT,
    name        TEXT NOT NULL DEFAULT '',
    phone       TEXT NOT NULL DEFAULT '',
    visit_date  TEXT NOT NULL DEFAULT '',
    note        TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Volume cũ (A2 sớm): cột user_sub/guest_name → đổi sang schema parity
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'bookings' AND column_name = 'user_sub'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'bookings' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE bookings RENAME COLUMN user_sub TO user_id;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'bookings' AND column_name = 'guest_name'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'bookings' AND column_name = 'name'
    ) THEN
        ALTER TABLE bookings RENAME COLUMN guest_name TO name;
    END IF;
END;
$$;

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS user_id TEXT,
    ADD COLUMN IF NOT EXISTS user_email TEXT,
    ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS visit_date TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS note TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- visit_date kiểu DATE (schema A2 cũ) → TEXT để khớp seed/FE
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'bookings'
          AND column_name = 'visit_date'
          AND data_type = 'date'
    ) THEN
        ALTER TABLE bookings
            ALTER COLUMN visit_date TYPE TEXT USING visit_date::text;
    END IF;
END;
$$;

INSERT INTO bookings (id, room_id, user_id, user_email, name, phone, visit_date, note, status)
VALUES (
    1,
    1,
    'student_demo',
    'user@minicloud.local',
    'Nguyen A',
    '0901234567',
    '2026-11-10',
    'Hẹn xem phòng buổi chiều',
    'confirmed'
)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('bookings', 'id'),
    COALESCE(MAX(id), 1),
    MAX(id) IS NOT NULL
)
FROM bookings;

