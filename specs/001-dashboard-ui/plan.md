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

```markdown
# Implementation Plan: Dashboard UI (001-dashboard-ui)

**Branch**: `001-dashboard-ui` | **Date**: 2026-01-18 | **Spec**: [spec.md](spec.md#L1)
**Input**: Feature specification from `/specs/001-dashboard-ui/spec.md`

## Summary

Primary requirement: Add a Title Page New Game flow that collects a character `name`, runs a deterministic (seeded) world generation while showing a blocking progress modal, and navigates to the Dashboard Main page on success. The Dashboard must expose tabs (Main, Intel, Personnel, Economy, Infirmary, Captives, Settings), support Dark/Light theme (default Dark), persist theme and seed, and reuse existing services (`generation.ts`, `persistence.ts`, `turn.ts`) where possible.

Technical approach: implement a `CharacterGeneration` component that validates `name`, invokes the existing world generation service with an explicit seed (persisting it to IndexedDB via current persistence layer), displays `LoadModal` while generation runs, and navigates programmatically to the Dashboard once generation completes. Reuse `EndDayButton.tsx` or wire `End Turn` to the `turn` service. Provide unit and integration tests for deterministic generation and the end-to-end New Game flow.

## Technical Context

**Language/Version**: TypeScript (project contains `tsconfig.json`) targeting modern browsers (ES2022+/ESNext).  
**Primary Dependencies**: React + Vite (frontend/), Vitest and @testing-library/react for tests; existing local services under `src/services` (`generation.ts`, `persistence.ts`, `turn.ts`).  
**Storage**: Local-first persistence using IndexedDB/localStorage via the existing `persistence.ts` service and repository contracts (see `specs/001-empire-game-spec/contracts/indexeddb-schema.json`).  
**Testing**: Vitest (unit) + React Testing Library (component/integration) + existing accessibility tests in `tests/accessibility`. Acceptance tests for New Game flow should be added as integration/e2e tests (CI-run).  
**Target Platform**: Web browser (desktop and mobile responsive).  
**Project Type**: Web application (frontend folder present).  
**Performance Goals**: New Game flow (name → generation → Dashboard) should complete within 15s for 90% of runs in developer/test environments; tab switches should update visible content within 1s for 95% of interactions. Generation progress must be reported and not freeze the main thread (use web-worker or chunked generation if needed).  
**Constraints**: World generation MUST be deterministic and reproducible from a seed; UI must be local-first and not depend on hosted services.  
**Scale/Scope**: Single frontend app; changes limited to `frontend/src` components and services, with tests under `tests/`.

## Constitution Check

This plan references `.specify/memory/constitution.md` and documents compliance below. Any deviation must be justified in the PR.

- **I. Code Quality & Maintainability**: Comply — changes are scoped to new components and service wiring. Reuse existing services (`generation.ts`, `persistence.ts`) to avoid duplication. PRs will include linters and at least one reviewer.
- **II. Test-First & Automated Testing**: Comply — write unit tests for generation logic, component tests for `CharacterGeneration` and `LoadModal`, integration test that runs the New Game flow end-to-end, and deterministic tests asserting identical world outputs for the same seed. CI MUST run these tests.
- **III. User Experience Consistency**: Comply — acceptance criteria and measurable success metrics are in the feature `spec.md`. Accessibility tests (keyboard focus, aria labels) will be added for new UI controls.
- **IV. Performance & Resource Constraints**: Comply with measured goals; plan includes adding a benchmark test (simple generation performance measurement) and an integration timing assertion for the New Game flow. If generation blocks the main thread, consider migrating the heavy work to a Web Worker (documented in the PR).
- **V. Local-First & Portability**: Comply — use existing local persistence; no hosted backend required. Seeds and preferences persist locally via IndexedDB. Privacy: no telemetry or external sync by default.

## Project Structure (selected)

This repository already has a `frontend/` single-page application. The feature will live under `frontend/src` with the following additions/edits:

- `frontend/src/pages/TitlePage.tsx` (add `New Game` button)
- `frontend/src/pages/CharacterGeneration.tsx` (new component)
- `frontend/src/components/LoadModal.tsx` (reuse/edit existing)
- `frontend/src/pages/Dashboard/*` (tabs wiring; reuse existing sub-pages)
- `frontend/src/services/generation.ts` (call sites updated to accept/persist seed)
- `frontend/src/services/persistence.ts` (persist theme and seed if necessary)

Tests: add new tests under `tests/integration/` and component tests under `tests/unit/`.

## Next Steps (Phase mapping)

- Phase 0: Resolve any remaining clarifications (seed key name, persistence schema location) and update `research.md`.
- Phase 1: Produce `data-model.md`, update or confirm contracts in `contracts/`, and publish `quickstart.md` adjustments.
- Phase 2: Create `tasks.md` with implementation tasks, implement code, and author tests.

## Complexity Tracking

No constitution violations are anticipated. If heavy CPU usage causes UI stalls, we will add a short justification and propose a Web Worker migration; that will be documented in Complexity Tracking if chosen.
```

directories captured above]
