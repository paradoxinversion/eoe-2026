# UI Contracts

This feature does not introduce network API contracts. The following documents the UI contract between Dashboard Main and the underlying game state:

- `getGameState()` (conceptual): returns `{ playerName, day, turn, metrics }` used by Dashboard Main.
- Persisted preference: `themeMode` stored in local persistence (IndexedDB).

If backend contracts are required later, add OpenAPI or GraphQL schema files here.
