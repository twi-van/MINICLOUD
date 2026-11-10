#!/usr/bin/env bash
# A1 (Lợi): Bật registrationAllowed=true trên realm realm_52400211 đang chạy (khi volume keycloak_data đã tồn tại)
# và đảm bảo tài khoản test student_demo / 123456 sẵn sàng.
set -euo pipefail

CONTAINER="${KEYCLOAK_CONTAINER:-authentication-identity-server}"
ADMIN_USER="${KC_BOOTSTRAP_ADMIN_USERNAME:-admin}"
ADMIN_PASS="${KC_BOOTSTRAP_ADMIN_PASSWORD:-admin}"
DEMO_USER="${DEMO_USERNAME:-student_demo}"
DEMO_PASS="${DEMO_PASSWORD:-123456}"
REALM="${KEYCLOAK_REALM:-realm_52400211}"

echo "Authenticating kcadm inside $CONTAINER ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh config credentials \
  --server http://localhost:8080/auth \
  --realm master \
  --user "$ADMIN_USER" \
  --password "$ADMIN_PASS"

echo "Allowing HTTP access (sslRequired=NONE) on master and $REALM ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=NONE

echo "Enabling registrationAllowed=true on realm $REALM ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh update realms/"$REALM" \
  -s sslRequired=NONE \
  -s registrationAllowed=true \
  -s loginWithEmailAllowed=true \
  -s duplicateEmailsAllowed=false

ensure_user() {
  local username="$1"
  local email="$2"
  local first="$3"
  local last="$4"
  local password="$5"
  if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get users -r "$REALM" -q "username=$username" --fields username --format csv --noquotes | grep -qx "$username"; then
    echo "Creating user $username ..."
    docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create users -r "$REALM" \
      -s "username=$username" \
      -s "email=$email" \
      -s "firstName=$first" \
      -s "lastName=$last" \
      -s enabled=true \
      -s emailVerified=true
  else
    echo "User $username already exists."
  fi
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh set-password -r "$REALM" \
    --username "$username" \
    --new-password "$password" \
    --temporary=false
}

ensure_user "$DEMO_USER" "user@minicloud.local" "Student" "Demo" "$DEMO_PASS"
ensure_user "sv01" "sv01@minicloud.local" "Sinh" "Vien 01" "123456"
ensure_user "sv02" "sv02@minicloud.local" "Sinh" "Vien 02" "123456"

if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get clients -r "$REALM" -q clientId=flask-app --fields clientId --format csv --noquotes | grep -qx "flask-app"; then
  echo "Creating public client flask-app ..."
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create clients -r "$REALM" \
    -s clientId=flask-app \
    -s name="Lab token client" \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=true \
    -s 'redirectUris=["http://localhost/*","http://13.250.19.3/*"]' \
    -s 'webOrigins=["http://localhost","http://13.250.19.3"]'
fi

if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get clients -r "$REALM" -q clientId=web-frontend --fields clientId --format csv --noquotes | grep -qx "web-frontend"; then
  echo "Creating public client web-frontend ..."
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create clients -r "$REALM" \
    -s clientId=web-frontend \
    -s name="MyMiniCloud React Web" \
    -s publicClient=true \
    -s standardFlowEnabled=true \
    -s directAccessGrantsEnabled=true \
    -s rootUrl="http://localhost" \
    -s baseUrl="http://localhost/" \
    -s 'redirectUris=["http://localhost/*","http://localhost:8080/*","http://localhost:5173/*","http://13.250.19.3/*","http://13.250.19.3:8080/*"]' \
    -s 'webOrigins=["http://localhost","http://localhost:8080","http://localhost:5173","http://13.250.19.3","http://13.250.19.3:8080"]' \
    -s 'attributes={"pkce.code.challenge.method":"S256","post.logout.redirect.uris":"+"}'
fi

echo "Done. Realm $REALM allows registration, users student_demo/sv01/sv02, clients flask-app/web-frontend."
