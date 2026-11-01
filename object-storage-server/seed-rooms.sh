#!/usr/bin/env bash
# Sprint 3 (Lợi): bucket rooms-images + cập nhật rooms.image_url → URL MinIO.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BUCKET="${MINIO_BUCKET:-rooms-images}"
ENDPOINT="${MINIO_ENDPOINT:-http://localhost:9000}"
ACCESS_KEY="${MINIO_ROOT_USER:-minioadmin}"
SECRET_KEY="${MINIO_ROOT_PASSWORD:-minioadmin}"

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

if ! aws s3api head-bucket --bucket "$BUCKET" --endpoint-url "$ENDPOINT" 2>/dev/null; then
  echo "Creating bucket $BUCKET ..."
  aws s3api create-bucket --bucket "$BUCKET" --endpoint-url "$ENDPOINT" >/dev/null
fi

POLICY=$(cat <<EOF
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::${BUCKET}/*"]}]}
EOF
)
aws s3api put-bucket-policy --bucket "$BUCKET" --policy "$POLICY" --endpoint-url "$ENDPOINT"

for key in room-1.jpg room-2.jpg; do
  file="$ROOT/seed/$key"
  if [[ ! -f "$file" ]]; then
    echo "Missing image: $file" >&2
    exit 1
  fi
  echo "Uploading $key ..."
  aws s3 cp "$file" "s3://$BUCKET/$key" --content-type image/jpeg --endpoint-url "$ENDPOINT"
done

URL1="$ENDPOINT/$BUCKET/room-1.jpg"
URL2="$ENDPOINT/$BUCKET/room-2.jpg"
SQL="UPDATE rooms SET image_url = CASE id WHEN 1 THEN '$URL1' WHEN 2 THEN '$URL2' ELSE image_url END WHERE id IN (1, 2);"

echo "Updating Postgres rooms.image_url ..."
docker exec relational-database-server \
  psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -c "$SQL"

echo "Done."
echo "  $URL1"
echo "  $URL2"
echo "Check: curl -s http://localhost/api/rooms | head"
