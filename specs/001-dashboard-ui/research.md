# research.md — Dashboard UI

Decisions and rationale for `001-dashboard-ui` (session 2026-01-18)

Decision: Blocking world-generation UX

- Rationale: Simpler initial UX, avoids partial-state dashboards and reduces edge-case surface area during early rollout. Matches product expectation to present a fully generated world before gameplay.

Decision: Deterministic, seeded generation

- Rationale: Matches repository-wide decision in `001-empire-game-spec` for reproducible runs and deterministic tests. The system will accept and persist a seed (optional input) and expose it in saves/exports.

Decision: Seed format and persistence (RESOLVED)

- Decision: Treat the seed as an opaque string (prefer stable numeric string when produced by the RNG). The generation API will accept a `seed` string; the internal RNG may parse it to a numeric seed as required. For reproducibility tests prefer a stable numeric representation (e.g., 64-bit integer encoded as decimal) but support arbitrary opaque strings for export/inspect.
- Persistence: Persist the chosen seed in the Player record under `preferences.seed` and mirror it on the generated `World.seed` field. This aligns with the data model in `data-model.md` and keeps the seed tied to both the player and world saved artifacts.

Decision: Theme defaults and persistence

- Rationale: Default to Dark mode for first-run, allow toggle in Settings, persist via existing persistence layer (IndexedDB/local storage).

Decision: Dashboard navigation

- Rationale: Tabs for Main, Intel, Personnel, Economy, Infirmary, Captives, Settings provide clear surface areas for existing services; `Main` contains `End Turn` wired to `turn` service.

Alternatives considered

- Background generation (rejected): increases complexity for initial implementation and testability.
- Expose seed only in advanced options (deferred): we will persist seed but surface it in Export/Options.

Next research tasks (if needed)

- Define progress UX and timeouts for long-running generation (metrics to capture generation time distribution).
- Confirm exact seed format and persistence key with persistence schema.

Resolved next tasks

- Progress UX: Use a blocking progress modal with a spinner and an estimated progress bar when generation can report progress. If generation cannot report deterministic progress, use an indeterminate spinner and display elapsed time. After 30 seconds without progress completion show gentle messaging that generation may take longer and provide a `Retry` button if an error occurs. Allow the user to cancel generation only if cancellation is cleanly supported by the generation API; otherwise present a retry/abort path that resets the Character Generation UI.
- Worker migration: If local profiling or tests show main-thread blocking during generation (jank or >200ms frame stalls observed during CI/perf tests), migrate heavy generation to a Web Worker. The plan will include a short benchmark and a PR note if the migration is implemented.

Clarifications resolved: seed key (`preferences.seed`), seed format guidance (opaque string / numeric representation preferred for tests), persistence location (Player + World), progress UX behavior, and Web Worker migration criterion.
