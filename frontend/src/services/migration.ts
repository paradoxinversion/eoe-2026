export type MigrationReport = {
  summary: { processed: number; migrated: number; quarantined: number };
  examples: any[];
  quarantine: { id?: string; reason: string; payload?: any }[];
  actions?: string[];
};

function shortId() {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function splitPersonName(fullName?: string) {
  if (!fullName) return { firstName: "", lastName: "" };
  const trimmed = fullName.trim();
  const idx = trimmed.lastIndexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

export function generateCodeName() {
  return `codename-${shortId()}`;
}

export function mapLegacySentiment(person: any, govIds: string[] = []) {
  if (person.governingOrganizationSentiments)
    return person.governingOrganizationSentiments;
  const out: Record<string, number> = {};
  if (typeof person.sentiment === "number") {
    const target = govIds.length ? govIds[0] : "player-unknown";
    out[target] = person.sentiment;
  }
  return out;
}

export function generateBuildingsForZone(zone: any) {
  const numBuildings = Math.max(1, Math.round((zone.size || 10) / 10));
  const buildings = [];
  for (let i = 0; i < numBuildings; i++) {
    buildings.push({
      id: `building-${shortId()}`,
      name: `${zone.name || "Zone"} Building ${i + 1}`,
      type:
        zone.wealth >= 75
          ? "Office"
          : zone.wealth < 25
            ? "Residence"
            : "Office",
      size: Math.max(1, Math.round((zone.size || 10) / numBuildings)),
      zoneId: zone.id,
      intelligenceLevel: zone.intelligenceLevel ?? 50,
      upkeepCost: Math.max(1, Math.round((zone.wealth || 10) / 10)),
      infrastructureLoad: 1,
    });
  }
  return buildings;
}

export function migrateFixture(fixture: any, options?: { dryRun?: boolean }) {
  const report: MigrationReport = {
    summary: { processed: 0, migrated: 0, quarantined: 0 },
    examples: [],
    quarantine: [],
    actions: [],
  };

  const govIds = (fixture.governingOrganizations || [])
    .map((g: any) => g.id)
    .filter(Boolean);

  // Ensure arrays exist
  fixture.people = fixture.people || [];
  fixture.agents = fixture.agents || [];
  fixture.zones = fixture.zones || [];
  fixture.buildings = fixture.buildings || [];

  // Migrate people
  for (const p of fixture.people) {
    report.summary.processed++;
    if (p.name && (!p.firstName || !p.lastName)) {
      const { firstName, lastName } = splitPersonName(p.name);
      p.firstName = p.firstName || firstName;
      p.lastName = p.lastName || lastName;
      report.summary.migrated++;
      report.examples.push({
        type: "splitName",
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
      });
    }
    if (!p.governingOrganizationSentiments) {
      const mapped = mapLegacySentiment(p, govIds);
      if (Object.keys(mapped).length) {
        p.governingOrganizationSentiments = mapped;
        report.summary.migrated++;
      }
    }
  }

  // Migrate agents
  for (const a of fixture.agents) {
    if (a.name && !a.codeName) {
      a.codeName = a.name;
      delete a.name;
      report.summary.migrated++;
      report.examples.push({ type: "renameAgentName", id: a.id });
    }
    if (!a.codeName) {
      a.codeName = generateCodeName();
      report.summary.migrated++;
      report.examples.push({
        type: "generateCodeName",
        id: a.id,
        codeName: a.codeName,
      });
    }
  }

  // Generate buildings for zones that lack them
  for (const z of fixture.zones) {
    const has = (fixture.buildings || []).some((b: any) => b.zoneId === z.id);
    if (!has) {
      const gen = generateBuildingsForZone(z);
      fixture.buildings.push(...gen);
      report.summary.migrated += gen.length;
      report.examples.push({
        type: "generateBuildings",
        zoneId: z.id,
        count: gen.length,
      });
    }
  }

  // Basic integrity: quarantine agents with missing person references
  for (const a of fixture.agents) {
    const exists = fixture.people.some((p: any) => p.id === a.personId);
    if (!exists) {
      report.quarantine.push({
        id: a.id,
        reason: "missing person reference",
        payload: a,
      });
      report.summary.quarantined++;
    }
  }

  return { transformed: fixture, report };
}

export default {
  migrateFixture,
  splitPersonName,
  generateCodeName,
  mapLegacySentiment,
};
