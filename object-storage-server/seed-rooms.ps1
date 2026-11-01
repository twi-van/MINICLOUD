$ErrorActionPreference = 'Stop'

$bucket = if ($env:MINIO_BUCKET) { $env:MINIO_BUCKET } else { 'rooms-images' }
$avatarBucket = if ($env:MINIO_AVATAR_BUCKET) { $env:MINIO_AVATAR_BUCKET } else { 'profile-pics' }
$endpoint = if ($env:MINIO_ENDPOINT) { $env:MINIO_ENDPOINT } else { 'http://localhost:9000' }
$publicBaseUrl = if ($env:PUBLIC_MINIO_BASE_URL) { $env:PUBLIC_MINIO_BASE_URL } else { $endpoint }
$accessKey = if ($env:MINIO_ROOT_USER) { $env:MINIO_ROOT_USER } else { 'minioadmin' }
$secretKey = if ($env:MINIO_ROOT_PASSWORD) { $env:MINIO_ROOT_PASSWORD } else { 'minioadmin' }
$migrationFile = Join-Path $PSScriptRoot '..\relational-database-server\init\004_parity_rooms_bookings.sql'

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
$existingBuckets = $bucketList -split '\s+'

foreach ($b in @($bucket, $avatarBucket)) {
    if ($existingBuckets -notcontains $b) {
        & aws s3api create-bucket --bucket $b --endpoint-url $endpoint | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Could not create bucket $b." }
    }
    $policy = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::' + $b + '/*"]}]}'
    $policyFile = Join-Path ([System.IO.Path]::GetTempPath()) "minio-policy-$b.json"
    [System.IO.File]::WriteAllText($policyFile, $policy, (New-Object System.Text.UTF8Encoding($false)))
    & aws s3api put-bucket-policy --bucket $b --policy "file://$policyFile" --endpoint-url $endpoint
    Remove-Item -LiteralPath $policyFile -Force -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -ne 0) { throw "Could not enable public read for $b." }
}

foreach ($key in @('room-1.jpg', 'room-2.jpg', 'room-3.jpg', 'room-4.jpg', 'room-5.jpg', 'room-6.jpg')) {
    $file = Join-Path $PSScriptRoot "seed/$key"
    if (-not (Test-Path -LiteralPath $file)) { throw "Missing image: $file" }
    & aws s3 cp $file "s3://$bucket/$key" --content-type image/jpeg --endpoint-url $endpoint
    if ($LASTEXITCODE -ne 0) { throw "Could not upload $key." }
}

$avatarFile = Join-Path $PSScriptRoot 'seed/avatar-demo.jpg'
if (Test-Path -LiteralPath $avatarFile) {
    & aws s3 cp $avatarFile "s3://$avatarBucket/avatar-demo.jpg" --content-type image/jpeg --endpoint-url $endpoint
    if ($LASTEXITCODE -ne 0) { throw "Could not upload avatar-demo.jpg." }
}

if (Test-Path -LiteralPath $migrationFile) {
    & docker cp $migrationFile relational-database-server:/tmp/004_parity_rooms_bookings.sql
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not copy migration file into relational-database-server.'
    }
    & docker exec relational-database-server psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -f /tmp/004_parity_rooms_bookings.sql
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not apply 004_parity_rooms_bookings.sql. Ensure the relational-database-server container is running.'
    }
}

if ($publicBaseUrl -ne 'http://localhost:9000') {
    $sql = "UPDATE rooms SET image_url = replace(image_url, 'http://localhost:9000/rooms-images/', '$publicBaseUrl/$bucket/'); UPDATE users SET avatar_url = '$publicBaseUrl/$avatarBucket/avatar-demo.jpg' WHERE email = 'demo@minicloud.local';"
    & docker exec relational-database-server psql -v ON_ERROR_STOP=1 -U minicloud -d minicloud -c $sql
    if ($LASTEXITCODE -ne 0) {
        throw 'Could not update custom public MinIO URLs in Postgres.'
    }
}

Write-Host "Uploaded room-1.jpg .. room-6.jpg to $bucket, avatar-demo.jpg to $avatarBucket, and synced 8 rooms + bookings in Postgres."
