import { describe, it, expect } from "vitest";
import createRng from "../../src/lib/rng";
import { resolveTurn, GameState } from "../../src/services/turn";

describe("event config probabilities", () => {
    it("high event probabilities cause events to occur", () => {
        const initial: GameState = {
            day: 0,
            resources: { gold: 50, science: 10 },
            agents: [],
        };
        const stateWithHighEvents = {
            ...initial,
            eventProbabilities: { raid: 0.5, blessing: 0.4, discovery: 0.05 },
        } as any;
        const rng = createRng(2026);
        const out = resolveTurn(stateWithHighEvents, rng);
        const hasEvent = (out.log || []).some((l) => l.startsWith("Event:"));
        expect(hasEvent).toBe(true);
    });

    it("zero probabilities prevent events", () => {
        const initial: GameState = {
            day: 0,
            resources: { gold: 50, science: 10 },
            agents: [],
        };
        const stateNoEvents = {
            ...initial,
            eventProbabilities: { raid: 0, blessing: 0, discovery: 0 },
        } as any;
        const rng = createRng(2026);
        const out = resolveTurn(stateNoEvents, rng);
        const hasEvent = (out.log || []).some((l) => l.startsWith("Event:"));
        expect(hasEvent).toBe(false);
    });
});
