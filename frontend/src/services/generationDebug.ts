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

  // create organizations
  const orgCount = Math.max(1, Math.floor(zones.length / 5));
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
      const p = createPerson(id, firstName + " " + lastName, 0, {
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

  return { zones, people, buildings, organizations };
}

export default generateDebugWorld;
