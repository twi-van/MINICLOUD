# MinIO — Sprint 1–3 & Parity (A4, A5, A6)

Run this service with `docker compose -f object-storage-server/compose.yaml up -d --build` (or via the root `docker-compose.yml`).

- Console: `http://localhost:9001`
- S3 API (host): `http://localhost:9000`
- Internal endpoint on `cloud-net`: `http://object-storage-server:9000`
- Local demo credentials: `minioadmin` / `minioadmin`
- Files persist under `object-storage-server/data/`.

## Seeding Buckets & Room/Avatar Assets (`rooms-images` & `profile-pics`)

Run the seed script after `object-storage-server` and `relational-database-server` are up:

- **macOS / Linux / Git Bash:**
  ```sh
  bash object-storage-server/seed-rooms.sh
  ```
- **Windows PowerShell:**
  ```powershell
  .\object-storage-server\seed-rooms.ps1
  ```

What the seed script does:
1. Creates bucket `rooms-images` with public read policy (`s3:GetObject`) and uploads `room-1.jpg` .. `room-6.jpg`.
   - Public URLs: `http://localhost:9000/rooms-images/room-1.jpg` .. `http://localhost:9000/rooms-images/room-6.jpg`
2. Creates bucket `profile-pics` (A6 parity) with public read policy (`s3:GetObject`) and uploads `avatar-demo.jpg` plus `avatar.jpg`.
   - Public URL: `http://localhost:9000/profile-pics/avatar-demo.jpg`
3. Creates bucket `documents` and uploads a small PDF generated at runtime (`bao-cao.pdf` is not stored in git).
   - Public URL: `http://localhost:9000/documents/bao-cao.pdf`
4. Applies `relational-database-server/init/004_parity_rooms_bookings.sql` so PostgreSQL has all 8 rooms with filter fields (`district`, `type`, `amenities`, `available`, `images`), the `bookings` table (A2), and `users.avatar_url`.
