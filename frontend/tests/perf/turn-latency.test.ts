import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import createRng from "../../src/lib/rng";
import { resolveTurns } from "../../src/services/turn";

describe("perf: turn resolution latency", () => {
    it("measures resolveTurns latency for many days and records artifacts", () => {
        const seed = 2026;
        const days = 1000; // stress test
        const rng = createRng(seed);
        const initial = {
            day: 0,
            resources: { gold: 0, science: 0 },
            agents: [],
        } as any;

        const start = process.hrtime.bigint();
        const result = resolveTurns(initial, rng, days);
        const end = process.hrtime.bigint();
        const durationMs = Number(end - start) / 1_000_000;

        // write a perf artifact for CI review
        const outDir = path.join(process.cwd(), "tests_output");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(
            outDir,
            `perf-turn-latency-seed-${seed}.json`,
        );
        const data = {
            seed,
            days,
            durationMs,
            resultSummary: { day: result.day, resources: result.resources },
        };
        fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

        // assert the function completed and produced a sensible result
        expect(result.day).toBe(days);
        expect(typeof result.resources.gold).toBe("number");

        // basic threshold so tests fail loudly if resolution is very slow on CI
        const thresholdMs = 5000; // 5s
        expect(durationMs).toBeLessThan(thresholdMs);
    });
});
