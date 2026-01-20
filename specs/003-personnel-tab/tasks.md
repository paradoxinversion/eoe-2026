# Tasks for Personnel Tab

Feature: Personnel Tab (specs/003-personnel-tab/spec.md)

Phase 1: Setup

- [x] T001 [P] Create research notes in specs/003-personnel-tab/research.md
- [x] T002 [P] Create data model doc in specs/003-personnel-tab/data-model.md
- [x] T003 [P] Add JSON contracts in specs/003-personnel-tab/contracts/ (people.schema.json, profile.schema.json)
- [x] T004 [P] Add quickstart in specs/003-personnel-tab/quickstart.md

Phase 2: Foundational (blocking prerequisites)

- [x] T005 Complete frontend service helpers in frontend/src/services/personnelService.ts (intelligenceToConfidence, computeCapacity, reassignment helpers)
- [x] T006 Add persistence adapter for personnel reads/writes in frontend/src/services/personnelPersistence.ts (IndexedDB integration calling frontend/src/services/persistence.ts)
- [x] T007 Add AJV runtime validators for contracts in frontend/src/services/validation/personContracts.ts (use specs/003-personnel-tab/contracts/\*.json)

Phase 3: User Stories (by priority)

US1 — View Personnel Overview (Priority: P1)

- [x] T008 [P] [US1] Implement `CapacityWidgets` component in frontend/src/components/personnel/CapacityWidgets.tsx (shows current count, max capacity, capacity warning state)
- [x] T009 [P] [US1] Implement `AgentTypeChart` component in frontend/src/components/personnel/AgentTypeChart.tsx (circular chart driven by agentTypeSummary service)
- [x] T010 [P] [US1] Wire widgets + chart into frontend/src/components/personnel/PersonnelTab.tsx and ensure data flow from personnelPersistence.ts
- [x] T011 [P] [US1] Unit test frontend/tests/unit/agentTypeSummary.test.ts and frontend/tests/unit/capacity.widgets.test.ts for widget logic and chart data
- [x] T012 [P] [US1] Integration test frontend/tests/integration/personnel.overview.integration.test.ts validating widget values and chart segments render correctly (uses mocked/persisted fixture)
- [ ] T025 [P] [US1] Smoke integration: verify `PersonnelTab` mounts via app navigation and renders CapacityWidgets, AgentTypeChart, and Profile when the Personnel tab is opened (add `frontend/tests/integration/personnel.open.integration.test.ts`)

US2 — Browse and Focus Agent (Priority: P1)

- [x] T013 [P] [US2] Finalize `AgentList` in frontend/src/components/personnel/AgentList.tsx: add Focus button, keyboard/ARIA support, and visual focus state
- [x] T014 [P] [US2] Add `Focus` action wiring in frontend/src/components/personnel/PersonnelTab.tsx to load Profile when an Agent is focused
- [x] T015 [P] [US2] Add unit tests frontend/tests/unit/agentList.focus.test.tsx and frontend/tests/unit/personnel.focus.state.test.tsx
- [x] T016 [P] [US2] Integration test frontend/tests/integration/personnel.focus.integration.test.ts for clicking/keyboard focusing and Profile loading
- [x] T017 [P] [US2] Accessibility tests frontend/tests/accessibility/personnel.a11y.test.tsx covering tab order and ARIA labels for rows and focus actions

US3 — Profile for Agents and People (Priority: P2)

- [x] T018 [P] [US3] Complete `Profile` component in frontend/src/components/personnel/Profile.tsx to display Agent fields first and person attributes with confidence indicators
- [x] T019 [P] [US3] Implement confidence rendering using frontend/src/services/personnelService.ts (`intelligenceToConfidence`) and ensure Agents show 100% confidence where applicable
- [x] T020 [P] [US3] Unit tests frontend/tests/unit/profile.confidence.test.tsx to validate confidence mapping and conditional field visibility
- [ ] T021 [P] [US3] Integration test frontend/tests/integration/personnel.profile.integration.test.ts verifying Agent profile vs non-agent profile rendering and data accuracy indicators

Final Phase: Polish & Cross-cutting Concerns

- [ ] T022 Update docs and quickstart: ensure specs/003-personnel-tab/quickstart.md references new commands and fixtures
- [ ] T023 Add performance check script scripts/perf/personnel-warm-render.sh and document run steps in README
- [ ] T024 Add CI matrix entry to run `frontend` unit tests and `frontend` a11y tests for this feature (modify .github/workflows/ci.yml or add job entry)

Dependencies

- Foundational tasks T005-T007 MUST be completed before User Story work begins.
- User Story tasks: US1 (T008..T012) and US2 (T013..T017) are independent and can be worked in parallel after foundational tasks complete.
- US3 (T018..T021) depends on at least one of US1 or US2 completing (Profile rendering benefits from Focus wiring and data adapters); treat US3 as subsequent to US1/US2.

Parallel execution examples

- Example 1 (parallel): While one engineer implements `AgentTypeChart` (T009) and its unit tests (T011), another implements `AgentList` focus and ARIA support (T013) and unit tests (T015).
- Example 2 (parallel): The validation and persistence adapter (T006/T007) can be implemented in parallel with Profile UI wiring (T018/T019) as long as mock adapters are used in tests.

Implementation strategy

- MVP scope: Implement T005, T006, T008, T009, T010, T013, T014, T018, T019, and their unit tests (T011, T015, T020). This yields a working Personnel tab with widgets, chart, list, focus, and basic Profile rendering.
- Iterative delivery: Start with services and persistence (T005-T007), then implement overview (US1) and list/focus (US2) in parallel, then finish Profile details (US3), finish integration and a11y tests, and finally polish.

Validation checklist

- Every task above includes a file path for implementation.
- Tasks marked `[P]` are parallelizable by file/module boundaries.

Generated: 2026-01-19
