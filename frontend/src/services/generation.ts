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
type ZoneWithExtras = Zone & {
  buildings?: string[];
  people?: string[];
  size?: number;
  governingOrganization?: string;
};
type BuildingWithExtras = Building & {
  zoneId?: string;
  ownerOrgId?: string;
  type?: string;
  size?: number;
};
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

  const zones: ZoneWithExtras[] = [];
  const buildings: BuildingWithExtras[] = [];
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
      }) as ZoneWithExtras;
      z.size = size;
      z.buildings = z.buildings ?? [];
      z.people = z.people ?? [];
      zones.push(z);
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
      const b: BuildingWithExtras = {
        id,
        name,
        type: t,
        size,
        zoneId: z.id,
        intelligenceLevel,
        upkeepCost,
        infrastructureLoad,
      } as BuildingWithExtras;
      buildings.push(b);
      if (Array.isArray(z.buildings)) {
        z.buildings.push(id);
      }
    }
  }

  for (const z of zones) {
    // base people derived from non-Residence building sizes in this zone
    const zoneSize = z.size ?? 1;
    const basePeople = buildings
      .filter((b) => b.zoneId === z.id)
      .filter((b) => b.type !== "Residence")
      .reduce((acc, b) => acc + (b.size ?? 0), 0);
    // number of people scales with zone size (peoplePerZone is a multiplier) plus base
    const peopleCount = Math.max(
      0,
      Math.floor((peoplePerZone ?? 0) * zoneSize) + Math.floor(basePeople),
    );
    for (let i = 0; i < peopleCount; i++) {
      const id = makeId(rng, "p");
      const firstName = `P${rng.int(10, 99)}`;
      const lastName = `Z${z.id.split("-").slice(-2).join("")}`;
      const p = createPerson(id, firstName, lastName, {
        homeZoneId: z.id,
        intelligenceLevel: rng.int(0, 100),
      });
      people.push(p);
      if (Array.isArray(z.people)) {
        z.people.push(p.id);
      }
    }
  }

  for (const b of buildings) {
    if (organizations.length > 0 && rng.int(0, 4) === 0) {
      const org = organizations[rng.int(0, organizations.length - 1)];
      b.ownerOrgId = org.id;
    }
  }

  return { zones, people, buildings, organizations, placementErrors };
}

// lightweight gameplay generator kept for compatibility
// Legacy gameplay player type kept for compatibility with services that
// operate on a `player` object. Tests should prefer using `generateDebugWorld`.
export type PlayerEmpire = {
  id: string;
  name: string;
  resources: {
    evil: number;
    money: number;
    infrastructure: number;
    science: number;
  };
  zones: Array<{ id: string; name: string; intelligence_level: number }>;
};

// NOTE: `generateWorld` (gameplay lightweight generator) removed in favor of
// `generateDebugWorld`. Consumers should use `generateDebugWorld` or construct
// minimal `PlayerEmpire` objects in tests. Keeping the `PlayerEmpire` type
// exported for typing compatibility.

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
      const zone = artifact.zones[zi] as ZoneWithExtras;
      zone.governingOrganization = orgId;
      player.homeZoneId = zone.id;
      if (!Array.isArray(zone.people)) zone.people = [];
      zone.people.push(player.id);
      for (const b of artifact.buildings as BuildingWithExtras[]) {
        if (b.zoneId === zone.id) b.ownerOrgId = orgId;
      }
    }

    artifact.playerCharacterId = player.id;
    artifact.playerOrgId = playerOrg.id;
  } catch (e) {
    console.warn("generateAndSaveWorld: failed to create player/org", e);
  }

  const name = saveName || `generation-${String(seed)}`;
  await saveGameState(name, artifact);

  // write a simple counts JSON file reporting the number of each entity created
  const counts = {
    zones: Array.isArray(artifact.zones) ? artifact.zones.length : 0,
    people: Array.isArray(artifact.people) ? artifact.people.length : 0,
    buildings: Array.isArray(artifact.buildings)
      ? artifact.buildings.length
      : 0,
    organizations: Array.isArray(artifact.organizations)
      ? artifact.organizations.length
      : 0,
  } as const;

  try {
    // Prefer writing to disk when running in Node (tests / dev scripts).
    // Use dynamic import so bundlers won't include `fs` in browser builds.
    const isNode =
      typeof process !== "undefined" &&
      !!(process.versions && process.versions.node);
    if (isNode) {
      const fs = await import("fs");
      const fname = `${name}-counts.json`;
      await fs.promises.writeFile(
        fname,
        JSON.stringify(counts, null, 2),
        "utf8",
      );
    } else {
      // Fallback for environments without filesystem: persist via saveGameState
      await saveGameState(`${name}-counts`, counts as unknown as DebugArtifact);
    }
  } catch (e) {
    // don't fail generation for inability to write counts; log for diagnosics
    // eslint-disable-next-line no-console
    console.warn("generateAndSaveWorld: failed to write counts file", e);
  }
  return artifact;
}
