import type { RNG } from "../lib/rng";

export type Resources = {
    gold: number;
    science: number;
};

export type GameState = {
    day: number;
    resources: Resources;
    log?: string[];
};

export function resolveTurn(state: GameState, rng: RNG): GameState {
    // deterministic simple rules for turn resolution:
    // - gold increases by 1..5
    // - science increases by 0..2
    const goldGain = rng.int(1, 5);
    const scienceGain = rng.int(0, 2);

    const next: GameState = {
        day: state.day + 1,
        resources: {
            gold: state.resources.gold + goldGain,
            science: state.resources.science + scienceGain,
        },
        log: (state.log || []).concat([
            `Day ${state.day + 1}: +${goldGain} gold, +${scienceGain} science`,
        ]),
    };

    return next;
}

export function resolveTurns(
    state: GameState,
    rng: RNG,
    days: number,
): GameState {
    let s = {
        ...state,
        resources: { ...state.resources },
        log: state.log ? [...state.log] : [],
    } as GameState;
    for (let i = 0; i < days; i++) {
        s = resolveTurn(s, rng);
    }
    return s;
}

export default { resolveTurn, resolveTurns };
