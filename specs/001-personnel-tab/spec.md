# Feature Specification: Personnel Tab

**Feature Branch**: `001-personnel-tab`
**Created**: 2026-01-19
**Status**: Draft
**Input**: User description: "We are now going to do another pass on the interface, focusing on the Personnel tab first. The Personnel tab contains information about all Agents employed by the Player's Empire. At the top of the page, there will be small widgets that show: 1) the Current amount of Agents employed, and the maximum total of agents that can be, 2) A circular chart that shows the breakdown of employed Agent Types.\n\nBelow the widgets at the top will be a component that shows the most relevant data about Empire Agents. At minimum, this data will include their name (first and last), codename, role, pay, and status. There should be a button that allows Players to focus on a certain Agent.\n\nWhen an Agent is in focus, the Personnel tab should load a Profile.\n\nThe Profile is a reusable component that will be used for Agents and Non-Agent People. It should surface all properties and attributes (except for IDs or properties used for internal processes) about the person. When an Agent is being profiled, their relevant Agent properties should be shown at the top of the profile. If the person is not an agent, the accuracy of the information is dependent upon person's intelligence level (ie, the amount/accuracy of the data the Empire has on the person)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Personnel Overview (Priority: P1)

As a Player, I want to open the Personnel tab to see a quick summary of my current workforce so I can judge capacity and distribution at a glance.

**Why this priority**: Provides immediate situational awareness and drives hiring/assignment decisions.

**Independent Test**: Open the Personnel tab from the dashboard and verify the widgets and summary component render with current data.

**Acceptance Scenarios**:

1. **Given** the Player has 0..N Agents employed, **When** they open the Personnel tab, **Then** the top widgets show: current count, configured max capacity, and a circular chart showing counts per Agent Type.
2. **Given** Agents exist with different types, **When** the tab renders, **Then** the circular chart segments sum to the current agent count and match the breakdown by type.

---

### User Story 2 - Browse and Focus Agent (Priority: P1)

As a Player, I want to scan the list of Agents and focus on one to inspect details or take actions.

**Why this priority**: Core management flow — players must be able to act on individual Agents.

**Independent Test**: Click the focus button for an Agent in the list and verify the Profile loads and the UI state indicates that Agent is focused.

**Acceptance Scenarios**:

1. **Given** a list of Agents displayed under the widgets, **When** the Player clicks the focus button for a particular Agent, **Then** the Profile component loads the Agent's profile and visual focus state is applied to that Agent in the list.
2. **Given** the focused Agent is changed, **When** the Player selects a different Agent, **Then** the new Agent's Profile replaces the previous one and focus state updates.

---

### User Story 3 - Profile for Agents and People (Priority: P2)

As a Player, I want to view a complete Profile for the selected person that surfaces all relevant, non-internal attributes and presents Agent-specific properties prominently when applicable.

**Why this priority**: Reusable Profile component serves multiple features (Agents and Non-Agent People).

**Independent Test**: Open a Profile for an Agent and for a non-agent person and verify visible fields and ordering.

**Acceptance Scenarios**:

1. **Given** a focused Agent, **When** the Profile opens, **Then** it shows Agent-specific fields first (codename, role, pay, status) followed by person attributes (name, skills, traits).
2. **Given** a focused non-agent person with an intelligence attribute, **When** the Profile opens, **Then** displayed data accuracy and completeness vary according to the intelligence level (see Assumptions & Clarifications below).

---

### Edge Cases

- When the Empire has reached or exceeded max agent capacity, the widgets must indicate "At capacity" and the list should still display all employed Agents.
- When an Agent referenced in a saved state no longer exists, the Profile view should surface a clear "missing" state and allow the player to dismiss or navigate away.
- When the data source is transient/unloaded, the Personnel tab must show a loading state and not crash.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Display top widgets showing **current agent count** and **max agent capacity**.
- **FR-002**: Render a circular breakdown chart of employed Agent Types where each segment represents a type and the total equals the current agent count.
- **FR-003**: List employed Agents with columns/fields: first name, last name, codename, role, pay, and status.
- **FR-004**: Provide a clearly labeled "Focus" action on each Agent row that opens the Profile for that person.
- **FR-005**: The Profile component MUST be reusable for both Agents and non-agent People and MUST NOT display internal-only fields such as persistence IDs or ephemeral process flags.
- **FR-006**: When an Agent is profiled, surface Agent-specific properties (codename, role, pay, status) at the top of the Profile.
- **FR-007**: For non-agent People, the UI MUST display an accuracy/confidence indicator derived from the person's `intelligenceLevel` attribute. Uncertain or inferred values MUST be shown with a confidence percentage (for example: "Skill: X (70% confidence)") computed from the `intelligenceLevel` score.
- **FR-008**: The Personnel tab UI must present accessible controls (keyboard focusable, ARIA labels where appropriate) and include screen-reader friendly labels for widgets and the Profile.
- **FR-009**: When agents exceed configured capacity, visually communicate capacity status and disable actions that would create additional Agents unless overridden by configuration.
- **FR-010**: The Personnel tab MUST support a reasonable loading state and error messages when data retrieval fails.

_Clarifications embedded as needed — see Assumptions & [NEEDS CLARIFICATION] markers._

### Key Entities

- **Agent**: Employed operative. Key attributes: `firstName`, `lastName`, `codename`, `role`, `pay`, `status`, `type`, `employmentDate`.
- **Person**: Any character. Key attributes: `firstName`, `lastName`, `traits`, `skills`, `intelligenceLevel`, `knownAliases`.
- **Profile**: UI artifact that surfaces a Person/Agent's attributes. Does not include internal IDs or persistence metadata.
- **AgentTypeSummary**: Aggregation used to populate the circular chart: `{ type, count }`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Opening the Personnel tab displays widgets and list within 500ms on a warm client render for typical data sets (<= 200 Agents).
- **SC-002**: The circular chart accurately reflects counts per Agent Type for 100% of deterministic test fixtures provided by the QA team.
- **SC-003**: Clicking "Focus" loads the Profile and displays primary Agent fields within 300ms for cached data.
- **SC-004**: 100% of Agent Profiles do not expose internal persistence IDs or process-only flags in the UI.
- **SC-005**: Accessibility: keyboard navigation must allow focus and activation of Agent rows (tab order) and automated a11y checks show no critical violations for the Personnel tab's primary flows.

## Assumptions

- Max agent capacity is derived from the Governing Organization's chain-of-command: each leader/agent has a `leadership` attribute that determines how many direct subordinates they may manage. The Personnel tab must present capacity as an emergent property of current superiors' leadership values.
- `intelligenceLevel` is a numeric attribute where larger values indicate more accurate knowledge; the Profile UI will calculate a confidence percentage from this score to annotate displayed fields.

- **Agent intelligence note**: Agents do NOT store an `intelligenceLevel` property. Agents employed by the Player are assumed to have the highest possible `intelligenceLevel` for the purposes of UI confidence and information accuracy.
- Codename visibility: codenames are visible in the UI for Agents by default unless privacy mode is enabled (privacy mode is out of scope for this spec).

## Chain-of-Command Behaviour

- When a Person is promoted to Agent the system MUST assign them to an existing superior within the Governing Organization. The selected superior's available capacity is their `leadership` value minus their current subordinate count.
- The Personnel tab should surface warnings when superiors approach capacity (e.g., 90% threshold) and surface which superiors have free subordinate slots.
- If a superior is removed (killed, fired, or otherwise leaves the organization), their direct subordinates MUST be reassigned to eligible superiors at the same level or higher. Reassignment SHOULD prefer superiors with spare capacity and preserve team parity; if no eligible superiors exist, mark those Agents as "Unassigned" and surface an action in the UI to reassign.

## Constitution References _(mandatory)_

- Follow the project's accessibility and local-first principles in `.specify/memory/constitution.md`.
- UX consistency: Profile component must match the visual language used by other profile-like components (cards, detail panes) and maintain medium-contrast text and focus styles.

---

**Spec status**: Draft — ready for review. Next steps: finalize acceptance criteria with Product and convert to a planning ticket.

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

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

_Example of marking unclear requirements:_

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Constitution References _(mandatory)_

Each specification MUST include a `Constitution References` section that:

- Names the applicable principles from `.specify/memory/constitution.md`.
- Explains how the feature meets each principle or lists an approved
  exception with rationale.
- Provides measurable acceptance criteria for Tests, Performance,
  UX consistency, Accessibility, and Local-First behavior where relevant.

Include short links to plan and test artifacts that demonstrate compliance.
