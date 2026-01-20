import { describe, it, expect } from "vitest";
import createRng from "../../src/lib/rng";
import { resolveTurn, resolveTurns } from "../../src/services/turn";
import { generateDebugWorld } from "../../src/services/generation";
import { createScienceProject } from "../../src/models/scienceProject";

describe("turn + science integration", () => {
  it("reserves science for queued project on resolveTurn when player has enough", () => {
    const rng = createRng(42);
    const art = generateDebugWorld("int-1", { mapWidth: 3, mapHeight: 2 });
    const player = {
      id: "p1",
      name: "Int1",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 0 },
      zones: art.zones.map((z) => ({
        id: z.id,
        name: z.name,
        intelligence_level: (z as any).intelligenceLevel || 0,
      })),
    } as any;
    // give player enough science
    player.resources.science = 30;
    const proj = createScienceProject("ip1", "Integration Reserve", 15, 3);

    const state = {
      day: 0,
      resources: { gold: 0, science: player.resources.science },
      player: player,
      projects: [proj],
    } as any;

    const next = resolveTurn(state, rng);

    // project should be active and reserved
    expect(next.projects[0].status).toBe("active");
    expect(next.projects[0].reserved_science).toBeGreaterThanOrEqual(15);
    // player's science in attached player object should be reduced by reserved amount
    expect(next.player.resources.science).toBeLessThan(30);
  });

  it("advances and completes project across multiple turns and consumes reserved science", () => {
    const rng = createRng(123);
    const art2 = generateDebugWorld("int-2", { mapWidth: 3, mapHeight: 2 });
    const player = {
      id: "p2",
      name: "Int2",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 0 },
      zones: art2.zones.map((z) => ({
        id: z.id,
        name: z.name,
        intelligence_level: (z as any).intelligenceLevel || 0,
      })),
    } as any;
    player.resources.science = 50;
    const proj = createScienceProject("ip2", "Integration Progress", 10, 2);

    const state = {
      day: 0,
      resources: { gold: 0, science: player.resources.science },
      player: player,
      projects: [proj],
    } as any;
    // add a scientist agent and assign to the project so it can progress
    state.agents = [{ id: "s1", name: "Dr S", role: "scientist" }];
    proj.assigned_scientists = ["s1"];

    const afterTwo = resolveTurns(state, rng, 3);

    const updatedProj = afterTwo.projects[0];
    expect(updatedProj.status).toBe("completed");
    // reserved_science should be 0 after completion
    expect(updatedProj.reserved_science || 0).toBe(0);
    // player's science should have decreased or stayed consumed (not returned)
    expect(afterTwo.player.resources.science).toBeLessThanOrEqual(50);
  });

  it("does not reserve when player lacks science", () => {
    const rng = createRng("lowseed");
    const art3 = generateDebugWorld("int-3", { mapWidth: 3, mapHeight: 2 });
    const player = {
      id: "p3",
      name: "Int3",
      resources: { evil: 0, money: 0, infrastructure: 1, science: 0 },
      zones: art3.zones.map((z) => ({
        id: z.id,
        name: z.name,
        intelligence_level: (z as any).intelligenceLevel || 0,
      })),
    } as any;
    player.resources.science = 1; // insufficient
    const proj = createScienceProject("ip3", "Integration Fail", 10, 4);

    const state = {
      day: 0,
      resources: { gold: 0, science: player.resources.science },
      player: player,
      projects: [proj],
    } as any;

    const next = resolveTurn(state, rng);
    expect(next.projects[0].status).toBe("queued");
    expect(next.projects[0].reserved_science || 0).toBe(0);
  });
});
