import { describe, it, expect } from "vitest";

// Lightweight migration test scaffold for p.name -> firstName/lastName and a.name -> codeName
import {
  splitPersonName,
  migrateFixture,
} from "../../specs/001-rework-data-models/scripts/migration-helpers";

describe("migration helpers (spec scaffold)", () => {
  it("splitPersonName splits a single full name into first and last", () => {
    const { firstName, lastName } = splitPersonName("John Doe");
    expect(firstName).toBe("John");
    expect(lastName).toBe("Doe");
  });

  it("migrateFixture migrates legacy person/agent name fields", () => {
    const fixture = {
      people: [{ id: "p1", name: "Alice Smith" }],
      agents: [{ id: "ag1", name: "Agent A", personId: "p1" }],
      zones: [],
    } as unknown as Record<string, unknown>;

    const report = migrateFixture(fixture);
    expect(report).toBeDefined();
    // after migration the person should have firstName/lastName
    expect(fixture.people[0].firstName).toBeTruthy();
    expect(fixture.people[0].lastName).toBeTruthy();
    // agent should have codeName populated
    expect(fixture.agents[0].codeName).toBeTruthy();
  });
});
