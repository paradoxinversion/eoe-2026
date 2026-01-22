# Quickstart: Implementing & Testing Initial Agents

1. Install dependencies (root of repo):

```bash
pnpm install
```

2. Run frontend tests (unit + integration):

```bash
cd frontend
pnpm test
```

3. Deterministic world-generation and tests (concrete commands):

From the repository root run:

```bash
# install project deps (once)
pnpm install

# run all unit tests
cd frontend && pnpm test:unit

# run integration tests (all)
pnpm test:integration

# run only the name-generation integration test
pnpm test:integration -- tests/integration/namegen.integration.test.tsx --run

# run only the new-game integration test
pnpm test:integration -- tests/integration/new-game.integration.test.tsx --run

# run a single vitest test by path+title (example: only initial-agents test)
pnpm test:integration -- tests/integration/initial-agents.integration.test.tsx --run
```

To run deterministic world generation from Node (dev helper):

```bash
# generate an artifact using the in-repo script (example)
node frontend/src/services/generationDebug.ts --seed 12345 --out /tmp/world-12345.json
```

Notes: the frontend generators accept an explicit `seed` (number|string) and the `NameGenerator` and RNG wrappers are deterministic when supplied the same seed.

4. Update AI agent context (optional):

```bash
.specify/scripts/bash/update-agent-context.sh copilot
```

Notes

- Replace the pseudo `generate-world.js` command with your actual world generation entrypoint. Ensure it accepts a `--seed` or RNG parameter per the spec (FR-009).
- Contracts are in `specs/004-initial-agents/contracts/agent-view.json` and should be used for frontend <-> backend shape checks.
