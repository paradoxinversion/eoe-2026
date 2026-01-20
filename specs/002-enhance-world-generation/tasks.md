# Tasks: Enhance World Generation — Zones, People, Buildings, Orgs

**Input**: Design documents from `specs/002-enhance-world-generation/` (spec.md, plan.md, research.md, data-model.md, debug-schema.json)

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Verify feature plan and spec exist at specs/002-enhance-world-generation/plan.md and specs/002-enhance-world-generation/spec.md
- [x] T002 [P] Confirm `BUILDING_TYPES` export in frontend/src/models/building.ts and document canonical types in specs/002-enhance-world-generation/debug-schema.json
- [x] T003 [P] Confirm generator service exists at frontend/src/services/generation.ts and run basic smoke import in dev (quickstart steps in specs/002-enhance-world-generation/quickstart.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Finalize debug schema at specs/002-enhance-world-generation/debug-schema.json to enumerate `BUILDING_TYPES` and fully describe `Person` attribute/skill shapes
- [x] T005 [P] Finalize data model in specs/002-enhance-world-generation/data-model.md (ensure `Zone` uses `gridX`/`gridY`) and sync with frontend model files under frontend/src/models
- [x] T006 Add a small QA helper script or export in frontend/src/services/generation.ts to return the debug artifact for tests and manual inspection

---

## Phase 3: User Story 1 - Zones and Entities present after generation (Priority: P1) 🎯 MVP

**Goal**: Ensure generation produces Zones partitioning the map and that each Zone contains at least one instance of every configured building type; Entities must be canonical frontend models and maintain referential integrity.

**Independent Test**: Generate with a seed and debug mode; assert Zones > 0, each Zone contains all configured building types, no dangling references, and artifact validates against specs/002-enhance-world-generation/debug-schema.json.

### Tests (write first)

- [x] T007 [P] [US1] Add unit test `tests/unit/generation.entities.test.ts` that validates: per-zone building coverage (SC-001) and zero dangling references (SC-004) using AJV and the debug schema at specs/002-enhance-world-generation/debug-schema.json
- [x] T008 [US1] Add integration test `tests/integration/generation.debug.integration.test.ts` that runs the generator with a fixed seed and asserts deterministic output (SC-002)

### Implementation

- [x] T009 [P] [US1] Ensure model factories/constructors are canonical and exported: `frontend/src/models/person.ts`, `frontend/src/models/building.ts`, `frontend/src/models/zone.ts`, `frontend/src/models/governingOrganization.ts`
- [x] T010 [US1] Implement or finalize generator logic in `frontend/src/services/generation.ts` to: partition map into Zones (gridX/gridY), place at least one of each `BUILDING_TYPES` per Zone, create People and GoverningOrganizations with valid cross-references, and return a debug artifact
- [x] T011 [US1] Add test helper to write the debug artifact to `tests_output/generation-debug-<seed>.json` for manual QA
- [ ] T012 [US1] Add logging of placementErrors into the debug artifact and assert tests record zero placementErrors for default map sizes

---

## Phase 4: User Story 2 - Realistic placement and ownership (Priority: P2)

**Goal**: Improve placement heuristics to cluster buildings around resources and assign GoverningOrganization ownership consistently.

**Independent Test**: Measure average distance from Buildings to nearest resource and verify GoverningOrganization owns multiple Buildings in its region.

### Tests

- [ ] T013 [P] [US2] Add integration test `tests/integration/generation.placement.integration.test.ts` that measures building-to-resource distances and asserts they fall under an agreed threshold for default maps
- [ ] T014 [P] [US2] Add unit test `tests/unit/generation.ownership.test.ts` that verifies GoverningOrganization building ownership counts and referential integrity

### Implementation

- [ ] T015 [US2] Enhance placement algorithm in `frontend/src/services/generation.ts` to prefer tiles near resources when placing buildings
- [ ] T016 [US2] Implement GoverningOrganization creation and building ownership assignment in `frontend/src/services/generation.ts` and ensure `frontend/src/models/governingOrganization.ts` includes required fields
- [ ] T017 [US2] Add optional placement retry/expansion mechanism that expands search radius inside the Zone before logging placementErrors

---

## Phase 5: User Story 3 - Debuggable and reproducible (Priority: P3)

**Goal**: Provide clear debug artifacts, reproducible runs, and easy QA hooks for developers and QA.

**Independent Test**: Running the generator with the same seed reproduces identical debug artifacts and AJV validates schema compliance.

### Tests

- [x] T018 [P] [US3] Add integration test `tests/integration/generation.schema.integration.test.ts` that validates debug artifact against specs/002-enhance-world-generation/debug-schema.json using AJV
- [x] T019 [P] [US3] Add reproducibility test `tests/unit/generation.reproducibility.test.ts` that runs generator N times with same seed and asserts identical outputs

### Implementation

- [ ] T020 [US3] Add a developer-facing QA hook (export or small CLI) in `frontend/src/services/generationDebug.ts` or augment `frontend/src/services/generation.ts` to support `debug: true` and returning the artifact to callers
- [ ] T021 [US3] Update `specs/002-enhance-world-generation/quickstart.md` with exact commands to run the generator and capture artifacts (already present; verify accuracy)

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T022 [P] Documentation update: add usage notes to `specs/002-enhance-world-generation/quickstart.md` and inline README in `frontend/src/services/`
- [ ] T023 [P] Add CI job entry to run new generator tests: update `.github/workflows/` with a job that runs `pnpm test -- tests/integration/generation.*` and schema validation
- [ ] T024 [P] Code cleanup and ensure linting passes for modified files: run project lint configuration and fix issues

---

## Dependencies & Execution Order

- Foundation tasks (T004-T006) must complete before User Story implementation tasks (T009-T021) proceed.
- Tests (T007-T019) are written early and can be implemented in parallel where marked [P].

## Parallel Execution Examples

- While finalizing the debug schema (T004) and data model (T005), implementers can concurrently scaffold tests T007 and T008 and confirm `BUILDING_TYPES` (T002)
- Multiple developers can work in parallel: one on placement heuristics (T015), one on ownership (T016), and one on tests (T013/T014)

## Implementation Strategy (MVP)

1. Complete Phases 1+2 (T001-T006)
2. Implement US1 (T007-T012) and validate independently (MVP)
3. Add US2 (T013-T017) and US3 (T018-T021)
4. Polish, CI, and docs (T022-T024)

---

Generated from: `specs/002-enhance-world-generation/spec.md`, `specs/002-enhance-world-generation/plan.md`, `specs/002-enhance-world-generation/data-model.md`, `specs/002-enhance-world-generation/debug-schema.json`
