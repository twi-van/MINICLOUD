-- Upgrade the original Sprint 1 rooms(name, ...) schema to the FE/BE contract.
-- Safe to run on a fresh database created by 001_schema.sql or the old schema.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'rooms'
          AND column_name = 'name'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'rooms'
          AND column_name = 'title'
    ) THEN
        ALTER TABLE rooms RENAME COLUMN name TO title;
    END IF;
END;
$$;

ALTER TABLE rooms
    ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS price BIGINT NOT NULL DEFAULT 0 CHECK (price >= 0),
    ADD COLUMN IF NOT EXISTS area NUMERIC(8, 2) NOT NULL DEFAULT 1 CHECK (area > 0);

UPDATE rooms
SET title = CASE title
        WHEN 'Cloud Room 01' THEN 'Phòng trọ gần ĐH'
        WHEN 'Cloud Room 02' THEN 'Phòng trọ trung tâm'
        ELSE title
    END,
    address = CASE title
        WHEN 'Cloud Room 01' THEN 'Quận 7, TP.HCM'
        WHEN 'Cloud Room 02' THEN 'Thủ Đức, TP.HCM'
        ELSE address
    END,
    price = CASE title
        WHEN 'Cloud Room 01' THEN 3500000
        WHEN 'Cloud Room 02' THEN 4200000
        ELSE price
    END,
    area = CASE title
        WHEN 'Cloud Room 01' THEN 25
        WHEN 'Cloud Room 02' THEN 30
        ELSE area
    END
WHERE title IN ('Cloud Room 01', 'Cloud Room 02');
