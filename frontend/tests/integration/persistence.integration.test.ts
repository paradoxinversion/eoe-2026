import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";

import {
  saveConfig,
  loadConfig,
  listConfigs,
  deleteConfig,
  exportConfig,
  importConfig,
  clearAllConfigs,
} from "../../src/services/persistence";

describe("integration: persistence (IndexedDB)", () => {
  beforeEach(async () => {
    await clearAllConfigs();
  });

  it("saves, loads, exports, imports, deletes, and clears configs", async () => {
    const sample = {
      playerName: "Int",
      startingSeed: 123,
      autosaveIntervalSeconds: 15,
      gracePeriodDays: 5,
    };
    await saveConfig("int-a", sample);

    const loaded = await loadConfig("int-a");
    expect(loaded).toBeTruthy();
    expect(loaded!.startingSeed).toBe(123);

    const list1 = await listConfigs();
    expect(list1.length).toBe(1);

    const exported = await exportConfig("int-a");
    expect(typeof exported).toBe("string");

    const importedName = await importConfig(exported as string, "int-b");
    expect(importedName).toBe("int-b");

    const list2 = await listConfigs();
    expect(list2.length).toBe(2);

    await deleteConfig("int-a");
    const list3 = await listConfigs();
    expect(list3.length).toBe(1);

    await clearAllConfigs();
    const list4 = await listConfigs();
    expect(list4.length).toBe(0);
  });
});
