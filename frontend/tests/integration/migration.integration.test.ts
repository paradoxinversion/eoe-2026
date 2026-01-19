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
      expect(typeof report.summary.processed).toBe("number");
      // transformed should at minimum be an object containing arrays
      expect(transformed).toBeTruthy();
    }
  });
});
