import { describe, it, expect } from "vitest";
import { generateAndSaveWorld } from "../../src/services/generation";

describe("Initial agents edge cases", () => {
  it("does not create more agents than available people in low-population zones", async () => {
    const seed = "edge-seed-low-pop";
    // Small map and low peoplePerZone to force fewer than 10 candidates
    const opts = { mapWidth: 2, mapHeight: 2, peoplePerZone: 1 };

    const artifact = await generateAndSaveWorld(seed, opts);
    expect(artifact).toBeTruthy();

    const agents = Array.isArray(artifact.agents) ? artifact.agents : [];
    expect(agents.length).toBeLessThanOrEqual(10);

    const playerZone = (artifact.zones || []).find(
      (z: any) => z.governingOrganization === artifact.playerOrgId,
    );
    const zonePeople = Array.isArray((playerZone as any)?.people)
      ? (playerZone as any).people
      : [];

    // Each agent must reference a person present in the player's starting zone
    for (const ag of agents) {
      expect(zonePeople).toContain(ag.personId);
    }

    // Number of agents should never exceed number of people in zone
    expect(agents.length).toBeLessThanOrEqual(zonePeople.length);

    // Ensure uniqueness
    const ids = agents.map((a: any) => a.personId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
