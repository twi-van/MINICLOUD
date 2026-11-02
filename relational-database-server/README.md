# PostgreSQL — Sprint 1–3 & Parity (A2, A5, A6)

Run this service on its own for Sprint 1, or as part of the root `docker-compose.yml` stack on `cloud-net` so the App containers resolve `relational-database-server`.

- Database: `minicloud`
- User/password: `minicloud` / `minicloud_dev` (local demo credentials)
- Host port: `5432`
- Initialization scripts in `relational-database-server/init/` create and seed:
  - `rooms`: 8 rooms matching the FE/BE contract (`id`, `title`, `address`, `district`, `price`, `area`, `type`, `amenities`, `available`, `description`, `image_url`, `images`).
  - `users`: sample user with `avatar_url` pointing to the `profile-pics` bucket on MinIO (`http://localhost:9000/profile-pics/avatar-demo.jpg`).
  - `students`: 5 students matching the `/student` JSON contract (`id`, `name`, `major`, `gpa`).
  - `bookings`: room viewing appointment table (`id`, `room_id`, `user_id`, `user_email`, `name`, `phone`, `visit_date`, `note`, `status`, `created_at`) with sample booking data for A2.
- Data persists in the `postgres_data` Docker volume.

From the repository root, run:

```sh
docker network create cloud-net
docker compose -f relational-database-server/compose.yaml up -d
docker compose -f relational-database-server/compose.yaml ps
```

For an existing `postgres_data` volume created before the A2/A5/A6 parity update, apply the idempotent migration script once (or run `object-storage-server/seed-rooms.sh` / `seed-rooms.ps1`, which also applies it automatically):

```sh
docker exec relational-database-server psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -f /docker-entrypoint-initdb.d/004_parity_rooms_bookings.sql
```

Verify the schema and sample rows:

```sh
docker exec relational-database-server psql -U minicloud -d minicloud -c '\dt'
docker exec relational-database-server psql -U minicloud -d minicloud -c 'SELECT id, title, district, price, area, type, available, image_url FROM rooms ORDER BY id;'
docker exec relational-database-server psql -U minicloud -d minicloud -c 'SELECT id, room_id, user_id, name, phone, visit_date, status FROM bookings ORDER BY id;'
docker exec relational-database-server psql -U minicloud -d minicloud -c 'SELECT id, name, major, gpa FROM students ORDER BY id;'
```
