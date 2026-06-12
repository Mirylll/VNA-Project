#!/bin/bash
# Restore data from dump-data.sql
# Requires: Docker containers running
#
# Usage: bash scripts/restore-db.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DUMP_FILE="$SCRIPT_DIR/dump-data.sql"

if [ ! -f "$DUMP_FILE" ]; then
  echo "❌ File not found: $DUMP_FILE"
  exit 1
fi

echo "Restoring database from dump-data.sql..."
docker exec -i vna-postgres psql -U vna_user vna_db --set=ON_ERROR_STOP=1 < "$DUMP_FILE"
echo "✅ Database restored successfully"
