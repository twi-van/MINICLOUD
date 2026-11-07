#!/usr/bin/env bash
# Sprint 3 & Parity A4/A5/A6 (Lợi):
# - Bucket rooms-images (public read) + upload room-1.jpg .. room-6.jpg
# - Bucket profile-pics (public read) + upload avatar-demo.jpg
# - Đồng bộ schema & seed 8 phòng + bảng bookings + avatar_url vào Postgres
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BUCKET="${MINIO_BUCKET:-rooms-images}"
AVATAR_BUCKET="${MINIO_AVATAR_BUCKET:-profile-pics}"
DOCS_BUCKET="${MINIO_DOCS_BUCKET:-documents}"
ENDPOINT="${MINIO_ENDPOINT:-http://localhost:9000}"
# A4: mặc định URL public qua proxy :80/minio (API seed vẫn dùng ENDPOINT :9000)
PUBLIC_BASE_URL="${PUBLIC_MINIO_BASE_URL:-http://localhost/minio}"
ACCESS_KEY="${MINIO_ROOT_USER:-minioadmin}"
SECRET_KEY="${MINIO_ROOT_PASSWORD:-minioadmin}"
MIGRATION_FILE="$ROOT/../relational-database-server/init/004_parity_rooms_bookings.sql"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is required (aws). Install it, then rerun." >&2
  exit 1
fi

export AWS_ACCESS_KEY_ID="$ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SECRET_KEY"
export AWS_DEFAULT_REGION=us-east-1

echo "Connecting to MinIO at $ENDPOINT ..."
if ! aws s3api list-buckets --endpoint-url "$ENDPOINT" >/dev/null; then
  echo "Cannot connect to MinIO. Start object-storage-server first." >&2
  exit 1
fi

ensure_public_bucket() {
  local b="$1"
  if ! aws s3api head-bucket --bucket "$b" --endpoint-url "$ENDPOINT" 2>/dev/null; then
    echo "Creating bucket $b ..."
    aws s3api create-bucket --bucket "$b" --endpoint-url "$ENDPOINT" >/dev/null
  fi
  local policy
  policy=$(cat <<EOF
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::${b}/*"]}]}
EOF
  )
  aws s3api put-bucket-policy --bucket "$b" --policy "$policy" --endpoint-url "$ENDPOINT"
}

ensure_public_bucket "$BUCKET"
ensure_public_bucket "$AVATAR_BUCKET"
ensure_public_bucket "$DOCS_BUCKET"

for key in room-1.jpg room-2.jpg room-3.jpg room-4.jpg room-5.jpg room-6.jpg; do
  file="$ROOT/seed/$key"
  if [[ ! -f "$file" ]]; then
    echo "Missing image: $file" >&2
    exit 1
  fi
  echo "Uploading $key to s3://$BUCKET/$key ..."
  aws s3 cp "$file" "s3://$BUCKET/$key" --content-type image/jpeg --endpoint-url "$ENDPOINT"
done

AVATAR_FILE="$ROOT/seed/avatar-demo.jpg"
if [[ -f "$AVATAR_FILE" ]]; then
  echo "Uploading avatar-demo.jpg to s3://$AVATAR_BUCKET/avatar-demo.jpg ..."
  aws s3 cp "$AVATAR_FILE" "s3://$AVATAR_BUCKET/avatar-demo.jpg" --content-type image/jpeg --endpoint-url "$ENDPOINT"
  echo "Uploading avatar.jpg to s3://$AVATAR_BUCKET/avatar.jpg ..."
  aws s3 cp "$AVATAR_FILE" "s3://$AVATAR_BUCKET/avatar.jpg" --content-type image/jpeg --endpoint-url "$ENDPOINT"
fi

PDF_FILE="$(mktemp "${TMPDIR:-/tmp}/minicloud-bao-cao.XXXXXX.pdf")"
cat > "$PDF_FILE" <<'PDF'
%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 57>>stream
BT /F1 18 Tf 36 90 Td (MyMiniCloud report) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Size 6/Root 1 0 R>>
%%EOF
PDF
echo "Uploading bao-cao.pdf to s3://$DOCS_BUCKET/bao-cao.pdf ..."
aws s3 cp "$PDF_FILE" "s3://$DOCS_BUCKET/bao-cao.pdf" --content-type application/pdf --endpoint-url "$ENDPOINT"
rm -f "$PDF_FILE"

echo "Applying parity schema & 8-room seed to Postgres ..."
if [[ -f "$MIGRATION_FILE" ]]; then
  docker exec -i relational-database-server \
    psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud < "$MIGRATION_FILE"
fi

if [[ "$PUBLIC_BASE_URL" != "http://localhost:9000" ]]; then
  SQL="UPDATE rooms SET image_url = replace(image_url, 'http://localhost:9000/rooms-images/', '$PUBLIC_BASE_URL/$BUCKET/');
       UPDATE users SET avatar_url = '$PUBLIC_BASE_URL/$AVATAR_BUCKET/avatar-demo.jpg' WHERE email = 'demo@minicloud.local';"
  docker exec relational-database-server \
    psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -c "$SQL"
fi

echo "Done."
echo "  Room images:  $PUBLIC_BASE_URL/$BUCKET/room-1.jpg .. room-6.jpg"
echo "  Demo avatar:  $PUBLIC_BASE_URL/$AVATAR_BUCKET/avatar-demo.jpg"
echo "  Lab avatar:   $PUBLIC_BASE_URL/$AVATAR_BUCKET/avatar.jpg"
echo "  Report PDF:   $PUBLIC_BASE_URL/$DOCS_BUCKET/bao-cao.pdf"
echo "Check: curl -s http://localhost/api/rooms | head"
