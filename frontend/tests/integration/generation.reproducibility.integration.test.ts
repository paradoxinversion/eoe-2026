import { describe, it, expect } from "vitest";
import { generateDebugWorld } from "../../src/services/generation";

describe("generation.debug.reproducibility", () => {
  it("produces identical artifacts for the same seed", () => {
    const seed = "repro-seed-42";
    const a = generateDebugWorld(seed, {
      mapWidth: 80,
      mapHeight: 80,
      zoneSize: 10,
      peoplePerZone: 1,
    });
    const b = generateDebugWorld(seed, {
      mapWidth: 80,
      mapHeight: 80,
      zoneSize: 10,
      peoplePerZone: 1,
    });

    // deep equality via JSON round-trip to avoid issues with object identity
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
