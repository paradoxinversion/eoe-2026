# Implementation Plan: Initial Agents & Personnel Screen Enhancements

**Branch**: `004-initial-agents` | **Date**: 2026-01-21 | **Spec**: specs/004-initial-agents/spec.md
**Input**: Feature specification from `/specs/004-initial-agents/spec.md`

## Summary

Initialize the Player's Governing Organization with up to 10 Agents sampled from unassigned `Person` records in the Player's starting `Zone`, add a local `NameGenerator` used during world-generation, and enhance the Personnel screen so the Profile pane reads canonical `Person` fields (`firstName`, `lastName`, `homeZoneId`, `skills`, `attributes`) via the frontend models. World-generation must accept an explicit RNG/seed to support deterministic tests.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Node.js for dev tooling
**Primary Dependencies**: React 18, Vite, MUI, `idb` (IndexedDB helper), `ajv` (schema validation), Vitest, Playwright
**Storage**: Local-first (IndexedDB via `idb`) and in-memory state; no external backend required for core feature
**Testing**: Vitest for unit/integration, Playwright for end-to-end/accessibility tests
**Target Platform**: Web (desktop-first, responsive) implemented in `frontend/`
**Project Type**: Web application (frontend-only changes for UI + local world-generation)
**Performance Goals**: Personnel screen primary view becomes interactive <1s on a typical development machine; world-generation including name-gen and agent selection <100ms for small worlds, <500ms for larger test fixtures.
**Constraints**: Local-first; no runtime network dependencies required for name generation or initial assignment; deterministic RNG/seed must be supported for tests.
**Scale/Scope**: Feature affects world-generation, frontend models, and Personnel UI only.

## Constitution Check

References: `.specify/memory/constitution.md`

- **Code Quality & Maintainability**: Implement changes in focused modules: `frontend/src/services/generation.ts` (RNG + NameGenerator), UI components under `frontend/src/components/personnel`, and minor model usage. Run `eslint` and `prettier` as part of CI. PR must include design notes and API surface changes.
- **Test-First & Automated Testing**: Mandatory unit tests for `NameGenerator` and selection algorithm; integration tests for deterministic world-generation (seed-in/out); UI tests for Personnel screen. Tests run via Vitest and Playwright in CI.
- **User Experience Consistency**: Acceptance criteria are defined in spec (SC-001..SC-006). Personnel screen must be accessible and sortable/filterable; include at least one Playwright accessibility check.
- **Performance & Resource Constraints**: Performance targets stated above; measure world-generation timings in integration tests. Performance regressions detected by CI block merges until addressed.
- **Local-First & Portability**: Feature is local-first (IndexedDB + in-memory). No hosted services required; name generation is local and deterministic when seeded.

The plan complies with the constitution; no exceptions requested.

## Project Structure

Documentation (this feature)

`text
specs/004-initial-agents/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
`

Source Code (selected layout)

``text
frontend/
├── src/
│ ├── components/personnel/ # UI changes and Profile pane
│ ├── services/generation.ts # Add RNG/seed param and NameGenerator integration

- │ └── models/ # Use canonical Person, Agent, Zone models
  └── tests/
  ├── integration/ # deterministic world-generation + UI tests
  └── unit/ # NameGenerator and selection unit tests
  ``

**Structure Decision**: Use the existing web application structure; minimal changes in `frontend/` to preserve separation and local-first behavior.

## Complexity Tracking

No constitution violations requiring exception. No additional project-level complexity introduced.

## Phase 2: Implementation Tasks (high level)

1. Add `NameGenerator` utility (local lists + templating) and unit tests.
2. Update `frontend/src/services/generation.ts` to accept an explicit RNG/seed and use it when sampling `Person` ids for initial Agent creation; implement bounded retry and uniqueness checks.
3. Implement Agent creation flow: create `Agent` records with `personId` and set `affiliationId` to the player's GoverningOrganization `id`.
4. Update Personnel UI (`components/personnel`) to display list, sorting/filtering, and Profile pane reading `Person` canonical fields.
5. Add integration tests: deterministic generation (seed), Agent selection correctness, and UI acceptance tests (Vitest + Playwright).
6. Add `specs/004-initial-agents/tasks.md` with detailed work items, owners, and timeboxes.
7. Run linters, formatters, and CI checks; update draft PR with testing evidence.

Estimated effort: 3–5 engineer-days (implementation + tests + review).
