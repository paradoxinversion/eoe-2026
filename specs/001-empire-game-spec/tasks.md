# Implementation Tasks: Empire of Evil (001-empire-game-spec)

## Phase 1 — Setup

- [ ] T001 [P] Create `frontend/package.json` and bootstrap Vite + React + TypeScript project in `frontend/` (frontend/package.json)
- [ ] T002 [P] Add dependencies to `frontend/package.json`: `react`, `react-dom`, `typescript`, `vite`, `@mui/material`, `@emotion/react`, `@emotion/styled`, `idb`, `vitest`, `@testing-library/react` (frontend/package.json)
- [ ] T003 [P] Create entry files `frontend/src/main.tsx` and `frontend/src/App.tsx` with React root and router placeholder (frontend/src/main.tsx, frontend/src/App.tsx)
- [ ] T004 Create `frontend/tsconfig.json` and `frontend/vite.config.ts` (frontend/tsconfig.json, frontend/vite.config.ts)

## Phase 2 — Foundational

- [ ] T005 Implement typed config schema and types in `frontend/src/config/schema.ts` (frontend/src/config/schema.ts)
- [ ] T006 Implement persistence service `frontend/src/services/persistence.ts` (IndexedDB wrapper using `idb`) with methods: `saveConfig`, `loadConfig`, `listConfigs`, `deleteConfig` (frontend/src/services/persistence.ts)
- [ ] T007 Add autosave hook `frontend/src/hooks/useAutosave.ts` implementing `autosave_interval_seconds` (frontend/src/hooks/useAutosave.ts)
- [ ] T008 Create `specs/001-empire-game-spec/contracts/indexeddb-schema.json` (verify existing) and reference it from `frontend/src/services/persistence.ts` (specs/001-empire-game-spec/contracts/indexeddb-schema.json)
- [ ] T009 Create typed config examples under `specs/001-empire-game-spec/configs/default.json` (specs/001-empire-game-spec/configs/default.json)

## Phase 3 — User Story Phases

### User Story 1 - Core Turn Loop (Priority: P1)

- [ ] T010 [US1] Implement seeded RNG utility `frontend/src/lib/rng.ts` supporting deterministic seeds (frontend/src/lib/rng.ts)
- [ ] T011 [US1] Implement core turn resolution service `frontend/src/services/turn.ts` with deterministic execution hooks (frontend/src/services/turn.ts)
- [ ] T012 [US1] Implement Dashboard UI skeleton `frontend/src/pages/Dashboard.tsx` showing resources and plots (frontend/src/pages/Dashboard.tsx)
- [ ] T013 [P] [US1] Implement `End Day` control `frontend/src/components/EndDayButton.tsx` that calls turn resolution (frontend/src/components/EndDayButton.tsx)
- [ ] T014 [US1] Add unit tests for turn resolution and seeded runs `tests/unit/turn.test.ts` (tests/unit/turn.test.ts)

### User Story 2 - Procedural World Creation (Priority: P2)

- [ ] T015 [US2] Implement world generation service `frontend/src/services/generation.ts` accepting a `seed` and returning deterministic world JSON (frontend/src/services/generation.ts)
- [ ] T016 [US2] Add generation unit tests `tests/unit/generation.test.ts` to validate seed determinism (tests/unit/generation.test.ts)
- [ ] T017 [P] [US2] Create simple Zone and Person model files `frontend/src/models/zone.ts` and `frontend/src/models/person.ts` (frontend/src/models/zone.ts, frontend/src/models/person.ts)

### User Story 3 - Agents, Roles, and Technologies (Priority: P3)

- [ ] T018 [US3] Implement `Agent` model and `ScienceProject` model in `frontend/src/models/agent.ts` and `frontend/src/models/scienceProject.ts` (frontend/src/models/agent.ts, frontend/src/models/scienceProject.ts)
- [ ] T019 [US3] Implement science accumulation service `frontend/src/services/science.ts` and ensure up-front reservation behavior (frontend/src/services/science.ts)
- [ ] T020 [US3] Add unit tests for Science Project reservation `tests/unit/science.test.ts` (tests/unit/science.test.ts)

## Phase 4 — Options Page, Load Modal & Persistence UX

- [ ] T021 Implement MUI-based Options Page `frontend/src/pages/OptionsPage.tsx` bound to the config schema and `save as` behavior (frontend/src/pages/OptionsPage.tsx)
- [ ] T022 Implement Title Page `frontend/src/pages/TitlePage.tsx` with `New Game`, `Load Game`, and `Options` buttons (frontend/src/pages/TitlePage.tsx)
- [ ] T023 Implement Load Modal component `frontend/src/components/LoadModal.tsx` with `Saved` and `Import` tabs and keyboard accessibility (frontend/src/components/LoadModal.tsx)
- [ ] T024 Implement Export/Import handlers `frontend/src/services/importExport.ts` and wire to UI (frontend/src/services/importExport.ts)
- [ ] T025 Add integration tests for persistence flows `tests/integration/persistence.test.ts` (tests/integration/persistence.test.ts)

## Phase 5 — Deterministic Integration, Performance & CI

- [ ] T026 Implement integration test harness `tests/integration/seeded-harness.ts` to run deterministic scenarios (tests/integration/seeded-harness.ts)
- [ ] T027 Add performance smoke tests `tests/perf/turn-latency.test.ts` and recording (tests/perf/turn-latency.test.ts)
- [ ] T028 Create CI workflow `.github/workflows/ci.yml` implementing jobs: `lint`, `unit-tests`, `integration-deterministic`, `export-import`, `performance-smoke`, `build` (.github/workflows/ci.yml)
- [ ] T029 Add npm scripts in `frontend/package.json` for `dev`, `build`, `test:unit`, `test:integration`, `test:perf`, and `lint` (frontend/package.json)

## Final Phase — Polish & Cross-Cutting Concerns

- [ ] T030 [P] Add ESLint/Prettier configs and run formatters on created files (frontend/.eslintrc.cjs, frontend/.prettierrc)
- [ ] T031 [P] Document developer quickstart and acceptance test runbook in `specs/001-empire-game-spec/README.md` (specs/001-empire-game-spec/README.md)
- [ ] T032 [P] Perform accessibility audit on Options Page and Load Modal and fix issues (reports in specs/001-empire-game-spec/accessibility.md)
