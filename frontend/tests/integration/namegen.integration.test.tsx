import { test, expect } from "vitest";
import { generateDebugWorld } from "../../src/services/generation";

test("generateDebugWorld produces deterministic names for same seed", async () => {
  const opts = { mapWidth: 3, mapHeight: 2, peoplePerZone: 1 };
  const seed = 424242;

  const a = generateDebugWorld(seed, opts);
  const b = generateDebugWorld(seed, opts);

  // sort people by id to make ordering deterministic for comparison
  const namesA = a.people
    .slice()
    .sort((x, y) => x.id.localeCompare(y.id))
    .map((p) =>
      `${(p.firstName || "").trim()} ${(p.lastName || "").trim()}`.trim(),
    );

  const namesB = b.people
    .slice()
    .sort((x, y) => x.id.localeCompare(y.id))
    .map((p) =>
      `${(p.firstName || "").trim()} ${(p.lastName || "").trim()}`.trim(),
    );

  expect(namesA).toEqual(namesB);

  // different seed should usually produce different name sequences
  const c = generateDebugWorld(seed + 1, opts);
  const namesC = c.people
    .slice()
    .sort((x, y) => x.id.localeCompare(y.id))
    .map((p) =>
      `${(p.firstName || "").trim()} ${(p.lastName || "").trim()}`.trim(),
    );

  // allow possibility of collision but assert at least one difference
  const allSame =
    namesA.length === namesC.length && namesA.every((v, i) => v === namesC[i]);
  expect(allSame).toBe(false);
});
