# PostgreSQL — Sprint 1

Run this service independently for Sprint 1; the root Compose file belongs to the team integration work.

- Database: `minicloud`
- User/password: `minicloud` / `minicloud_dev` (local demo credentials)
- Host port: `5432`
- First initialization creates `rooms` and `users` and inserts sample rows.
- Data persists in the `postgres_data` Docker volume.

From the repository root, run:

```sh
docker compose -f relational-database-server/compose.yaml up -d
docker compose -f relational-database-server/compose.yaml ps
```

Verify the schema and sample rows:

```sh
docker compose -f relational-database-server/compose.yaml exec relational-database-server psql -U minicloud -d minicloud -c '\dt'
docker compose -f relational-database-server/compose.yaml exec relational-database-server psql -U minicloud -d minicloud -c 'SELECT * FROM rooms;'
```

The image runs initialization scripts only when the data volume is empty. To stop this Sprint 1 service, run `docker compose -f relational-database-server/compose.yaml down` from the repository root.
