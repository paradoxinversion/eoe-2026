import createRng, { RNG } from "../lib/rng";

export type Zone = {
    id: string;
    name: string;
    intelligence_level: number; // 0-100
};

export type PlayerEmpire = {
    id: string;
    name: string;
    resources: {
        evil: number;
        money: number;
        infrastructure: number;
        science: number;
    };
    zones: Zone[];
};

export type World = {
    seed: number | string;
    player: PlayerEmpire;
};

function makeId(prefix: string, rng: RNG) {
    return `${prefix}-${rng.serialize()}`;
}

const ZONE_NAMES = [
    "Central City",
    "Iron Vale",
    "Blackwater",
    "New Arcadia",
    "Highspire",
    "Lower Hollow",
    "Eastwatch",
];

export function generateWorld(seed: number | string): World {
    const rng = createRng(seed);

    const numZones = rng.int(3, 6);
    const zones: Zone[] = [];
    const usedNames: Set<string> = new Set();

    for (let i = 0; i < numZones; i++) {
        // pick a name deterministically, avoid duplicates by sampling shuffled list
        const choices = rng
            .shuffle(ZONE_NAMES)
            .filter((n) => !usedNames.has(n));
        const name = choices.length > 0 ? choices[0] : `Zone ${i + 1}`;
        usedNames.add(name);

        zones.push({
            id: makeId("zone", rng.split(i)),
            name,
            intelligence_level: rng.int(0, 100),
        });
    }

    const player: PlayerEmpire = {
        id: makeId("player", rng),
        name: `The Empire of ${String(seed)}`,
        resources: {
            evil: rng.int(0, 10),
            money: rng.int(500, 2000),
            infrastructure: rng.int(1, 5),
            science: rng.int(0, 100),
        },
        zones,
    };

    return {
        seed,
        player,
    };
}

export default generateWorld;
