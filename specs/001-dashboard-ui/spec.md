# Feature Specification: Dashboard UI

**Feature Branch**: `001-dashboard-ui`  
**Created**: 2026-01-18  
**Status**: Draft  
**Input**: User description: "Add a Title Page New Game flow with Character Generation (name input), generate world on completion, then navigate to Dashboard with tabs: Main, Intel, Personnel, Economy, Infirmary, Captives, Settings. Main must include End Turn button. Add Dark/Light mode (default Dark) and wire existing functionality where possible."

## Clarifications

### Session 2026-01-18

- Q: World generation UX — block and wait, generate in background, or progressive load? → A: Option A (blocking progress modal; wait for generation to finish before navigating to Dashboard).
- Q: Determinism for world generation? → A: Follow `001-empire-game-spec`: deterministic, seeded generation (same seed produces identical world).

# Feature Specification: Dashboard UI

**Feature Branch**: `001-dashboard-ui`
**Created**: 2026-01-18
**Status**: Draft
**Input**: User description: "Add a Title Page New Game flow with Character Generation (name input), generate world on completion, then navigate to Dashboard with tabs: Main, Intel, Personnel, Economy, Infirmary, Captives, Settings. Main must include End Turn button. Add Dark/Light mode (default Dark) and wire existing functionality where possible."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - New Game flow (Priority: P1)

A new or returning player starts at the Title Page, taps `New Game`, enters a character name on the Character Generation page, and confirms. The system runs world generation and then navigates the player to the Dashboard Main page.

**Why this priority**: This is the primary onboarding flow that creates playable state and must be testable end-to-end.

**Independent Test**: From the Title Page, tap `New Game`, enter a name, confirm; verify world generation completes and the Dashboard Main page is shown with the player's name present.

**Acceptance Scenarios**:

1. **Given** the Title Page is shown, **When** the user taps `New Game`, **Then** the Character Generation page is displayed with a required name input field.
2. **Given** the user enters a valid name and confirms, **When** world generation completes, **Then** the app navigates to the Dashboard Main page.
3. **Given** world generation fails, **When** an error occurs, **Then** the user sees a clear, retryable error message and can return to Title Page.

---

### User Story 2 - Dashboard navigation & End Turn (Priority: P1)

A player on the Dashboard can switch between tabs: Main, Intel, Personnel, Economy, Infirmary, Captives, Settings. The Main tab includes a visible `End Turn` button that triggers the existing turn/advance logic.

**Why this priority**: Core gameplay controls and navigation must be available immediately after onboarding.

**Independent Test**: From Dashboard, tap each tab and verify the corresponding sub-page is displayed; on Main, tap `End Turn` and confirm game advances (turn counter or visible state change).

**Acceptance Scenarios**:

1. **Given** the Dashboard is displayed, **When** the user selects `Intel`, **Then** the Intel view is shown.
2. **Given** the user is on `Main`, **When** the user taps `End Turn`, **Then** the game advances one turn and relevant UI updates occur (day counter, events).

---

### User Story 3 - Theme (Dark/Light) (Priority: P2)

Players can choose Dark or Light mode from Dashboard Settings. Dark mode is the default. The selection persists across sessions.

**Why this priority**: Improves accessibility and user comfort; defaulting to Dark matches existing design preference.

**Independent Test**: Open Settings, toggle theme, restart app or reload; verify theme persists and default is Dark for fresh installs.

**Acceptance Scenarios**:

1. **Given** a fresh install, **When** first visiting Dashboard, **Then** UI is in Dark mode.
2. **Given** the user switches to Light mode, **When** they return later, **Then** the selected mode remains active.

---

### Edge Cases

- Name input left blank: user cannot proceed; inline validation is shown.
- Very long names: system truncates display or shows ellipsis; full name stored for saves.
- World generation takes long: show a blocking progress modal with an estimated progress indicator; provide a retry action and an option to cancel generation if appropriate.
- World generation fails due to resource error: present retry and diagnostics.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The Title Page MUST include a `New Game` button that navigates to a Character Generation page.
- **FR-002**: The Character Generation page MUST include a required `Name` input and a `Confirm` button. Empty names are rejected with an inline error.
- **FR-003**: After confirmation, the system MUST trigger world generation, show a blocking progress modal while generation runs, and only navigate to the Dashboard Main page after generation completes successfully. If generation fails the UI MUST present a clear, retryable error and remain on or return the user to the Character Generation/Title Page flow.
- **FR-003**: After confirmation, the system MUST trigger world generation, show a blocking progress modal while generation runs, and only navigate to the Dashboard Main page after generation completes successfully. World generation MUST be deterministic and reproducible from a seed (the system SHALL accept and persist a seed value; if none is provided a generated seed may be used). If generation fails the UI MUST present a clear, retryable error and remain on or return the user to the Character Generation/Title Page flow.
- **FR-004**: On successful generation, the system MUST navigate to the Dashboard Main page and display the created character's name on the UI.
- **FR-005**: The Dashboard MUST provide navigation controls (tabs or buttons) to switch between: Main, Intel, Personnel, Economy, Infirmary, Captives, Settings.
- **FR-006**: The Main sub-page MUST include an `End Turn` button that invokes the existing turn-advancement logic.
- **FR-007**: The Dashboard MUST support Dark and Light modes; the default for new installs MUST be Dark; the user MUST be able to change the mode from Settings.
- **FR-008**: The selected theme choice MUST persist across app sessions (saved in persisted preferences).
- **FR-009**: The implementation SHOULD reuse existing services and UI components where available (world generation, persistence, end-turn logic).

### Key Entities

- **Player / Evil Overlord**: Character created by the user. Attributes: `name` (string), `id` (opaque), `preferences` (includes theme).
- **World**: Generated game state produced after character creation. Attributes: generation `status`, seeds/parameters, and generated zones/agents.
- **Dashboard**: UI container for sub-pages and navigation; holds current tab, turn state, and theme.
- **CharacterGenerationSession**: transient object representing the in-progress creation and generation state.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 95% of users who tap `New Game` and enter a name reach the Dashboard Main page without manual intervention.
- **SC-002**: The New Game flow (tap `New Game` → enter name → confirm → Dashboard Main visible) completes within 15 seconds for 90% of runs (including world generation progress display when applicable).
- **SC-003**: Dashboard displays the required tabs (Main, Intel, Personnel, Economy, Infirmary, Captives, Settings) and switching between tabs updates the visible content within 1 second for 95% of interactions.
- **SC-004**: The `End Turn` action advances one turn and updates visible state; automated tests should assert turn count increments after pressing `End Turn` in 100% deterministic unit/integration runs.
- **SC-005**: On first run, the UI defaults to Dark mode; after a user selects Light mode, the choice persists across app reloads in 100% of saved sessions.

## Assumptions

- World generation may be asynchronous and may reuse existing `generation.ts` logic in `src/services`.
- Character creation is initially limited to a single `name` field; additional attributes can be added later.
- Persistence layer is already available via `persistence.ts` and can store simple preferences.
- Navigation is implemented client-side and supports programmatic routing to Dashboard pages.

## Constitution References _(mandatory)_

- Principle: Local-First & Resilience — feature uses existing local generation and persistence where possible; when generation fails, the UI surfaces retry and graceful fallback.
- Principle: Accessibility — UI controls (tabs, buttons, inputs) must be keyboard and screen-reader accessible; see `specs/001-empire-game-spec/accessibility.md` for baseline.
- Principle: UX Consistency — Dashboard tabs follow existing app styling and navigation patterns to maintain consistency with other pages.

Reference: see `.specify/memory/constitution.md` for full principles and `specs/001-empire-game-spec/accessibility.md` for accessibility obligations.

## Implementation Notes (non-normative)

- Add a `New Game` button to the existing `TitlePage` that navigates to a `CharacterGeneration` page/component.
- Consider reusing the existing `generation.ts` world-generation logic and show a progress modal (`LoadModal.tsx`) during generation.
- Wire the `End Turn` button to the existing turn service and reuse the UI `EndDayButton.tsx` where appropriate.
- Save theme preference using the existing persistence layer and expose the toggle within the `Settings` sub-page.

---

**Spec Ready for Planning**: YES
