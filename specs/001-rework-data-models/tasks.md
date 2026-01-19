# Tasks — Rework Data Models (Generated)

Phase 1: Setup

- [x] T001 Initialize feature branch and ensure working tree matches plan (create branch `001-rework-data-models` if missing) — repo root
- [x] T002 Install dev dependencies and verify test runner: run `npm ci` in `frontend/` and ensure `npm run test:unit` exits successfully — frontend/package.json

Phase 2: Foundational

- [x] T003 [P] Add model stubs: create `frontend/src/models/person.ts`, `frontend/src/models/agent.ts`, `frontend/src/models/zone.ts`, `frontend/src/models/building.ts`, `frontend/src/models/governingOrganization.ts` using `specs/001-rework-data-models/data-model.md` as canonical shapes
- [x] T004 [P] Add id helper `frontend/src/lib/id.ts` with function to create `<type>-<uuidv4>` ids (use existing `uuid` dependency) — frontend/src/lib/id.ts
- [x] T005 [P] Add/verify JSON schema runtime validator usage in `frontend/src/services/persistence.ts` to persist `schemaVersion` alongside saves — frontend/src/services/persistence.ts

Phase 3: User Stories (priority order)

User Story: People & Agent Lifecycle [US1] (Priority: P1)

- [x] T006 [US1] Create `frontend/src/models/person.ts` with fields from `specs/001-rework-data-models/data-model.md` (firstName, lastName, attributes, skills, governingOrganizationSentiments, intelligenceLevel) — frontend/src/models/person.ts
- [x] T007 [US1] Create `frontend/src/models/agent.ts` with `personId`, `codeName`, `role`, `inventory`, `health` — frontend/src/models/agent.ts
- [x] T008 [US1] Implement hire flow service that creates an `Agent` referencing a `Person`: `frontend/src/services/hiring.ts` (unit tests under `frontend/tests/unit/hiring.test.ts`) — frontend/src/services/hiring.ts
- [x] T009 [US1] Add unit tests for Person/Agent model serialization and validation using fixtures: `frontend/tests/unit/person.model.test.ts`, `frontend/tests/unit/agent.model.test.ts` — frontend/tests/unit/

- [x] T010 [P] [US1] Update `frontend/src/services/migration.ts` to include deterministic mapping rules for `Person.name`->split and `Agent.name`->`codeName` and export a stable dry-run report to `specs/001-rework-data-models/migration-reports/` — frontend/src/services/migration.ts

- User Story: Occupants & Relationship Queries [US2] (Priority: P2)

- [x] T011 [US2] Implement zone occupant query helper `frontend/src/services/zoneService.ts` that returns `Person` records for a given `zoneId` and joins `Agent` data when present — frontend/src/services/zoneService.ts
- [x] T012 [P] [US2] Add integration test for occupant queries: `frontend/tests/integration/zone.occupants.test.ts` using fixtures in `specs/001-rework-data-models/fixtures/` — frontend/tests/integration/zone.occupants.test.ts
- [x] T013 [US2] Ensure `Zone.currentOccupants` is used correctly across persistence and migrate any legacy relationships during migration — modify `frontend/src/services/persistence.ts` and `frontend/src/services/migration.ts` accordingly

User Story: Backward Compatibility & Migration Safety [US3] (Priority: P3)

- [x] T014 [US3] Implement migration dry-run CLI/module that produces `specs/001-rework-data-models/migration-reports/<fixture>-report.json` and supports `apply=false|true` — scripts/migrate-fixtures.sh (Vitest exporter)
- [x] T015 [P] [US3] Add migration integration tests that run each fixture under `specs/001-rework-data-models/fixtures/` and assert report summary and quarantined item handling: `frontend/tests/integration/migration.integration.test.ts` (already scaffolded, extend with report assertions) — frontend/tests/integration/migration.integration.test.ts
- [x] T016 [P] [US3] Add UI component for manual import/export migration UX: `frontend/src/components/MigrationTool.tsx` with dry-run/readable report download — frontend/src/components/MigrationTool.tsx

Phase 4: Polish & Cross-Cutting Concerns

- [ ] T017 [P] Add CI job to run unit/integration/perf tests and upload perf artifacts (create `.github/workflows/migration-tests.yml`) — .github/workflows/migration-tests.yml
- [ ] T018 [P] Document migration quickstart and developer guide: update `specs/001-rework-data-models/quickstart.md` with commands and expectations — specs/001-rework-data-models/quickstart.md
- [ ] T019 [P] Add performance benchmark & gating: create a perf job that fails the build if migration dry-run on 200 entities exceeds SC-002 budget — .github/workflows/migration-tests.yml
- [ ] T020 [P] Add representative fixtures verification script `specs/001-rework-data-models/scripts/verify-fixtures.sh` to validate each fixture against JSON schemas and run in CI — specs/001-rework-data-models/scripts/verify-fixtures.sh

Final acceptance: confirm CI passing (unit + integration + perf within target) and update `specs/001-rework-data-models/checklists/requirements.md` to mark all items complete
