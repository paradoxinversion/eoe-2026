import { bench, describe } from "vitest";
import { generateDebugWorld } from "../../src/services/generation";

// Simple benchmark: measure generation time for several seeds and report
// statistics via Vitest's bench runner. Use moderate map sizes to simulate
// realistic load.

describe("world generation perf", () => {
  const runs = 25;
  const opts = { mapWidth: 100, mapHeight: 100, peoplePerZone: 2 };

  for (let i = 0; i < runs; i++) {
    const seed = Date.now() + i;
    bench(`generate seed ${i}`, () => {
      // call generateDebugWorld synchronously
      generateDebugWorld(seed, opts);
    });
  }
});
