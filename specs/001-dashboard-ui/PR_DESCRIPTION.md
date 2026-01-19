Feature: Dashboard UI (specs/001-dashboard-ui)

Summary

- Implements Title Page New Game flow, Character Generation, deterministic world generation, Dashboard with tabs (Main, Intel, Personnel, Economy, Infirmary, Captives, Settings), Settings theme toggle (default dark), and End Turn integration.

What I changed

- frontend: UI pages and components for TitlePage, CharacterGeneration, Dashboard (Main, Settings), EndDayButton updates
- Services: generation, persistence, turn helper `advanceTurn()` usage
- Tests: unit, integration, accessibility fixes; added perf benchmark for generation
- Specs: updated `specs/001-dashboard-ui/tasks.md`, added `quickstart.md`, added `specs/001-dashboard-ui/contracts/openapi.yml`

Tests & artifacts

- Unit: passed (13 files, 35 tests)
- Integration: passed (8 files, 12 tests)
- Accessibility: passed (4 files)
- Perf: generation and turn-latency benchmarks run; artifacts produced:
    - `tests_output/generation-bench-seed-2026.json`
    - `tests_output/perf-turn-latency-seed-2026.json`

How to run locally

- Start dev server
    - `npm --prefix frontend run dev`
- Run unit tests
    - `npm --prefix frontend run test:unit`
- Run integration tests
    - `npm --prefix frontend run test:integration`
- Run a11y tests
    - `npm --prefix frontend run test:a11y`
- Run perf tests
    - `cd frontend && npx --yes vitest tests/perf --run`

Notes and caveats

- `EndDayButton` exposes an `aria-label` to satisfy integration tests.
- `Main` uses exported `advanceTurn()` helper so integration mocks can intercept turn resolution.
- OpenAPI contract added as minimal frontend-facing documentation for persistence/generation/turn APIs.

Request for reviewers

- Frontend reviewers: @frontend-team
- QA: please run integration and a11y suites
- Performance: please review `tests_output/*.json` artifacts
