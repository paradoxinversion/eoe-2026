import { describe, it, expect } from "vitest";
import createRng from "../../src/lib/rng";
import { resolveTurn, resolveTurns, GameState } from "../../src/services/turn";

describe("turn resolution deterministic behavior", () => {
    const initial: GameState = { day: 0, resources: { gold: 10, science: 0 } };

    it("same seed yields same single-turn result", () => {
        const r1 = createRng(123);
        const r2 = createRng(123);
        const a = resolveTurn(initial, r1);
        const b = resolveTurn(initial, r2);
        expect(a).toEqual(b);
    });

    it("different seeds yield different results over multiple turns", () => {
        const r1 = createRng("alpha");
        const r2 = createRng("beta");
        const a = resolveTurns(initial, r1, 5);
        const b = resolveTurns(initial, r2, 5);
        expect(a).not.toEqual(b);
    });

    it("resolveTurns advances day count correctly", () => {
        const r = createRng(999);
        const out = resolveTurns(initial, r, 3);
        expect(out.day).toBe(3);
        expect(out.resources.gold).toBeGreaterThanOrEqual(
            initial.resources.gold + 3,
        );
    });
});
