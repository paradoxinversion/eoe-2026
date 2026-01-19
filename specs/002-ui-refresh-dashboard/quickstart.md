# quickstart.md

Developer quickstart for UI refresh work (frontend-only)

1. Checkout feature branch:

```bash
git fetch origin
git checkout 002-ui-refresh-dashboard
```

2. Install dependencies (from repo root):

```bash
npm --prefix frontend install
```

3. Run dev server:

```bash
npm --prefix frontend run dev
```

4. Run tests locally (unit + integration + a11y):

```bash
npm --prefix frontend run test:unit
npm --prefix frontend run test:integration
npm --prefix frontend run test:a11y
```

5. Run perf benchmarks (optional):

```bash
npx --yes vitest run frontend/tests/perf --run
```

6. Local tasks:

- Implement `frontend/src/theme/tokens.ts` and integrate into the project's ThemeProvider.
- Refactor `frontend/src/pages/Dashboard/Main.tsx` to consume tokens and the new layout.
- Add visual snapshot tests under `frontend/tests/visual/` and update `specs/002-ui-refresh-dashboard/research.md` with screenshots.
