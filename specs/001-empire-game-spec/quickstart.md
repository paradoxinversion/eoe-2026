# Quickstart — Development (Vite + React + TypeScript)

1. Prerequisites: Node 18+, npm or yarn

2. Create project (example):

```bash
npx create-vite@latest eoe-2026 -- --template react-ts
cd eoe-2026
npm install
```

3. Install runtime deps (examples):

```bash
npm install idb @mui/material @emotion/react @emotion/styled recharts
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

4. Run dev server:

```bash
npm run dev
```

5. Run tests:

```bash
npm run test
```

Notes:

- Use `idb` for IndexedDB access and provide a typed persistence service.
- Implement seeded RNG utilities to enable deterministic test runs (Vitest + deterministic fixtures).

Configuration:

- The game exposes a set of runtime configuration options which can be edited via the Options UI or persisted as named configurations.
- Key settings and defaults (also available in the JSON schema at `specs/001-empire-game-spec/contracts/config-schema.json`):
    - `playerName` (default: "Player 1") — player display name.
    - `startingSeed` (default: `42`, min: `0`) — RNG seed used for deterministic generation.
    - `autosaveIntervalSeconds` (default: `30`, min: `5`) — how often autosave runs.
    - `gracePeriodDays` (default: `7`, min: `0`) — grace period used by game rules.
    - `eventProbabilities` (defaults: `raid=0.08`, `blessing=0.08`, `discovery=0.08`) — probabilities in the range [0.0, 1.0].
    - `organizationCount` (default: `5`, min: `1`) — number of governing organizations created during generation; must be less than `mapWidth * mapHeight`.
    - `mapWidth` / `mapHeight` (defaults: `10` / `10`, min: `1`) — grid dimensions for world generation; total zones = `mapWidth * mapHeight`.
    - `zoneSizeMin` / `zoneSizeMax` (defaults: `1` / `5`, min: `1`) — minimum and maximum zone `size` values used during generation; `zoneSizeMax` must be >= `zoneSizeMin`.

These settings are persisted via the Options page and validated against the JSON schema.
