#!/usr/bin/env bash
# Chạy: bash scripts/demo-smoke.sh
set -euo pipefail

echo "=== /api/hello ==="
curl -s http://localhost/api/hello
echo

echo "=== /api/student ==="
curl -s http://localhost/api/student
echo

echo "=== /student/ ==="
curl -s http://localhost/student/
echo

echo "=== /lb-demo (1) ==="
curl -s http://localhost/lb-demo
echo

echo "=== /lb-demo (2) ==="
curl -s http://localhost/lb-demo
echo
