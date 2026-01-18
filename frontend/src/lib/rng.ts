// Deterministic seeded RNG utilities
// Uses a small string->uint32 hash and mulberry32 PRNG

function hashStringToUint32(str: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    // final avalanche
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return h >>> 0;
}

function toUint32(seed: number | string): number {
    if (typeof seed === "number") return seed >>> 0 || 0xdeadbeef;
    return hashStringToUint32(String(seed || "")) || 0xdeadbeef;
}

export type RNG = {
    next(): number; // raw 32-bit fraction [0,1)
    float(): number; // alias for next()
    int(min: number, max: number): number; // inclusive min, inclusive max
    choice<T>(arr: T[]): T;
    shuffle<T>(arr: T[]): T[]; // returns new shuffled array
    // advanced helpers
    serialize(): number; // return internal uint32 state snapshot
    split(label?: string | number): RNG; // produce a new RNG derived from this one
};

export function createRng(seed: number | string): RNG {
    let state = toUint32(seed);

    function mulberry32() {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function snapshot() {
        return state >>> 0;
    }

    function mixSeedValues(a: number, b: number) {
        // simple mixing via stringification and hashing to produce a 32-bit value
        return hashStringToUint32(String(a) + ":" + String(b));
    }

    return {
        next: () => mulberry32(),
        float: () => mulberry32(),
        int: (min: number, max: number) => {
            const f = mulberry32();
            const lo = Math.ceil(min);
            const hi = Math.floor(max);
            return Math.floor(f * (hi - lo + 1)) + lo;
        },
        choice: <T>(arr: T[]) => {
            if (!arr || arr.length === 0)
                throw new Error("choice: empty array");
            const idx = Math.floor(mulberry32() * arr.length);
            return arr[idx];
        },
        shuffle: <T>(arr: T[]) => {
            const out = arr.slice();
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(mulberry32() * (i + 1));
                const tmp = out[i];
                out[i] = out[j];
                out[j] = tmp;
            }
            return out;
        },
        serialize: () => snapshot(),
        split: (label?: string | number) => {
            const labelVal =
                label === undefined
                    ? Math.floor(mulberry32() * 4294967295)
                    : toUint32(label);
            const mixed = mixSeedValues(snapshot(), labelVal);
            return createRng(mixed);
        },
    };
}

export function createRngFromState(stateUint32: number): RNG {
    // create an RNG with internal state seeded to the provided uint32
    let state = stateUint32 >>> 0;

    function mulberry32() {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function snapshot() {
        return state >>> 0;
    }

    return {
        next: () => mulberry32(),
        float: () => mulberry32(),
        int: (min: number, max: number) => {
            const f = mulberry32();
            const lo = Math.ceil(min);
            const hi = Math.floor(max);
            return Math.floor(f * (hi - lo + 1)) + lo;
        },
        choice: <T>(arr: T[]) => {
            if (!arr || arr.length === 0)
                throw new Error("choice: empty array");
            const idx = Math.floor(mulberry32() * arr.length);
            return arr[idx];
        },
        shuffle: <T>(arr: T[]) => {
            const out = arr.slice();
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(mulberry32() * (i + 1));
                const tmp = out[i];
                out[i] = out[j];
                out[j] = tmp;
            }
            return out;
        },
        serialize: () => snapshot(),
        split: (label?: string | number) => {
            const labelVal =
                label === undefined
                    ? Math.floor(mulberry32() * 4294967295)
                    : toUint32(label);
            const mixed = hashStringToUint32(
                String(snapshot()) + ":" + String(labelVal),
            );
            return createRng(mixed);
        },
    };
}

export function mixSeeds(a: number | string, b: number | string): number {
    return hashStringToUint32(String(toUint32(a)) + ":" + String(toUint32(b)));
}

export default createRng;
