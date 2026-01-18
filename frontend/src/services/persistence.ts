import { openDB, IDBPDatabase } from "idb";
import type { Config } from "../config/schema";

const DB_NAME = "eoe-db";
const DB_VERSION = 1;
const STORE_CONFIGS = "configs";

type Db = IDBPDatabase<any>;

let dbPromise: Promise<Db> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
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
    return all.map((r: any) => ({ name: r.name, updatedAt: r.updatedAt }));
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
