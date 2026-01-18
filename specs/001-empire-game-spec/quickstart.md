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
