#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
FIXTURES_DIR="$ROOT_DIR/fixtures"
CONTRACTS_DIR="$ROOT_DIR/contracts"
REPORT_DIR="$ROOT_DIR/verify-reports"

APPLY_FIXES=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --report-dir)
      REPORT_DIR="$2"; shift 2;;
    --apply-fixes|--fix)
      APPLY_FIXES=1; shift;;
    --report-dir=*)
      REPORT_DIR="${1#*=}"; shift;;
    --help|-h)
      echo "Usage: verify-fixtures.sh [--report-dir=path]"; exit 0;;
    *)
      echo "Unknown arg: $1"; exit 2;;
  esac
done

mkdir -p "$REPORT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "node is required"; exit 2
fi

if [ "$APPLY_FIXES" -eq 1 ]; then
  node "$ROOT_DIR/scripts/verify-fixtures.js" "$FIXTURES_DIR" "$CONTRACTS_DIR" --report-dir="$REPORT_DIR" --apply-fixes
else
  node "$ROOT_DIR/scripts/verify-fixtures.js" "$FIXTURES_DIR" "$CONTRACTS_DIR" --report-dir="$REPORT_DIR"
fi
