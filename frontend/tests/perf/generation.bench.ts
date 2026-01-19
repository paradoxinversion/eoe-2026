import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import generateWorld from "../../src/services/generation";

describe("perf: generation latency", () => {
  it("measures generateWorld latency for many runs and records artifacts", () => {
    const seed = 2026;
    const runs = 2000; // stress test many generations

    const start = process.hrtime.bigint();
    for (let i = 0; i < runs; i++) {
      // vary seed slightly to exercise RNG but keep deterministic pattern
      generateWorld((seed + i) % 1_000_000);
    }
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    const outDir = path.join(process.cwd(), "tests_output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `generation-bench-seed-${seed}.json`);
    const data = {
      seed,
      runs,
      durationMs,
      avgMsPerRun: durationMs / runs,
    };
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

    expect(typeof durationMs).toBe("number");
    // ensure the test completes and is within an arbitrary threshold
    const thresholdMs = 10000; // 10s overall
    expect(durationMs).toBeLessThan(thresholdMs);
  });
});
