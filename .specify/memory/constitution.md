<!--
Sync Impact Report

- Version change: none -> 1.0.0 (initial ratification)
- Modified principles: placeholders -> concrete principles
	- [PRINCIPLE_1_NAME] -> I. Code Quality & Maintainability
	- [PRINCIPLE_2_NAME] -> II. Test-First & Automated Testing (NON-NEGOTIABLE)
	- [PRINCIPLE_3_NAME] -> III. User Experience Consistency
	- [PRINCIPLE_4_NAME] -> IV. Performance & Resource Constraints
	- [PRINCIPLE_5_NAME] -> V. Local-First & Portability
- Added sections: Constraints & Requirements; Development Workflow
- Removed sections: none (placeholders replaced)
- Templates requiring updates: ⚠ pending
	- .specify/templates/plan-template.md (⚠ pending)
	- .specify/templates/spec-template.md (⚠ pending)
	- .specify/templates/tasks-template.md (⚠ pending)
	- .specify/templates/checklist-template.md (⚠ pending)
	- .specify/templates/agent-file-template.md (⚠ pending)
- Follow-up TODOs:
	- None left in this file; all placeholder tokens replaced.
-->

# eoe-2026 Constitution

## Core Principles

### I. Code Quality & Maintainability

Code must be clear, modular, and directly testable. All production code
MUST follow a documented style and linting configuration; structural
changes that increase system complexity MUST include a written justification
and an associated cost/benefit note in the PR. Public APIs and module
boundaries MUST be explicit, documented, and backward-compatible except when
a breaking-change procedure is followed in Governance. Code reviews are
MANDATORY for all non-trivial changes and MUST validate readability,
complexity limits, and adequate tests.

### II. Test-First & Automated Testing (NON-NEGOTIABLE)

Testing is a primary artifact. For all new features or behavior changes,
tests MUST be authored as part of the change: unit tests for correctness,
integration/contract tests for interaction boundaries, and acceptance tests
for user-facing flows. Tests SHOULD be written to fail before implementation
(Red-Green-Refactor). Test runs MUST be automated and deterministic in CI
environments. Any omitted test types require explicit, documented justification
in the PR and approval by the maintainers.

### III. User Experience Consistency

User-facing behavior MUST be consistent across flows and platforms. UX
decisions MUST define acceptance criteria and measurable success metrics
(e.g., completion rate, time-to-task). Accessibility, clear error states,
and helpful defaults are required. UX patterns and conventions MUST be
documented and referenced by feature specs; deviations require explicit
approval and user-facing tests or demos.

### IV. Performance & Resource Constraints

Performance goals MUST be defined in the plan for any feature that can
reasonably affect responsiveness, memory, disk, or CPU usage. By default
designs MUST target a local-machine-first operating envelope (low-latency,
modest memory/disk). Benchmarks or acceptance criteria (p95/p99 latency,
memory budgets, cold-start times) MUST be recorded in the plan. Performance
regressions detected by CI or benchmarks MUST block merges until resolved or
accepted with a mitigation plan.

### V. Local-First & Portability

The default expectation is that software runs effectively on a developer's
or user's local machine without requiring hosted infrastructure. Design
decisions MUST prioritize local-first capabilities: local storage, offline
work, and explicit sync strategies for hosted options. No implementation
SHOULD assume a hosted backend is available by default; hosted modes are
allowed only when documented, opt-in, and accompanied by privacy/security
considerations. The project MUST remain implementation-agnostic: do not
prescribe languages, frameworks, or providers in the constitution.

## Constraints & Requirements

The project follows a technology-agnostic stance. Requirements include:

- Local-First: Features MUST work on a typical developer laptop without
  hosted services, with graceful degradation for offline scenarios.
- Security & Privacy: Sensitive data MUST be stored and transmitted
  according to least-privilege and minimize external exposure by default.
- Performance Budgets: Each feature plan MUST list measurable performance
  constraints where applicable (p95, memory, disk). If none are listed,
  the default expectation is modest resource use compatible with local
  machines.
- Accessibility: User-facing features MUST adopt accessible defaults and
  include acceptance criteria for accessibility where relevant.

No specific technology, language, or vendor is mandated; implementation
choices are made per-plan with the constitution guiding non-functional
constraints and trade-offs.

## Development Workflow

- Feature work begins with a plan and spec that references the constitution
  checks (see `.specify/templates/plan-template.md`). Plans MUST include
  testing and performance acceptance criteria.
- Pull requests MUST include: summary, test plan, migration steps (if
  applicable), and a note listing constitution gates satisfied or justified
  exceptions.
- Code review gates: At least one approving maintainer for routine changes;
  two maintainers or a designated release lead for changes affecting APIs,
  performance budgets, or security boundaries.
- CI gates: All tests and linters defined in the plan MUST pass. Performance
  or integration tests that are required by the plan MUST run as part of CI
  or stage gating.

## Governance

Amendments and Interpretation:

- The constitution is authoritative for non-functional requirements and the
  decision-making guidance it contains.
- Amendments MUST be proposed as a documented Pull Request that includes:
  rationale, concrete text changes, migration steps, and a test/validation
  plan where applicable.
- Approval: A constitutional amendment requires either (a) approval from at
  least two maintainers listed in the repository `MAINTAINERS` file, or (b)
  a 2/3 supermajority of active contributors who sign the PR in a 14-day
  comment window. If the `MAINTAINERS` file is absent, the latter rule
  applies.
- Versioning: The constitution follows semantic versioning: MAJOR for
  incompatible principle redefinitions or removals, MINOR for added
  principles or material new guidance, PATCH for clarifications and
  non-semantic edits. The `Last Amended` date is the ISO date of merge.
- Compliance: All feature plans and PRs MUST reference relevant constitution
  sections and demonstrate compliance or provide an explicit mitigation and
  approval trace.

**Version**: 1.0.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
