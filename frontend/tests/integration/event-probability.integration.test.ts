import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import createRng from "../../src/lib/rng";
import { resolveTurns, resolveTurn } from "../../src/services/turn";
import {
  saveConfig,
  loadConfig,
  deleteConfig,
  clearAllConfigs,
} from "../../src/services/persistence";

describe("integration: event probabilities persist and affect turns", () => {
  beforeEach(async () => {
    await clearAllConfigs();
  });

  it("saving a config with high event probabilities leads to events occurring", async () => {
    const cfg = {
      playerName: "Tester",
      startingSeed: 12345,
      autosaveIntervalSeconds: 30,
      gracePeriodDays: 0,
      eventProbabilities: { raid: 0.5, blessing: 0.4, discovery: 0.05 },
    } as any;
    await saveConfig("high-events", cfg);
    const loaded = await loadConfig("high-events");
    expect(loaded).not.toBeNull();

    const rng = createRng(loaded!.startingSeed);
    const initial = {
      day: 0,
      resources: { gold: 50, science: 10 },
      agents: [],
    } as any;
    // run multiple turns deterministically and assert at least one event occurred
    let s = { ...initial };
    let sawEvent = false;
    for (let i = 0; i < 5; i++) {
      s = resolveTurn(
        { ...s, eventProbabilities: loaded!.eventProbabilities },
        rng,
      );
      if ((s.log || []).some((l: string) => l.startsWith("Event:"))) {
        sawEvent = true;
        break;
      }
    }
    expect(sawEvent).toBe(true);
  });

  it("saving a config with zero probabilities prevents events", async () => {
    const cfg = {
      playerName: "NoEvents",
      startingSeed: 54321,
      autosaveIntervalSeconds: 30,
      gracePeriodDays: 0,
      eventProbabilities: { raid: 0, blessing: 0, discovery: 0 },
    } as any;
    await saveConfig("no-events", cfg);
    const loaded = await loadConfig("no-events");
    expect(loaded).not.toBeNull();

    const rng = createRng(loaded!.startingSeed);
    const initial = {
      day: 0,
      resources: { gold: 50, science: 10 },
      agents: [],
    } as any;
    let s = { ...initial };
    let sawEvent = false;
    for (let i = 0; i < 5; i++) {
      s = resolveTurn(
        { ...s, eventProbabilities: loaded!.eventProbabilities },
        rng,
      );
      if ((s.log || []).some((l: string) => l.startsWith("Event:"))) {
        sawEvent = true;
        break;
      }
    }
    expect(sawEvent).toBe(false);
  });
});
