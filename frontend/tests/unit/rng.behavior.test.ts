import { describe, it, expect } from "vitest";
import createRng, { createRngFromState } from "../../src/lib/rng";

describe("RNG advanced behavior", () => {
  it("serialize + createRngFromState restores sequence", () => {
    const r = createRng(12345);
    // advance one step, capture state, then compare subsequent outputs
    const first = r.next();
    const snap = r.serialize();
    const r2 = createRngFromState(snap);
    const nextA = r.next();
    const nextB = r2.next();
    expect(nextA).toEqual(nextB);
  });

  it("split(label) is deterministic for same label", () => {
    const base = createRng("split-base");
    const a = base.split("child");
    const b = createRng("split-base").split("child");
    const seqA = [a.next(), a.next(), a.next()];
    const seqB = [b.next(), b.next(), b.next()];
    expect(seqA).toEqual(seqB);
  });
});
