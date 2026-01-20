# Quickstart — Personnel Tab

To preview the Personnel Tab locally:

1. Install dependencies and start the frontend dev server:

```bash
cd frontend
npm install
npm run dev
```

2. Open the app in your browser (Vite will print the local URL). Navigate to the Dashboard and open the Personnel tab.

3. Run tests (from repo root):

```bash
npm run test
```

Notes:

- The Personnel Tab is frontend-only and reads data from the local IndexedDB persistence layer.
- If you need example fixtures, use the `specs/003-personnel-tab/contracts` schemas to generate mock data.
