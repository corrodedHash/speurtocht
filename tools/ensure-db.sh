#!/usr/bin/env bash
set -euo pipefail

if ! command -v pg_isready &>/dev/null; then
  echo "pg_isready not found — skipping Postgres health check."
  exit 0
fi
if ! pg_isready -h localhost -p 5432 -q 2>/dev/null; then
  echo "No PostgreSQL found on localhost:5432, starting temporary container..."
  docker run --rm -d --name sj-postgres-ensure \
    -e POSTGRES_USER=user \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=schnitzeljagd \
    -p 5432:5432 postgres:16
  echo "Waiting for PostgreSQL to be ready..."
  for i in $(seq 1 30); do
    if pg_isready -h localhost -p 5432 -q 2>/dev/null; then
      echo "PostgreSQL is ready."
      break
    fi
    sleep 1
  done
else
  echo "PostgreSQL already running on localhost:5432."
fi
