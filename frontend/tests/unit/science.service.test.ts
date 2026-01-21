import { describe, it, expect } from "vitest";
import { createScienceProject } from "../../src/models/scienceProject";
import {
  reserveForProject,
  canReserve,
  releaseReservation,
  accumulateScience,
} from "../../src/services/science";

describe("science service reservation", () => {
  it("reserves science up-front when available", () => {
    const player = {
      id: "p-test",
      name: "Tester",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 50 },
      zones: [],
    } as any;
    const proj = createScienceProject("p1", "ReserveTest", 20, 3);

    expect(canReserve(player, proj)).toBe(true);
    const ok = reserveForProject(player, proj);
    expect(ok).toBe(true);
    expect(proj.reserved_science).toBeGreaterThanOrEqual(20);
    expect(player.resources.science).toBe(30);
  });

  it("does not reserve if insufficient science", () => {
    const player = {
      id: "p-low",
      name: "Low",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 5 },
      zones: [],
    } as any;
    const proj = createScienceProject("p2", "TooPoor", 10, 2);

    expect(canReserve(player, proj)).toBe(false);
    const ok = reserveForProject(player, proj);
    expect(ok).toBe(false);
    expect(proj.reserved_science || 0).toBe(0);
    expect(player.resources.science).toBe(5);
  });

  it("releases reservation if project not completed", () => {
    const player = {
      id: "p-rel",
      name: "Rel",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 30 },
      zones: [],
    } as any;
    const proj = createScienceProject("p3", "RelTest", 15, 3);
    reserveForProject(player, proj);
    expect(player.resources.science).toBe(15);
    // cancel project
    proj.status = "cancelled";
    releaseReservation(player, proj);
    expect(player.resources.science).toBe(30);
  });

  it("does not return reserved science when project completed", () => {
    const player = {
      id: "p-comp",
      name: "Comp",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 40 },
      zones: [],
    } as any;
    const proj = createScienceProject("p4", "CompTest", 20, 2);
    reserveForProject(player, proj);
    expect(player.resources.science).toBe(20);
    proj.status = "completed";
    releaseReservation(player, proj);
    // reserved science consumed on completion
    expect(player.resources.science).toBe(20);
  });

  it("accumulates science into player resources", () => {
    const player = {
      id: "p-acc",
      name: "Acc",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 2 },
      zones: [],
    } as any;
    accumulateScience(player, 5);
    expect(player.resources.science).toBe(7);
  });
});
