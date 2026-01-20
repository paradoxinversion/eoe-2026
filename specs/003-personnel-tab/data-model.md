# Data Model — Personnel Tab (Phase 1)

Entities

- Person
    - `id` (string, uuid)
    - `name` (string)
    - `intelligenceLevel` (integer 0..10) — optional for Agent presentation; People persist this.
    - `role` (string) — human-readable role/title
    - `zoneId` (string) — reference to current zone

- Agent (runtime/employment view)
    - `id` (string)
    - `personId` (string) — optional link to `Person` record
    - `agentType` (enum: `Surveyor`, `Scientist`, `Worker`, `Leader`, `Other`)
    - `leadership` (integer >=0) — used to compute capacity
    - `superiorId` (string | null) — chain-of-command

- Profile (UI model)
    - `displayName` (string)
    - `confidence` (integer 0..100) — computed from `intelligenceLevel` or treated as 100 for Agents
    - `summary` (string)

Relationships

- Agent.personId -> Person.id (optional)
- Agent.superiorId -> Agent.id (nullable)

Validation Rules

- `intelligenceLevel` must be integer between 0 and 10.
- `confidence` is derived; not stored in canonical Person data.
- `leadership` is non-negative integer; used to compute available subordinate slots.

State transitions

- On superior removal: run reassignment algorithm (see `research.md`) to reattach subordinates.
