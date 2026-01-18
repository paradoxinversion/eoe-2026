import { describe, it, expect } from "vitest";
import createRng, { createRngFromState, mixSeeds } from "../../src/lib/rng";

describe("RNG helpers: split/mix/serialize", () => {
    it("mixSeeds produces stable numeric seed", () => {
        const a = mixSeeds("foo", 123);
        const b = mixSeeds("foo", 123);
        expect(a).toBe(b);
    });

    it("serialize and createRngFromState preserve sequence", () => {
        const r = createRng("serialize-test");
        // advance a few
        const s1 = r.next();
        const s2 = r.next();
        const state = r.serialize();

        // create new rng from state and ensure next values match
        const r2 = createRngFromState(state);
        const x1 = r2.next();
        const x2 = r2.next();
        // these should equal next() from original sequence after snapshot
        expect(x1).toBeCloseTo(r.next(), 10);
        expect(x2).toBeCloseTo(r.next(), 10);
    });

    it("split produces independent but deterministic RNGs", () => {
        const parent = createRng("parent-seed");
        const childA = parent.split("a");
        const childB = parent.split("a");
        // same split label yields same deterministic child from parent state
        expect(childA.next()).toBeCloseTo(childB.next(), 10);
        // different label yields different sequence
        const childC = parent.split("c");
        expect(childA.next()).not.toEqual(childC.next());
    });
});
