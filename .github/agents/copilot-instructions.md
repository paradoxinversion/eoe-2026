# eoe-2026 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-17

## Active Technologies
- TypeScript (frontend); Node 18+ for tooling where applicable. + React 18, Vite, Material-UI (MUI) for components, uuid for ids; test deps: Vitest, @testing-library/react, axe-core for a11y. (001-rework-data-models)
- Local-first IndexedDB via the existing `frontend/src/services/persistence.ts` (browser). Export/import via file fallback. (001-rework-data-models)

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
- 001-rework-data-models: Added TypeScript (frontend); Node 18+ for tooling where applicable. + React 18, Vite, Material-UI (MUI) for components, uuid for ids; test deps: Vitest, @testing-library/react, axe-core for a11y.
- 002-ui-refresh-dashboard: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
- 001-dashboard-ui: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]


<!-- MANUAL ADDITIONS START -->

## Constitution

This document is derived from feature plans and MUST surface how
generated guidance aligns to the project's constitution at
`.specify/memory/constitution.md`. Include a short mapping of active
recommendations to constitution principles (Code Quality, Testing,
UX Consistency, Performance, Local-First) in the top section.

<!-- MANUAL ADDITIONS END -->
