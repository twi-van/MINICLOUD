# Keycloak — Sprint 1–3 & Parity (A1 Register)

Run this service with `docker compose -f authentication-identity-server/compose.yaml up -d` (or via the root `docker-compose.yml`). It runs in development mode on host port `8082` (container port `8080`) and joins `cloud-net`.

- Public route via proxy: `http://localhost/auth/`
- Direct host port: `http://localhost:8082`
- Internal endpoint on `cloud-net`: `http://authentication-identity-server:8080`
- Admin console: `http://localhost:8082/admin/` (`admin` / `admin`)
- Imported realm: `minicloud` (`authentication-identity-server/realm/minicloud-realm.json`)
  - Public OIDC client: `web-frontend` (Authorization Code + PKCE `S256`)
  - Self-registration enabled (`"registrationAllowed": true`) for A1 parity (`keycloak.register()`).

If the `keycloak_data` volume was already created before `registrationAllowed` was enabled in `minicloud-realm.json`, update the live realm and create the demo account (`student_demo` / `123456`) without removing the volume:

- **macOS / Linux / Git Bash:**
  ```sh
  bash authentication-identity-server/enable-register.sh
  ```
- **Windows PowerShell:**
  ```powershell
  .\authentication-identity-server\enable-register.ps1
  ```
