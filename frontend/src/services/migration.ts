export type MigrationReport = {
  summary: { processed: number; migrated: number; quarantined: number };
  examples: unknown[];
  quarantine: { id?: string; reason: string; payload?: unknown }[];
  actions?: string[];
};

import type {
  ArtifactLike,
  ZoneLike,
  PersonLike,
  AgentLike,
} from "../types/game";

function shortId() {
  if (
    typeof crypto !== "undefined" &&
    (crypto as unknown as { randomUUID?: () => string }).randomUUID
  ) {
    return (
      (crypto as unknown as { randomUUID?: () => string }).randomUUID() || ""
    ).slice(0, 8);
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
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function mapLegacySentiment(person: unknown, govIds: string[] = []) {
  if (!isObject(person)) return {};
  if (person.governingOrganizationSentiments) {
    return person.governingOrganizationSentiments as Record<string, number>;
  }
  const out: Record<string, number> = {};
  if (typeof person.sentiment === "number") {
    const target = govIds.length ? govIds[0] : "player-unknown";
    out[target] = person.sentiment as number;
  }
  return out;
}

export function generateBuildingsForZone(zone: unknown) {
  const z = (isObject(zone) ? zone : {}) as ZoneLike & Record<string, unknown>;
  const size = typeof z.size === "number" ? z.size : 10;
  const wealth = typeof z.wealth === "number" ? z.wealth : 10;
  const numBuildings = Math.max(1, Math.round(size / 10));
  const buildings: Record<string, unknown>[] = [];
  for (let i = 0; i < numBuildings; i++) {
    buildings.push({
      id: `building-${shortId()}`,
      name: `${(z.name as string) || "Zone"} Building ${i + 1}`,
      type: wealth >= 75 ? "Office" : wealth < 25 ? "Residence" : "Office",
      size: Math.max(1, Math.round(size / numBuildings)),
      zoneId: z.id,
      intelligenceLevel:
        typeof z.intelligenceLevel === "number" ? z.intelligenceLevel : 50,
      upkeepCost: Math.max(1, Math.round((wealth || 10) / 10)),
      infrastructureLoad: 1,
    });
  }
  return buildings;
}

export function migrateFixture(
  fixture: unknown,
  options?: { dryRun?: boolean },
) {
  const opts = options || {};
  const report: MigrationReport = {
    summary: { processed: 0, migrated: 0, quarantined: 0 },
    examples: [],
    quarantine: [],
    actions: [],
  };
  const fx = (isObject(fixture) ? fixture : {}) as ArtifactLike;

  const govIds = (
    Array.isArray(fx.governingOrganizations)
      ? (fx.governingOrganizations as unknown[])
      : []
  )
    .map((g) => (isObject(g) && g.id ? String(g.id) : ""))
    .filter(Boolean);

  // Ensure arrays exist
  if (!Array.isArray((fx as any).people)) (fx as any).people = [];
  if (!Array.isArray((fx as any).agents)) (fx as any).agents = [];
  if (!Array.isArray((fx as any).zones)) (fx as any).zones = [];
  if (!Array.isArray((fx as any).buildings)) (fx as any).buildings = [];

  // Migrate people
  for (const p0 of (fx as any).people as unknown[]) {
    const p = p0 as PersonLike & Record<string, unknown>;
    report.summary.processed++;
    if (isObject(p)) {
      if (p.name && (!p.firstName || !p.lastName)) {
        const { firstName, lastName } = splitPersonName(String(p.name));
        p.firstName = (p.firstName as string) || firstName;
        p.lastName = (p.lastName as string) || lastName;
        report.summary.migrated++;
        report.examples.push({
          type: "splitName",
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
        });
      }
      if (!(p as any).governingOrganizationSentiments) {
        const mapped = mapLegacySentiment(p, govIds);
        if (Object.keys(mapped).length) {
          (p as any).governingOrganizationSentiments = mapped as unknown;
          report.summary.migrated++;
        }
      }
    }
  }

  // Migrate agents
  for (const a0 of (fx as any).agents as unknown[]) {
    const a = a0 as AgentLike;
    if (!isObject(a)) continue;
    // If the legacy `name` exists prefer it but store deterministically as `codeName`
    if ((a as any).name && !(a as any).codeName) {
      (a as any).codeName = String((a as any).name);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - deleting legacy prop
      delete (a as any).name;
      report.summary.migrated++;
      report.examples.push({
        type: "renameAgentName",
        id: a.id,
        codeName: (a as any).codeName,
      });
    }
    // If still missing, generate a stable codeName derived from personId or id
    if (!(a as any).codeName) {
      const seed = (a.personId as string) || (a.id as string) || "unknown";
      (a as any).codeName = generateCodeNameFromSeed(seed);
      report.summary.migrated++;
      report.examples.push({
        type: "generateCodeName",
        id: a.id,
        codeName: (a as any).codeName,
        seed,
      });
    }
  }

  // Generate buildings for zones that lack them
  for (const z0 of (fx as any).zones as unknown[]) {
    const z = z0 as ZoneLike & Record<string, unknown>;
    const zid = isObject(z) && (z.id ? String(z.id) : undefined);
    const has = ((fx as any).buildings as unknown[]).some(
      (b) => isObject(b) && String((b as any).zoneId) === zid,
    );
    if (!has) {
      const gen = generateBuildingsForZone(z);
      ((fx as any).buildings as unknown[]).push(...gen);
      report.summary.migrated += gen.length;
      report.examples.push({
        type: "generateBuildings",
        zoneId: z.id,
        count: gen.length,
      });
    }
  }

  // Normalize legacy `zone.currentOccupants` formats and reconcile with people
  for (const z0 of (fx as any).zones as unknown[]) {
    const z = z0 as ZoneLike & Record<string, unknown>;
    let occupantIds: string[] = [];
    if (isObject(z) && Array.isArray(z.currentOccupants)) {
      occupantIds = (z.currentOccupants as unknown[]).map((id) => String(id));
    } else if (isObject(z) && typeof z.currentOccupants === "string") {
      occupantIds = (z.currentOccupants as string)
        .split(/[\s,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (isObject(z) && typeof z.currentOccupants === "number") {
      occupantIds = [String(z.currentOccupants)];
    }

    if (occupantIds.length) {
      // ensure person.homeZoneId is set for referenced people
      for (const pid of occupantIds) {
        const person = ((fx as any).people as unknown[]).find(
          (p) => isObject(p) && String((p as any).id) === String(pid),
        );
        if (person && isObject(person)) {
          if (!(person as any).homeZoneId) {
            (person as any).homeZoneId = z.id;
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
      if (isObject(z))
        z.currentOccupants =
          occupantIds as unknown as ZoneLike["currentOccupants"];
      report.summary.migrated++;
      report.examples.push({
        type: "normalizeZoneOccupants",
        zoneId: z.id,
        count: occupantIds.length,
      });
    }
  }

  // Basic integrity: quarantine agents with missing person references
  for (const a of (fx as any).agents as unknown[]) {
    const exists = ((fx as any).people as unknown[]).some(
      (p) =>
        isObject(p) && String((p as any).id) === String((a as any).personId),
    );
    if (!exists) {
      report.quarantine.push({
        id: (a as any).id,
        reason: "missing person reference",
        payload: a,
      });
      report.summary.quarantined++;
    }
  }

  // Optionally export a dry-run report to disk (Node only).
  try {
    const o = opts as {
      exportReport?: boolean;
      fixtureName?: string;
      outDir?: string;
    };
    if (o.exportReport && o.fixtureName) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const res = exportDryRunReport(
        report,
        String(o.fixtureName),
        o.outDir ? String(o.outDir) : undefined,
      );
      if (res.ok) {
        report.actions!.push(`exported-report:${res.path}`);
      } else {
        report.actions!.push(`export-failed:${JSON.stringify(res.error)}`);
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
): { ok: boolean; path?: string; error?: string } {
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
