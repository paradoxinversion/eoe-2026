# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

# Feature Specification: UI Refresh — Dashboard Simplification

**Feature Branch**: `002-ui-refresh-dashboard`
**Created**: 2026-01-18
**Status**: Draft
**Input**: User description: "Improve UI appearance across the app; simplify Main Dashboard page with modern styling and layout."

## Summary

Improve visual clarity and usability of the game's frontend by modernizing the global theme tokens, simplifying the Dashboard Main layout, and moving advanced controls out of the primary content area. The goal is a sleeker, more readable interface that reduces cognitive load while preserving all existing gameplay behavior.

## User Scenarios & Testing (mandatory)

P1 — Primary: Simplified Main Dashboard

- User: New or returning player
- Goal: View the Main dashboard and perform core turn actions (End Turn, quick info) with minimal distractions
- Flow: Player opens game → Dashboard → Main tab visible with day/turn, player name, three primary metrics, End Turn button, quick actions panel
- Independent Test: Render Dashboard Main, verify presence and ordering of primary elements, simulate End Turn action and assert game state advances

Acceptance Scenarios (P1):

1. Given the player is on Dashboard Main, when the page loads, then the header shows player name, day/turn, and three primary metrics in the top region.
2. Given the player presses End Turn, when the confirmation (if shown) is accepted, then the turn advances and the UI updates within one second.

---

P2 — Theme tokens and visual polish

- User: Any player who changes theme or views dashboard
- Goal: Use coherent color, spacing, and typography tokens across screens; default to dark theme
- Independent Test: Toggle theme in Settings and confirm tokens update color/contrast and persist across reloads

Acceptance Scenarios (P2):

1. Given default install, when the player first opens the app, then the dark theme is applied.
2. Given a player toggles theme to light and reloads, then the selected theme persists.

---

P3 — Advanced controls relocated (P3)

- User: Power user who uses advanced controls frequently
- Goal: Move rarely used controls out of the central view into a collapsible side panel or modal to declutter the Main area
- Independent Test: Confirm advanced controls are accessible via a clearly labeled toggle and remain functional

Acceptance Scenarios (P3):

1. Given Dashboard Main, when user opens "Advanced" panel, then the controls are visible and functional.

---

Edge Cases

- Very small viewports: Ensure layout stacks vertically and End Turn remains reachable.
- Large metric values: Truncate or wrap values; ensure layout doesn't break.
- Persistent user preferences: If persistence store is unavailable, UI falls back to default theme and shows an unobtrusive warning.

## Requirements (mandatory)

- FR-UI-001: Update and centralize theme tokens (colors, spacing, typography scale, elevation) so all screens use the same token set.
    - Acceptance: Theme tokens are applied across Dashboard, Title, and Settings; visual regressions compared to prior baseline are intentional and documented.

- FR-UI-002: Redesign Dashboard Main layout to present (1) top header with player name and day/turn, (2) three primary metric cards, (3) End Turn prominent control, (4) quick actions area; layout must be responsive.
    - Acceptance: Automated layout snapshot tests for desktop/tablet/mobile match expected component presence and ordering.

- FR-UI-003: Move advanced controls out of primary content into an accessible side panel or modal reachable from Main.
    - Acceptance: Controls remain fully functional and accessible via keyboard and screen reader.

- FR-UI-004: Preserve existing game behavior and data flows (generation seed, saving, End Turn mechanics) — this feature is UI-only unless a regression is discovered.
    - Acceptance: Integration tests that exercise turn progression and persistence continue to pass.

- FR-UI-005: Accessibility: All updated components must pass existing accessibility checks (axe-based) with no new violations of WCAG 2.1 AA criteria for color contrast and semantics.
    - Acceptance: Axe reports show zero new violations; any remaining warnings are documented with justification.

- FR-UI-006: Performance: UI updates for End Turn and primary screen transitions must remain within existing perf baselines (no >20% regression in measured metrics).
    - Acceptance: Perf benchmark comparison to baseline artifacts shows no more than 20% regression.

## Measurable Outcomes / Success Criteria

- SC-001: 95% of users can find and use the End Turn control within 5 seconds on first load (measured via usability test or instrumented telemetry).
- SC-002: Theme toggle changes persist across reloads for 100% of successful saves in environments where persistence is available.
- SC-003: Accessibility: No new critical or severe accessibility violations introduced (axe severity >= critical) across updated pages.
- SC-004: Performance: Average turn-advance UI latency increases by no more than 20% compared to baseline artifacts in `tests_output/`.

## Key Entities (if data involved)

- `ThemeTokens`: set of named tokens (primary, background, surface, text, muted, spacing scale, typography scale) — described conceptually only.
- `DashboardLayout`: presentation composition of header, metrics, actions, advanced panel.

## Assumptions

- The project will reuse the existing frontend theming and persistence mechanism; this work will focus on token values and component layout rather than introducing new platform dependencies.
- Existing gameplay APIs (turn advance, generation, persistence) remain unchanged and will be used as-is.

## Acceptance Tests / Test Plan

- Unit tests: component rendering, token application, accessibility smoke tests.
- Integration tests: end-to-end turn progression and persistence flows must remain green.
- Accessibility: Run axe-core checks on updated pages; report and resolve violations.
- Visual testing: Generate snapshot/visual-diff baselines for Dashboard Main desktop/tablet/mobile.

## Dependencies

- Existing persistence and generation services (seed, save/load) must be present and exercised by integration tests.

## Constitution References (mandatory)

- See `.specify/memory/constitution.md` for relevant principles. This feature emphasizes "Local-first" behavior (preferences persist locally) and "Accessible by default"; testing and measurable acceptance criteria are included above.

## Notes

- This spec intentionally avoids implementation details (libraries, frameworks). Where the project has existing conventions, those will be followed and documented in implementation tasks.
