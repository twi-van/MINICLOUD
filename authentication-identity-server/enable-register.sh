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

if ! docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh get users -r minicloud -q "username=$DEMO_USER" | grep -q "\"username\" : \"$DEMO_USER\""; then
  echo "Creating demo user $DEMO_USER ..."
  docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh create users -r minicloud \
    -s "username=$DEMO_USER" \
    -s "email=user@minicloud.local" \
    -s "firstName=Student" \
    -s "lastName=Demo" \
    -s enabled=true \
    -s emailVerified=true
fi

echo "Setting password for $DEMO_USER ..."
docker exec "$CONTAINER" /opt/keycloak/bin/kcadm.sh set-password -r minicloud \
  --username "$DEMO_USER" \
  --new-password "$DEMO_PASS"

echo "Done. Realm minicloud now has registrationAllowed=true and demo user $DEMO_USER."

