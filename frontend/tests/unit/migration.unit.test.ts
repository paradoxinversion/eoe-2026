import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

import {
  migrateFixture,
  splitPersonName,
  generateCodeName,
  mapLegacySentiment,
} from "../../src/services/migration";

function loadFixture(name: string) {
  const p = path.resolve(
    __dirname,
    "../../../specs/001-rework-data-models/fixtures/",
    name,
  );
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw);
}

describe("migration helper basic transforms", () => {
  it("splits legacy single-name into first/last conservatively", () => {
    const r = splitPersonName("Madonna");
    expect(r.firstName).toBe("Madonna");
    expect(r.lastName).toBe("");

    const r2 = splitPersonName("Juan Carlos de la Vega");
    expect(r2.firstName).toBe("Juan Carlos de la");
    expect(r2.lastName).toBe("Vega");
  });

  it("generates a codename when missing", () => {
    const code = generateCodeName();
    expect(code.startsWith("codename-")).toBe(true);
  });

  it("maps legacy sentiment single-value to governingOrganizationSentiments", () => {
    const fixture = loadFixture("fixture-04-legacy-sentiment-single.json");
    const { transformed, report } = migrateFixture(fixture as any, {
      dryRun: true,
    });
    const person = transformed.people.find(
      (p: any) => p.id === "person-legacy-1",
    );
    expect(person.governingOrganizationSentiments).toBeTruthy();
    expect(
      Object.values(person.governingOrganizationSentiments).length,
    ).toBeGreaterThan(0);
  });

  it("renames legacy agent.name to codeName or generates one", () => {
    const fixture = loadFixture("fixture-05-missing-agent-codename.json");
    const { transformed } = migrateFixture(fixture as any, { dryRun: true });
    const agent = transformed.agents[0];
    expect(agent.codeName).toBeTruthy();
  });
});
