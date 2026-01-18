import { beforeEach, describe, expect, it, vi } from "vitest";

describe("persistence service (IndexedDB)", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("save/load/list/delete/export/import/clear flow", async () => {
        // create an in-memory mock DB per test
        const store = new Map<string, any>();

        const mockDb: any = {
            objectStoreNames: { contains: () => false },
            createObjectStore: () => {},
            put: async (_store: string, value: any) =>
                store.set(value.name, value),
            get: async (_store: string, key: string) => store.get(key) || null,
            delete: async (_store: string, key: string) => store.delete(key),
            transaction: (_store: string) => {
                const objectStore = {
                    getAll: async () => Array.from(store.values()),
                    clear: async () => store.clear(),
                    get: async (k: string) => store.get(k),
                    delete: async (k: string) => store.delete(k),
                    put: async (_k: any, v: any) => store.set(v.name, v),
                };
                return {
                    objectStore: () => objectStore,
                    done: Promise.resolve(),
                };
            },
        };

        vi.doMock("idb", () => ({ openDB: () => Promise.resolve(mockDb) }));

        const persistence = await import("../../src/services/persistence");

        const sample = {
            playerName: "A",
            startingSeed: 1,
            autosaveIntervalSeconds: 10,
            gracePeriodDays: 7,
        };

        await persistence.saveConfig("a", sample);
        const loaded = await persistence.loadConfig("a");
        expect(loaded).toBeTruthy();
        expect(loaded!.playerName).toBe("A");

        const list1 = await persistence.listConfigs();
        expect(list1.length).toBe(1);
        expect(list1[0].name).toBe("a");

        const exported = await persistence.exportConfig("a");
        expect(exported).toContain("playerName");

        const importedName = await persistence.importConfig(
            exported as string,
            "b",
        );
        expect(importedName).toBe("b");

        const list2 = await persistence.listConfigs();
        expect(list2.length).toBe(2);

        await persistence.deleteConfig("a");
        const list3 = await persistence.listConfigs();
        expect(list3.length).toBe(1);

        await persistence.clearAllConfigs();
        const list4 = await persistence.listConfigs();
        expect(list4.length).toBe(0);
    });
});
