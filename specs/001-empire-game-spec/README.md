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
