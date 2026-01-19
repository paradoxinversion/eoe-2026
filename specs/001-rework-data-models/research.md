# Research — Rework Data Models (Phase 0)

**Feature**: 001-rework-data-models
**Date**: 2026-01-19

This document records decisions, rationale, and alternatives for open questions in the spec before moving to design (Phase 1).

---

## Decision: ID format

- Decision: Use composite IDs: `<entityType>-<uuidv4>` (e.g., `person-3fa85f64-...`).
- Rationale: Guarantees global uniqueness across fixtures and merged branches, keeps IDs namespaced and readable for debugging and logs; aligns with CI/merge workflows.
- Alternatives considered: UUID-only (ok but less human-friendly), numeric incremental IDs (not safe across merges/fixtures).

## Decision: Name splitting for legacy `Person.name`

- Decision: Split on the last space. If no space or ambiguous result, set `firstName` = full name and `lastName` = ""; record the original in the migration report.
- Rationale: Splitting on last space handles "First Last" and multi-part first names conservatively. Recording originals enables manual cleanup.
- Alternatives: Use NLP name parser (overkill / language-dependent) or prompt user during migration (requires interactive tooling).

## Decision: `codeName` generation for missing Agent code names

- Decision: Generate `codeName` as `codename-<short-uuid>` when legacy `Agent.name` is missing and migration cannot derive a safe value.
- Rationale: Ensures uniqueness, avoids accidental collisions with Person names, and keeps generated names identifiable in logs/reports.
- Alternatives: Use Person initials + number (possible collisions), ask user (requires interactive migration UX).

## Decision: `intelligenceLevel` default values

- Decision: Range 0..100; default to 50 when no legacy source available. If legacy data contains a heuristic (e.g., city-level awareness), map proportionally.
- Rationale: 50 is neutral/median and keeps simulation behavior stable until designers refine values.
- Alternatives: Use 0 or 100 defaults (biases outcomes), or try to infer from related metrics (complex and brittle).

## Decision: Building generation heuristics during migration (when builds absent)

- Decision (simple heuristic):
    - `numBuildings = max(1, round(zone.size / 10))`
    - Type distribution weights based on `zone.wealth`:
        - wealth >= 75: more `Office`/`Bank`/`Lab`
        - 25 <= wealth < 75: mixed `Residence`/`Office`/`Lab`
        - wealth < 25: mostly `Residence`
    - `size` of building proportional to zone.size and wealth.
- Rationale: Deterministic, easy to test, and produces plausible structures for missing legacy building data.
- Alternatives: World-gen algorithms (preferable later), or require manual import (friction for users).

## Decision: Relationship representation

- Decision: Use id arrays on owner entities for current state (e.g., `Zone.currentOccupants: string[]`). No `Assignment` entity unless temporal/history/careers are required in future.
- Rationale: Simpler serialization, lower migration complexity, matches existing UI needs; temporal needs can be added later as separate feature.
- Alternatives: Keep `Assignment` entity (supports history/time ranges) — rejected for now as not required.

## Decision: Migration strategy (hybrid)

- Decision: Hybrid approach:
    - Automatic on-load, non-destructive upgrades for safe schema bumps (field renames, defaults, type widenings).
    - Manual import/export migration tool with dry-run + human-readable JSON report for major/breaking changes (structure changes, entity splits/merges).
- Rationale: Balances user convenience and safety; large migrations often require human review and reporting.
- Alternatives: Fully automatic migrations (risky), fully manual only (poor UX).

## Decision: Migration mapping rules (summary)

- `Agent.name` -> `codeName` (rename). If missing, generate `codename-<short-uuid>`.
- Legacy per-agent `skills`/`attributes`: Map to `Person` when semantically appropriate; otherwise quarantine and surface in report.
- Legacy single-value sentiments: convert to `{ [governingOrganizationId]: value }` mapping, mapping global sentiment to PlayerEmpire if applicable.
- Legacy `Person.name`: attempt split (see above); record ambiguous items.
- Create `GoverningOrganization` entries for legacy PlayerEmpire fields and remap references.
- For zones lacking buildings: generate buildings using heuristics above.
- Ensure `Zone`/`Building` `intelligenceLevel` present (use legacy mapping or default 50).

## Decision: Migration report & quarantine

- Decision: Migration report format will be JSON and include:
    - `summary`: counts (processed, migrated, quarantined)
    - `examples`: sample transformed records
    - `quarantine`: list of items with reason codes and original payload snippets
    - `actions`: suggested manual steps for unresolved items
- Rationale: Machine-readable for CI, and human-readable for reviewers.

## Decision: Tests & fixtures expectations

- Decision: Require representative saved-game fixtures (recommended >=20 samples) covering:
    - small/medium/large worlds
    - missing fields, legacy shapes, ambiguous Person names, global sentiments
    - edge-cases: circular references, missing zone ids
- Tests required before implementation:
    - Unit tests for model shapes and ID helper
    - Unit tests for migration transforms (rename, split-name, sentiment mapping)
    - Integration tests for persistence round-trip and migration dry-run/apply on fixtures
    - Performance benchmark: load ~200 entities within target (SC-002)

## Decision: Validation & next steps

- Produce `research.md` (this file) — complete.
- Phase 1: generate `data-model.md` with TypeScript interfaces and JSON schemas (`specs/001-rework-data-models/contracts/*.json`).
- Prepare fixtures in `specs/001-rework-data-models/fixtures/` and migration unit/integration test scaffolding.

---

If any decision above needs alteration, mark as `NEEDS CLARIFICATION` in `spec.md` and update this document before Phase 1.
