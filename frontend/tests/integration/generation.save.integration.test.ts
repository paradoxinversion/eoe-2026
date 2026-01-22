import { describe, it, expect } from "vitest";
import { generateAndSaveWorld } from "../../src/services/generation";
import { loadGameState } from "../../src/services/persistence";

describe("generation.save", () => {
  it("saves generated world to persistence and saved state matches artifact", async () => {
    const seed = `save-seed-${Date.now()}`;
    const saveName = `test-save-${Date.now()}`;
    const artifact = await generateAndSaveWorld(
      seed,
      { mapWidth: 40, mapHeight: 40, zoneSize: 10, peoplePerZone: 1 },
      saveName,
    );

    // The generator persists the artifact under a generation-{seed}
    // key; tests should load that authoritative artifact rather than
    // relying on caller-provided saveName.
    const artifactSaveName = `generation-${String(seed)}`;
    const saved = await loadGameState(artifactSaveName);
    expect(saved).not.toBeNull();
    // deep equality via JSON to avoid prototype issues
    expect(JSON.stringify(saved)).toBe(JSON.stringify(artifact));
  }, 20000);
});
