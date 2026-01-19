# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

# Feature Specification: Rework Data Models

**Feature Branch**: `001-rework-data-models`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Rework the game's data models (Agent, Person, etc.) to support richer simulation — add attributes, relationships, and migration path."

## Clarifications

### Session 2026-01-19

- Q: Person governingOrganizationSentiment format → A: `governingOrganizationSentiments` as a key/value map of governingOrganizationId -> sentiment (-100..100).
- Q: Zones and Buildings intelligence level → A: Both `Zone` and `Building` include an `intelligenceLevel:number` attribute (e.g., 0..100) used for simulation/awareness heuristics.
- Q: Person name split → A: `Person` will expose `firstName` and `lastName` string properties (both required).
- Q: Timestamp fields → A: `createdAt` and `updatedAt` will NOT be used on game entity models; timestamps must not be added to entity definitions for this feature.
- Q: GoverningOrganization & Zone metadata presence → A: `GoverningOrganization` and `Zone` MUST NOT include a `metadata` object at this time.
- Q: Agent → A: `Agent` MUST include a reference to the `Person` entity via `personId:string`.
- Q: Relationship representation → A: Use id arrays on owner entities (e.g., `Zone.currentOccupants: string[]`). The separate `Assignment` entity has been removed unless a temporal/history model is required later.
- Q: Relationship representation → A: Use id arrays on owner entities (e.g., `Zone.currentOccupants: string[]`). The separate `Assignment` entity has been removed unless a temporal/history model is required later.
- Q: Person/Agent lifecycle → A: `Person` entities are produced by world generation and persisted; `Agent` entities are created when a `Person` is hired by a `GoverningOrganization` and must reference the `Person` via `personId:string`.
- Q: Migration strategy → A: Hybrid — automatic on-load for safe/minor schema bumps; require manual import/export (with dry-run and report) for major/breaking changes.
- Q: ID scheme → A: Use composite IDs (type prefix + UUID) for all entity `id` fields (e.g., `zone-3fa85f64-...`).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - People & Agent Lifecycle (Priority: P1)

People are generated as part of world generation and persisted as `Person` entities. `Agent` entities are not user-created directly — an `Agent` is created only when a `Person` is hired or commissioned by a `GoverningOrganization`. Hiring produces an `Agent` record that references the originating `Person` via `personId` and captures operational attributes (inventory, role, health).

**Why this priority**: Accurate generation and stable persistence of `Person` data plus a correct hire-to-agent flow are foundational for simulation, hiring mechanics, UI displays, and migration safety.

**Independent Test**: Run world generation to produce a population of `Person` entities and verify persisted attributes; then execute a hire action (simulate organization hiring a Person) and verify an `Agent` entity is created with `personId` referencing that `Person`, and that both entities persist and reload correctly.

**Acceptance Scenarios**:

1. **Given** world generation runs, **When** the world is initialized, **Then** a population of `Person` entities exists with required attributes (firstName, lastName, homeZoneId, attributes/skills) persisted in storage.
2. **Given** a `Person` and a `GoverningOrganization`, **When** the organization hires the `Person`, **Then** an `Agent` entity is created with `personId` referencing the `Person`, assigned `role`, and persisted; reloading the save presents both `Person` and `Agent` intact.
3. **Given** legacy saves, **When** migration runs, **Then** People produced by previous world-gen versions are mapped to new `Person` shapes and hiring-derived `Agent` records are created or derived according to migration rules where applicable.

---

### User Story 2 - Occupants & Relationship Queries (Priority: P2)

People are the canonical occupants of `Zone`s. Some `Person` entities may also be `Agent`s (when hired), but occupancy is primarily a `Person` property. Game systems and UI must be able to query occupants of a `Zone` (returning `Person` records) and join to `Agent` records where applicable to show operational details.

**Why this priority**: Many gameplay systems and UI views show zone populations and must surface both Person-level attributes (name, attributes, skills) and Agent-level operational data (role, inventory) when present.

**Independent Test**: Create `Person` entities assigned to zones (some with corresponding `Agent` records), then query zone occupants and verify returned `Person` records; where an occupant has an `Agent` record, join and verify agent fields are available.

**Acceptance Scenarios**:

1. **Given** several `Person` entities with `homeZoneId = Zone A`, **When** the UI lists occupants of `Zone A`, **Then** the list includes all `Person` records (including those who are also `Agent`s) with their summary fields.
2. **Given** a `Person` who has been hired (has an `Agent`), **When** the UI drills into that occupant, **Then** the view shows both the `Person` attributes and the `Agent` operational fields (role, inventory, health).

---

### User Story 3 - Backward Compatibility & Migration Safety (Priority: P3)

Ensure prior saved games load reliably and data upgrades are explicit and testable.

**Why this priority**: Avoids data loss and preserves user trust; migration strategy impacts release cadence.

**Independent Test**: Run a set of representative older saves through the migration routine and assert structural integrity of migrated data.

**Acceptance Scenarios**:

1. **Given** a saved file from a recent release, **When** the user attempts migration, **Then** the migration tool supports the last 2 releases (best-effort for older saves) and either upgrades or reports a clear incompatibility error.

---

### Edge Cases

- Loading partially-corrupt save files — migration should fail gracefully and offer the user a readable error with file export option.
- Entities missing optional fields — defaults must be applied without breaking gameplay.
- Circular or inconsistent relationships (e.g., Agent assigned to nonexistent Zone) — detect and quarantine inconsistent entries during migration.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST represent `Agent` as a lightweight operational actor with `codeName` (replacing legacy `name`) and role constrained to `Recruit | Administrator | Scientist | Doctor | Soldier`.
- **FR-002**: The system MUST introduce a `GoverningOrganization` entity to represent governments; the Player Empire is modeled as a `GoverningOrganization` instance.
- **FR-003**: The system MUST add `Zone.size:number`, `Zone.wealth:number`, and `Zone.intelligenceLevel:number` properties; world-gen must use them to determine counts and building composition and `intelligenceLevel` influences simulation/awareness heuristics.
- **FR-004**: `Person` entities MUST include `homeZoneId`, `governingOrganizationSentiments` (a key/value map of `governingOrganizationId -> sentiment` with values in the range -100..100), `intelligenceLevel`, `occupation`, attributes (`health`, `intelligence`, `strength`, `agility`, `endurance`, `empathy`, `charisma`) and a `skills` map containing `fighting`, `medicine`, `business`, `finance`, `publicPlanning`, `science`.
- **FR-005**: The system MUST add `Building` entities with attributes: `name`, `type`, `size`, `zoneId`, `intelligenceLevel`, `upkeepCost`, `infrastructureLoad`; building types include `Residence`, `Office`, `Lab`, `Bank`, `Hospital`.
- **FR-006**: The system MUST persist a `schemaVersion` with saved data and provide a migration tool (manual import/export with dry-run and report) that supports at least the last 2 releases.
- **FR-007**: Migration routines MUST perform integrity checks, quarantine incompatible items, and produce human-readable migration reports.

### Key Entities _(reworked)_

- **GoverningOrganization**: `id:string`, `name:string`, `type?:string`, `leaderId?:string`.
- **Agent**: `id:string`, `personId:string`, `codeName:string`, `role:"Recruit"|"Administrator"|"Scientist"|"Doctor"|"Soldier"`, `affiliationId?:string`, `inventory: { itemId:string, qty:number }[]`, `health:number`.
- **Person**: `id:string`, `firstName:string`, `lastName:string`, `homeZoneId?:string`, `governingOrganizationSentiments:{ [governingOrganizationId:string]: number }` (values -100..100), `intelligenceLevel:number`, `occupation?:string`, `attributes:{ health:number; intelligence:number; strength:number; agility:number; endurance:number; empathy:number; charisma:number }`, `skills:{ fighting:number; medicine:number; business:number; finance:number; publicPlanning:number; science:number }`.
- **Zone**: `id:string`, `name:string`, `size:number`, `wealth:number`, `intelligenceLevel:number`, `capacity?:number`, `currentOccupants:string[]`.
- **Building**: `id:string`, `name:string`, `type: 'Residence'|'Office'|'Lab'|'Bank'|'Hospital'`, `size:number`, `zoneId:string`, `intelligenceLevel:number`, `upkeepCost:number`, `infrastructureLoad:number`.

ID Format: All entity `id` fields will use a composite format: `<entityType>-<uuidv4>` (e.g., `person-3fa85f64-...`). This keeps IDs globally unique and namespaced by type.

## Migration Notes

    - Rename `Agent.name` -> `codeName` (fallback: generate code-name if missing).
    - Remove per-agent `skills`/`attributes` or map relevant fields into `Person` where applicable.
    - For legacy single-value sentiments, migration MUST convert to a `governingOrganizationId -> sentiment` map; if legacy data only contained a single global sentiment, map it to the PlayerEmpire/governingOrganization id with that value.
    - For legacy `Person.name`, migration MUST attempt to split into `firstName` and `lastName` (split on the last space). If splitting is ambiguous, set `firstName` to the full name and `lastName` to an empty string and record in the migration report.
    - Create `GoverningOrganization` entries for legacy PlayerEmpire fields and map references.
    - Create `Building` entities during migration using `Zone.size` and `Zone.wealth` heuristics where legacy data lacks building structures.
    - Ensure migrated `Zone` and `Building` entries include `intelligenceLevel` (populate from legacy data where possible or use safe defaults documented in the migration report).
    - Produce a migration report and quarantine unverifiable items.
     - Use a hybrid migration approach: perform automatic, non-destructive on-load upgrades for minor schema bumps where possible; require the manual import/export migration tool (with dry-run and human-readable report) for major or breaking schema changes.

## Acceptance & Tests to add

- Unit tests for `Agent` model (rename behavior and role validation).
- Migration integration tests for representative saves covering rename, mapping, and building generation.
- World-gen tests validating `Zone.size` and `Zone.wealth` influence on generated counts and building types.

## Files / Implementation Targets

- Model stubs: `frontend/src/models/governingOrganization.ts`, `frontend/src/models/agent.ts`, `frontend/src/models/person.ts`, `frontend/src/models/zone.ts`, `frontend/src/models/building.ts`.
- Migration & persistence targets: `frontend/src/services/migration.ts`, update `frontend/src/services/persistence.ts`, tests under `frontend/tests/unit/migration.*.test.ts`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of a representative set (minimum 20) of saved games from the immediately previous release load with no data-loss of required fields after migration.
- **SC-002**: Loading and presenting a saved game with up to 200 entities completes within 3 seconds on a typical developer laptop (technology-agnostic formulation: "Loads interactively within a few seconds").
- **SC-003**: Post-migration integrity checks report zero critical errors for at least 95% of representative saves in CI runs.
- **SC-004**: Primary user journeys (create agent, assign to zone, save, reload) have 100% automated test coverage in unit/integration tests defined for this feature.

## Constitution References _(mandatory)_

- **II. Test-First & Automated Testing**: This feature includes unit tests for model serialization/deserialization, integration tests for migration routines, and acceptance tests for user-visible flows. Acceptance criteria: CI runs include migration tests and they pass for the representative save set.
- **IV. Performance & Resource Constraints**: Define and verify load-time budgets in CI (see SC-002). Any performance regressions discovered by benchmarks block merges until resolved.
- **V. Local-First & Portability**: Data model and migrations are implemented to work fully on local storage (no hosted dependency). Import/export flows are provided for manual migration fallback.

---

**Documented Assumptions**

- Default persistence is local storage; export/import via file is available as fallback.
- Representative saved-game set for migration testing will be supplied by the product team (minimum 20 samples).

**Files to review / artifacts**

- Example saved-game samples: `test-artifacts/scenario-2026.json`, `tests_output/*` (perf artifacts)
- Related code: `frontend/src/models/agent.ts`, `frontend/src/models/person.ts`, `frontend/src/services/persistence.ts`
