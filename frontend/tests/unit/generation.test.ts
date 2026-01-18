import { describe, it, expect } from "vitest";
import generateWorld from "../../src/services/generation";

describe("generation", () => {
  it("is deterministic for a given seed", () => {
    const a = generateWorld(12345);
    const b = generateWorld(12345);
    expect(a).toEqual(b);
  });

  it("produces different worlds for different seeds", () => {
    const a = generateWorld("seed-a");
    const b = generateWorld("seed-b");
    expect(a).not.toEqual(b);
  });

  it("keeps zone count deterministic and within expected bounds", () => {
    const a = generateWorld(777);
    const b = generateWorld(777);
    expect(a.player.zones.length).toBeGreaterThanOrEqual(3);
    expect(a.player.zones.length).toBeLessThanOrEqual(6);
    expect(a.player.zones.length).toEqual(b.player.zones.length);
  });

  it("zone ids are deterministic and stable across runs", () => {
    const a = generateWorld("stability-seed");
    const b = generateWorld("stability-seed");
    const idsA = a.player.zones.map((z) => z.id);
    const idsB = b.player.zones.map((z) => z.id);
    expect(idsA).toEqual(idsB);
  });

  it("resources are within expected ranges", () => {
    const w = generateWorld(42);
    const r = w.player.resources;
    expect(r.evil).toBeGreaterThanOrEqual(0);
    expect(r.money).toBeGreaterThanOrEqual(0);
    expect(r.infrastructure).toBeGreaterThanOrEqual(1);
    expect(r.science).toBeGreaterThanOrEqual(0);
  });
});
