# data-model.md

This feature is UI-focused; data-model changes are minimal. The following conceptual entities are used by the UI for presentation and are NOT new persisted domain models.

- Entity: `ThemeTokens`
    - Fields: `primary`, `background`, `surface`, `text`, `muted`, `accent`, `error`, `spacingScale`, `typographyScale`
    - Relationships: used by components for styling; persisted preference is a single `themeMode` ("dark" | "light") in existing persistence store.

- Entity: `DashboardLayout`
    - Fields: `playerName`, `day`, `turn`, `metricCards[]`, `quickActions[]`
    - Relationships: reads from existing game state (no new persistence)

Validation rules:

- `themeMode` must be one of `dark` or `light` and defaults to `dark`.
- `metricCards` should contain exactly 3 primary metrics for Main; additional metrics move to Advanced panel.

State transitions:

- Theme toggle updates `themeMode` and persists via existing persistence service.
- End Turn triggers existing `advanceTurn()` flow; UI should re-render and show updated day/turn.
