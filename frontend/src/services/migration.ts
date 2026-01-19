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

export function stableHash(input: string | undefined, length = 8) {
  if (!input) return shortId();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  // convert to base36 and pad
  const s = (h >>> 0).toString(36);
  return s.slice(0, length).padEnd(length, "0");
}

export function generateCodeNameFromSeed(seed?: string) {
  const hash = stableHash(seed);
  return `codename-${hash}`;
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
  const opts = options || {};
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
    // If the legacy `name` exists prefer it but store deterministically as `codeName`
    if (a.name && !a.codeName) {
      a.codeName = String(a.name);
      delete a.name;
      report.summary.migrated++;
      report.examples.push({
        type: "renameAgentName",
        id: a.id,
        codeName: a.codeName,
      });
    }
    // If still missing, generate a stable codeName derived from personId or id
    if (!a.codeName) {
      const seed = a.personId || a.id || "unknown";
      a.codeName = generateCodeNameFromSeed(seed);
      report.summary.migrated++;
      report.examples.push({
        type: "generateCodeName",
        id: a.id,
        codeName: a.codeName,
        seed,
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

  // Normalize legacy `zone.currentOccupants` formats and reconcile with people
  for (const z of fixture.zones) {
    let occupantIds: string[] = [];
    if (Array.isArray(z.currentOccupants)) {
      occupantIds = z.currentOccupants.map((id: any) => String(id));
    } else if (typeof z.currentOccupants === "string") {
      occupantIds = z.currentOccupants
        .split(/[\s,;]+/)
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (typeof z.currentOccupants === "number") {
      occupantIds = [String(z.currentOccupants)];
    }

    if (occupantIds.length) {
      // ensure person.homeZoneId is set for referenced people
      for (const pid of occupantIds) {
        const person = fixture.people.find(
          (p: any) => String(p.id) === String(pid),
        );
        if (person) {
          if (!person.homeZoneId) {
            person.homeZoneId = z.id;
            report.summary.migrated++;
            report.examples.push({
              type: "setHomeZone",
              personId: pid,
              zoneId: z.id,
            });
          }
        } else {
          report.quarantine.push({
            id: pid,
            reason: "zone references missing person",
            payload: { zoneId: z.id },
          });
          report.summary.quarantined++;
        }
      }
      // normalize to array of strings
      z.currentOccupants = occupantIds;
      report.summary.migrated++;
      report.examples.push({
        type: "normalizeZoneOccupants",
        zoneId: z.id,
        count: occupantIds.length,
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

  // Optionally export a dry-run report to disk (Node only).
  try {
    if ((opts as any).exportReport && (opts as any).fixtureName) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const res = exportDryRunReport(
        report,
        (opts as any).fixtureName,
        (opts as any).outDir,
      );
      if ((res as any)?.ok) {
        report.actions!.push(`exported-report:${(res as any).path}`);
      } else {
        report.actions!.push(
          `export-failed:${JSON.stringify((res as any).error)}`,
        );
      }
    }
  } catch (err) {
    // non-fatal for browser environments
    report.actions!.push(`export-error:${String(err)}`);
  }

  return { transformed: fixture, report };
}

// Export a dry-run report to disk. This function is Node-safe and will no-op in browsers.
export function exportDryRunReport(
  report: MigrationReport,
  fixtureName: string,
  outDir?: string,
) {
  try {
    // Only attempt fs operations in Node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require("path");
    const base = outDir
      ? String(outDir)
      : path.join(
          process.cwd(),
          "specs",
          "001-rework-data-models",
          "migration-reports",
        );
    if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
    const safeName = String(fixtureName).replace(/\.[^.]+$/, "");
    const filename = path.join(base, `${safeName}-report.json`);
    fs.writeFileSync(filename, JSON.stringify(report, null, 2), "utf8");
    return { ok: true, path: filename };
  } catch (err) {
    // If fs isn't available (browser), just return a noop result
    return { ok: false, error: String(err) };
  }
}

export default {
  migrateFixture,
  splitPersonName,
  generateCodeName,
  mapLegacySentiment,
  generateCodeNameFromSeed,
  stableHash,
  exportDryRunReport,
};
