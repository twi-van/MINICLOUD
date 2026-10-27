$ErrorActionPreference = 'Stop'

$bucket = 'rooms-images'
$endpoint = 'http://localhost:9000'
$accessKey = if ($env:MINIO_ROOT_USER) { $env:MINIO_ROOT_USER } else { 'minioadmin' }
$secretKey = if ($env:MINIO_ROOT_PASSWORD) { $env:MINIO_ROOT_PASSWORD } else { 'minioadmin' }

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    throw 'AWS CLI is required. Install it, then rerun this script.'
}

$env:AWS_ACCESS_KEY_ID = $accessKey
$env:AWS_SECRET_ACCESS_KEY = $secretKey
$env:AWS_DEFAULT_REGION = 'us-east-1'

$bucketList = & aws s3api list-buckets --endpoint-url $endpoint --query 'Buckets[].Name' --output text
if ($LASTEXITCODE -ne 0) {
    throw "Cannot connect to MinIO at $endpoint. Start the MinIO service first."
}
if (($bucketList -split '\s+') -notcontains $bucket) {
    & aws s3api create-bucket --bucket $bucket --endpoint-url $endpoint | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Could not create bucket $bucket." }
}

$policy = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::' + $bucket + '/*"]}]}'
& aws s3api put-bucket-policy --bucket $bucket --policy $policy --endpoint-url $endpoint
if ($LASTEXITCODE -ne 0) { throw "Could not enable public read for $bucket." }

foreach ($key in @('room-1.jpg', 'room-2.jpg')) {
    $file = Join-Path $PSScriptRoot "seed/$key"
    if (-not (Test-Path -LiteralPath $file)) { throw "Missing image: $file" }
    & aws s3 cp $file "s3://$bucket/$key" --content-type image/jpeg --endpoint-url $endpoint
    if ($LASTEXITCODE -ne 0) { throw "Could not upload $key." }
}

$sql = "UPDATE rooms SET image_url = CASE id WHEN 1 THEN 'http://localhost:9000/$bucket/room-1.jpg' WHEN 2 THEN 'http://localhost:9000/$bucket/room-2.jpg' ELSE image_url END WHERE id IN (1, 2);"
& docker exec relational-database-server psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -c $sql
if ($LASTEXITCODE -ne 0) {
    throw 'Could not update room image URLs. Ensure the relational-database-server container is running.'
}

Write-Host "Uploaded demo room images to $bucket and updated rooms 1 and 2."
