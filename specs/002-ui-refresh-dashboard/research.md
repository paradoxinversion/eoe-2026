# research.md

Decision: Centralize theme tokens in a `ThemeTokens` module under `frontend/src/theme`.

Rationale: The project already uses a ThemeProvider pattern and a small set of global styles; introducing a single source of truth for colors, spacing, and typography reduces duplication and simplifies visual regression testing.

Alternatives considered:

- Keep ad-hoc CSS in components: rejected because it causes divergence and inconsistent UI.
- Introduce a design system library dependency: rejected to avoid new external runtime dependency for this UI-only change.

Decision: Apply responsive layout patterns (grid + stacked cards) for Dashboard Main.

Rationale: Grid with card components maps well to existing React components and simplifies snapshot testing across breakpoints.

Alternatives considered:

- Heavy layout refactor using CSS-in-JS with new runtime: rejected due to scope; prefer incremental token-driven approach.

Decision: Accessibility-first approach — run axe-core during CI and local dev.

Rationale: Accessibility is a constitutional requirement; integrating axe into tests prevents regressions.

Alternatives considered:

- Manual a11y reviews only: insufficient and not automated.

Notes:

- There were no unresolved NEEDS_CLARIFICATION items in the spec.
