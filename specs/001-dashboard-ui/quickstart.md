---
description: Quickstart for feature 001-dashboard-ui
---

# Quickstart — Dashboard UI (001-dashboard-ui)

This document lists the common developer commands to run, test, and generate perf artifacts for the Dashboard UI feature.

Prerequisites:

- Node.js (LTS), npm
- From repo root run commands using the `frontend` prefix (examples below)

Development

- Start dev server:

```bash
npm --prefix frontend run dev
```

Testing

- Run unit tests:

```bash
npm --prefix frontend run test:unit
```

- Run integration tests:

```bash
npm --prefix frontend run test:integration
```

- Run accessibility checks (axe via vitest):

```bash
npm --prefix frontend run test:a11y
```

Performance

- Run perf benchmarks (writes artifacts to `tests_output/`):

```bash
cd frontend
npx --yes vitest tests/perf --run
```

Artifacts

- Perf artifacts produced by the feature are placed in the repository `tests_output/` directory. Current artifact names:
    - `tests_output/generation-bench-seed-2026.json`
    - `tests_output/perf-turn-latency-seed-2026.json`

Committing and pushing

- Commit changes and push branch (example):

```bash
git add -A
git commit -m "feat(dashboard): implement dashboard UI and tests"
git push origin HEAD
```

Notes

- Use the `--prefix frontend` helper to run npm scripts from the repo root.
- Integration tests and perf tests are run locally during development; CI pipelines may run a subset depending on configuration.

# quickstart.md — Dashboard UI

Steps to run the app locally and exercise the New Game flow.

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open browser at `http://localhost:5173` (Vite default) and use the `Title Page` → `New Game` flow.

4. To run tests (unit/integration):

```bash
npm test
```

Notes:

- The `New Game` POST accepts an optional `seed` to reproduce generated worlds. The UI shows a blocking progress modal during generation.
- Theme preferences are persisted locally; default is Dark.
