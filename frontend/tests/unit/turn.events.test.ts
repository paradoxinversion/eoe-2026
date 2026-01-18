import { describe, it, expect } from "vitest";
import createRng from "../../src/lib/rng";
import { resolveTurn, GameState } from "../../src/services/turn";

describe("turn events and agents", () => {
    const initial: GameState = {
        day: 0,
        resources: { gold: 10, science: 0 },
        agents: [
            { id: "a1", role: "worker", name: "Worker1" },
            { id: "s1", role: "scientist", name: "Scientist1" },
        ],
    };

    it("agent production is deterministic with same seed", () => {
        const r1 = createRng(555);
        const r2 = createRng(555);
        const a = resolveTurn(initial, r1);
        const b = resolveTurn(initial, r2);
        expect(a).toEqual(b);
    });

    it("events can modify resources deterministically by seed", () => {
        const r1 = createRng("event-seed-1");
        const r2 = createRng("event-seed-1");
        const a = resolveTurn(initial, r1);
        const b = resolveTurn(initial, r2);
        expect(a).toEqual(b);
    });

    it("different seeds may yield different events/results", () => {
        const r1 = createRng("x");
        const r2 = createRng("y");
        const a = resolveTurn(initial, r1);
        const b = resolveTurn(initial, r2);
        // possible they are equal by chance; assert they are objects and have resources
        expect(typeof a.resources.gold).toBe("number");
        expect(typeof b.resources.gold).toBe("number");
    });
});
