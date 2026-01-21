---
description: "Generated task list for Initial Agents & Personnel Screen feature"
---

# Tasks: Initial Agents & Personnel Screen Enhancements

**Input**: Design documents from `/specs/004-initial-agents/`

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create this tasks file at specs/004-initial-agents/tasks.md (repository)
- [ ] T002 [P] Ensure linting and formatting run in CI; update `.github/workflows` or frontend config if missing (frontend/.github or frontend/package.json)
- [ ] T003 [P] Add CI job snippet to run Vitest + Playwright for this feature (frontend/.github/workflows/test.yml)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Implement PRNG wrapper accepting a seed in `frontend/src/lib/rng.ts` and add unit tests in `frontend/tests/unit/rng.test.ts`
- [ ] T005 [P] Implement `NameGenerator` utility in `frontend/src/services/nameGenerator.ts` and unit tests in `frontend/tests/unit/nameGenerator.test.ts`
- [ ] T006 Update `frontend/src/services/generation.ts` to accept an explicit RNG/seed parameter and add unit tests in `frontend/tests/unit/generation.seed.test.ts`
- [x] T007 [P] Validate canonical frontend models used by this feature: review `frontend/src/models/person.ts`, `frontend/src/models/agent.ts`, and `frontend/src/models/zone.ts` and add any lightweight adapters in `frontend/src/models/adapters/` if necessary (add tests in `frontend/tests/unit/models.spec.ts`)

Note: Test-first requirement — all implementation tasks MUST be preceded by authored failing tests (Red). The following test-authoring tasks must be completed before implementing the corresponding modules.

- [ ] T004a Write failing unit tests for the PRNG wrapper in `frontend/tests/unit/rng.test.ts` (these tests should assert deterministic sampling behavior and fail until `frontend/src/lib/rng.ts` is implemented).
- [ ] T005a Write failing unit tests for `NameGenerator` in `frontend/tests/unit/nameGenerator.test.ts` (format + uniqueness tests per spec) and ensure they fail initially.
- [ ] T006a Write failing generation/seed unit tests in `frontend/tests/unit/generation.seed.test.ts` that assert deterministic sampling and seeded reproducibility and fail until `frontend/src/services/generation.ts` is implemented.

---

## Phase 3: User Story 1 - Initialize Player's Agents (Priority: P1) 🎯 MVP

**Goal**: On new-game, initialize the Player's Governing Organization with up to 10 unique Agents sampled from unassigned `Person` records in the Player's starting `Zone`, using the provided RNG/seed.

**Independent Test**: Deterministic generation reproduces the same Agent IDs given the same seed; integration test at `frontend/tests/integration/initial-agents.integration.test.tsx` should verify roster size, uniqueness, and source zone.

- [ ] T008 [US1] Implement sampling algorithm in `frontend/src/services/generation.ts` to select up to 10 unique `Person` ids from the starting zone using the injected RNG
- [ ] T008a Write failing integration test `frontend/tests/integration/initial-agents.integration.test.tsx` asserting roster size, uniqueness, and source zone given a seed (must fail before implementation).
- [ ] T009 [US1] Implement Agent creation in `frontend/src/services/generation.ts` (create `Agent` records with `personId` and `affiliationId` set to the Player's GoverningOrganization id) and persist via existing storage layer (IndexedDB wrappers under `frontend/src/lib/` or `frontend/src/services/`)
- [ ] T009 [US1] Implement Agent creation in `frontend/src/services/generation.ts` (create `Agent` records with `personId` and `affiliationId` set to the Player's GoverningOrganization id) and persist via existing storage layer (IndexedDB wrappers under `frontend/src/lib/` or `frontend/src/services/`)
- [ ] T010 [US1] Add bounded-retry uniqueness handling in `frontend/src/services/generation.ts` with a clear retry limit and fallback behavior when population <10
- [ ] T011 [US1] Integration test: `frontend/tests/integration/initial-agents.integration.test.tsx` — seed-in/seed-out reproducibility and correct zone scoping (uses deterministic RNG)
- [ ] T012 [US1] Add edge-case test: `frontend/tests/unit/initial-agents.edge.test.ts` for low-population behavior (fewer than 10 people)

---

## Phase 4: User Story 2 - Personnel Screen & Profile (Priority: P1)

**Goal**: Refactor the Personnel UI so the list is sortable/filterable and the Profile pane reads canonical `Person` fields via the frontend models.

**Independent Test**: UI integration tests verify list rendering, sort/filter behavior, and that Profile contents match the `Person` data for a selected Agent.

- [ ] T013 [US2] Refactor `frontend/src/components/personnel/Profile.tsx` to read `Person` fields (`firstName`, `lastName`, `homeZoneId`, `skills`, `attributes`) from the canonical `Person` model and render accessible placeholders for missing data
- [ ] T014 [US2] Implement or update `frontend/src/components/personnel/PersonnelList.tsx` (or equivalent) to include sorting by name/role/zone and filtering UI; add unit tests in `frontend/tests/unit/personnel.list.test.tsx`
- [ ] T015 [US2] Add integration Playwright test `frontend/tests/playwright/personnel.spec.ts` that opens Personnel screen, selects an Agent, and asserts Profile shows Person fields and accessibility checks
- [ ] T016 [US2] Ensure Profile changes conform to `specs/004-initial-agents/contracts/agent-view.json` and add a contract test in `frontend/tests/unit/agent-view.contract.test.ts`

---

## Phase 5: User Story 3 - Name Generation (Priority: P2)

**Goal**: Provide realistic, deterministic name generation for People created during world generation and ensure integration with world-generation flow.

**Independent Test**: Unit tests for `NameGenerator` (format/uniqueness) and integration test verifying names are assigned during generation when invoked.

- [ ] T017 [US3] Integrate `NameGenerator` into `frontend/src/services/generation.ts` so newly created `Person` records receive `firstName` and `lastName` when generated
- [ ] T018 [US3] Unit test `frontend/tests/unit/nameGenerator.uniqueness.test.ts` sampling 1,000 names and asserting uniqueness/format metrics per spec
- [ ] T019 [US3] Integration test `frontend/tests/integration/namegen.integration.test.tsx` to verify deterministic outputs when seeding name generation

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T020 [P] Update `specs/004-initial-agents/quickstart.md` with exact commands to run deterministic generation and the new tests
- [ ] T021 [P] Add documentation/comments in `frontend/src/services/generation.ts` and `frontend/src/services/nameGenerator.ts` describing RNG/seed usage and determinism guarantees
- [ ] T022 [P] Run `eslint`/`prettier` over changed files and fix issues (frontend/)
- [ ] T023 [P] Update draft PR with test run artifacts and evidence (screenshot or test output) in the PR description

- [ ] T024 [P] Add performance measurement: create `frontend/tests/perf/world-gen.bench.ts` to measure world-generation timings (p95/p99) and add a CI job to record timings and alert on regressions beyond thresholds

---

---

## Phase 6b: Migration & Exclusivity (Polish)

- [ ] T025 [P] Add migration steps & tests: add `frontend/src/services/migration.test.ts` validating `p.name` → `firstName`/`lastName` split, `a.name` → `codeName`, and migration dry-run report; add PR checklist entry requiring migration notes and verification steps in PR description.
- [ ] T026 [US1] Integration test `frontend/tests/integration/initial-agents.exclusivity.test.tsx`: assert that selected Agent `personId`s were not assigned to any other Governing Organization at initialization and remain exclusive after creation.

## Dependencies

- Phase 1 (Setup) -> Phase 2 (Foundational) -> Phase 3/4/5 (User Stories) -> Phase 6 (Polish)
- MVP scope: complete Phase 1 + Phase 2 + Phase 3 (User Story 1). After US1 passes, stop and validate before completing UI (US2) and NameGen (US3).

## Parallel Execution Examples

- While Phase 2 is running, developer A can implement `NameGenerator` (`frontend/src/services/nameGenerator.ts`) in parallel with developer B implementing the RNG wrapper (`frontend/src/lib/rng.ts`) — both tasks are independent and marked [P].
- After Foundation completes, Developer A works on `frontend/src/services/generation.ts` (US1) while Developer B refactors `frontend/src/components/personnel/Profile.tsx` (US2).

## Validation Checklist (format rules)

- All tasks above follow the checklist format `- [ ] T### [P?] [US?] Description with exact file path`.
- Stories: US1 (initial agents), US2 (personnel UI), US3 (name generation).

---

Path to generated tasks: specs/004-initial-agents/tasks.md
