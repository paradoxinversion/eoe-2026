# Implementation Plan: Empire of Evil (001-empire-game-spec)

## Technical Context

- Platform: Browser-first React + TypeScript single-page app. UI implemented with MUI (Material-UI) for enterprise-quality dashboard components.
- Bundler / dev tooling: Vite + React + TypeScript.
- Primary local persistence: IndexedDB (using the `idb` wrapper) for in-app saves and runtime state.
- Portable persistence: JSON export/import for manual backups and portability. Save behavior is INDEXEDDB + export/import only (File System Access and Electron out-of-scope for initial implementation).
- Charts & data viz: shortlist: `recharts` (simple, easy integration) and `visx` (fine control, smaller bundles); final selection during implementation based on bundle and accessibility tradeoffs.
- Determinism: core game logic (generation, turn resolution, Science Projects) MUST support seeded RNG for deterministic tests and CI runs.

Decisions resolved:

- UI framework: MUI (Material-UI).
- Persistence: IndexedDB (`idb`) + JSON export/import only.
- Tech stack: React + TypeScript, Vite for dev toolchain.

Unknowns / NEEDS CLARIFICATION:

- None remaining for initial implementation; future work may re-open File System Access or Electron options if a fixed-disk save requirement is requested.

## Constitution Check

Source: .specify/memory/constitution.md (v1.0.0)

- I. Code Quality & Maintainability: PASS (plan prescribes modular React + TS, linters and typed schemas)
- II. Test-First & Automated Testing: PASS (plan includes deterministic tests, unit/integration targets)
- III. UX Consistency: PASS (Options Page, Title Page, Load modal defined; accessibility noted)
- IV. Performance & Resource Constraints: PARTIAL — must add measurable targets in Phase 1 (SC-001/SC-002 already in spec)
- V. Local-First & Portability: PASS (IndexedDB + export/import primary; File System Access optional with clarification)

Gate Evaluation: No constitution violations detected. Performance targets require concrete numbers in Phase 1 tasks (benchmarks and CI gating).

## Phase 0 — Research (deliverable: `research.md`)

Tasks (Phase 0):

- Research browser persistence patterns (IndexedDB best practices, `idb` wrapper, schema migrations).
- Research File System Access API support and fallback strategies (how to detect availability and request handles).
- Research Electron vs browser tradeoffs if a fixed filesystem path is required.
- Evaluate UI frameworks (MUI vs Ant Design vs Fluent) for enterprise dashboards and accessibility.
- Evaluate chart libraries: `recharts`, `visx`, `chart.js`, `apexcharts` for performance and accessibility.

Phase 0 Outcome: `research.md` consolidates decisions and records rationale and alternatives.

## Phase 1 — Design & Contracts (deliverables: `data-model.md`, `/contracts/*`, `quickstart.md`)

Phase 1 tasks (high level):

- Define data model (entities, fields, validation rules, sample JSON schema) in `data-model.md`.
- Produce IndexedDB schema file and migration guidance (`/contracts/indexeddb-schema.json`).
- Produce UI contracts: Options Page fields, Title Page/Load modal API, import validation schema (`/contracts/ui-contracts.md`).
- Quickstart: dev environment + run instructions (`quickstart.md`) using Vite + React + TS.
- Acceptance tests: list deterministic test cases for generation, turn resolution, Science Projects, persistence import/export, and Load modal behavior.

Implementation tasks (developer-focused):

- Bootstrapping: `npm init vite@latest` (React + TS) or equivalent; install `react`, `react-dom`, `typescript`, `vite`, `idb`, chosen UI framework, charting library, testing libs (`vitest`, `@testing-library/react`).
- IndexedDB integration: implement a small persistence service with typed schema, versioned migrations, and autosave hooks.
- Options Page: form generator bound to JSON config schema; save/load named configs; export/import buttons.
- Title Page: `New Game`, `Load Game` (opens modal with `Saved` and `Import` tabs), `Options` (navigates to Options Page).
- File handling: implement File System Access API usage when available (user-granted handles) with fallback to import/export file picker.
- Deterministic tests: add seeded RNG utilities and test harness for repeatable scenario runs.

## Phase 1 — Agent Context Update

Run: `.specify/scripts/bash/update-agent-context.sh copilot`

## Phase 2 — Finalize & CI

- Add CI jobs for deterministic integration tests and performance smoke tests.
- Add migration scripts for IndexedDB schema updates.

## Artifacts Created In This Phase

- `plan.md` (this file)
- `research.md` (created)
- `data-model.md` (created)
- `/contracts/indexeddb-schema.json` (created)
- `/contracts/ui-contracts.md` (created)
- `quickstart.md` (created)

## Stop & Report

- Branch: `001-empire-game-spec`
- Plan path: specs/001-empire-game-spec/plan.md
- Next actions: (1) complete `research.md` (Phase 0) and resolve `save_file_location` clarification, (2) finalize IndexedDB schema, (3) scaffold the React + TS app using Vite.

## Milestones

- M1 — Project scaffold (2 days): create Vite + React + TypeScript project, install MUI, `idb`, testing libs, and basic project layout.
- M2 — Persistence POC (3 days): implement typed IndexedDB service, save/load named configs, export/import JSON, and autosave hook.
- M3 — Options Page & Title Page (3 days): MUI-based Options Page form bound to config schema; Title Page with `New Game` / `Load Game` modal and `Import` tab.
- M4 — Deterministic Core & Tests (4 days): implement seeded RNG utilities and core deterministic tests for generation, turn resolution, and Science Project flows.
- M5 — Integration & CI (2 days): add CI jobs, run deterministic integration tests, and performance smoke tests; finalize documentation and quickstart.

Estimated total: ~2 weeks (10-14 work days) depending on iteration and review cycles.

## Acceptance Tests (explicit)

All acceptance tests are automated where possible and recorded in `tests/`.

- AT-001: Determinism — Given seed S, running world generation twice yields identical world JSON outputs. (Vitest unit)
- AT-002: Turn Resolution — With a fixed seed and a pre-built world, advancing N days with seeded RNG produces identical resource/time-series outputs across runs. (integration test)
- AT-003: Persistence Save/Load — Save a named config to IndexedDB, reload the page, and confirm the config is available and produces the same seeded generation. (integration)
- AT-004: Export/Import — Export a named config to JSON, clear IndexedDB, import the JSON, and verify the config restores and can be loaded. (integration)
- AT-005: Options Page — Edit a field in the Options Page, save as a named config, and assert the saved JSON matches the edited form values.
- AT-006: Title Page Load Modal — With multiple saved configs, open `Load Game` modal `Saved` tab and verify `Load`, `Delete`, and `Rename` actions work and are accessible via keyboard.
- AT-007: Science Project reservation — Start a Science Project and assert the required Science Points are reserved up-front and deducted from available Science. (unit)
- AT-008: Payments schedule — Simulate end-of-month payroll and assert salaries and upkeep are deducted on last day with prorating for mid-month hires. (unit/integration)
- AT-009: Performance smoke — Turn resolution completes within SC-001 budget (95% within 1s on CI runner representative VM). If CI runner differs, run on a local dev machine benchmark and report.

## CI Job Specs

CI will run on each PR and on push to `main`/feature branches. Jobs described below assume GitHub Actions but are framework-agnostic.

- `lint` — Run TypeScript compile checks, ESLint, and style checks. Failure blocks merge.
- `unit-tests` — Run Vitest unit tests (fast). Must pass before merging.
- `integration-deterministic` — Run a deterministic integration harness that executes world generation and a set of turn-resolution scenarios using fixed RNG seeds. Output artifacts: serialized worlds and diffs. Failure blocks merge.
- `export-import` — Integration job that validates export/import flows against sample configs.
- `performance-smoke` — Run a small suite that measures turn-resolution latency for representative seeds (record p95); if regressions exceed threshold, mark warning or fail per plan policy.
- `build` — Production build (`vite build`) to ensure bundling succeeds and tree-shaking works.

Example GitHub Actions workflow snippets (to be added to `.github/workflows/` during Phase 2):

```yaml
name: CI
on: [push, pull_request]
jobs:
    lint:
        runs-on: ubuntu-latest
        steps: [...run setup, npm ci, npm run lint...]
    unit-tests:
        runs-on: ubuntu-latest
        steps: [...npm ci, npm run test:unit...]
    integration-deterministic:
        runs-on: ubuntu-latest
        steps: [...npm ci, npm run test:integration -- --seed=ci-seed...]
    performance-smoke:
        runs-on: ubuntu-latest
        steps: [...npm ci, npm run test:perf...]
    build:
        runs-on: ubuntu-latest
        steps: [...npm ci, npm run build...]
```

## Updated Next Actions

1. Scaffold Vite + React + TS project and add MUI skeleton (M1).
2. Implement and test Persistence POC (M2).
3. Implement Options Page and Title Page (M3) and wire to persistence.
4. Implement deterministic core utilities and acceptance tests (M4 + AT-001..AT-004, AT-007..AT-008).
5. Add CI workflows and performance smoke tests (M5).

# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._
_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Plans MUST include a `Constitution Check` section that references
`.specify/memory/constitution.md` and documents compliance or a justified
exception for each applicable principle. At minimum verify and document:

- Code Quality & Maintainability: design notes, modularity concerns,
  and review/linters to be applied.
- Test-First & Automated Testing: list of required tests (unit,
  integration, acceptance) and how they will be automated.
- User Experience Consistency: acceptance criteria and UX metrics.
- Performance & Resource Constraints: measurable goals (p95/p99,
  memory/disk budgets) or "no performance impact" rationale.
- Local-First & Portability: how the feature operates on a local machine
  and any hosted opt-in behavior with privacy/security notes.

The `Constitution Check` should be a short table or bullets in the plan
and included in the plan's top-level summary.

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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
