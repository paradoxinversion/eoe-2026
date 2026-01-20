import { describe, it, expect } from "vitest";
import { generateDebugWorld } from "../../frontend/src/services/generation";

describe("generation determinism (debug)", () => {
    it("produces identical artifacts for the same seed", () => {
        const seed = "test-seed-123";
        const a = generateDebugWorld(seed as any, {
            mapWidth: 4,
            mapHeight: 3,
        });
        const b = generateDebugWorld(seed as any, {
            mapWidth: 4,
            mapHeight: 3,
        });
        expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
    });
});
