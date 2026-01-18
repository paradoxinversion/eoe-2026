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
});
