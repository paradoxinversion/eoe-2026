import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import { migrateFixture } from "../../src/services/migration";

function makeLargeFixture(count = 200) {
  const fixture: any = {
    schemaVersion: "1.0.0",
    people: [],
    zones: [],
    agents: [],
    buildings: [],
    governingOrganizations: [],
  };
  fixture.governingOrganizations.push({ id: "gov-bench", name: "BenchGov" });
  fixture.zones.push({
    id: "zone-bench",
    name: "BenchZone",
    size: 200,
    wealth: 50,
    intelligenceLevel: 50,
    currentOccupants: [],
  });
  for (let i = 0; i < count; i++) {
    const pid = `person-bench-${i}`;
    fixture.people.push({
      id: pid,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      homeZoneId: "zone-bench",
      governingOrganizationSentiments: { "gov-bench": 0 },
      intelligenceLevel: 50,
      attributes: {
        health: 80,
        intelligence: 50,
        strength: 40,
        agility: 40,
        endurance: 40,
        empathy: 30,
        charisma: 20,
      },
      skills: {
        fighting: 5,
        medicine: 5,
        business: 5,
        finance: 5,
        publicPlanning: 5,
        science: 5,
      },
    });
    if (i % 10 === 0) {
      fixture.agents.push({
        id: `agent-bench-${i}`,
        personId: pid,
        codeName: `bench-${i}`,
        role: "Scientist",
        health: 100,
      });
    }
    if (i % 25 === 0) {
      fixture.buildings.push({
        id: `building-bench-${i}`,
        name: `Bldg ${i}`,
        type: "Residence",
        size: 3,
        zoneId: "zone-bench",
        intelligenceLevel: 50,
        upkeepCost: 1,
        infrastructureLoad: 1,
      });
    }
    fixture.zones[0].currentOccupants.push(pid);
  }
  return fixture;
}

describe("perf: load and migrate ~200 entities", () => {
  it("runs migration on a ~200-entity fixture and records duration", () => {
    const fixture = makeLargeFixture(200);
    const start = process.hrtime.bigint();
    const { transformed, report } = migrateFixture(fixture, { dryRun: true });
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const outDir = path.join(process.cwd(), "tests_output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `migration-load-200-${Date.now()}.json`);
    const data = { durationMs, reportSummary: report.summary };
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

    // Expect the migration dry-run to complete within an acceptable bound (3s)
    expect(durationMs).toBeLessThan(3000);
    expect(report.summary.processed).toBeGreaterThanOrEqual(200);
  });
});
