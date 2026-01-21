# Data Model: Initial Agents Feature

Entities (canonical / frontend/src/models)

- Person
    - `id` (string, uuid) — canonical Person identifier
    - `fullName` (string) — given + family name for display
    - `homeZone` / `originZone` (string) — zone id reference
    - `skills` (object | array) — structured skills summary used by UI
    - `attributes` (object) — traits/stats relevant to gameplay/UI

- Agent (assignment record)
    - `id` (string, uuid)
    - `personId` (string, uuid) — reference to `Person` (source of name/skills/attributes)
    - `role` (string|null) — role/title within the Organization
    - `assignedAt` (datetime|null) — when the Agent was assigned (optional)

- GoverningOrganization
    - `id` (string, uuid)
    - `ownerPlayerId` (string, uuid)
    - `agentSlots` (array[Agent|null]) — fixed-length array (initially length 10)

- Zone
    - `id` (string)
    - `name` (string)
    - `populationCount` (number)

Validation rules

- `personId` referenced by `Agent` MUST resolve to an existing `Person` record.
- Agent selection must only consider `Person` records whose `homeZone` equals the Player's starting zone and that are not assigned to any other GoverningOrganization at initialization.
- `agentSlots` length must be enforced as 10 on new GoverningOrganization creation.

State transitions

- New game init: create GoverningOrganization with 10 `agentSlots` (filled or null) → for each slot, attempt to assign a unique `Agent` referencing a `Person` from starting zone.
- Agent assignment: `Person` → create `Agent(personId=person.id)` and place into an available slot; mark `Person` as assigned for the initialization step.
