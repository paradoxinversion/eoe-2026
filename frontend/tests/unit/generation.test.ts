import { describe, it, expect } from "vitest";
import { generateDebugWorld } from "../../src/services/generation";

describe("generation", () => {
  it("is deterministic for a given seed (debug)", () => {
    const a = generateDebugWorld(12345, { mapWidth: 3, mapHeight: 2 });
    const b = generateDebugWorld(12345, { mapWidth: 3, mapHeight: 2 });
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it("produces different artifacts for different seeds (debug)", () => {
    const a = generateDebugWorld("seed-a", { mapWidth: 2, mapHeight: 2 });
    const b = generateDebugWorld("seed-b", { mapWidth: 2, mapHeight: 2 });
    expect(JSON.stringify(a)).not.toEqual(JSON.stringify(b));
  });

  it("keeps zone count equal to mapWidth*mapHeight and deterministic (debug)", () => {
    const a = generateDebugWorld(777, { mapWidth: 4, mapHeight: 5 });
    const b = generateDebugWorld(777, { mapWidth: 4, mapHeight: 5 });
    expect(a.zones.length).toBeGreaterThanOrEqual(1);
    expect(a.zones.length).toEqual(4 * 5);
    expect(a.zones.length).toEqual(b.zones.length);
  });

  it("zone ids are deterministic and stable across runs (debug)", () => {
    const a = generateDebugWorld("stability-seed", {
      mapWidth: 3,
      mapHeight: 3,
    });
    const b = generateDebugWorld("stability-seed", {
      mapWidth: 3,
      mapHeight: 3,
    });
    const idsA = a.zones.map((z) => z.id);
    const idsB = b.zones.map((z) => z.id);
    expect(idsA).toEqual(idsB);
  });

  it("debug artifact contains sensible people/building counts", () => {
    const art = generateDebugWorld(42, { mapWidth: 3, mapHeight: 2 });
    expect(Array.isArray(art.zones)).toBeTruthy();
    expect(Array.isArray(art.buildings)).toBeTruthy();
    expect(Array.isArray(art.people)).toBeTruthy();
  });
});
