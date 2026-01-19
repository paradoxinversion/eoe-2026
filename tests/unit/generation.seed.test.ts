import { describe, it, expect } from "vitest";
import { generateWorld } from "../../frontend/src/services/generation";

describe("generation determinism", () => {
    it("produces identical worlds for the same seed", () => {
        const seed = "test-seed-123";
        const a = generateWorld(seed as any);
        const b = generateWorld(seed as any);
        expect(a).toEqual(b);
    });
});
