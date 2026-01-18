import { describe, it, expect } from "vitest";
import path from "path";
import fs from "fs";
import { runManySeeds, runSeededScenario } from "./seeded-harness";

describe("integration: seeded harness scenarios", () => {
  it("runs multiple seeds and writes artifacts, deterministic across runs", () => {
    const seeds = [2026, 12345, "ci-seed"];
    const outDir = path.join(process.cwd(), "tests_output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // run once and write artifacts
    const results1 = runManySeeds(seeds, 7);
    for (const r of results1) {
      const outPath = path.join(outDir, `scenario-${String(r.seed)}.json`);
      fs.writeFileSync(outPath, JSON.stringify(r, null, 2));
      expect(fs.existsSync(outPath)).toBe(true);
    }

    // run again and verify identical results
    const results2 = runManySeeds(seeds, 7);
    expect(results2).toEqual(results1);
  });

  it("runs a single seeded scenario convenience helper", () => {
    const res = runSeededScenario({ seed: 42, days: 3 });
    expect(res.days).toBe(3);
    expect(res.result).toHaveProperty("day");
    expect(typeof res.result.resources.gold).toBe("number");
  });
});
