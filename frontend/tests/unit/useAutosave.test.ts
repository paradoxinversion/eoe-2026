import { vi, describe, it, beforeEach, afterEach, expect } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useAutosave", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    // provide a minimal DOM for renderHook
    const { JSDOM } = require("jsdom");
    const dom = new JSDOM("<!doctype html><html><body></body></html>");
    // @ts-ignore
    global.window = dom.window;
    // @ts-ignore
    global.document = dom.window.document;
    // navigator available via dom.window.navigator if needed
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("saves on interval and on unmount", async () => {
    // mock idb openDB used by persistence
    const store = new Map<string, any>();
    const mockDb: any = {
      objectStoreNames: { contains: () => false },
      createObjectStore: () => {},
      put: async (_store: string, value: any) => store.set(value.name, value),
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
    const saveSpy = vi
      .spyOn(persistence, "saveConfig")
      .mockImplementation(async () => undefined);

    const hookModule = await import("../../src/hooks/useAutosave");
    const { unmount } = renderHook(() =>
      hookModule.useAutosave(
        {
          playerName: "X",
          startingSeed: 1,
          autosaveIntervalSeconds: 1,
          gracePeriodDays: 0,
        },
        { name: "test-save", intervalSeconds: 1 },
      ),
    );

    // initial save occurs on mount
    expect(saveSpy).toHaveBeenCalledTimes(1);

    // advance interval by 1 second -> another save
    vi.advanceTimersByTime(1000);
    await Promise.resolve();
    expect(saveSpy).toHaveBeenCalledTimes(2);

    // unmount triggers final save
    unmount();
    await Promise.resolve();
    expect(saveSpy).toHaveBeenCalled();
  });
});
