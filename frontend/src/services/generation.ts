import createRng from "../lib/rng";
import NameGenerator from "./nameGenerator";
import { createZone } from "../models/zone";
import type { Zone } from "../models/zone";
import { createPerson } from "../models/person";
import type { Person } from "../models/person";
import type Building from "../models/building";
import { BUILDING_TYPES } from "../models/building";
import type GoverningOrganization from "../models/governingOrganization";
import {
  saveGameState,
  loadConfig,
  loadPreferences,
  listConfigs,
  deleteConfig,
} from "./persistence";
import { defaultConfig } from "../config/schema";

export type DebugArtifact = {
  zones: Zone[];
  people: Person[];
  buildings: Building[];
  organizations: GoverningOrganization[];
  agents?: import("../models/agent").Agent[];
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
  const nameGen = new NameGenerator({ rng });
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
      const nm = nameGen.generate();
      // fallback for any generation issues
      const firstName = nm?.firstName ?? `P${rng.int(10, 99)}`;
      const lastName = nm?.lastName ?? `Z${z.id.split("-").slice(-2).join("")}`;
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

  // Clear persisted world data (game states and agents) when starting a new game
  try {
    const isNode =
      typeof process !== "undefined" &&
      !!(process.versions && process.versions.node);
    if (!isNode) {
      const configs = await listConfigs();
      for (const c of configs) {
        if (
          typeof c.name === "string" &&
          (c.name.startsWith("game:") || c.name.startsWith("agent:"))
        ) {
          try {
            await deleteConfig(c.name);
          } catch (err) {
            // ignore individual deletion failures
          }
        }
      }
    }
  } catch (e) {
    // ignore clearing failures
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
    const nameGen = new NameGenerator({ rng });
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

    let firstName: string;
    let lastName: string;
    if (playerName && String(playerName).trim().length > 0) {
      const parts = String(playerName).split(/\s+/);
      firstName = parts[0] || "Player";
      lastName = parts.slice(1).join(" ") || "Player";
    } else {
      const nm = nameGen.generate();
      firstName = nm.firstName;
      lastName = nm.lastName;
    }
    const playerId = makeId(rng, "player");
    const player = createPerson(
      playerId,
      firstName || "Player",
      lastName || "Player",
      {
        intelligenceLevel: rng.int(30, 90),
      },
    );
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

    // Initialize agents array in artifact
    artifact.agents = artifact.agents || [];

    // Create an Agent entry for the player's character with role Overlord
    try {
      const agentModule = await import("../models/agent");
      const playerAgentId = makeId(rng, "ag");
      const playerCodeName =
        `${player.firstName || "Player"} ${player.lastName || "Player"}`.trim();
      const playerAgent = agentModule.createAgent(
        playerAgentId,
        player.id,
        playerCodeName,
        0,
        {
          role: "Overlord",
          hired_at: new Date().toISOString(),
        },
      );
      playerAgent.affiliationId = playerOrg.id;
      // ensure player agent is first so UI can select it predictably
      artifact.agents.unshift(playerAgent as import("../models/agent").Agent);
    } catch (e) {
      // ignore if dynamic import fails
      // eslint-disable-next-line no-console
      console.warn("generateAndSaveWorld: failed to create player agent", e);
    }

    // When running in the browser, clear any previously persisted agents
    // so a fresh game starts with a clean personnel store.
    try {
      const isNode =
        typeof process !== "undefined" &&
        !!(process.versions && process.versions.node);
      if (!isNode) {
        const pers = await import("./personnelPersistence");
        const existing = await pers.listAgents();
        if (Array.isArray(existing) && existing.length > 0) {
          await Promise.all(
            existing.map((e) => pers.deleteAgent(e.id).catch(() => {})),
          );
        }
      }
    } catch (e) {
      // ignore persistence cleanup failures
    }

    // Initial Agent selection: up to 10 unique Agents sampled from the
    // player's starting zone population. Use bounded retries per slot.
    try {
      const RETRY_LIMIT = 50;
      const TARGET_SLOTS = 10;
      if (player.homeZoneId) {
        const zone = (artifact.zones || []).find(
          (z) => z.id === player.homeZoneId,
        ) as ZoneWithExtras | undefined;
        const zonePeople = Array.isArray(zone?.people)
          ? zone!.people.slice()
          : [];
        const selected = new Set<string>(
          (Array.isArray(artifact.agents) ? artifact.agents : []).map(
            (a: any) => a.personId,
          ),
        );
        // If a player agent was already added, reduce the number of
        // additional sampled agents so total does not exceed TARGET_SLOTS.
        const existing = Array.isArray(artifact.agents)
          ? artifact.agents.length
          : 0;
        const slotsToFill = Math.max(0, TARGET_SLOTS - existing);
        for (let slot = 0; slot < slotsToFill; slot++) {
          let attempts = 0;
          let picked: string | null = null;
          while (attempts < RETRY_LIMIT && zonePeople.length > 0) {
            const candidate = rng.choice(zonePeople);
            if (!selected.has(candidate)) {
              picked = candidate;
              break;
            }
            attempts++;
          }
          if (picked) {
            selected.add(picked);
            const agId = makeId(rng, "ag");
            const codeName = `Agent ${agId.slice(-4)}`;
            const agentModule = await import("../models/agent");
            const ag = agentModule.createAgent(agId, picked, codeName, 0, {
              role: "Recruit",
            });
            ag.affiliationId = playerOrg.id;
            artifact.agents.push(ag as import("../models/agent").Agent);
            // do not persist agents as top-level configs; agents belong
            // inside the generated artifact (saved via `saveGameState`).
          } else {
            // leave slot empty
          }
        }
      }
    } catch (e) {
      console.warn("generateAndSaveWorld: agent assignment failed", e);
    }
    // Await any pending persistence so callers (UI) can read agents after generation returns
    try {
      if (persistPromises.length > 0) await Promise.all(persistPromises);
    } catch (e) {
      // ignore
    }
  } catch (e) {
    console.warn("generateAndSaveWorld: failed to create player/org", e);
  }

  const artifactSaveName = `generation-${String(seed)}`;
  await saveGameState(artifactSaveName, artifact);

  // If a specific save name was provided, also persist the generated
  // artifact under that save key so callers (and tests) can load it via
  // `loadGameState(saveName)` without having to know the generation key.
  if (saveName) {
    try {
      await saveGameState(saveName, artifact);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        "generateAndSaveWorld: failed to save artifact under saveName",
        e,
      );
    }
  }

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
      const fname = `${artifactSaveName}-counts.json`;
      // Write counts to disk but do not await completion so generation
      // returns promptly for tests and callers. Log errors if write fails.
      fs.promises
        .writeFile(fname, JSON.stringify(counts, null, 2), "utf8")
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.warn(
            "generateAndSaveWorld: failed to write counts file",
            err,
          );
        });
    } else {
      // Fallback for environments without filesystem: persist via saveGameState
      await saveGameState(
        `${artifactSaveName}-counts`,
        counts as unknown as DebugArtifact,
      );
    }
  } catch (e) {
    // don't fail generation for inability to write counts; log for diagnosics
    // eslint-disable-next-line no-console
    console.warn("generateAndSaveWorld: failed to write counts file", e);
  }
  return artifact;
}
