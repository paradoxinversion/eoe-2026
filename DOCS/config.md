# Game Configuration

This document lists the runtime configuration options for the game, their current default values, allowed ranges, and short explanations. Many of these settings are exposed in the Options page (UI) and persisted as named configurations.

Source of truth:

- Defaults and types: `frontend/src/config/schema.ts`
- JSON schema: `specs/001-empire-game-spec/contracts/config-schema.json`

Configuration fields

- playerName
    - Type: string
    - Default: "Player 1"
    - Min / Max: N/A
    - Explanation: Player display name used in UI and generated content. INSERT EXPLANATION

- startingSeed
    - Type: integer
    - Default: 42
    - Minimum: 0
    - Explanation: Seed for the deterministic RNG used during world and content generation. Changing the seed produces different worlds while keeping generation deterministic for the same seed.

- autosaveIntervalSeconds
    - Type: integer
    - Default: 30
    - Minimum: 5
    - Explanation: How often (in seconds) the frontend will autosave the current game state. INSERT EXPLANATION

- gracePeriodDays
    - Type: integer
    - Default: 7
    - Minimum: 0
    - Explanation: Game-rule related grace period applied at start or after specific events. INSERT EXPLANATION

- eventProbabilities
    - Type: object
    - Properties:
        - raid: number (default: 0.08, min: 0.0, max: 1.0)
        - blessing: number (default: 0.08, min: 0.0, max: 1.0)
        - discovery: number (default: 0.08, min: 0.0, max: 1.0)
    - Explanation: Probabilities (0.0 to 1.0) controlling how often certain random events occur during turns. INSERT EXPLANATION for each event type.

- organizationCount
    - Type: integer
    - Default: 5
    - Minimum: 1
    - Additional constraint: must be less than `mapWidth * mapHeight` (enforced by runtime validation)
    - Explanation: Number of Governing Organizations created during world generation. Governing Organizations represent factions or groups that can own buildings or control zones.

- mapWidth
    - Type: integer
    - Default: 10
    - Minimum: 1
    - Explanation: Number of columns in the map grid. Total zones generated = `mapWidth * mapHeight`.

- mapHeight
    - Type: integer
    - Default: 10
    - Minimum: 1
    - Explanation: Number of rows in the map grid.

- zoneSizeMin
    - Type: integer
    - Default: 1
    - Minimum: 1
    - Explanation: Minimum `size` value assigned to a Zone during generation. Each zone's `size` is randomly chosen between `zoneSizeMin` and `zoneSizeMax`.

- zoneSizeMax
    - Type: integer
    - Default: 5
    - Minimum: 1
    - Additional constraint: must be >= `zoneSizeMin`
    - Explanation: Maximum `size` value assigned to a Zone during generation.

Notes

- Persistence: Saved configurations are stored via IndexedDB and include any fields present in the saved object. Use the Options page to save named configurations.
- Validation: The Options UI validates critical constraints (for example ensuring `organizationCount` < `mapWidth * mapHeight` and `zoneSizeMax >= zoneSizeMin`). The JSON schema is located at `specs/001-empire-game-spec/contracts/config-schema.json` and is enforced server-side for automated checks and by AJV in the frontend validator.
- Extending: If you add new config fields, update `frontend/src/config/schema.ts`, the JSON schema above, the validator at `frontend/src/config/validator.ts`, and the Options UI to expose and validate the fields.

\*\*\* End of file
