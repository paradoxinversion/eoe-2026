import { describe, it, expect } from "vitest";
import {
  getOccupants,
  getOccupantsWithAgents,
} from "../../src/services/zoneService";

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

  it("supports zone.currentOccupants as an array of ids", () => {
    const s = {
      people: [
        { id: "p3", firstName: "C", lastName: "Three", homeZoneId: "zX" },
      ],
      agents: [{ id: "a3", personId: "p3", codeName: "charlie" }],
      zones: [{ id: "zX", name: "Z X", currentOccupants: ["p3"] }],
    };
    const occ = getOccupantsWithAgents("zX", s);
    expect(occ).toHaveLength(1);
    expect(occ[0].person.id).toBe("p3");
    expect(occ[0].agent.codeName).toBe("charlie");
  });

  it("supports zone.currentOccupants as comma-separated string", () => {
    const s = {
      people: [
        { id: "p4", firstName: "D", lastName: "Four" },
        { id: "p5", firstName: "E", lastName: "Five" },
      ],
      agents: [
        { id: "a4", personId: "p4", codeName: "delta" },
        { id: "a5", personId: "p5", codeName: "echo" },
      ],
      zones: [{ id: "zY", name: "Z Y", currentOccupants: "p4,p5" }],
    };
    const occ = getOccupantsWithAgents("zY", s);
    expect(occ.map((o) => o.person.id).sort()).toEqual(["p4", "p5"]);
    expect(occ.find((o) => o.person.id === "p4")?.agent?.codeName).toBe(
      "delta",
    );
  });

  it("supports numeric currentOccupants by coercion", () => {
    const s = {
      people: [{ id: "1", firstName: "Num", lastName: "One" }],
      agents: [{ id: "a-num", personId: "1", codeName: "number-one" }],
      zones: [{ id: "zNum", name: "Z Num", currentOccupants: 1 }],
    };
    const occ = getOccupantsWithAgents("zNum", s);
    expect(occ).toHaveLength(1);
    expect(occ[0].person.id).toBe("1");
    expect(occ[0].agent.codeName).toBe("number-one");
  });
});
