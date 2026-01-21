# Quickstart — Running the Generator and Collecting Debug Artifacts

This quickstart covers running the generator in three contexts: in-app (dev), developer CLI (Node), and within tests.

Prerequisites

- Node.js & pnpm (or npm/yarn) installed.
- From repository root run:

```bash
pnpm install
```

1. In-app (dev) — quick manual runs

- Start the frontend dev server (run from repo root or `frontend` folder):

```bash
pnpm --filter frontend dev
```

- Open the running app in browser, open DevTools Console and run:

```js
import("/src/services/generation").then((m) =>
    m.generateDebugWorld("my-seed", { mapWidth: 8, mapHeight: 6 }),
);
```

- The call returns a debug artifact object with `zones`, `people`, `buildings`, `organizations`, and `placementErrors`. Persist it manually if needed via the app's persistence UI.

2. Developer CLI (Node) — produce artifact JSON files

We provide a small developer helper at `frontend/src/services/generationDebug.ts` that writes JSON artifacts when run under Node.

- Run via `ts-node` (no build step):

```bash
# from repo root
pnpm install --filter frontend
npx ts-node frontend/src/services/generationDebug.ts my-seed ./tests_output/generation-my-seed.json
```

- Run via `node` after compiling TypeScript (recommended for CI / reproducible runs):

```bash
# compile frontend TS (project build may vary)
pnpm --filter frontend run build
node frontend/src/services/generationDebug.ts my-seed ./tests_output/generation-my-seed.json
```

Outputs written when running under Node:

- `<outPath>` (e.g. `./tests_output/generation-my-seed.json`) — full debug artifact JSON.
- `generation-<seed>-counts.json` — simple counts summary with keys: `zones`, `people`, `buildings`, `organizations`.

3. Running tests and capturing artifacts

- Unit tests: run the project's vitest runner. Example:

```bash
pnpm --filter frontend test
```

- Integration tests that validate artifact schema use AJV and the spec at `specs/002-enhance-world-generation/debug-schema.json`. Tests may write artifacts to `tests_output/` for manual inspection.

Troubleshooting

- If `ts-node` is unavailable, install it temporarily: `pnpm add -D ts-node` in the frontend package.
- If the CLI doesn't create files, ensure you ran the command in Node (not via a browser environment) and that the output directory exists and is writable.

Example full workflow

```bash
# generate artifact via CLI and inspect counts
npx ts-node frontend/src/services/generationDebug.ts 12345 ./tests_output/generation-12345.json
cat ./tests_output/generation-12345.json | jq '.zones | length'
cat generation-12345-counts.json
```

---

If you'd like, I can also add a short npm script to `frontend/package.json` to run the CLI via `pnpm --filter frontend run gen:debug`.
++ begin

# Quickstart — Running the Generator and Collecting Debug Artifacts

1. Start the frontend dev server (root or `frontend` depending on workspace):
    - Install dependencies: `pnpm install` (or `npm install` / `yarn` per project).
    - Start dev server: `pnpm dev` from repository root or `frontend` folder.

2. Trigger generation in-dev:
    - Open the browser devtools console on the running app and import the generation module:
      `import("/src/services/generation").then(m => m.generate({ seed: 'my-seed', debug: true }))`
    - The generator will return a debug JSON artifact with `zones`, `people`, `buildings`, `organizations`, and `placementErrors` (if any).

3. Running tests (unit/integration):
    - Run unit tests: `pnpm test` (or `pnpm vitest`), narrow to the new tests once present:
      `pnpm test -- tests/unit/generation.entities.test.ts`
    - Integration/test artifacts: tests will validate the debug JSON against `specs/002-enhance-world-generation/debug-schema.json` using AJV.

4. Debug artifact location: The generator returns the artifact; tests may write it to `tests_output/` for further inspection. Use the artifact to verify SC-001 (per-zone building coverage) and SC-002 (determinism).
