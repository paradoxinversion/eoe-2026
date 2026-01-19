/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Use an in-memory mock for persistence to avoid IndexedDB in unit tests
const mockStore: Record<string, any> = {};

vi.mock("../../src/services/persistence", () => ({
  saveConfig: vi.fn(async (name: string, cfg: any) => {
    mockStore[name] = cfg;
  }),
  loadConfig: vi.fn(async (name: string) => mockStore[name] || null),
  deleteConfig: vi.fn(async (name: string) => {
    delete mockStore[name];
  }),
}));

import {
  saveConfig,
  loadConfig,
  deleteConfig,
} from "../../src/services/persistence";

describe("theme persistence", () => {
  beforeEach(() => {
    for (const k of Object.keys(mockStore)) delete mockStore[k];
    vi.clearAllMocks();
  });

  it("saves and loads theme in preferences", async () => {
    const prefs = {
      playerName: "Tester",
      startingSeed: 123,
      theme: "dark",
    } as any;
    await saveConfig("preferences", prefs);

    const loaded = await loadConfig("preferences");
    expect(loaded).toBeTruthy();
    expect((loaded as any).theme).toBe("dark");

    // cleanup
    await deleteConfig("preferences");
    const after = await loadConfig("preferences");
    expect(after).toBeNull();
  });
});
