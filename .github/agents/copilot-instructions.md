# eoe-2026 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-17

## Active Technologies
- TypeScript (frontend); Node 18+ for tooling where applicable. + React 18, Vite, Material-UI (MUI) for components, uuid for ids; test deps: Vitest, @testing-library/react, axe-core for a11y. (001-rework-data-models)
- Local-first IndexedDB via the existing `frontend/src/services/persistence.ts` (browser). Export/import via file fallback. (001-rework-data-models)
- TypeScript (as configured in `tsconfig.json`) + React, Vite, Material-UI (existing in project), AJV (for fixtures/contracts), `idb`/IndexedDB persistence helpers. (003-personnel-tab)
- IndexedDB via existing persistence layer in `frontend/src/services/persistence.ts`. (003-personnel-tab)

- (001-empire-game-spec)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for 

## Code Style

: Follow standard conventions

## Recent Changes
- 003-personnel-tab: Added TypeScript (as configured in `tsconfig.json`) + React, Vite, Material-UI (existing in project), AJV (for fixtures/contracts), `idb`/IndexedDB persistence helpers.
- 001-rework-data-models: Added TypeScript (frontend); Node 18+ for tooling where applicable. + React 18, Vite, Material-UI (MUI) for components, uuid for ids; test deps: Vitest, @testing-library/react, axe-core for a11y.
- 002-ui-refresh-dashboard: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]


<!-- MANUAL ADDITIONS START -->

## Constitution

This document is derived from feature plans and MUST surface how
generated guidance aligns to the project's constitution at
`.specify/memory/constitution.md`. Include a short mapping of active
recommendations to constitution principles (Code Quality, Testing,
UX Consistency, Performance, Local-First) in the top section.

<!-- MANUAL ADDITIONS END -->
