# Quickstart — Migration & Local Testing

This quickstart explains minimal steps to run migration dry-runs, validate schemas, and exercise persistence tests locally.

Prerequisites

- Node 18+ and the repository's package manager installed (`npm`, `pnpm`, or `yarn`).
- Developer shell in the repository root.

Quick steps

1. Run the dev/test setup (install dependencies):

```bash
npm install
# or pnpm install
```

2. Run unit and integration tests (Vitest):

```bash
npm test
# or pnpm test
```

3. Validate JSON schemas (optional): use a JSON schema validator against files in `specs/001-rework-data-models/contracts/`.

4. Migration dry-run (manual import):

- The migration tool will be implemented at `frontend/src/services/migration.ts`. For now, run the test-suite migration harness which exercises transform rules against fixtures.

5. Representative fixtures: place saved-game fixtures under `specs/001-rework-data-models/fixtures/` (recommended >=20 samples). See `specs/001-rework-data-models/research.md` for fixture expectations.

Notes

- The migration tool is designed to be non-destructive by default (dry-run). Always review the generated migration report before applying changes.
- CI will run migration tests and performance benchmarks; ensure local runs pass before opening PRs.

Repository rule: tasks.md validation

- After completing any implementation task, update the feature `tasks.md` in the feature spec directory and ensure it is free of duplicates and correctly formatted. A pre-commit hook validates `specs/*/tasks.md` and will block commits if duplicate task IDs or formatting issues are found. Run `node scripts/validate-tasks.js` to check locally.
