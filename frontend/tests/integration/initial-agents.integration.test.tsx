import { describe, it, expect } from "vitest";
import { generateAndSaveWorld } from "../../src/services/generation";

describe("Initial Agents integration", () => {
  it("selects up to 10 unique agents from the player's starting zone and is deterministic", async () => {
    const seed = "test-seed-008a";
    const opts = { mapWidth: 3, mapHeight: 3, peoplePerZone: 4 };

    const a1 = await generateAndSaveWorld(seed, opts);
    expect(a1).toBeTruthy();
    const agents = Array.isArray(a1.agents) ? a1.agents : [];
    expect(agents.length).toBeLessThanOrEqual(10);

    // Ensure player org/zone exist and were assigned
    expect(a1.playerOrgId).toBeTruthy();
    const playerZone = (a1.zones || []).find(
      (z: any) => z.governingOrganization === a1.playerOrgId,
    );
    expect(playerZone).toBeTruthy();
    const zonePeople = Array.isArray((playerZone as any).people)
      ? (playerZone as any).people
      : [];

    // Agent personIds are unique and come from the starting zone
    const personIds = agents.map((ag: any) => ag.personId);
    const unique = new Set(personIds);
    expect(unique.size).toBe(personIds.length);
    for (const pid of personIds) {
      expect(zonePeople).toContain(pid);
    }

    // Deterministic: same seed produces same selection order
    const a2 = await generateAndSaveWorld(seed, opts);
    const personIds2 = Array.isArray(a2.agents)
      ? a2.agents.map((ag: any) => ag.personId)
      : [];
    expect(personIds2).toEqual(personIds);
  });
});
