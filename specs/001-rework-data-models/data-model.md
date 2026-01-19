# Data Model — Rework Data Models

This document contains TypeScript-style interface definitions and validation notes for the feature.

## ID Format

- All entity `id` fields use the composite format: `<entityType>-<uuidv4>` (e.g., `person-3fa85f64-...`).

## Interfaces (TypeScript)

```ts
export type UUID = string; // '<entity>-<uuidv4>'

export interface GoverningOrganization {
    id: UUID;
    name: string;
    type?: string;
    leaderId?: UUID;
}

export type AgentRole =
    | "Recruit"
    | "Administrator"
    | "Scientist"
    | "Doctor"
    | "Soldier";

export interface Agent {
    id: UUID;
    personId: UUID;
    codeName: string;
    role: AgentRole;
    affiliationId?: UUID;
    inventory?: { itemId: string; qty: number }[];
    health: number;
}

export interface PersonAttributes {
    health: number;
    intelligence: number;
    strength: number;
    agility: number;
    endurance: number;
    empathy: number;
    charisma: number;
}

export interface PersonSkills {
    fighting: number;
    medicine: number;
    business: number;
    finance: number;
    publicPlanning: number;
    science: number;
}

export interface Person {
    id: UUID;
    firstName: string;
    lastName: string;
    homeZoneId?: UUID;
    governingOrganizationSentiments: {
        [governingOrganizationId: string]: number;
    }; // -100..100
    intelligenceLevel: number;
    occupation?: string;
    attributes: PersonAttributes;
    skills: PersonSkills;
}

export interface Zone {
    id: UUID;
    name: string;
    size: number;
    wealth: number;
    intelligenceLevel: number;
    capacity?: number;
    currentOccupants: UUID[];
}

export type BuildingType = "Residence" | "Office" | "Lab" | "Bank" | "Hospital";

export interface Building {
    id: UUID;
    name: string;
    type: BuildingType;
    size: number;
    zoneId: UUID;
    intelligenceLevel: number;
    upkeepCost: number;
    infrastructureLoad: number;
}
```

## Validation Rules

- `id`: must follow `<entityType>-<uuidv4>` pattern.
- `governingOrganizationSentiments` values MUST be integers in [-100, 100].
- `intelligenceLevel` ranges: 0..100.
- `Person.firstName` and `Person.lastName` are required and non-empty strings.
- `Agent.personId` MUST reference an existing `Person.id` when present.
- `Zone.currentOccupants` contains `Person.id` values (people are canonical occupants).

## Notes for Implementation

- Relationship model: use arrays of ids for current referential state (e.g., `Zone.currentOccupants`).
- `Assignment` entity omitted; introduce later only if temporal/history is required.
- Migration routines must validate and coerce legacy shapes into these interfaces.
- Provide JSON schemas in `specs/001-rework-data-models/contracts/` for runtime validation and tests.
