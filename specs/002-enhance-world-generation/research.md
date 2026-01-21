++ begin

# Research: Enhance World Generation — Zones, People, Buildings, Orgs

Decision: Zones are fixed-size grid squares (NxN tiles per Zone).

Rationale: Fixed grid tiles simplify deterministic placement, testing, and validation. They map naturally to the existing tile grid and allow per-Zone iteration to enforce the "one-of-each building type" rule.

Alternatives considered:

- Free-form polygonal regions: more realistic but increases complexity for deterministic placement and tests.

---

Decision: Use canonical frontend model definitions as source-of-truth for entities and building types.

Rationale: The repo already contains `frontend/src/models/person.ts`, `zone.ts`, and `building.ts`. Using these types avoids model drift between spec and implementation and ensures generator outputs are compatible with existing UI and persistence layers.

Alternatives considered:

- Spec-only ad-hoc objects: faster prototyping but creates mapping work and test friction.

---

Decision: Deterministic RNG: use existing seeded RNG in `frontend/src/lib/rng.ts` (string→uint32 hash + mulberry32) for all placement decisions.

Rationale: Ensures reproducible generation across runs and environments; the project's RNG util is already in use elsewhere.

Alternatives considered:

- External RNG library: unnecessary dependency; mulberry32 is adequate for deterministic placement in tests.

---

Decision: Placement algorithm — per-Zone placement pass that ensures each configured building type is present.

Rationale: Iterate Zones; for each building type from `BUILDING_TYPES`, attempt K deterministic candidate placements inside the Zone (seeded by zone id + building type). If a placement collides or is invalid, continue searching; after K attempts, expand search within Zone bounds; if still impossible, log failure in debug artifact for QA.

Alternatives considered:

- Global greedy placement then redistribution: more complex to guarantee per-zone coverage and harder to test deterministically.

---

Decision: Debug artifact schema — JSON containing lists: zones, people, buildings, organizations, and a placementErrors list.

Rationale: QA and automated tests can validate this artifact using AJV. The schema will be placed at `specs/002-enhance-world-generation/debug-schema.json` and must enumerate building types according to `BUILDING_TYPES`.

Alternatives considered:

- Binary artifacts or snapshots: less portable and harder to inspect.

---

Decision: Failure handling — placement failures are non-fatal but recorded.

Rationale: Ensures generation completes and tests validate/report failures; prevents single failure from aborting tests or blocking PRs.

Alternatives considered:

- Strict-failure approach: would block merges until all cases solved, increasing development friction.

---

Next research actions (Phase 0 done):

- Confirm `BUILDING_TYPES` export exists and enumerate values in `debug-schema.json` (Phase 1).
- Create `data-model.md` mapping model fields to schema properties and validation rules.

++ end
