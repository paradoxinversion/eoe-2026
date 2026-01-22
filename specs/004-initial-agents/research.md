# Phase 0 Research: Initial Agents & Personnel Screen

Decision: Use explicit RNG/seed passed into world-generation for deterministic selection.
Rationale: Tests require reproducible outputs; passing an RNG/seed is the simplest, lowest-friction way to scope determinism to world-generation without changing global state.
Alternatives considered: rely purely on global world seed (less flexible), or per-player seeds (adds complexity for test harness).

Decision: Implement a lightweight local NameGenerator using curated name lists + templating.
Rationale: Avoids external dependencies and supports local-first design. Name lists (given + family) produce high variability and are simple to test for uniqueness/format.
Alternatives considered: integrate 3rd-party name libraries (more varied but external dependency), or remote API (not local-first).

Decision: Select Agents by sampling unassigned People from the Player's starting zone, ensuring uniqueness and retry up to a bounded limit (50 attempts per slot).
Rationale: Matches spec constraints (starting-zone exclusivity) and performs well on typical zone sizes. A 50-attempt retry limit prevents infinite loops in low-population worlds and provides a deterministic fallback behavior.
Alternatives considered: deterministic top-K selection (less variation), weighted sampling by traits (future enhancement).

Decision: Profile UI reads canonical `Person` fields (`id`, `firstName`, `lastName`, `homeZoneId`, `skills`, `attributes`) from `frontend/src/models` (legacy alias: `originZone`).
Rationale: Keeps `Agent` as a lightweight assignment record and prevents duplication. Frontend components simply dereference Person via `personId`.

Test considerations

- Unit tests for NameGenerator: format, uniqueness metrics on large samples (1k names), edge-case handling.
- Integration test for world-generation: seed-in/seed-out reproducibility, and Agent selection correctness.
- UI tests for Personnel screen: component renders, sorts/filters, and Profile shows Person fields.

Performance & constraints

- Name generation and Agent selection are inexpensive; target <50ms for generation per world on typical dev machines. Personnel screen must load interactive view within 1s (spec success criteria).
