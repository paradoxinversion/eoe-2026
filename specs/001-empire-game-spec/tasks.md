# Implementation Tasks: Empire of Evil (001-empire-game-spec)

## Phase 1 — Setup

- [x] T001 [P] Create frontend package and bootstrap Vite + React + TypeScript (frontend/package.json)
- [x] T002 [P] Add core dependencies to `frontend/package.json` (react, vite, typescript, MUI, idb, vitest, testing libs)
- [x] T003 [P] Create entry files `frontend/src/main.tsx` and `frontend/src/App.tsx` with React root and router placeholder
- [x] T004 [P] Create `frontend/tsconfig.json` and `frontend/vite.config.ts`

## Phase 2 — Foundational

- [x] T005 Implement typed config schema and types in `frontend/src/config/schema.ts` (frontend/src/config/schema.ts)
- [x] T006 Implement persistence service `frontend/src/services/persistence.ts` (IndexedDB wrapper using `idb`) with methods: `saveConfig`, `loadConfig`, `listConfigs`, `deleteConfig` (frontend/src/services/persistence.ts)
- [x] T007 Add autosave hook `frontend/src/hooks/useAutosave.ts` implementing `autosave_interval_seconds` (frontend/src/hooks/useAutosave.ts)
- [x] T008 Create `specs/001-empire-game-spec/contracts/indexeddb-schema.json` (verify existing) and reference it from `frontend/src/services/persistence.ts` (specs/001-empire-game-spec/contracts/indexeddb-schema.json)
- [x] T009 Create typed config examples under `specs/001-empire-game-spec/configs/default.json` (specs/001-empire-game-spec/configs/default.json)

## Phase 3 — User Story Phases

### User Story 1 - Core Turn Loop (Priority: P1)

- [x] T010 [US1] Implement seeded RNG utility `frontend/src/lib/rng.ts` supporting deterministic seeds (frontend/src/lib/rng.ts)
- [x] T011 [US1] Implement core turn resolution service `frontend/src/services/turn.ts` with deterministic execution hooks (frontend/src/services/turn.ts)
- [x] T012 [US1] Implement Dashboard UI skeleton `frontend/src/pages/Dashboard.tsx` showing resources and plots (frontend/src/pages/Dashboard.tsx)
- [x] T013 [P] [US1] Implement `End Day` control `frontend/src/components/EndDayButton.tsx` that calls turn resolution (frontend/src/components/EndDayButton.tsx)
- [x] T014 [US1] Add unit tests for turn resolution and seeded runs `tests/unit/turn.test.ts` (tests/unit/turn.test.ts)

### User Story 2 - Procedural World Creation (Priority: P2)

- [x] T015 [US2] Implement world generation service `frontend/src/services/generation.ts` accepting a `seed` and returning deterministic world JSON (frontend/src/services/generation.ts)
- [x] T016 [US2] Add generation unit tests `tests/unit/generation.test.ts` to validate seed determinism (tests/unit/generation.test.ts)
- [x] T017 [P] [US2] Create simple Zone and Person model files `frontend/src/models/zone.ts` and `frontend/src/models/person.ts` (frontend/src/models/zone.ts, frontend/src/models/person.ts)

- ### User Story 3 - Agents, Roles, and Technologies (Priority: P3)

- [x] T018 [US3] Implement `Agent` model and `ScienceProject` model in `frontend/src/models/agent.ts` and `frontend/src/models/scienceProject.ts` (frontend/src/models/agent.ts, frontend/src/models/scienceProject.ts)
- [x] T019 [US3] Implement science accumulation service `frontend/src/services/science.ts` and ensure up-front reservation behavior (frontend/src/services/science.ts)
- [x] T020 [US3] Add unit/integration tests for Science Project reservation and integration (`tests/unit/science.test.ts` and `tests/integration/turn.science.integration.test.ts`)

## Phase 4 — Options Page, Load Modal & Persistence UX

- [x] T021 Implement MUI-based Options Page `frontend/src/pages/OptionsPage.tsx` bound to the config schema and `save as` behavior
- [x] T022 Implement Title Page `frontend/src/pages/TitlePage.tsx` with `New Game`, `Load Game`, and `Options` buttons
- [x] T023 Implement Load Modal component `frontend/src/components/LoadModal.tsx` with `Saved` and `Import` tabs and keyboard accessibility
- [x] T024 Implement Export/Import handlers `frontend/src/services/importExport.ts` and wire to UI
- [x] T025 Add integration tests for persistence flows (`tests/integration/persistence.test.ts` and `tests/integration/persistence.e2e.test.ts`)

## Phase 5 — Deterministic Integration, Performance & CI

- [x] T026 Implement integration test harness `tests/integration/seeded-harness.ts` to run deterministic scenarios
- [x] T027 Add performance smoke tests `tests/perf/turn-latency.test.ts` and recording
- [x] T028 Create CI workflow `.github/workflows/ci.yml` implementing jobs: `lint`, `unit-tests`, `integration-deterministic`, `export-import`, `performance-smoke`, `build`
- [x] T029 Add npm scripts in `frontend/package.json` for `dev`, `build`, `test:unit`, `test:integration`, `test:perf`, and `lint`

- [x] T033 Run full integration suite (including `persistence.e2e.test.ts`) in CI and verify results
- [x] T034 Investigate and fix CI artifact upload/download (404 on artifact retrieval)
- [x] T035 Add CI debug step to print artifacts directory contents and upload logs
- [x] T036 Open PR for `001-empire-game-spec` with summary and tests attached

## Post-merge Notes

- **Merged:** The `001-empire-game-spec` feature branch has been merged into `main` on 2026-01-18.
- **Artifacts & CI:** CI runs for the branch completed; test artifacts were uploaded and verified. A temporary CI debug step was added to help diagnose artifact uploads — consider removing it after monitoring one more successful run.
- **Next steps (suggested):**
    - Create a short developer quickstart in `specs/001-empire-game-spec/README.md`.
    - Run an ESLint/Prettier pass and open a follow-up PR with formatting fixes if needed.
    - Triage and address accessibility issues for `OptionsPage` and `LoadModal` (audit results and fixes).
    - Remove the temporary CI debug step from `.github/workflows/ci.yml` once artifacts are stable.

Marking this tasks file as reflecting the current project state; opening a branch with this update for review.

## Final Phase — Polish & Cross-Cutting Concerns

- [x] T030 [P] Add ESLint/Prettier configs and run formatters on created files
- [ ] T031 [P] Document developer quickstart and acceptance test runbook in `specs/001-empire-game-spec/README.md`
- [ ] T032 [P] Perform accessibility audit on Options Page and Load Modal and fix issues (reports in `specs/001-empire-game-spec/accessibility.md`)
