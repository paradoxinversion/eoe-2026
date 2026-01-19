# quickstart.md — Dashboard UI

Steps to run the app locally and exercise the New Game flow.

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open browser at `http://localhost:5173` (Vite default) and use the `Title Page` → `New Game` flow.

4. To run tests (unit/integration):

```bash
npm test
```

Notes:

- The `New Game` POST accepts an optional `seed` to reproduce generated worlds. The UI shows a blocking progress modal during generation.
- Theme preferences are persisted locally; default is Dark.
