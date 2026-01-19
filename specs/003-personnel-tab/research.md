# Research Notes — Personnel Tab (Phase 0)

Decision: intelligenceLevel → confidence is a linear mapping.

Rationale: The product requested a predictable, monotonic mapping from an integer intelligence scale (0–10) to a UI-facing confidence percentage. Linear mapping is intuitive for players and simple to test.

Mapping: confidence% = round((intelligenceLevel / 10) \* 100).

Chain-of-Command Capacity and Reassignment

Decision: Leadership attribute determines capacity; when a superior is removed, subordinates are reassigned to the next available superior with capacity, preserving chain order where possible.

Rationale: This keeps capacity emergent (no hard-coded capacities on Persons) and matches spec behavioral rules. Reassignment attempts:

- First, assign to the superior's superior if capacity available.
- Next, assign to any other superior in the same zone with available capacity.
- If none available, mark subordinate as unassigned and surface in UI.

Agents vs People

Decision: Agents are rendered as having "max intelligence" for UI displays where intelligence is required. Only `Person` entities carry `intelligenceLevel` in data models.

Rationale: Simplifies model consistency: `Agent` is a runtime entity (employed or not) and is presented with maximum capability for display; `Person` persists intelligence as part of their profile.

Open Questions (none remain): All clarifications requested in the spec have been resolved.
