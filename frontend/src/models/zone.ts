export type Zone = {
    id: string;
    name: string;
    governing_org?: string;
    buildings?: string[];
    people?: string[];
    intelligence_level: number; // 0-100
    surveillance_profile?: Record<string, unknown>;
};

export function createZone(
    id: string,
    name: string,
    intelligence_level = 0,
    opts?: Partial<
        Pick<
            Zone,
            "governing_org" | "buildings" | "people" | "surveillance_profile"
        >
    >,
): Zone {
    return {
        id,
        name,
        intelligence_level: Math.max(
            0,
            Math.min(100, Math.floor(intelligence_level)),
        ),
        governing_org: opts?.governing_org,
        buildings: opts?.buildings ?? [],
        people: opts?.people ?? [],
        surveillance_profile: opts?.surveillance_profile ?? {},
    };
}

export default Zone;
