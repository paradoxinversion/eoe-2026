import createRng from "../lib/rng";
import { createZone } from "../models/zone";
import type { Zone } from "../models/zone";
import { createPerson } from "../models/person";
import type { Person } from "../models/person";
import type Building from "../models/building";
import { BUILDING_TYPES } from "../models/building";
import type GoverningOrganization from "../models/governingOrganization";

type DebugArtifact = {
  zones: Zone[];
  people: Person[];
  buildings: Building[];
  organizations: GoverningOrganization[];
  placementErrors: Array<{
    zoneId?: string;
    buildingType?: string;
    message: string;
  }>;
};

function makeId(rng: ReturnType<typeof createRng>, prefix: string) {
  return `${prefix}-${rng.int(100000, 999999)}`;
}

export function generateDebugWorld(
  seed: number | string,
  opts?: {
    mapWidth?: number;
    mapHeight?: number;
    zoneSize?: number;
    peoplePerZone?: number;
    orgCount?: number;
  },
): DebugArtifact {
  const rng = createRng(seed);
  const mapWidth = opts?.mapWidth ?? 100;
  const mapHeight = opts?.mapHeight ?? 100;
  const zoneSize = opts?.zoneSize ?? 10;
  const peoplePerZone = opts?.peoplePerZone ?? 2;

  const gridX = Math.max(1, Math.ceil(mapWidth / zoneSize));
  const gridY = Math.max(1, Math.ceil(mapHeight / zoneSize));

  const zones: Zone[] = [];
  const buildings: Building[] = [];
  const people: Person[] = [];
  const organizations: GoverningOrganization[] = [];
  const placementErrors: Array<{
    zoneId?: string;
    buildingType?: string;
    message: string;
  }> = [];

  // create zones
  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      const id = `zone-${x}-${y}`;
      const name = `Zone ${x},${y}`;
      const intelligence = rng.int(0, 100);
      const z = createZone(id, x, y, name, intelligence, {
        buildings: [],
        people: [],
      });
      zones.push(z as Zone);
    }
  }

  // create organizations (allow override via opts.orgCount)
  const orgCount =
    typeof opts?.orgCount === "number"
      ? Math.max(1, Math.floor(opts!.orgCount))
      : Math.max(1, Math.floor(zones.length / 5));
  for (let i = 0; i < orgCount; i++) {
    const id = makeId(rng, "org");
    organizations.push({
      id,
      name: `Org ${i}`,
      type: "local",
      leaderId: undefined,
    } as GoverningOrganization);
  }

  // place buildings: ensure each zone has at least one of each building type
  for (const z of zones) {
    for (const t of BUILDING_TYPES) {
      const id = makeId(rng, "b");
      const name = `${t} ${id.slice(-4)}`;
      const size = rng.int(1, 5);
      const intelligenceLevel = rng.int(0, 100);
      const upkeepCost = rng.int(1, 50);
      const infrastructureLoad = rng.int(0, 10);
      const b: Building = {
        id,
        name,
        type: t,
        size,
        zoneId: (z as any).id,
        intelligenceLevel,
        upkeepCost,
        infrastructureLoad,
      } as Building;
      buildings.push(b);
      if ((z as any).buildings && Array.isArray((z as any).buildings)) {
        (z as any).buildings.push(id);
      }
    }
  }

  // create people per zone
  for (const z of zones) {
    for (let i = 0; i < peoplePerZone; i++) {
      const id = makeId(rng, "p");
      const firstName = `P${rng.int(10, 99)}`;
      const lastName = `Z${z.id.split("-").slice(-2).join("")}`;
      const p = createPerson(id, firstName, lastName, {
        homeZoneId: (z as any).id,
        intelligenceLevel: rng.int(0, 100),
      });
      people.push(p);
      if ((z as any).people && Array.isArray((z as any).people)) {
        (z as any).people.push(p.id);
      }
    }
  }

  // assign some buildings to organizations
  for (const b of buildings) {
    if (organizations.length > 0 && rng.int(0, 4) === 0) {
      const org = organizations[rng.int(0, organizations.length - 1)];
      (b as any).ownerOrgId = org.id;
    }
  }

  return { zones, people, buildings, organizations, placementErrors };
}

import createRng2, { RNG } from "../lib/rng";
import { saveGameState, loadConfig, loadPreferences } from "./persistence";
import { defaultConfig } from "../config/schema";

export type Zone2 = {
  id: string;
  name: string;
  intelligence_level: number; // 0-100
};

export type PlayerEmpire2 = {
  id: string;
  name: string;
  resources: {
    evil: number;
    money: number;
    infrastructure: number;
    science: number;
  };
  zones: Zone2[];
};

export type World2 = {
  seed: number | string;
  player: PlayerEmpire2;
};

function makeId2(prefix: string, rng: RNG) {
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

export function generateWorld(seed: number | string): World2 {
  const rng = createRng2(seed);

  const numZones = rng.int(3, 6);
  const zones: Zone2[] = [];
  const usedNames: Set<string> = new Set();

  for (let i = 0; i < numZones; i++) {
    // pick a name deterministically, avoid duplicates by sampling shuffled list
    const choices = rng.shuffle(ZONE_NAMES).filter((n) => !usedNames.has(n));
    const name = choices.length > 0 ? choices[0] : `Zone ${i + 1}`;
    usedNames.add(name);

    zones.push({
      id: makeId2("zone", rng.split(i)),
      name,
      intelligence_level: rng.int(0, 100),
    });
  }

  const player: PlayerEmpire2 = {
    id: makeId2("player", rng),
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

export async function generateAndSaveWorld(
  seed: number | string,
  opts?: {
    mapWidth?: number;
    mapHeight?: number;
    zoneSize?: number;
    peoplePerZone?: number;
    orgCount?: number;
  },
  saveName?: string,
): Promise<DebugArtifact> {
  // If orgCount not provided, attempt to read from saved preferences
  let finalOpts = opts || {};
  if (typeof finalOpts.orgCount !== "number") {
    try {
      const prefs = (await loadConfig("preferences")) as
        | (Record<string, unknown> & { organizationCount?: number })
        | null;
      if (prefs && typeof prefs.organizationCount === "number") {
        finalOpts = Object.assign({}, finalOpts, {
          orgCount: prefs.organizationCount,
        });
      } else {
        // try legacy preferences store
        const lp = (await loadPreferences("preferences")) as
          | (Record<string, unknown> & { organizationCount?: number })
          | null;
        if (lp && typeof lp.organizationCount === "number") {
          finalOpts = Object.assign({}, finalOpts, {
            orgCount: lp.organizationCount,
          });
        } else if (typeof defaultConfig.organizationCount === "number") {
          finalOpts = Object.assign({}, finalOpts, {
            orgCount: defaultConfig.organizationCount,
          });
        }
      }
    } catch (e) {
      // ignore and fall back to generator default
    }
  }

  // If map dimensions not provided, attempt to read from preferences or defaults
  if (
    typeof finalOpts.mapWidth !== "number" ||
    typeof finalOpts.mapHeight !== "number"
  ) {
    try {
      const prefs = (await loadConfig("preferences")) as
        | (Record<string, unknown> & { mapWidth?: number; mapHeight?: number })
        | null;
      if (prefs) {
        const updates: Record<string, number> = {};
        if (
          typeof prefs.mapWidth === "number" &&
          typeof finalOpts.mapWidth !== "number"
        ) {
          updates.mapWidth = prefs.mapWidth;
        }
        if (
          typeof prefs.mapHeight === "number" &&
          typeof finalOpts.mapHeight !== "number"
        ) {
          updates.mapHeight = prefs.mapHeight;
        }
        if (Object.keys(updates).length > 0) {
          finalOpts = Object.assign({}, finalOpts, updates);
        }
      } else {
        const lp = (await loadPreferences("preferences")) as
          | (Record<string, unknown> & {
              mapWidth?: number;
              mapHeight?: number;
            })
          | null;
        const updates: Record<string, number> = {};
        if (
          lp &&
          typeof lp.mapWidth === "number" &&
          typeof finalOpts.mapWidth !== "number"
        ) {
          updates.mapWidth = lp.mapWidth;
        }
        if (
          lp &&
          typeof lp.mapHeight === "number" &&
          typeof finalOpts.mapHeight !== "number"
        ) {
          updates.mapHeight = lp.mapHeight;
        }
        if (Object.keys(updates).length > 0) {
          finalOpts = Object.assign({}, finalOpts, updates);
        }
        // fall back to defaults if still missing
        if (
          typeof finalOpts.mapWidth !== "number" &&
          typeof defaultConfig.mapWidth === "number"
        ) {
          finalOpts.mapWidth = defaultConfig.mapWidth;
        }
        if (
          typeof finalOpts.mapHeight !== "number" &&
          typeof defaultConfig.mapHeight === "number"
        ) {
          finalOpts.mapHeight = defaultConfig.mapHeight;
        }
      }
    } catch (e) {
      // ignore and fall back to generator defaults
    }
  }

  const artifact = generateDebugWorld(seed, finalOpts);
  const name = saveName || `generation-${String(seed)}`;
  await saveGameState(name, artifact);
  return artifact;
}
