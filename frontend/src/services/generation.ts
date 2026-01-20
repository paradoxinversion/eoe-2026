import createRng from "../lib/rng";
import { createZone } from "../models/zone";
import type { Zone } from "../models/zone";
import { createPerson } from "../models/person";
import type { Person } from "../models/person";
import type Building from "../models/building";
import { BUILDING_TYPES } from "../models/building";
import type GoverningOrganization from "../models/governingOrganization";
import { saveGameState, loadConfig, loadPreferences } from "./persistence";
import { defaultConfig } from "../config/schema";

export type DebugArtifact = {
  zones: Zone[];
  people: Person[];
  buildings: Building[];
  organizations: GoverningOrganization[];
  placementErrors: Array<{
    zoneId?: string;
    buildingType?: string;
    message: string;
  }>;
  playerCharacterId?: string;
  playerOrgId?: string;
};

function makeId(rng: ReturnType<typeof createRng>, prefix: string) {
  return `${prefix}-${rng.int(100000, 999999)}`;
}

export function generateDebugWorld(
  seed: number | string,
  opts?: {
    mapWidth?: number;
    mapHeight?: number;
    zoneSizeMin?: number;
    zoneSizeMax?: number;
    peoplePerZone?: number;
    orgCount?: number;
  },
): DebugArtifact {
  const rng = createRng(seed);
  const mapWidth = Math.max(1, Math.floor(opts?.mapWidth ?? 100));
  const mapHeight = Math.max(1, Math.floor(opts?.mapHeight ?? 100));
  const peoplePerZone = opts?.peoplePerZone ?? 2;
  const zoneSizeMin = Math.max(
    1,
    Math.floor(opts?.zoneSizeMin ?? defaultConfig.zoneSizeMin ?? 1),
  );
  const zoneSizeMax = Math.max(
    zoneSizeMin,
    Math.floor(opts?.zoneSizeMax ?? defaultConfig.zoneSizeMax ?? zoneSizeMin),
  );

  const gridX = mapWidth;
  const gridY = mapHeight;

  const zones: Zone[] = [];
  const buildings: Building[] = [];
  const people: Person[] = [];
  const organizations: GoverningOrganization[] = [];
  const placementErrors: Array<{
    zoneId?: string;
    buildingType?: string;
    message: string;
  }> = [];

  for (let y = 0; y < gridY; y++) {
    for (let x = 0; x < gridX; x++) {
      const id = `zone-${x}-${y}`;
      const name = `Zone ${x},${y}`;
      const intelligence = rng.int(0, 100);
      const size = rng.int(zoneSizeMin, zoneSizeMax);
      const z = createZone(id, x, y, name, intelligence, {
        buildings: [],
        people: [],
        size,
      });
      zones.push(z as Zone);
    }
  }

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

  for (const z of zones) {
    // number of people scales with zone size (peoplePerZone is a multiplier)
    const zoneSize = (z as any).size ?? 1;
    const peopleCount = Math.max(
      0,
      Math.floor((peoplePerZone ?? 0) * zoneSize),
    );
    for (let i = 0; i < peopleCount; i++) {
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

  for (const b of buildings) {
    if (organizations.length > 0 && rng.int(0, 4) === 0) {
      const org = organizations[rng.int(0, organizations.length - 1)];
      (b as any).ownerOrgId = org.id;
    }
  }

  return { zones, people, buildings, organizations, placementErrors };
}

// lightweight gameplay generator kept for compatibility
export type Zone2 = { id: string; name: string; intelligence_level: number };
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
export type World2 = { seed: number | string; player: PlayerEmpire2 };

function makeId2(prefix: string, rng: ReturnType<typeof createRng>) {
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
  const rng = createRng(seed);
  const numZones = rng.int(3, 6);
  const zones: Zone2[] = [];
  const used = new Set<string>();
  for (let i = 0; i < numZones; i++) {
    const choices = rng.shuffle(ZONE_NAMES).filter((n) => !used.has(n));
    const name = choices.length > 0 ? choices[0] : `Zone ${i + 1}`;
    used.add(name);
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
  return { seed, player };
}

export default generateWorld;

export async function generateAndSaveWorld(
  seed: number | string,
  opts?: {
    mapWidth?: number;
    mapHeight?: number;
    zoneSizeMin?: number;
    zoneSizeMax?: number;
    peoplePerZone?: number;
    orgCount?: number;
  },
  saveName?: string,
): Promise<DebugArtifact> {
  const finalOpts: {
    mapWidth?: number;
    mapHeight?: number;
    zoneSizeMin?: number;
    zoneSizeMax?: number;
    peoplePerZone?: number;
    orgCount?: number;
  } = Object.assign({}, opts || {});

  try {
    if (typeof finalOpts.orgCount !== "number") {
      const prefs = (await loadConfig("preferences")) as
        | (Record<string, unknown> & { organizationCount?: number })
        | null;
      if (prefs && typeof prefs.organizationCount === "number")
        finalOpts.orgCount = prefs.organizationCount;
      else {
        const lp = (await loadPreferences("preferences")) as
          | (Record<string, unknown> & { organizationCount?: number })
          | null;
        if (lp && typeof lp.organizationCount === "number")
          finalOpts.orgCount = lp.organizationCount;
        else if (typeof defaultConfig.organizationCount === "number")
          finalOpts.orgCount = defaultConfig.organizationCount;
      }
    }

    if (
      typeof finalOpts.mapWidth !== "number" ||
      typeof finalOpts.mapHeight !== "number"
    ) {
      const prefs = (await loadConfig("preferences")) as
        | (Record<string, unknown> & { mapWidth?: number; mapHeight?: number })
        | null;
      if (prefs) {
        if (
          typeof prefs.mapWidth === "number" &&
          typeof finalOpts.mapWidth !== "number"
        )
          finalOpts.mapWidth = prefs.mapWidth;
        if (
          typeof prefs.mapHeight === "number" &&
          typeof finalOpts.mapHeight !== "number"
        )
          finalOpts.mapHeight = prefs.mapHeight;
      } else {
        const lp = (await loadPreferences("preferences")) as
          | (Record<string, unknown> & {
              mapWidth?: number;
              mapHeight?: number;
            })
          | null;
        if (lp) {
          if (
            typeof lp.mapWidth === "number" &&
            typeof finalOpts.mapWidth !== "number"
          )
            finalOpts.mapWidth = lp.mapWidth;
          if (
            typeof lp.mapHeight === "number" &&
            typeof finalOpts.mapHeight !== "number"
          )
            finalOpts.mapHeight = lp.mapHeight;
        }
        if (
          typeof finalOpts.mapWidth !== "number" &&
          typeof defaultConfig.mapWidth === "number"
        )
          finalOpts.mapWidth = defaultConfig.mapWidth;
        if (
          typeof finalOpts.mapHeight !== "number" &&
          typeof defaultConfig.mapHeight === "number"
        )
          finalOpts.mapHeight = defaultConfig.mapHeight;
      }
    }
  } catch (e) {
    // ignore and fall back to generator defaults
  }

  const artifact = generateDebugWorld(seed, finalOpts);

  try {
    const expectedX = Math.max(1, Math.floor(finalOpts.mapWidth ?? 100));
    const expectedY = Math.max(1, Math.floor(finalOpts.mapHeight ?? 100));
    const expectedCount = expectedX * expectedY;
    if (
      !Array.isArray(artifact.zones) ||
      artifact.zones.length < expectedCount
    ) {
      const full = generateDebugWorld(
        seed,
        Object.assign({}, finalOpts, {
          mapWidth: expectedX,
          mapHeight: expectedY,
        }),
      );
      artifact.zones = full.zones;
      artifact.people = full.people;
      artifact.buildings = full.buildings;
      artifact.organizations = full.organizations;
      artifact.placementErrors = full.placementErrors;
    }
  } catch (e) {
    // continue with what we have
  }

  try {
    const rng = createRng(seed);
    let playerName = defaultConfig.playerName || "Player";
    try {
      const prefs = (await loadConfig("preferences")) as
        | (Record<string, unknown> & { playerName?: string })
        | null;
      if (prefs && typeof prefs.playerName === "string")
        playerName = prefs.playerName as string;
      else {
        const lp = (await loadPreferences("preferences")) as
          | (Record<string, unknown> & { playerName?: string })
          | null;
        if (lp && typeof lp.playerName === "string")
          playerName = lp.playerName as string;
      }
    } catch (e) {
      // ignore
    }

    const [firstName, ...rest] = String(playerName).split(/\s+/);
    const lastName = rest.length > 0 ? rest.join(" ") : "Player";
    const playerId = makeId(rng, "player");
    const player = createPerson(playerId, firstName || "Player", lastName, {
      intelligenceLevel: rng.int(30, 90),
    });
    artifact.people.push(player);

    const orgId = makeId(rng, "org-player");
    const playerOrg: GoverningOrganization = {
      id: orgId,
      name: `${firstName || "Player"}'s Organization`,
      type: "player",
      leaderId: playerId,
    } as GoverningOrganization;
    artifact.organizations.push(playerOrg);

    if (Array.isArray(artifact.zones) && artifact.zones.length > 0) {
      const zi = rng.int(0, artifact.zones.length - 1);
      const zone = artifact.zones[zi] as any;
      zone.governingOrganization = orgId;
      player.homeZoneId = zone.id;
      if (Array.isArray(zone.people)) zone.people.push(player.id);
      for (const b of artifact.buildings) {
        if ((b as any).zoneId === zone.id) (b as any).ownerOrgId = orgId;
      }
    }

    artifact.playerCharacterId = player.id;
    artifact.playerOrgId = playerOrg.id;
  } catch (e) {
    console.warn("generateAndSaveWorld: failed to create player/org", e);
  }

  const name = saveName || `generation-${String(seed)}`;
  await saveGameState(name, artifact);
  return artifact;
}
