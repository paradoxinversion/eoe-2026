/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "fake-indexeddb/auto";
import Main from "../../src/pages/Dashboard/Main";
import { saveGameState } from "../../src/services/persistence";

describe("perf: End Turn UI latency", () => {
  it("measures UI latency from click to day update and writes artifact", async () => {
    // prepare a saved game that advanceTurn will pick
    const seed = 2026;
    const initial = {
      day: 0,
      resources: { gold: 0, science: 0 },
    } as any;
    await saveGameState("perf-autosave", initial);

    const { container } = render(<Main />);

    const btn = await screen.findByLabelText("end-turn");

    const start = Number(process.hrtime.bigint());
    fireEvent.click(btn);

    // wait for the Day header to update to exactly "Day 1"
    await waitFor(() => expect(screen.getByText(/^Day\s*1$/)).toBeDefined(), {
      timeout: 10000,
    });

    const end = Number(process.hrtime.bigint());
    const durationMs = (end - start) / 1_000_000;

    // write artifact for CI inspection
    const outDir = path.join(process.cwd(), "tests_output");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `perf-end-turn-ui-seed-${seed}.json`);
    const data = { seed, durationMs };
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

    // basic sanity checks
    expect(durationMs).toBeGreaterThan(0);

    // threshold to catch regressions in CI
    const thresholdMs = 6000;
    expect(durationMs).toBeLessThan(thresholdMs);
  }, 15000);
});
