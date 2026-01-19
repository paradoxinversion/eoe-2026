# data-model.md — Dashboard UI

Entities extracted from the feature spec and their key fields.

- Player
    - id: string
    - name: string
    - preferences: { theme: 'dark'|'light', seed?: string }

- World
    - id: string
    - seed: string
    - status: 'generating'|'ready'|'failed'
    - zones: Zone[]

- Zone
    - id: string
    - name: string
    - governingOrganizationId: string
    - people: Person[]
    - buildings: Building[]

- Person / Agent
    - id: string
    - name: string
    - role?: string
    - attributes: { health:number, science_output?:number, infrastructure_output?:number }

- Building
    - id: string
    - type: 'Residence'|'Office'|'Lab'|'Hospital'
    - infrastructure_load: number

- DashboardState
    - currentTab: 'Main'|'Intel'|'Personnel'|'Economy'|'Infirmary'|'Captives'|'Settings'
    - turn: number
    - playerId: string

- CharacterGenerationSession
    - name: string
    - seed?: string
    - progress: number
    - status: 'idle'|'running'|'completed'|'failed'

Validation rules

- `name` required and non-empty for character creation.
- `seed` is opaque string; generation must accept and persist it.

State transitions

- CharacterGenerationSession: idle -> running -> completed|failed
- World: generating -> ready|failed
