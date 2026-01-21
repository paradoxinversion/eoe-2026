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

3. Deterministic world-generation test (example):

Run your world-generation entrypoint with an explicit seed/ RNG parameter (implementation-specific). Example pseudo-command:

```bash
node scripts/generate-world.js --seed 12345 --output test/world-12345.json
```

Then run the integration test that validates initial Agents (or use the in-repo test harness):

```bash
pnpm test -- --testPathPattern=tests/integration/new-game.integration.test.tsx -t "initial agents"
```

4. Update AI agent context (optional):

```bash
.specify/scripts/bash/update-agent-context.sh copilot
```

Notes

- Replace the pseudo `generate-world.js` command with your actual world generation entrypoint. Ensure it accepts a `--seed` or RNG parameter per the spec (FR-009).
- Contracts are in `specs/004-initial-agents/contracts/agent-view.json` and should be used for frontend <-> backend shape checks.
