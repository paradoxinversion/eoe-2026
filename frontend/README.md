# Frontend developer notes

Convenience scripts for frontend development.

Run the developer CLI to generate debug artifacts (uses `generationDebug.ts`):

```bash
# from repository root
pnpm --filter frontend run gen:debug -- 12345 ./tests_output/generation-12345.json
```

This invokes `npx ts-node src/services/generationDebug.ts` and writes:

- `./tests_output/generation-12345.json` — full debug artifact (if `outPath` provided).
- `generation-12345-counts.json` — simple counts summary produced next to the artifact.

Notes:

- `ts-node` is invoked via `npx` so you don't need to add it as a permanent devDependency.
- For CI or reproducible runs, compile the frontend TypeScript and run the script with `node`.
