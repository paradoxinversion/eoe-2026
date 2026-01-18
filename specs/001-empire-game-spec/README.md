# Empire of Evil — Developer Quickstart & Acceptance Runbook

This quickstart explains how to set up the local workspace, run the key test suites (unit, deterministic integration, accessibility), and reproduce deterministic scenarios used by the project.

Prerequisites

- Node 22.x (recommended 22.16.0) via `nvm`
- npm (bundled with Node) or compatible package manager
- Git and the `gh` CLI (optional, for PR/workflow inspection)

Repository layout (relevant)

- `frontend/` — Vite + React frontend, source under `frontend/src`
- `specs/001-empire-game-spec/` — feature spec & quickstart
- `tests/` and `frontend/tests/` — test files (unit, integration, a11y, perf)
- `.github/workflows/ci.yml` — CI workflow executed on pushes and PRs

Local setup

1. Use the recommended Node version:

```bash
nvm use 22.16.0
```

2. Install dependencies:

```bash
cd frontend
npm install
```

Development server

```bash
npm run dev
# Open http://localhost:5173
```

Test commands

- Unit tests:

```bash
npm run test:unit
```

- Deterministic integration tests (all integration tests):

```bash
npm run test:integration
```

- Accessibility tests (axe + jsdom):

```bash
npm run test:a11y
```

- Run all test types sequentially:

```bash
npm run test:unit && npm run test:integration && npm run test:a11y
```

Notes on Node test environment

- The integration E2E persistence test uses `fake-indexeddb` to provide IndexedDB globals in Node. Tests that rely on it import `fake-indexeddb/auto` at module load time.
- Accessibility tests run under jsdom; a small canvas polyfill exists at `frontend/tests/setup/a11y-polyfill.ts` to silence jsdom getContext warnings.

Reproducing deterministic scenarios

- Deterministic integration harness: `frontend/tests/integration/seeded-harness.ts`
- To run the seeded harness test file directly:

```bash
npx vitest frontend/tests/integration/seeded-harness.integration.test.ts --run
```

- Recorded deterministic scenarios are in `frontend/tests_output/` (JSON). To replay or inspect seeds, open the scenario JSON files mentioned in that folder.

CI / Workflow

- CI file: `.github/workflows/ci.yml` (runs lint, unit, integration deterministic, export/import, perf smoke, build)
- To trigger CI manually from your machine (requires `gh`):

```bash
gh workflow run ci.yml --ref main
gh run list --workflow=ci.yml --limit 5
gh run view <run-id>
```

Acceptance runbook (quick checklist)

1. Ensure `main` is up-to-date: `git checkout main && git pull`
2. Run unit tests: `npm run test:unit` — expect all unit tests to pass.
3. Run integration tests: `npm run test:integration` — deterministic integration tests should pass consistently when using the test harness seeds.
4. Run a11y tests: `npm run test:a11y` — no detectable accessibility violations.
5. If you change persistence code, run `frontend/tests/integration/persistence.e2e.test.ts` to verify save/load behavior under `fake-indexeddb`.

Where to look for problems

- Failing deterministic tests: check RNG seeds and ensure tests pass when run in isolation (seed-specific behavior). See `frontend/src/lib/rng.ts`.
- Persistence failures in Node: confirm `fake-indexeddb/auto` is required before persistence modules are imported.
- a11y warnings: see `frontend/tests/setup/a11y-polyfill.ts` and `axe` output in test logs.

Contact / Maintainers

- Open PRs against `main` and request reviews from the frontend maintainers. Use PRs for formatting and lint fixes when running `npm run format`.

This file satisfies T031 in the feature tasks list.

# Empire of Evil — Frontend Quickstart

This quickstart describes how to set up, run tests, and build the frontend POC for the
`001-empire-game-spec` feature.

Prerequisites

- Node.js 22.x (we used 22.16.0)
- npm
- Git and GitHub CLI (`gh`) for CI workflows (optional)

Local setup

1. Clone the repo and switch to `main`:

    cd <repo-root>
    git checkout main
    git pull

2. Install frontend dependencies:

    cd frontend
    npm ci

Running the app (dev)

- Start the Vite dev server:

    npm run dev

Running tests

- Unit tests:

    npm run test:unit

- Integration tests (deterministic harness + E2E persistence):

    npm run test:integration

- Accessibility (a11y) checks:

    npm run test:a11y

Notes on E2E persistence tests

- The Node-based E2E persistence test uses `fake-indexeddb/auto` to provide IndexedDB
  globals in the test process. If tests that import persistence directly fail with
  `IDBRequest is not defined`, ensure `tests/integration/persistence.e2e.test.ts` is importing
  or requiring `fake-indexeddb/auto` before the persistence module is loaded.

Build

- Create a production build:

    npm run build

CI

- The repository contains a GitHub Actions workflow at `.github/workflows/ci.yml` that runs
  unit, integration and accessibility tests and uploads artifacts to the run. To manually
  dispatch the workflow (or to inspect runs):

    gh workflow run ci.yml --ref main
    gh run list --workflow="ci.yml"

Post-merge housekeeping (recommended)

- Remove temporary CI debug steps once artifacts are validated.
- Add a small `specs/001-empire-game-spec/README.md` (this file) and link it from higher-level
  project docs.
- Open follow-up PRs for:
    - ESLint/Prettier pass and formatting fixes
    - Accessibility fixes for `OptionsPage` and `LoadModal`

Where to look

- Key code locations:
    - `frontend/src/services/persistence.ts`
    - `frontend/src/lib/rng.ts`
    - `frontend/src/services/turn.ts`
    - `frontend/src/pages/Dashboard.tsx`
    - Tests under `frontend/tests/*`

If you want, I can open a PR with this quickstart or add an abbreviated version to the repo root.
