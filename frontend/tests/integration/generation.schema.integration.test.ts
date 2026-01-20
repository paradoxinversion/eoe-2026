import { describe, it, expect } from "vitest";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { generateDebugWorld } from "../../src/services/generation";
import schema from "../../../specs/002-enhance-world-generation/debug-schema.json";

describe("generation.debug.schema", () => {
  it("produces an artifact that validates against the debug schema", () => {
    const artifact = generateDebugWorld("integration-seed-1", {
      mapWidth: 60,
      mapHeight: 60,
      zoneSize: 10,
      peoplePerZone: 1,
    });

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    const validate = ajv.compile(schema as any);
    const ok = validate(artifact);
    if (!ok) {
      // show errors for CI logs
      // @ts-ignore
      console.error(validate.errors);
    }
    expect(ok).toBe(true);
  });
});
