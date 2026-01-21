import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { generateDebugWorld } from "../../src/services/generation";
import { BUILDING_TYPES } from "../../src/models/building";
import schema from "../../../specs/002-enhance-world-generation/debug-schema.json";
import writeDebugArtifact from "../helpers/writeDebugArtifact";
import fs from "fs";

describe("generation.entities", () => {
  it("ensures each zone has at least one of each building type", () => {
    const artifact = generateDebugWorld("seed-123", {
      mapWidth: 100,
      mapHeight: 100,
      zoneSize: 10,
      peoplePerZone: 1,
    });

    for (const zone of artifact.zones) {
      const zoneBuildings = artifact.buildings.filter(
        (b) => b.zoneId === zone.id,
      );
      const zoneTypes = new Set(zoneBuildings.map((b) => b.type));
      expect(zoneTypes.size).toBe(BUILDING_TYPES.length);
      for (const t of BUILDING_TYPES) expect(zoneTypes.has(t)).toBe(true);
    }
  });

  it("has no dangling references and matches debug schema", () => {
    const artifact = generateDebugWorld("seed-123", {
      mapWidth: 100,
      mapHeight: 100,
      zoneSize: 10,
      peoplePerZone: 1,
    });

    const zoneIds = new Set(artifact.zones.map((z) => z.id));
    const buildingIds = new Set(artifact.buildings.map((b) => b.id));
    const personIds = new Set(artifact.people.map((p) => p.id));

    for (const b of artifact.buildings) {
      expect(zoneIds.has(b.zoneId)).toBe(true);
    }

    for (const p of artifact.people) {
      if (p.homeZoneId) expect(zoneIds.has(p.homeZoneId)).toBe(true);
    }

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema as any);
    const ok = validate(artifact);
    if (!ok) {
      // include errors in assertion for easier debugging
      // @ts-ignore
      console.error(validate.errors);
    }
    expect(ok).toBe(true);

    // placementErrors should be present and empty for default map sizes
    expect(Array.isArray((artifact as any).placementErrors)).toBe(true);
    expect(((artifact as any).placementErrors as any[]).length).toBe(0);

    // write artifact for manual QA and ensure file exists and contents match
    const fp = writeDebugArtifact(artifact, "seed-123");
    expect(fs.existsSync(fp)).toBe(true);
    const read = JSON.parse(fs.readFileSync(fp, "utf8"));
    expect(read).toEqual(artifact);
  });
});
