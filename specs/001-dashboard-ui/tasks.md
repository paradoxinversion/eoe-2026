---
description: "Task list for Dashboard UI feature (001-dashboard-ui)"
---

# Tasks: Dashboard UI (001-dashboard-ui)

**Input**: Design documents from `/specs/001-dashboard-ui/` (spec.md, plan.md, research.md, data-model.md, contracts/)
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

Purpose: Ensure tooling and linters are in place and repository is ready for feature work.

- [x] T001 [P] Verify `frontend` dev scripts and dependencies (`frontend/package.json`) are present and working
- [x] T002 [P] Ensure linting/formatting configured (`.eslintrc`, `prettier`) and run against `frontend/src`

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: Core wiring required before user stories (routing, persistence access patterns).

- [x] T003 Confirm `persistence.ts` API supports storing `preferences.theme` and `preferences.seed` (file: `frontend/src/services/persistence.ts`)
- [x] T004 Ensure `generation.ts` exposes a seed-accepting API and deterministic output contract (file: `frontend/src/services/generation.ts`)
- [x] T005 [P] Add integration smoke test harness for programmatic navigation and generation (tests/integration/new-game.integration.test.ts)

Checkpoint: Foundation ready — user story work may begin

---

## Phase 3: User Story US1 - New Game Flow (Priority: P1) 🎯 MVP

Goal: Title Page `New Game` → Character Generation (name input) → deterministic world generation (blocking modal) → Dashboard Main with player name shown

Independent Test: From Title Page, click `New Game`, enter name, confirm; assert Dashboard Main appears and Player name is present; for a fixed seed, repeated generation returns identical `World` data.

### Tests (write first)

- [x] T010 [P] [US1] Unit: generation deterministicity test (tests/unit/generation.seed.test.ts)
- [x] T011 [x] [US1] Component: `CharacterGeneration` renders and validates name input (tests/unit/characterGeneration.test.tsx)
- [x] T012 [x] [US1] Integration: end-to-end New Game flow (tests/integration/new-game.integration.test.ts)

### Implementation

- [x] T013 [x] [US1] Implement `TitlePage` `New Game` button (frontend/src/pages/TitlePage.tsx) that routes to `CharacterGeneration`
- [x] T014 [x] [US1] Implement `CharacterGeneration` page/component (frontend/src/pages/CharacterGeneration.tsx) with name form and confirm action
- [x] T015 [x] [US1] Implement blocking `LoadModal` usage during generation (frontend/src/components/LoadModal.tsx + CharacterGeneration)
- [x] T016 [x] [US1] Wire generation call to `generation.ts` with seed handling and persist seed to `preferences.seed` via `persistence.ts`
- [x] T017 [x] [US1] Programmatic navigation to Dashboard Main on generation success and display player name (frontend/src/pages/Dashboard/index.tsx)

Checkpoint: US1 functional and testable

---

## Phase 4: User Story US2 - Dashboard & End Turn (Priority: P1)

Goal: Dashboard tabs (Main, Intel, Personnel, Economy, Infirmary, Captives, Settings) and `End Turn` on Main wired to `turn` service

Independent Test: Switch tabs and press `End Turn`; assert visible updates and turn increment.

### Tests

- [x] T020 [x] [US2] Component test for Dashboard tabs (tests/unit/dashboard.tabs.test.tsx)
- [x] T021 [x] [US2] Integration test for End Turn advancing game state (tests/integration/endturn.integration.test.ts)

### Implementation

- [x] T022 [x] [US2] Implement Dashboard tabs wiring (frontend/src/pages/Dashboard/\*)
- [x] T023 [x] [US2] Wire or reuse `EndDayButton.tsx` to call `turn` service (frontend/src/components/EndDayButton.tsx, frontend/src/pages/Dashboard/Main.tsx)

Checkpoint: US2 functional and testable

---

## Phase 5: User Story US3 - Settings & Theme (Priority: P2)

Goal: Add Dark/Light toggle in Settings, default Dark for fresh installs, persist choice in `preferences.theme`

### Tests

- [x] T030 [US3] Unit test for theme persistence (tests/unit/settings.theme.persistence.test.tsx)

### Implementation

- [x] T031 [US3] Implement Settings theme toggle (frontend/src/pages/Dashboard/Settings.tsx) and persist via `persistence.ts`; App now applies persisted theme via MUI ThemeProvider

Checkpoint: US3 functional and testable

---

## Phase 6: Cross-Cutting Concerns & Polish

- [x] T040 [P] Accessibility checks for new controls (tests/accessibility/\*)
- [x] T041 [P] Performance benchmark for generation and worker migration assessment (tests/perf/generation.bench.ts)
- Note: perf artifact written to `tests_output/generation-bench-seed-2026.json`.
- [x] T042 [P] Add or update API contract evidence in `specs/001-dashboard-ui/contracts/openapi.yml`
- Note: API contract added at `specs/001-dashboard-ui/contracts/openapi.yml`.
- [x] T043 [P] Update `quickstart.md` to reflect any new test or dev commands
- Note: quickstart added at `specs/001-dashboard-ui/quickstart.md`.

---

## PR & Governance

- [x] T050 [ ] Open PR with summary, tests, performance notes, constitution check, and request reviewers
- Note: PR opened at https://github.com/paradoxinversion/eoe-2026/pull/7
- [ ] T051 [ ] Update agent context if new tech (e.g., Web Worker) is added (`.specify/scripts/bash/update-agent-context.sh copilot`)

---

## Notes

- Follow test-first: write tests in `tests/` and ensure they fail before implementation where applicable.
- Tasks labeled `[P]` can be worked on in parallel.
- Prioritize P1 tasks (Phases 3 and 4) for the initial merge; Phase 5 and 6 follow.

## Phase 6: Cross-Cutting Concerns & Polish

- [x] T040 [P] Accessibility checks for new controls (tests/accessibility/\*)
- [x] T041 [P] Performance benchmark for generation and worker migration assessment (tests/perf/generation.bench.ts)
- Note: perf artifact written to `tests_output/generation-bench-seed-2026.json`.
- [x] T042 [P] Add or update API contract evidence in `specs/001-dashboard-ui/contracts/openapi.yml`
- Note: API contract added at `specs/001-dashboard-ui/contracts/openapi.yml`.
- [x] T043 [P] Update `quickstart.md` to reflect any new test or dev commands
- Note: quickstart added at `specs/001-dashboard-ui/quickstart.md`.

---

## PR & Governance

- [ ] T050 [ ] Open PR with summary, tests, performance notes, constitution check, and request reviewers
- [ ] T051 [ ] Update agent context if new tech (e.g., Web Worker) is added (`.specify/scripts/bash/update-agent-context.sh copilot`)

---

## Notes

- Follow test-first: write tests in `tests/` and ensure they fail before implementation where applicable.
- Tasks labeled `[P]` can be worked on in parallel.
- Prioritize P1 tasks (Phases 3 and 4) for the initial merge; Phase 5 and 6 follow.
