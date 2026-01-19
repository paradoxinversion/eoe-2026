# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript (frontend); Node 18+ for tooling where applicable.  
**Primary Dependencies**: React 18, Vite, Material-UI (MUI) for components, uuid for ids; test deps: Vitest, @testing-library/react, axe-core for a11y.  
**Storage**: Local-first IndexedDB via the existing `frontend/src/services/persistence.ts` (browser). Export/import via file fallback.  
**Testing**: Vitest for unit/integration; testing-library for component tests; visual snapshot tests present under `frontend/tests/visual`; accessibility tests with axe; perf harness produces JSON artifacts in `frontend/tests_output/`.  
**Target Platform**: Web browser (desktop-first) — the game runs as a single-page web app served from `frontend/`.  
**Project Type**: Web application (frontend-only changes for this feature).  
**Performance Goals**: Loading and presenting a saved game with up to 200 entities should complete within ~3s on a typical developer laptop (SC-002). Migration dry-run/report performance should be interactive for single save files (<5s).  
**Constraints**: Must operate fully offline/local-first; avoid server dependencies. Migration tools must be deterministic and non-destructive by default (dry-run). Keep memory/disk usage modest; preserve responsive UI during migration.  
**Scale/Scope**: Typical save sizes targeted: up to a few hundred entities per save; migration and CI tests will validate up to 1k entities as a stretch goal.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

This section documents compliance with `/specify/memory/constitution.md`.

- **I. Code Quality & Maintainability**: Compliant. Changes are limited to model stubs and migration tooling in `frontend/src/models` and `frontend/src/services`. All code changes will include unit tests and follow existing linting/config (PRs will include rationale for design trade-offs).
- **II. Test-First & Automated Testing**: Compliant. Plan mandates unit tests for model serialization, integration tests for migration (representative saves), accessibility tests (axe) and visual/perf tests. CI must run these tests; migration tests are included in plan acceptance criteria.
- **III. User Experience Consistency**: Compliant. Acceptance scenarios are defined in the feature spec (zone occupants, hire flow). Accessibility checks and UI acceptance tests will be added for any UI changes tied to these models.
- **IV. Performance & Resource Constraints**: Compliant with measurable goals. SC-002 target: load ~200 entities <~3s on a developer laptop. Perf benchmarks exist and will be extended; any regressions block merge per constitution.
- **V. Local-First & Portability**: Compliant. Storage remains local-first (IndexedDB). Migration tools are import/export files and run client-side; no hosted dependency is required.

If any gate requires a justified exception, it will be documented here with rationale and an approver's signature (PR reviewer comment). No exceptions are requested at this planning stage.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Use the existing web-app structure rooted at `frontend/`. Feature work will live in `frontend/src/models/` (model stubs), `frontend/src/services/` (migration + persistence), and tests under `frontend/tests/{unit,integration,perf,visual}`. Contracts and plan artifacts remain in `specs/001-rework-data-models/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
