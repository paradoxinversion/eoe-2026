# Quickstart — Migration & Local Testing

This quickstart contains the exact commands and sequence for running migration dry-runs, validating fixtures, and applying migrations locally.

Prerequisites

- Node 18+ and `npm` available.
- A working shell at the repository root.

Install dependencies

```bash
# from repo root
cd frontend
npm ci
cd -
```

Run tests

```bash
# unit
cd frontend && npm run test:unit
# integration
cd frontend && npm run test:integration
# accessibility
cd frontend && npm run test:a11y
```

Migration dry-run (produce reviewable reports)

1. Back up existing fixtures (recommended):

```bash
cd specs/001-rework-data-models
TS=$(date +%Y%m%d%H%M%S)
cp -R fixtures "fixtures-backup-$TS"
cd -
```

2. Run the migration exporter in dry-run mode (writes reports to `specs/001-rework-data-models/migration-reports/`):

```bash
# from repo root
APPLY=0 ./scripts/migrate-fixtures.sh
```

3. Inspect reports:

```bash
ls -la specs/001-rework-data-models/migration-reports
jq . specs/001-rework-data-models/migration-reports/fixture-01-small-report.json | less
```

Apply migrations (destructive — only when reviewed)

```bash
# backup first (see above), then:
APPLY=1 ./scripts/migrate-fixtures.sh
# Applied fixtures are written to specs/001-rework-data-models/migration-applied/
```

Fixture verification

- Validate fixtures against JSON schemas in `specs/001-rework-data-models/contracts/` (use your preferred JSON schema validator).
- Run `node scripts/verify-fixtures.js` if provided; otherwise use `ajv` or `ajv-cli`.

CI notes

- CI runs the migration exporter and uploads `migration-reports` as artifacts for review. The perf step is guarded and will only run when perf tests exist.
- If you change migration behavior, add or update integration tests under `frontend/tests/integration/` and ensure the migration exporter test (`migration.exporter.test.ts`) still passes.

Repository hygiene

- Update `specs/001-rework-data-models/tasks.md` after completing implementation tasks and run the validator:

```bash
node scripts/validate-tasks.js specs/001-rework-data-models/tasks.md
```

- Avoid committing generated `migration-reports/` — CI will publish them as artifacts. Commit curated samples only under `specs/001-rework-data-models/migration-reports-committed/`.

Troubleshooting

- If the exporter step fails in CI but passes locally, check for environment differences (node version, installed binaries). Use `gh run view <run-id>` to fetch run details and download artifacts with `gh run download` for investigation.

Contact

- If unsure, open a PR and request review; CI will attach migration reports as artifacts for reviewers.
