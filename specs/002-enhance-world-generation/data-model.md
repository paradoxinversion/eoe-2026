++ begin

# Data Model: Enhance World Generation

Entities and primary fields (mapped to frontend models):

- Zone
    - id: string
    - name: string
    - gridX: number
    - gridY: number
    - wealth?: number
    - intelligenceLevel?: number
    - buildingIds: string[]
    - peopleIds: string[]

- Person
    - id: string
    - firstName: string
    - lastName: string
    - attributes: Record<string, number>
    - skills: Record<string, number>
    - intelligenceLevel?: number
    - homeZoneId: string
    - homeBuildingId?: string

- Building
    - id: string
    - type: string # must be one of BUILDING_TYPES from frontend/src/models/building.ts
    - zoneId: string
    - tile: [x,y]
    - ownerOrgId?: string

- GoverningOrganization
    - id: string
    - name: string
    - type?: string
    - leaderId?: string
    - buildingIds: string[]

Validation notes:

- Building.type MUST be one of BUILDING_TYPES.
- All id references (zoneId, ownerOrgId, homeZoneId, homeBuildingId) MUST resolve to existing entities.

State transitions:

- Entities are created during generation and generally remain immutable at creation. Ownership links (ownerOrgId) may be assigned post-creation by other systems.
