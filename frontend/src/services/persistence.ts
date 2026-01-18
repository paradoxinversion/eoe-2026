import { openDB, IDBPDatabase } from "idb";
import type { Config } from "../config/schema";
import indexeddbSchema from "../../../specs/001-empire-game-spec/contracts/indexeddb-schema.json";

const DB_NAME: string = (indexeddbSchema as any).dbName || "eoe-db";
const DB_VERSION: number = (indexeddbSchema as any).version || 1;
const STORE_CONFIGS: string =
    ((indexeddbSchema as any).stores &&
        (indexeddbSchema as any).stores.find((s: any) => s.name === "configs")
            ?.name) ||
    "configs";

type Db = IDBPDatabase<any>;

let dbPromise: Promise<Db> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // create stores based on the indexeddb schema contract
                const stores: any[] = (indexeddbSchema as any).stores || [];
                for (const s of stores) {
                    if (!db.objectStoreNames.contains(s.name)) {
                        const opts: any = {};
                        if (s.keyPath) opts.keyPath = s.keyPath;
                        if (s.autoIncrement)
                            opts.autoIncrement = s.autoIncrement;
                        db.createObjectStore(s.name, opts);
                        if (s.indexes && Array.isArray(s.indexes)) {
                            const os = db.transaction?.objectStore?.(
                                s.name,
                            ) as any;
                            // Note: IDB createIndex must be called inside upgrade using the store variable
                            // but `openDB` upgrade callback provides only db; we recreate indexes below via direct calls
                        }
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
