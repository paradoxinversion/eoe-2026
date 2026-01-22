import { openDB, IDBPDatabase } from "idb";
import type { Config } from "../config/schema";
import type { ArtifactLike, ZoneLike } from "../types/game";
import indexeddbSchema from "../../../specs/001-empire-game-spec/contracts/indexeddb-schema.json";

interface IndexedDBStoreSchema {
  name: string;
  keyPath?: string;
  autoIncrement?: boolean;
  indexes?: Array<{ name: string; keyPath?: string }>;
}

interface IndexedDBSchema {
  dbName?: string;
  version?: number;
  stores?: IndexedDBStoreSchema[];
}

const schema = indexeddbSchema as unknown as IndexedDBSchema;
const DB_NAME: string = schema.dbName || "eoe-db";
const DB_VERSION: number = schema.version || 1;
const STORE_CONFIGS: string =
  (schema.stores && schema.stores.find((s) => s.name === "configs")?.name) ||
  "configs";

type Db = IDBPDatabase<unknown>;

let dbPromise: Promise<Db> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // create stores based on the indexeddb schema contract
        const stores: IndexedDBStoreSchema[] = schema.stores || [];
        for (const s of stores) {
          if (!db.objectStoreNames.contains(s.name)) {
            const opts: { keyPath?: string; autoIncrement?: boolean } = {};
            if (s.keyPath) opts.keyPath = s.keyPath;
            if (s.autoIncrement) opts.autoIncrement = s.autoIncrement;
            db.createObjectStore(s.name, opts);
          }
        }
        // ensure default configs store exists
        if (!db.objectStoreNames.contains(STORE_CONFIGS)) {
          db.createObjectStore(STORE_CONFIGS, { keyPath: "name" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveConfig(name: string, config: Config) {
  const db = await getDB();
  await db.put(STORE_CONFIGS, { name, config, updatedAt: Date.now() });
}

export async function loadConfig(name: string): Promise<Config | null> {
  const db = await getDB();
  const rec = await db.get(STORE_CONFIGS, name);
  return rec ? (rec.config as Config) : null;
}

export async function listConfigs(): Promise<
  Array<{ name: string; updatedAt: number }>
> {
  const db = await getDB();
  const tx = db.transaction(STORE_CONFIGS);
  const store = tx.objectStore(STORE_CONFIGS);
  const all = await store.getAll();
  await tx.done;
  return all.map((r: unknown) => {
    const rec = r as { name?: string; updatedAt?: number };
    return { name: rec.name || "", updatedAt: rec.updatedAt || 0 };
  });
}

export async function deleteConfig(name: string) {
  const db = await getDB();
  await db.delete(STORE_CONFIGS, name);
}

export async function exportConfig(name: string): Promise<string | null> {
  const cfg = await loadConfig(name);
  return cfg ? JSON.stringify({ name, config: cfg }, null, 2) : null;
}

export async function importConfig(
  json: string,
  nameOverride?: string,
): Promise<string> {
  const parsed = JSON.parse(json);
  const name = nameOverride || parsed.name || `import-${Date.now()}`;
  const config = parsed.config || parsed;
  await saveConfig(name, config);
  return name;
}

export async function clearAllConfigs() {
  const db = await getDB();
  const tx = db.transaction(STORE_CONFIGS, "readwrite");
  await tx.objectStore(STORE_CONFIGS).clear();
  await tx.done;
}

// --- Preferences helpers (generic key/value stored under `config` field)
export async function savePreferences(name: string, value: unknown) {
  const db = await getDB();
  await db.put(STORE_CONFIGS, { name, config: value, updatedAt: Date.now() });
}

export async function loadPreferences(name: string): Promise<unknown | null> {
  const db = await getDB();
  const rec = await db.get(STORE_CONFIGS, name);
  if (!rec) return null;
  return (rec as { config?: unknown }).config ?? null;
}

// Convenience helpers for themeMode specifically
export async function saveThemeMode(mode: "dark" | "light") {
  try {
    const existing = (await loadPreferences("preferences")) as Record<
      string,
      unknown
    > | null;
    const updated = Object.assign({}, existing || {}, { theme: mode });
    await savePreferences("preferences", updated);
  } catch (e) {
    // swallow persistence errors; caller may still update UI
    console.warn("saveThemeMode failed", e);
  }
}

export async function loadThemeMode(): Promise<"dark" | "light" | null> {
  try {
    const prefs = (await loadPreferences("preferences")) as Record<
      string,
      unknown
    > | null;
    if (!prefs) return null;
    const t = prefs.theme;
    return t === "light" ? "light" : t === "dark" ? "dark" : null;
  } catch (e) {
    return null;
  }
}

// --- Schema/version for persisted game saves
export const SCHEMA_VERSION = 1;

// --- Game state helpers (stored in the same configs store under a `game:` prefix)
export async function saveGameState(name: string, state: unknown) {
  const db = await getDB();
  const key = `game:${name}`;
  // Normalize zones.currentOccupants before saving to ensure consistent shape
  try {
    const s = (state as ArtifactLike) || {};
    if (Array.isArray(s.zones)) {
      for (const z of s.zones as ZoneLike[]) {
        if (z && typeof z === "object") {
          if (z.currentOccupants !== undefined) {
            if (Array.isArray(z.currentOccupants)) {
              z.currentOccupants = (z.currentOccupants as unknown[]).map((id) =>
                String(id),
              );
            } else if (typeof z.currentOccupants === "string") {
              z.currentOccupants = (z.currentOccupants as string)
                .split(/[\s,;]+/)
                .map((s2) => s2.trim())
                .filter(Boolean);
            } else if (typeof z.currentOccupants === "number") {
              z.currentOccupants = [String(z.currentOccupants)];
            }
          }
        }
      }
    }
  } catch (e) {
    // don't block save on normalization failures
    console.warn("saveGameState: zone normalization failed", e);
  }

  await db.put(STORE_CONFIGS, {
    name: key,
    state,
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now(),
  });
}

export async function loadGameState(name: string): Promise<unknown | null> {
  const db = await getDB();
  const key = `game:${name}`;
  const rec = (await db.get(STORE_CONFIGS, key)) as unknown;
  if (!rec) return null;
  const r = rec as { state?: unknown; schemaVersion?: number };
  // Coerce legacy zone.currentOccupants on load to array of strings
  try {
    const s = r.state as ArtifactLike | undefined;
    if (s && Array.isArray(s.zones)) {
      for (const z of s.zones as ZoneLike[]) {
        if (z && typeof z === "object") {
          if (
            z.currentOccupants !== undefined &&
            !Array.isArray(z.currentOccupants)
          ) {
            if (typeof z.currentOccupants === "string") {
              z.currentOccupants = (z.currentOccupants as string)
                .split(/[\s,;]+/)
                .map((s2) => s2.trim())
                .filter(Boolean);
            } else if (typeof z.currentOccupants === "number") {
              z.currentOccupants = [String(z.currentOccupants)];
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn("loadGameState: zone normalization failed", e);
  }

  return r.state === undefined ? null : r.state;
}

export async function listGameStates(): Promise<
  Array<{ name: string; updatedAt: number }>
> {
  const all = await listConfigs();
  return all
    .filter((r) => r.name.startsWith("game:"))
    .map((r) => ({
      name: r.name.replace(/^game:/, ""),
      updatedAt: r.updatedAt,
    }));
}
