# Quickstart CLI — Running the Generator (developer)

This file shows example CLI usage for developer QA. The same guidance can be merged into `quickstart.md`.

Developer helper: `frontend/src/services/generationDebug.ts`

Examples:

- Using `ts-node` (quick, for development):

```bash
# from repo root
pnpm install --filter frontend # ensure deps for frontend
npx ts-node frontend/src/services/generationDebug.ts my-seed ./tests_output/generation-my-seed.json
```

- Using plain `node` after compiling TypeScript (recommended for CI or repeatable runs):

```bash
# compile frontend TypeScript (project may already have a build step)
pnpm --filter frontend run build
# run compiled script (adjust path if build emits to a different folder)
node frontend/src/services/generationDebug.ts my-seed ./tests_output/generation-my-seed.json
```

Notes:

- The CLI writes `generation-<seed>-artifact.json` (or the `outPath` you pass) when running under Node.
- The generator also writes a counts file named `generation-<seed>-counts.json` next to the artifact (zones/people/buildings/organizations counts).
- If filesystem access is not available (browser), use the in-app `generateDebugWorld()` API and persist results from the browser devtools or tests.
