# Data Model (overview)

## Key entities

- `PlayerEmpire`:
    - `id`: string
    - `name`: string
    - `resources`: { evil: number, money: number, infrastructure: number, science: number }
    - `zones`: string[] (zone ids)
    - `agents`: string[] (agent ids)

- `Zone`:
    - `id`: string
    - `name`: string
    - `governing_org`: string
    - `buildings`: string[]
    - `people`: string[]
    - `intelligence_level`: integer (0-100)
    - `surveillance_profile`: object

- `Person` / `Agent`:
    - `id`: string
    - `name`: string
    - `role`: string
    - `pay`: number
    - `attributes`: object (extensible)

- `Building`:
    - `id`: string
    - `type`: enum (Residence, Office, Lab, Hospital)
    - `infrastructure_load`: integer
    - `staff_slots`: integer
    - `status`: string

- `ScienceProject`:
    - `id`: string
    - `name`: string
    - `required_science`: integer
    - `status`: enum (queued, active, completed, cancelled)
    - `assigned_scientists`: string[] (agent ids)
    - `lab_modifiers`: object
    - `progress_days`: integer
    - `base_duration_days`: integer

## Config / Options JSON schema (example)

```json
{
    "seed": 12345,
    "difficulty": "normal",
    "starting_resources": {
        "evil": 0,
        "money": 1000,
        "infrastructure": 1,
        "science": 0
    },
    "autosave": true,
    "autosave_interval_seconds": 30,
    "named_configs": [
        { "name": "default", "created_at": "2026-01-17T00:00:00Z" }
    ]
}
```

## Validation rules

- `seed`: integer
- `starting_resources.*`: non-negative integers
- `autosave_interval_seconds`: integer >= 5
