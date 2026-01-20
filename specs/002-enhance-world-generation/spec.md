# Feature Specification: Enhance World Generation — Zones, People, Buildings, Orgs

**Feature Branch**: `002-enhance-world-generation`  
**Created**: 2026-01-19  
**Status**: Draft  
**Input**: User description: "Update world generation so that Zones, People, Buildings, and Governing Organizations are properly created."

## Summary

Extend world generation so that generated maps also instantiate high-level gameplay entities: `Zones` (regions/administrative areas), `People` (person records tied to locations), `Buildings` (structures placed logically near resources/settlements), and `GoverningOrganization` (factions/owners that manage settlements). Ensure generation is deterministic via seeds, produces valid linkages (People -> Zone, Building -> Zone, Building -> GoverningOrganization), and emits debug artifacts for QA.

## Clarifications

### Session 2026-01-19

- Q: Should `Zone` boundaries be free-form regions or fixed grid squares (chessboard style)? → A: Option A (fixed-size grid squares). Zones are implemented as fixed-size square tiles (grid cells composed of N×N map tiles). This choice prioritizes deterministic mapping, simple RNG placement within each Zone, and easier validation in tests.

- Q: Should the `Zone`, `Person`, `Building`, and `GoverningOrganization` entities map to the frontend model files under `frontend/src/models`? → A: Yes. Use the frontend model files as the canonical entity definitions: `Zone` → `frontend/src/models/zone.ts`, `Person` → `frontend/src/models/person.ts`. `Building` and `GoverningOrganization` models will be created under `frontend/src/models/building.ts` and `frontend/src/models/governingOrganization.ts` respectively if they do not already exist; the generation implementation must import and instantiate these model types.

- Q: Should every Zone include at least one of each building type? → A: Yes. All Zones must contain at least one instance of each building type; the generator should search within the Zone to place missing types and, if necessary, expand the placement search within the Zone bounds or log placement failures to the debug artifact.

- Q: Where are the project's canonical building types defined? → A: In `frontend/src/models/building.ts`. The generator MUST use the building type definitions from that file as the canonical configured building types for placement and validation.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Zones and Entities present after generation (Priority: P1)

As a player starting a new game, I expect the generated world to include Zones that partition the map, populated with People, Buildings, and Governing Organizations so gameplay elements (ownership, services) are available immediately.

Independent Test: Generate new game; assert Zones > 0, that each Zone contains at least one instance of every configured building type (as defined in `frontend/src/models/building.ts`), and that every Building has a link to a Zone and optionally a GoverningOrganization.

Acceptance Scenarios:

1. Given default new-game parameters, When generation finishes, Then the world model contains Zones, People, Buildings, and GoverningOrganization entities with valid cross-references.
2. Given a provided seed, When generation repeats, Then entity placements and linkages are identical.

---

### User Story 2 — Realistic placement and ownership (Priority: P2)

As a simulation player, I want Buildings and People to be placed logically — e.g., settlements near resources, buildings clustered in towns, and GoverningOrganizations owning multiple Buildings — so that the world feels coherent.

Independent Test: For generated worlds, measure distance from Buildings to nearest resource and assert average distance below threshold; verify GoverningOrganization owns at least N buildings in its region.

Acceptance Scenarios:

1. Given a resource cluster, When generation runs, Then at least one Building that uses that resource exists within a reasonable radius.

---

### User Story 3 — Debuggable and reproducible (Priority: P3)

As a developer or QA, I need debug output that describes Zones, entity lists, and ownership so I can reproduce and inspect generation behavior.

Independent Test: Run generation with seed and `--debug` flag and verify JSON debug contains Zone, People, Buildings, and Org layers.

Acceptance Scenarios:

1. Given `--debug` enabled, When generation completes, Then a JSON artifact with entity lists and relationships is written.

### Edge Cases

- Very small maps: still create at least one Zone and avoid orphaned People/Buildings.
- Conflicting placement (no valid tile for a Building): attempt alternative nearby tiles; if impossible, skip and log in debug artifact.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Generation MUST create `Zone` entities that partition the map into fixed-size square Zones (e.g., NxN tiles per Zone) and include metadata (id, name, gridX/gridY, bounding tiles).
- **FR-002**: Generation MUST instantiate `Person` model instances using the canonical frontend model (`frontend/src/models/person.ts`). Created Person instances MUST conform to the attributes and validation rules defined by that model and be associated with a Zone and optionally a Building (home/workplace) via model references.
- **FR-003**: Generation MUST instantiate `Building` model instances using the canonical frontend model (`frontend/src/models/building.ts`). Created Building instances MUST conform to the attributes and type definitions in that model file and MUST be placed on valid non-water tiles.
- **FR-004**: Generation MUST instantiate `GoverningOrganization` model instances using the canonical frontend model (`frontend/src/models/governingOrganization.ts`). Organization instances MUST conform to the attributes and validation rules defined by that model, and ownership assignments of Buildings/People MUST reference those model instances.
- **FR-005**: All entity linkages MUST be valid references (no dangling IDs) and covered by unit tests.
- **FR-006**: Generation MUST be deterministic given a `seed` and configurable parameters.
- **FR-007**: Generation MUST emit a debug JSON containing Zones, People, Buildings, and Organizations when `debug` mode is enabled.
- **FR-008**: Generation MUST gracefully handle placement failures (log and skip) and maintain referential integrity.
- **FR-009**: Generation MUST ensure each Zone contains at least one instance of each configured building type (configured in `frontend/src/models/building.ts`) or record the failure in debug output if placement is impossible after reasonable search attempts.

### Key Entities

These entities map directly to the frontend model definitions; generation should instantiate model instances and must not introduce additional entity-specific properties in the spec. Use the model types as the canonical source of truth for attributes and validation.

Model mappings:

- `Zone` model: frontend/src/models/zone.ts
- `Person` model: frontend/src/models/person.ts
- `Building` model (planned): frontend/src/models/building.ts
- `GoverningOrganization` model (planned): frontend/src/models/governingOrganization.ts

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: For generated default maps, at least one Zone is created and 100% of Zones contain at least one instance of every configured building type (as defined in `frontend/src/models/building.ts`).
- **SC-002**: Regeneration with the same seed reproduces all entity placements and linkages exactly.
- **SC-003**: Debug JSON conforms to the schema at `specs/002-enhance-world-generation/debug-schema.json` and is produced for `--debug` runs.
- **SC-004**: Generation preserves referential integrity; unit tests assert 0 dangling references in generated artifacts.

## Assumptions

- A tile grid (map tiling) is available from existing world generation stages; this feature consumes that grid to place entities. There is no concept of biomes or elevation in the game.
- Default map size and tile resolution are the project's current defaults; if larger sizes are requested, generation may fallback to incremental mode.

## Next Steps

1. Implement `engine/generation/entities.ts` that adds Zones, People, Buildings, and Orgs after base terrain/biome generation.
2. Add unit tests for entity creation and referential integrity (`tests/unit/generation.entities.test.ts`).
3. Add an integration test to validate deterministic outputs for seeded runs and a debug-mode artifact (`tests/integration/generation.entities.integration.test.ts`).

## Constitution References

- Complies with project constitution: test-first, local-first, measurable performance targets, and UX consistency (no blocking freezes via incremental generation).

Links: spec created at [specs/002-enhance-world-generation/spec.md](spec.md)
