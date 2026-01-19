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

````markdown
# Implementation Plan: UI Refresh — Dashboard Simplification

**Branch**: `002-ui-refresh-dashboard` | **Date**: 2026-01-18 | **Spec**: [spec.md]
**Input**: Feature specification from `/specs/002-ui-refresh-dashboard/spec.md`

## Summary

Improve the visual design and usability of the existing web frontend by centralizing theme tokens, simplifying the Dashboard Main layout, and moving advanced controls to an optional side panel. This is a UI-only change that preserves existing game mechanics (generation seed, persistence, turn mechanics) and focuses on accessibility, visual consistency, and maintaining performance baselines.

## Technical Context

**Language/Version**: TypeScript (ES2022), React 18, Vite (frontend)
**Primary Dependencies**: Vite, React, Vitest, @testing-library/react, axe-core
**Storage**: Local persistence via IndexedDB (service under `frontend/src/services/persistence.ts`)
**Testing**: Vitest for unit/integration/perf; axe-core integration for accessibility checks; tests under `frontend/tests/`
**Target Platform**: Web (desktop/tablet/mobile via responsive layout)
**Project Type**: Web application (frontend-only changes)
**Performance Goals**: No more than 20% regression in measured turn-advance UI latency vs baseline artifacts in `tests_output/` (measure p95/p99 where available)
**Constraints**: Local-first persistence for preferences; maintain WCAG 2.1 AA accessibility; keep bundle size and runtime overhead minimal
**Scale/Scope**: UI refresh limited to Dashboard and global theming; changes concentrated in `frontend/src/pages/Dashboard/*`, `frontend/src/components/*`, and a new `frontend/src/theme/` module.

## Constitution Check

Constitution Gate: Validate compliance before Phase 0 and re-check after Phase 1 design.

- **I. Code Quality & Maintainability**: Implement as modular components and a theme tokens module. New code must include unit tests and follow existing linting rules. PRs will include a short design note for reviewers.

- **II. Test-First & Automated Testing**: Required tests: unit tests for components, integration tests for End Turn and persistence, accessibility (axe) checks, and perf benchmarks. These will be run via existing Vitest commands and included in CI gating.

- **III. User Experience Consistency**: Acceptance criteria and measurable outcomes are documented in the spec (SC-001..SC-004). Visual-diff snapshots and responsive layout checks will be added.

- **IV. Performance & Resource Constraints**: Perf baselines exist in `tests_output/`. The plan requires performance verification (no >20% regression) and documents mitigation steps if regressions are detected.

- **V. Local-First & Portability**: Theme and UI preferences persist locally using the existing persistence layer; no hosted services are required.

No constitution violations detected; all principles are satisfied by the acceptance criteria and test plan.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-refresh-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── theme/            # new: theme tokens and tokenized components
│   └── services/
└── tests/
```

**Structure Decision**: This is a frontend-only web UI change; edits will be made in `frontend/` with a new `frontend/src/theme` module and focused updates to Dashboard-related components and pages.

## Complexity Tracking

No constitution violations requiring special tracking were found. If a violation is discovered during design, it will be added here with rationale.

## Next steps (Phase 0 -> Phase 1)

1. Phase 0: Research — produce `research.md` resolving any remaining clarifications and listing design options for theme tokens and layout patterns.
2. Phase 1: Design — produce `data-model.md` (UI entity definitions), `contracts/` (if any UI contracts), and `quickstart.md` with dev instructions; run `.specify/scripts/bash/update-agent-context.sh copilot` to refresh agent context.
3. Phase 2: Implementation tasks (`specs/.../tasks.md`) will be generated after design approval.
````
