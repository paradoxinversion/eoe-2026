# Research: Persistence, UI framework, and charts

## Decision: Tech stack

- Chosen: React + TypeScript, Vite for bundling.
- Rationale: Fast dev feedback, wide ecosystem, TypeScript for safer domain model evolution.
- Alternatives: CRA (legacy), Next.js (server features not needed now).

## Decision: UI Framework

- Chosen: MUI (Material-UI).
- Rationale: MUI supports enterprise dashboard components, accessible controls, theming, a large component surface (tables, forms, drawers), and has strong TypeScript support and community adoption.

## Decision: Charts

- Candidates: `recharts`, `visx`, `chart.js`.
- Recommendation: evaluate `recharts` and `visx`; choose based on accessibility and tree-shaking needs. `visx` offers finer control and smaller bundles; `recharts` is simpler to adopt.

## Decision: Persistence

- Primary: IndexedDB via `idb` wrapper for typed, promise-based usage.
- Portable: JSON export/import for manual backups and transfers.
- Decision: RESOLVED — initial implementation will use IndexedDB + export/import only. The File System Access API and Electron integration are explicitly out-of-scope for the initial implementation and may be re-evaluated later if a fixed-disk save requirement appears.

## Unknowns to resolve

- `save_file_location` semantics — Clarify whether the app will run in a context where a fixed disk path is accessible (Electron) or if the browser-only mode must rely on File System Access handles and IndexedDB.

## Libraries to evaluate in Phase 0

- `idb` (IndexedDB wrapper)
- `localforage` (higher-level fallback) — optional
- `file-saver` / File System Access API usage patterns
- `recharts`, `visx`, `chart.js`
- MUI accessibility and component patterns

## Rationale summary

- IndexedDB + export/import covers local-first and portability requirements while remaining browser-compatible. File System Access adds convenience but requires user consent and is not universally available; Electron should be used only if a fixed disk path is mandatory.
