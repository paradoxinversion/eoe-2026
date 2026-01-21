# Data Model: Initial Agents Feature

This document mirrors the canonical frontend models in `frontend/src/models` and describes how the feature uses them.

Entities (canonical / frontend/src/models)

- Person
    - `id` (string, uuid) — canonical Person identifier
    - `firstName` (string)
    - `lastName` (string)
    - `homeZoneId` (string|uuid, optional) — reference to Zone id
    - `governingOrganizationSentiments` (object) — sentiment map by organization id
    - `intelligenceLevel` (number)
    - `occupation` (string|optional)
    - `attributes` (object) — traits/stats relevant to gameplay/UI. Typical keys include:
        - `health` (number)
        - `intelligence` (number)
        - `leadership` (number)
        - `strength` (number)
        - `agility` (number)
        - `endurance` (number)
        - `empathy` (number)
        - `charisma` (number)
    - `skills` (object) — structured skills summary used by UI

- Agent (assignment record)
    - `id` (string, uuid)
    - `personId` (string, uuid) — reference to `Person` (source of name/skills/attributes)
    - `codeName` (string)
    - `role` (AgentRole)
    - `affiliationId` (string|uuid, optional) — GoverningOrganization id when assigned
    - `health` (number)
    - `pay` (number)
    - `status` (string enum) — e.g., `active` / `idle` / `unavailable` / `dead`

- GoverningOrganization
    - `id` (string, uuid)
    - `name` (string)
    - `type` (string|optional)
    - `leaderId` (string|uuid|optional)

- Zone
    - `id` (string)
    - `gridX` (number)
    - `gridY` (number)
    - `name` (string)
    - `wealth` (number)
    - `intelligenceLevel` (number)
    - `people` (string[]|optional) — list of Person ids in the zone

Validation rules

- `personId` referenced by `Agent` MUST resolve to an existing `Person` record.
- Agent selection MUST only consider `Person` records whose `homeZoneId` equals the Player's starting zone and that are not assigned (`affiliationId` absent) to any other GoverningOrganization at initialization.
- The feature does NOT add `agentSlots` to `GoverningOrganization`; initial assignment is represented by creating `Agent` records with `affiliationId` set to the player's GoverningOrganization `id` and, if desired, storing an ordered roster array elsewhere (e.g., Player state or a separate roster collection).

State transitions (initialization)

- New game init:
    1. Create Player's GoverningOrganization record.
    2. Sample up to 10 unique `Person` ids from the Player's starting zone (using provided RNG/seed).
    3. For each sampled `Person`, create an `Agent` record with `personId` pointing to the `Person` and `affiliationId` set to the Player's GoverningOrganization `id`.
    4. Persist created `Agent` records and mark those `Person` records as assigned for the initialization step (set `affiliationId` on Agents; `Person` keeps no `agent` pointer in canonical model).

- Agent assignment after init: create `Agent` with `personId` and set `affiliationId` when hiring/assigning.
