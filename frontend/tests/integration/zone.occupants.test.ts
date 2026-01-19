import { describe, it, expect } from "vitest";
import {
  getOccupants,
  getOccupantsWithAgents,
} from "../../frontend/src/services/zoneService";

describe("zoneService occupants", () => {
  const state = {
    people: [
      { id: "p1", firstName: "A", lastName: "One", homeZoneId: "z1" },
      { id: "p2", firstName: "B", lastName: "Two", homeZoneId: "z2" },
    ],
    agents: [{ id: "a1", personId: "p1", codeName: "alpha" }],
    zones: [{ id: "z1", name: "Zone One" }],
  };

  it("returns occupants by homeZoneId", () => {
    const occ = getOccupants("z1", state);
    expect(occ).toHaveLength(1);
    expect(occ[0].id).toBe("p1");
  });

  it("joins agent data when present", () => {
    const occ = getOccupantsWithAgents("z1", state);
    expect(occ).toHaveLength(1);
    expect(occ[0].person.id).toBe("p1");
    expect(occ[0].agent).toBeDefined();
    expect(occ[0].agent.codeName).toBe("alpha");
  });
});
