#!/usr/bin/env bash
# Run the migration exporter (dry-run by default). Set APPLY=1 to write applied fixtures.
set -euo pipefail
APPLY=${APPLY:-0}
echo "Running migration exporter (APPLY=${APPLY})"
cd "$(dirname "$0")/.." || exit 1
cd frontend || exit 1
if [ "$APPLY" = "1" ]; then
  echo "Applying migrations and writing transformed fixtures..."
else
  echo "Running dry-run migrations and writing reports..."
fi
APPLY=$APPLY npx vitest tests/integration/migration.exporter.test.ts --run
echo "Done. Reports are in specs/001-rework-data-models/migration-reports/"
