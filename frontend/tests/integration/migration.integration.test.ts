import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import { migrateFixture } from "../../src/services/migration";

describe("migration integration: run fixtures through migrateFixture", () => {
  it("processes all representative fixtures without throwing and produces reports", () => {
    const fixturesDir = path.resolve(
      __dirname,
      "../../../specs/001-rework-data-models/fixtures",
    );
    const files = fs
      .readdirSync(fixturesDir)
      .filter((f) => f.endsWith(".json"));
    expect(files.length).toBeGreaterThanOrEqual(1);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(fixturesDir, file), "utf8");
      // strip simple JS-style comments from fixtures to be tolerant of human-edited JSON
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");
      const fixture = JSON.parse(stripComments(raw));
      const { transformed, report } = migrateFixture(fixture, { dryRun: true });
      expect(report).toBeTruthy();
      // summary counts must be numbers
      expect(typeof report.summary.processed).toBe("number");
      expect(typeof report.summary.migrated).toBe("number");
      expect(typeof report.summary.quarantined).toBe("number");

      // examples and quarantine arrays
      expect(Array.isArray(report.examples)).toBe(true);
      expect(Array.isArray(report.quarantine)).toBe(true);

      // quarantine entries must include reason and payload when present
      for (const q of report.quarantine) {
        expect(typeof q.reason).toBe("string");
        expect(q.payload !== undefined).toBe(true);
      }

      // summary.quarantined should reflect actual quarantine array length
      expect(report.summary.quarantined).toBe(report.quarantine.length);

      // transformed should at minimum be an object containing arrays
      expect(transformed).toBeTruthy();
    }
  });
});
