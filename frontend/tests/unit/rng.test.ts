import { describe, it, expect } from "vitest";
import createRng from "../../src/lib/rng";

describe("createRng deterministic behavior", () => {
    it("produces the same sequence for same numeric seed", () => {
        const a = createRng(42);
        const b = createRng(42);
        const seqA = [a.next(), a.next(), a.next()];
        const seqB = [b.next(), b.next(), b.next()];
        expect(seqA).toEqual(seqB);
    });

    it("produces different sequences for different seeds", () => {
        const a = createRng("alpha");
        const b = createRng("beta");
        const seqA = [a.next(), a.next(), a.next()];
        const seqB = [b.next(), b.next(), b.next()];
        expect(seqA).not.toEqual(seqB);
    });

    it("int returns values in inclusive range", () => {
        const r = createRng(1);
        for (let i = 0; i < 20; i++) {
            const v = r.int(1, 6);
            expect(v).toBeGreaterThanOrEqual(1);
            expect(v).toBeLessThanOrEqual(6);
        }
    });

    it("shuffle is deterministic", () => {
        const arr = [1, 2, 3, 4, 5, 6];
        const s1 = createRng("seed1").shuffle(arr);
        const s2 = createRng("seed1").shuffle(arr);
        expect(s1).toEqual(s2);
        // different seed -> likely different order
        const s3 = createRng("seed2").shuffle(arr);
        expect(s1).not.toEqual(s3);
    });
});
