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
