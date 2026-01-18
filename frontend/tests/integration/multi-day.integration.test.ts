import { describe, it, expect, beforeEach } from "vitest";

// Integration: uses real persistence (fake-indexeddb is a dependency)
import {
  saveConfig,
  loadConfig,
  clearAllConfigs,
} from "../../src/services/persistence";
import "fake-indexeddb/auto";
import createRng from "../../src/lib/rng";
import { resolveTurns, GameState } from "../../src/services/turn";

beforeEach(async () => {
  await clearAllConfigs();
});

describe("integration: multi-day scenarios using saved configs", () => {
  it("saves a config, loads it, and runs deterministic multi-day scenario", async () => {
    const cfg = {
      playerName: "IntegrationPlayer",
      startingSeed: 2026,
      autosaveIntervalSeconds: 60,
      gracePeriodDays: 1,
    };

    await saveConfig("integration-save", cfg);
    const loaded = await loadConfig("integration-save");
    expect(loaded).toBeTruthy();
    expect(loaded!.playerName).toBe(cfg.playerName);

    const rng = createRng(loaded!.startingSeed);
    const initial: GameState = {
      day: 0,
      resources: { gold: 0, science: 0 },
    };

    const result = resolveTurns(initial, rng, 10);

    // deterministic expectations: day should advance by 10
    expect(result.day).toBe(10);
    // resources should be numbers and reproducible
    expect(typeof result.resources.gold).toBe("number");
    expect(typeof result.resources.science).toBe("number");

    // run again with same seed to verify determinism
    const rng2 = createRng(loaded!.startingSeed);
    const result2 = resolveTurns(initial, rng2, 10);
    expect(result2).toEqual(result);
  });
});
