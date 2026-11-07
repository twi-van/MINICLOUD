#!/usr/bin/env bash
# A1 (Lợi): Bật registrationAllowed=true trên realm minicloud đang chạy (khi volume keycloak_data đã tồn tại)
# và đảm bảo tài khoản test student_demo / 123456 sẵn sàng.
set -euo pipefail

CONTAINER="${KEYCLOAK_CONTAINER:-authentication-identity-server}"
ADMIN_USER="${KC_BOOTSTRAP_ADMIN_USERNAME:-admin}"
ADMIN_PASS="${KC_BOOTSTRAP_ADMIN_PASSWORD:-admin}"
DEMO_USER="${DEMO_USERNAME:-student_demo}"
DEMO_PASS="${DEMO_PASSWORD:-123456}"

echo "Authenticating kcadm inside $CONTAINER ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080 \
  --realm master \
  --user "$ADMIN_USER" \
  --password "$ADMIN_PASS"

echo "Enabling registrationAllowed=true on realm minicloud ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh update realms/minicloud \
  -s registrationAllowed=true \
  -s loginWithEmailAllowed=true \
  -s duplicateEmailsAllowed=false

ensure_user() {
  local username="$1"
  local email="$2"
  local first="$3"
  local last="$4"
  local password="$5"
  if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get users -r minicloud -q "username=$username" --fields username --format csv --noquotes | grep -qx "$username"; then
    echo "Creating user $username ..."
    docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create users -r minicloud \
      -s "username=$username" \
      -s "email=$email" \
      -s "firstName=$first" \
      -s "lastName=$last" \
      -s enabled=true \
      -s emailVerified=true
  else
    echo "User $username already exists."
  fi
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh set-password -r minicloud \
    --username "$username" \
    --new-password "$password"
}

ensure_user "$DEMO_USER" "user@minicloud.local" "Student" "Demo" "$DEMO_PASS"
ensure_user "sv01" "sv01@minicloud.local" "Sinh" "Vien 01" "123456"
ensure_user "sv02" "sv02@minicloud.local" "Sinh" "Vien 02" "123456"

if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get clients -r minicloud -q clientId=flask-app --fields clientId --format csv --noquotes | grep -qx "flask-app"; then
  echo "Creating public client flask-app ..."
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create clients -r minicloud \
    -s clientId=flask-app \
    -s name="Lab token client" \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=true \
    -s 'redirectUris=["http://localhost/*","http://13.250.19.3/*"]' \
    -s 'webOrigins=["http://localhost","http://13.250.19.3"]'
fi

CLIENT_UUID="$(docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get clients -r minicloud -q clientId=web-frontend --fields id --format csv --noquotes | tail -n 1)"
echo "Updating web-frontend redirect URIs ($CLIENT_UUID) ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh update "clients/$CLIENT_UUID" -r minicloud \
  -s 'redirectUris=["http://localhost/*","http://localhost:8080/*","http://localhost:5173/*","http://13.250.19.3/*","http://13.250.19.3:8080/*"]' \
  -s 'webOrigins=["http://localhost","http://localhost:8080","http://localhost:5173","http://13.250.19.3","http://13.250.19.3:8080"]'

echo "Done. Realm minicloud allows registration, users student_demo/sv01/sv02, client flask-app, and EC2 redirect URIs."

