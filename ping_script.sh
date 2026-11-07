#!/bin/sh
for h in web-frontend-server web-frontend-server-2 application-backend-server-1 application-backend-server-2 relational-database-server authentication-identity-server object-storage-server monitoring-prometheus-server monitoring-grafana-dashboard-server api-gateway-proxy-server internal-dns-server monitoring-node-exporter-server; do
  echo "=== $h ==="
  ping -c 3 $h
  echo ""
done
