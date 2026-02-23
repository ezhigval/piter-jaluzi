#!/bin/sh
set -e

: "${BACKEND_PORT:=8080}"
: "${PORT:=3000}"

export API_BASE_URL="http://127.0.0.1:${BACKEND_PORT}"

./server &

cd /app/web

export HOSTNAME=0.0.0.0

node server.js
