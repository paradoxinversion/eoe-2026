# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

```markdown
# Feature Specification: Empire of Evil — Core Gameplay

**Feature Branch**: `001-empire-game-spec`  
**Created**: 2026-01-17  
**Status**: Draft  
**Input**: User description: "Empire of Evil, a turn based game about world domination that is played in the browser. The game is played via a mock profesional dashboard. The goal of the game is to take over the world through various Plots that result in benefits and/or consequences for the player. Each turn is a 'day' in game time. The world is represented by Zones that have populations of People and various types of Buildings. Zones are controlled by a Governing Organization. The world is created procedurally, during which time Governing Organizations, Zones, People, and Buildings are created. Players 'Bide their time' to end their turn by clicking a button in the interface, during which time Plots are executed and Random Events. Random Events may be good or bad for the Player's Empire. The player will have to manage four resources: EVIL, Money, Infrastructure, and Science. EVIL allows the empire access to certain plots and influences the chances of another Governing Organization targeting them. Money is how much money the Empire has on hand, and is used to pay Agents, which are people who work for a Governing Organization. Infrastructure determines how many zones the Empire can control at one time. Science points are accumulated by Agents that are Scientists, and spent on purchasing new technologies for the Empire to use. The player loses the game when their character is killed, or the Empire has lost all of it's zones."

## Clarifications

### Session 2026-01-17

- Q: When are Agents and Building upkeep payments scheduled? → A: Agents and Building upkeep are paid on the last day of each month.
- Q: What is the Player's character model and permissions? → A: The Player's character is a special Agent type that can be assigned to any activity, work, or Plot regardless of other Agents' type restrictions; the Player character's death triggers game over.
- Q: How do Activities work and where do they appear in the UI? → A: Activities are assigned to individual Agents, incur a daily cost per participant, and produce specific effects (e.g., increase an Agent's attributes or increase loyalty among Citizens in the Zone where the activity takes place). Activities appear on the same interface page as Plots. Daily activity costs are applied during Turn Resolution each day the Activity runs; plans should define queuing, multi-day activities, and insufficient-funds behavior.
- Q: What are Building types and their effects? → A: Buildings are typed: `Residence`, `Office`, `Lab`, `Hospital`.
    - Residences: house People.
    - Offices: staffed by Administrators; Administrators working in Offices increase the Governing Organization's current Infrastructure level.
    - Labs: staffed by Scientists; Scientists working in Labs increase the Governing Organization's Science points.
    - Hospitals: staffed by Doctors; Doctors working in Hospitals increase patient health (applied at end of each turn).
      Buildings have an `infrastructure_load` that reduces a Governing Organization's available infrastructure points while the building exists/operates.
- Q: Are Agents only Player-assigned? → A: No. Agents are People employed by any Governing Organization (player or non-player). Employment determines pay, available assignments, and allegiance; plans must define hiring, transfer, and contract rules.
- Q: What happens when the Empire lacks funds for scheduled payments? → A: Grace period with penalties: allow a configurable grace window (default 7 days) before desertion; during the grace period unpaid Agents suffer reduced effectiveness and Buildings may operate at reduced capacity. Plans MUST define penalty magnitudes, prorating, UI messaging, and final desertion behavior.
- Q: How does `infrastructure_load` aggregate across Buildings? → A: Sum only operational buildings' `infrastructure_load` (staffed/active buildings count). A Building is considered operational if it has at least one assigned staff AND is not marked inactive. Unstaffed or inactive Buildings do not consume infrastructure capacity. Plans MAY define stricter role-specific staffing thresholds (e.g., Labs requiring X Scientists) only when deviating from this default.
- Q: How does the Intelligence screen and accuracy work? → A: The interface includes an `Intelligence` tab leading to an Intelligence Screen presenting per-Zone Intelligence Data. For each Zone the screen shows population data (the `surveillance_profile`) and buildings data (the `asset_profile`). The accuracy and completeness of displayed data SHALL be determined by the Zone's `intelligence_level` (0-100%). The Player's initial starting Zone SHALL have `intelligence_level` = 100%. Plans MUST define how `intelligence_level` is acquired, modified, and decays, the mapping from `intelligence_level` to data accuracy/visibility, and UI refresh/update frequency.
- Q: What daily behavior do non-Agent People exhibit and how is it surfaced? → A: People who are not Agents perform one daily "action" each day (e.g., `work`, `stay_home`, `go_out`, `socialize`). Employed People attend `work` five days per week by default; on non-work days they may `stay_home` or `go_out`. If a Person is under Player surveillance, their daily actions are recorded in a `surveillance_profile` (visible to the Player) showing recent actions and timestamps. Plans MUST define action selection rules, weekday scheduling, and what details exposure in the `surveillance_profile` (privacy granularity).
- Q: How are Science Points deducted for Science Projects? → A: Science Points required for a Science Project are deducted (reserved) up-front when the project is started.
- Q: How are game configuration files stored and edited? → A: Primary storage SHALL be in-browser (IndexedDB) with an Options Page form-based editor that reads/writes the JSON configuration. Players SHALL also be able to export and import JSON configuration files and save multiple named configurations.
- Q: What buttons and load behavior should the Title Page provide? → A: The Title Page SHALL present `New Game`, `Load Game` (if any saved configs exist), and `Options`. The `Load Game` flow SHALL open a modal with two tabs: `Saved` (lists named configs from IndexedDB) and `Import` (file picker to load a JSON config). The `Options` button SHALL open the form-based Options Page for editing and saving configurations.

## User Scenarios & Testing (mandatory)

### User Story 1 - Core Turn Loop (Priority: P1)

As a Player I open the browser dashboard, review my Empire's status, make decisions (hire Agents, allocate spending, pick or queue Plots), and then click the "Bide Time / End Day" control to progress the game one day.

Why this priority: This delivers the core playable loop and validates core mechanics (resource changes, plot execution, random events, win/lose conditions).

Independent Test: Using a local build or dev harness, trigger a turn execution with a seeded world and assert deterministic outcomes for Plots and Random Events when using a fixed RNG seed.

Acceptance Scenarios:

1. Given a Player with resources and at least one actionable Plot, When the Player clicks "Bide Time", Then Plots resolve, Random Events run, resources update, and a turn summary is shown within the performance budget (see Success Criteria).
2. Given a Player whose character is killed during resolution, When the turn completes, Then the game enters the "lost" state and displays the defeat summary.
3. Given the Empire loses control of all Zones during resolution, When the turn completes, Then the game enters the "lost" state and displays the defeat summary.

---

### User Story 2 - Procedural World Creation (Priority: P2)

As the system I generate a new world at game start: create Zones, assign populations of People, generate Buildings, and create Governing Organizations that control Zones.

Why this priority: The world model underpins all gameplay and must be deterministic for testing and replay.

Independent Test: Run world generation with a fixed RNG seed and assert stable counts and expected relationships (zones >0, each zone has a governing organization, persons and buildings assigned).

Acceptance Scenarios:

1. Given a new game is started with seed S, When generation completes, Then the same seed S produces an identical world structure (zones, organizations, people, buildings).
2. Given generated Zones, When inspected, Then each Zone references a Governing Organization and contains at least one Person or Building.

---

### User Story 3 - Agents, Roles, and Technologies (Priority: P3)

As a Player I hire Agents (of roles: Scientist, Operative, Engineer, etc.), pay them from Money each turn, and use Scientists to accumulate Science points to purchase Technologies.

Why this priority: Agents and technologies materially affect strategy but can be implemented after the core loop and generation are in place.

Independent Test: Simulate hiring an Agent, run several turns, assert Money decreases by pay rate each turn, Scientists accumulate Science per turn, and Technology purchase deducts Science and unlocks new Plots.

Acceptance Scenarios:

1. Given an Agent is hired and paid, When N turns elapse, Then Money reduced by N \* pay and Agent remains active unless removed.
2. Given Scientist Agents assigned to research, When research runs, Then Science increases and Technologies may be purchased when thresholds are met.

---

### Edge Cases

- No Money: If the Empire lacks Money to pay Agents, Agents become Unpaid and may desert or reduce effectiveness per well-documented rules.
- Maximum Infrastructure: If Infrastructure limit reached, claiming additional Zones is blocked and causes an explicit UI message.
- Concurrent Events: Multiple Plots affecting the same Zone are resolved in a deterministic order (e.g., by priority then by timestamp) to ensure testability.

## Requirements (mandatory)

### Functional Requirements

- FR-001: Turn Resolution — The system MUST provide a single action that advances game state by one day, running Plots and Random Events deterministically when using a fixed RNG seed.
- FR-002: Procedural Generation — The system MUST generate a world (Zones, People, Buildings, Governing Organizations) at new-game time that is reproducible from a seed.
- FR-003: Resources — The system MUST represent and update the four resources (EVIL, Money, Infrastructure, Science) each turn according to defined rules.
- FR-004: Agents — The system MUST support hiring, paying, and assigning Agents with roles; pay is deducted each turn and Agents provide role-based effects.
- FR-005: Zone Control & Infrastructure Cap — The system MUST enforce an Infrastructure budget limiting the number of Zones controllable by the Empire; control changes occur only during Turn Resolution.
- FR-006: Technologies, Science & Projects — The system MUST allow Science accumulation and spending and support multi-day `Science Project` objects that consume (or reserve) Science Points at start and produce Technologies or unlocks when completed. Science Projects SHALL have deterministic progress and duration calculations influenced by assigned Scientist Agents' skill levels and Lab efficiencies controlled by the Governing Organization. The implementation MUST allow deterministic testing (seeded runs) of project completion times and ensure Plans define the progress formula, cancellation/refund rules, and any UI flows. Some Plots or Technologies SHALL be allowed to declare completed Science Projects as prerequisites.
- FR-006: Technologies, Science & Projects — The system MUST allow Science accumulation and spending and support multi-day `Science Project` objects that consume (or reserve) Science Points at start and produce Technologies or unlocks when completed. Science Projects SHALL have deterministic progress and duration calculations influenced by assigned Scientist Agents' skill levels and Lab efficiencies controlled by the Governing Organization. The implementation MUST allow deterministic testing (seeded runs) of project completion times and ensure Plans define the progress formula, cancellation/refund rules, and any UI flows. For this feature, Science Points required for a Science Project SHALL be deducted (reserved) up-front when the project is started; plans MAY specify refund rules on cancellation. Some Plots or Technologies SHALL be allowed to declare completed Science Projects as prerequisites.
- FR-007: Win/Lose Conditions — The system MUST detect and surface loss conditions: Player character death OR Empire controls zero Zones; it MUST also support win conditions defined in plans.
- FR-008: Local-First Operation — The feature MUST operate on a local machine/browser without requiring hosted backends; data persistence and full gameplay must be possible locally (see Assumptions).
- FR-008: Local-First Operation — The feature MUST operate on a local machine/browser without requiring hosted backends; data persistence and full gameplay must be possible locally. Primary local persistence SHALL use in-browser storage (IndexedDB) with an Options Page form-based editor that reads/writes the JSON configuration file. Players MUST be able to export and import JSON configuration files for portability and backups, and manage multiple named saved configurations within the Options Page (see Assumptions).
- FR-009: Accessibility & UX — The UI MUST provide readable labels, keyboard navigation for primary controls, and clear error/confirmation dialogs for destructive actions.
- FR-010: Deterministic Tests — For core game logic (generation, turn resolution) the system MUST support deterministic test runs via seeded RNG to enable reproducible test cases.

- FR-011: Payments Schedule — Agents' salaries and Building upkeep MUST be deducted on the last day of each month. Salaries for hires or departures within a pay month SHALL use daily prorating (pay = monthly_salary \* days_worked / days_in_month); plans MUST define rounding, inclusive/exclusive day rules, and payday edge-cases. When funds are insufficient, the system SHALL apply a configurable grace period with penalties (default 7 days) before permanent desertion or deactivation; plans MUST define penalty magnitudes, UI messaging, and final outcomes.
- FR-012: Player Character Model — The Player's character MUST be represented as a special Agent subtype with permission to be assigned to any activity, work, or Plot regardless of other Agents' type restrictions. The Player Character's death MUST trigger the game's loss condition. Plans MUST document how Player Character assignment, status, and death are persisted and displayed in the UI.
- FR-013: Activities — The system MUST support Activities that are assigned to individual Agents (one or many). Each Activity SHALL declare a `daily_cost` per participant, a `zone` where it runs, and `effects` (attribute deltas, loyalty changes, income modifiers). Activities MUST appear on the dashboard alongside Plots and be resolved during Turn Resolution; plans MUST define queuing, multi-day Activities, and insufficient-funds behavior.
- FR-014: Building Types & Effects — The system MUST model Buildings with types `Residence`, `Office`, `Lab`, and `Hospital` and enforce their roles and effects: Residences house People; Offices staffed by Administrators increase Infrastructure; Labs staffed by Scientists increase Science points; Hospitals staffed by Doctors increase patient health at end of each turn. Plans MUST detail staffing rules and per-turn application of effects.
- FR-015: Infrastructure Load — Each Building MUST declare an `infrastructure_load` integer that reduces the Governing Organization's available infrastructure budget while present. The system SHALL aggregate `infrastructure_load` by summing only operational Buildings' loads; a Building is operational when it has at least one assigned staff and is not marked inactive. Unstaffed or inactive Buildings SHALL not consume capacity. Plans MAY specify role-specific staffing thresholds only if they diverge from this default.

- FR-016: Daily Person Activity — The system MUST simulate one daily `action` for every Person who is not an Agent. Employed People SHALL perform `work` five days per week by default; on other days they may `stay_home` or `go_out`. Daily actions MUST be recorded (time-stamped) and surfaced in a `surveillance_profile` when that Person is surveilled by the Player's Empire. Plans MUST define action selection, scheduling rules, and privacy/exposure levels for surveillance.

- FR-017: Intelligence & Recon — The UI MUST provide an `Intelligence` tab and Intelligence Screen that presents per-Zone Intelligence Data including population surveillance summaries and building asset information. The accuracy and completeness of Intelligence data displayed SHALL be a function of each Zone's `intelligence_level` (0-100%). The Player's starting Zone SHALL have `intelligence_level` = 100%. Plans MUST specify how `intelligence_level` is earned or degraded, the mapping from `intelligence_level` to visible data fields and accuracy, caching/refresh cadence, and performance budgets for rendering Intelligence screens.

- FR-018: Title Page & Config Management — The UI MUST provide a Title Page with `New Game`, `Load Game` (shown only if saved configurations exist), and `Options` buttons. The `Load Game` flow SHALL open a modal with two tabs: `Saved` (lists and loads named configurations stored in IndexedDB) and `Import` (opens a file picker to import a JSON configuration). The `Options` button SHALL open a form-based Options Page that exposes the JSON configuration fields for editing and saving. Plans MUST define UX details for the modal, import validation, conflict handling when loading, and accessibility considerations.

### Key Entities

- **Player Empire**: Tracks resources (EVIL, Money, Infrastructure, Science), owned Zones, Agents, and unlocked Technologies.
- **Zone**: Geographic area with population (People), Buildings, controlling Governing Organization, and status (controlled/contested). Zones SHALL track an `intelligence_level` integer (0-100) representing the Player's Empire's recon accuracy for that Zone. Zones expose `surveillance_profile` (population activity data when surveilled) and `asset_profile` (building/asset summary as observed). `intelligence_level` influences the accuracy and completeness of data surfaced in the Intelligence Screen.
- **Person / Agent**: Individuals generated in the world. Agents are People employed by a Governing Organization (player-controlled or otherwise); they have role, pay, and effects. Each Person includes an `attributes` map (extensible) containing at minimum:
    - `health`: integer (current and maximum health)
    - `science_output`: integer (science points produced per turn when assigned to Labs or research Activities)
    - `infrastructure_output`: integer (infrastructure points contributed per turn when assigned to Offices)
    - `hospital_heal`: integer (amount of health Doctors restore to patients per turn when assigned to Hospitals)
    - `leadership`: integer (how many other People this Agent can lead or command)
    - `combat_bonus`: integer or float (combat modifier applied during encounters)
      The **Player Character** is a special Agent subtype with full assignment permissions (can be assigned to any activity, work, or Plot regardless of other Agents' type restrictions) and is tracked separately; Player Character death is a loss condition. The `attributes` schema MUST be documented and versioned; implementations MUST handle unknown attributes gracefully.
      In addition, People who are not Agents SHALL perform one daily `action` (for example: `work`, `stay_home`, `go_out`, `socialize`). Employed People SHALL default to `work` five days per week; on non-work days they may `stay_home` or `go_out`. When a Person is surveilled by the Player's Empire, the system SHALL record recent daily actions in a `surveillance_profile` (time-stamped) which the Player may view; Plans MUST define surveillance visibility and retention rules.
- **Building**: Objects in Zones that modify zone attributes. Buildings have a `type` (Residence, Office, Lab, Hospital), an `infrastructure_load` integer, staffing slots, and per-turn or event-driven `effects`.
    - **Residence**: houses People; contributes population and may affect loyalty.
    - **Office**: staffed by `Administrator` People; Administrators increase the Governing Organization's current Infrastructure level while assigned.
    - **Lab**: staffed by `Scientist` People; Scientists produce Science points for the Governing Organization when assigned.
    - **Hospital**: staffed by `Doctor` People; Doctors improve patient health in the Hospital's Zones at the end of each turn.
- **Activity**: An actionable item assigned to one or more Agents. Activities have a `daily_cost` per participant, a `zone` where they run, and defined `effects` such as attribute changes for Agents or loyalty/income changes for Zone populations. Activities appear in the dashboard alongside Plots and are resolved during Turn Resolution.
- **Governing Organization**: AI-controlled entity that controls Zones and may target the Player. Governing Organizations track available `infrastructure` points reduced by Buildings' `infrastructure_load`.
- **Plot**: Player or AI-initiated action affecting Zones/People/resources; has prerequisites, cost, and deterministic resolution rules.
- **Random Event**: Non-player-driven event with probabilistic effects; can be good or bad and is resolved during Turn Resolution.
- **Science Project**: Multi-day research task started by the Player when required Science Points are available. Typical fields: `id`, `name`, `required_science`, `progress_days`, `base_duration_days`, `assigned_scientists`, `lab_modifiers`, `status` (queued/active/completed/cancelled), and `prerequisites` (plots/technologies). Science Projects MAY unlock Technologies or be required prerequisites for certain Plots. Plans MUST define formulas for duration, how assigned staff and labs modify progress, whether Science Points are deducted up-front or streamed, and deterministic resolution semantics for testing.
- **Science Project**: Multi-day research task started by the Player when required Science Points are available. Typical fields: `id`, `name`, `required_science`, `progress_days`, `base_duration_days`, `assigned_scientists`, `lab_modifiers`, `status` (queued/active/completed/cancelled), and `prerequisites` (plots/technologies). Science Projects MAY unlock Technologies or be required prerequisites for certain Plots. Plans MUST define formulas for duration, how assigned staff and labs modify progress, and deterministic resolution semantics for testing. For this feature, Science Points required for a Science Project SHALL be deducted (reserved) up-front when the project is started; plans MAY specify refund rules on cancellation.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: Turn Latency — On a typical developer laptop, 95% of turn resolutions complete within 1 second (seeded deterministic runs for tests may be faster).
- SC-002: UI Responsiveness — Primary dashboard loads and is interactive within 2 seconds on local machines.
- SC-003: Determinism — Given a seed, world generation and turn-resolution outcomes are reproducible in 100% of deterministic test runs.
- SC-004: Core Task Completion — New players can perform the primary loop (review dashboard → pick a Plot or action → end turn) within 3 minutes on first attempt.
- SC-005: Reliability — No crashes or unhandled exceptions during deterministic test suites for core mechanics (unit/integration tests pass consistently).

## Constitution References (mandatory)

- **Code Quality & Maintainability**: Design favors explicit domain entities (Zone, Agent, Plot) and documented boundaries; plans will declare linters and review criteria.
- **Test-First & Automated Testing**: All functional requirements include deterministic tests (seeded RNG) and unit/integration tests are required before implementation merges.
- **User Experience Consistency**: Dashboard UI flows, labels, and acceptance criteria (SC-002, SC-004) are defined; accessibility acceptance points included in FR-009.
- **Performance & Resource Constraints**: Turn latency and UI budgets (SC-001, SC-002) are documented and must be validated in the plan.
- **Local-First & Portability**: The default mode is local/browser play and the spec requires full gameplay locally (FR-008). Hosted sync or multi-player are OPTIONAL and require explicit justification.

Include links to plan and test artifacts once created: plan.md, tests/unit/, tests/integration/.
```

## Assumptions & Dependencies

- Assumption: Single-player, browser-based local play is the default; hosted sync or multiplayer are out-of-scope unless explicitly requested.
- Assumption: Deterministic RNG seeding is available for test runs.
- Dependency: Plan MUST adopt file export/import (JSON) as the primary local persistence approach and define autosave, schema, import UX, and conflict handling; optional hosted sync or IndexedDB may be proposed in plans with justification. The plan MUST also specify the CI test harness for deterministic runs.
- Assumption: Single-player, browser-based local play is the default; hosted sync or multiplayer are out-of-scope unless explicitly requested.
- Assumption: Deterministic RNG seeding is available for test runs.
- Dependency: Primary local persistence SHALL use in-browser storage (IndexedDB) with a form-based Options Page that exposes editable fields from the JSON configuration. The system MUST also support export/import of JSON configuration files for portability and backups and allow multiple named saved configurations. Plans MUST define autosave behavior, schema versioning, import UX, conflict handling, and migration strategies. Optional hosted sync may be proposed in plans with justification. The plan MUST also specify the CI test harness for deterministic runs.
