# Implementation Tasks: UI Refresh — Dashboard Simplification

Phase 1: Setup

- [x] T001 [P] Create theme tokens module in frontend/src/theme/tokens.ts
- [x] T002 [P] Add theme entrypoint and exports in frontend/src/theme/index.ts
- [x] T003 Initialize visual snapshot baseline folder at specs/002-ui-refresh-dashboard/visual-baseline/

Phase 2: Foundational (blocking prerequisites)

- [x] T004 Implement basic `ThemeTokens` values (dark + light) in frontend/src/theme/tokens.ts
- [x] T005 Integrate tokens into existing ThemeProvider in frontend/src/theme/index.ts and update provider usage in frontend/src/main.tsx
- [x] T006 [P] Add persistence key/handler for `themeMode` in frontend/src/services/persistence.ts (or extend existing persistence calls) and docs in specs/002-ui-refresh-dashboard/quickstart.md

Phase 3: User Story Phases (priority order)

**User Story 1 — Simplified Main Dashboard (Priority: P1)**

- [x] T007 [US1] Create new Dashboard Main layout component skeleton in frontend/src/pages/Dashboard/MainLayout.tsx
- [x] T008 [US1] Implement header area showing player name and day/turn in frontend/src/pages/Dashboard/MainLayout.tsx
- [x] T009 [US1] Implement three primary metric cards in frontend/src/pages/Dashboard/MetricCard.tsx and import into MainLayout
- [x] T010 [US1] Ensure End Turn control is prominent and wired to existing `advanceTurn()` in frontend/src/pages/Dashboard/MainLayout.tsx
- [ ] T011 [US1] Add unit tests for MainLayout and MetricCard in frontend/tests/unit/dashboard.main.test.tsx
- [ ] T012 [US1] Add integration test that simulates End Turn and asserts state advance in frontend/tests/integration/turns.dashboard.integration.test.ts
- [x] T011 [US1] Add unit tests for MainLayout and MetricCard in frontend/tests/unit/dashboard.main.test.tsx
- [x] T012 [US1] Add integration test that simulates End Turn and asserts state advance in frontend/tests/integration/turns.dashboard.integration.test.ts

**User Story 2 — Theme tokens & visual polish (Priority: P2)**

- [ ] T013 [US2] Add Settings toggle UI to modify `themeMode` in frontend/src/pages/Settings/ThemeToggle.tsx
- [ ] T014 [US2] Persist theme selection and add test to verify persistence in frontend/tests/integration/theme.persistence.test.ts
- [x] T013 [US2] Add Settings toggle UI to modify `themeMode` in frontend/src/pages/Settings/ThemeToggle.tsx
- [x] T014 [US2] Persist theme selection and add test to verify persistence in frontend/tests/integration/theme.persistence.test.ts
- [ ] T015 [US2] Create visual snapshot tests for Dashboard Main (desktop/tablet/mobile) under frontend/tests/visual/dashboard.main.snap.test.ts
- [x] T015 [US2] Create visual snapshot tests for Dashboard Main (desktop/tablet/mobile) under frontend/tests/visual/dashboard.main.snap.test.tsx
- [ ] T016 [US2] Run axe accessibility checks for updated pages and fix any WCAG 2.1 AA violations; add smoke checks in frontend/tests/a11y/dashboard.a11y.test.ts
- [x] T016 [US2] Run axe accessibility checks for updated pages and fix any WCAG 2.1 AA violations; add smoke checks in frontend/tests/a11y/dashboard.a11y.test.ts

**User Story 3 — Advanced controls relocated (Priority: P3)**

- [ ] T017 [US3] Design and implement Advanced Controls panel component in frontend/src/components/AdvancedPanel.tsx
- [ ] T018 [US3] Add a clearly labeled toggle/button in MainLayout to open the Advanced panel (frontend/src/pages/Dashboard/MainLayout.tsx)
- [ ] T019 [US3] Add tests for AdvancedPanel accessibility and keyboard interaction in frontend/tests/unit/advanced.panel.test.tsx

Final Phase: Polish & Cross-Cutting Concerns

- [x] T020 Update `specs/002-ui-refresh-dashboard/quickstart.md` with developer steps and visual baseline instructions (file exists; update if needed)
- [ ] T021 Add/adjust perf benchmark(s) in frontend/tests/perf to validate End Turn UI latency and compare against `tests_output/` baseline
- [ ] T022 Generate visual baseline screenshots into specs/002-ui-refresh-dashboard/visual-baseline/ and commit them
- [ ] T023 Run full test suites locally and document results in specs/002-ui-refresh-dashboard/README.md
- [ ] T024 Open PR from branch `002-ui-refresh-dashboard` with link to this tasks file and request review

Dependencies

- Stories should be implemented in priority order: US1 → US2 → US3.
- Tasks marked `[P]` can be worked on in parallel (touch different files or independent modules).

Parallel Execution Examples

- Example 1: While `T004` (tokens) and `T005` (ThemeProvider integration) are in progress, a teammate can implement `T007` (MainLayout skeleton) and `T009` (MetricCard) in parallel because the MainLayout can consume placeholder tokens.
- Example 2: `T013` (Settings toggle) and `T017` (AdvancedPanel) can be implemented in parallel since they touch different components.

Implementation Strategy

- MVP: Deliver `US1` first with minimal theme tokens (dark defaults) so the simplified Main is usable and testable. Then deliver `US2` (theme toggle + persistence) and finally `US3` (Advanced panel).
- Incremental delivery: Each story phase produces a self-contained, testable increment: rendering + tests + a11y checks + snapshot.

- Task numbering and labels follow the project checklist format and reference concrete file paths so each task is independently implementable by an LLM or developer.
