/**
 * End-to-end persistence test using fake-indexeddb.
 */
import { describe, it, expect } from "vitest";

// Ensure fake IndexedDB and related globals are installed before any imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("fake-indexeddb/auto");

describe("persistence e2e (fake-indexeddb)", () => {
  it("saves, lists, loads and deletes a game state", async () => {
    const persistence = await import("../../src/services/persistence");

    // ensure clean slate
    await persistence.clearAllConfigs();

    const state = { day: 7, resources: { gold: 12, science: 3 } };
    await persistence.saveGameState("e2e-test", state);

    const list = await persistence.listGameStates();
    expect(list.find((l) => l.name === "e2e-test")).toBeTruthy();

    const loaded = await persistence.loadGameState("e2e-test");
    expect(loaded).toBeTruthy();
    // shallow check
    // @ts-ignore
    expect((loaded as any).day).toBe(7);

    // delete and verify removal
    await persistence.deleteConfig("game:e2e-test");
    const list2 = await persistence.listGameStates();
    expect(list2.find((l) => l.name === "e2e-test")).toBeUndefined();
  });
});
