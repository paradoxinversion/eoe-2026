import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import {
  migrateFixture,
  exportDryRunReport,
} from "../../src/services/migration";

describe("migration exporter (dev CLI)", () => {
  it("exports dry-run reports for fixtures (use APPLY=1 to write applied fixtures)", async () => {
    const fixturesDir = path.resolve(
      __dirname,
      "../../../specs/001-rework-data-models/fixtures",
    );
    const outDir = path.resolve(
      __dirname,
      "../../../specs/001-rework-data-models/migration-reports",
    );
    const appliedDir = path.resolve(
      __dirname,
      "../../../specs/001-rework-data-models/migration-applied",
    );

    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    if (!fs.existsSync(appliedDir))
      fs.mkdirSync(appliedDir, { recursive: true });

    const files = fs
      .readdirSync(fixturesDir)
      .filter((f) => f.endsWith(".json"));
    expect(files.length).toBeGreaterThanOrEqual(1);

    const apply = !!process.env.APPLY && String(process.env.APPLY) !== "0";

    for (const file of files) {
      const raw = fs.readFileSync(path.join(fixturesDir, file), "utf8");
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");
      const fixture = JSON.parse(stripComments(raw));

      const { transformed, report } = migrateFixture(fixture, {
        dryRun: !apply,
      });
      // write report
      const safe = file.replace(/\.[^.]+$/, "");
      const reportFile = path.join(outDir, `${safe}-report.json`);
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), "utf8");

      // Optionally write applied fixture
      if (apply) {
        const appliedFile = path.join(appliedDir, file);
        fs.writeFileSync(
          appliedFile,
          JSON.stringify(transformed, null, 2),
          "utf8",
        );
      }
    }
  });
});
