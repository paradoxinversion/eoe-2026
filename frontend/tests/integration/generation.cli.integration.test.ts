import { describe, it, expect } from "vitest";
import { generateDebugArtifactToFile } from "../../src/services/generationDebug";
import fs from "fs/promises";
import path from "path";
import os from "os";

describe("generationDebug CLI helper", () => {
  it("writes artifact and counts file when run under Node", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "gen-cli-"));
    const outPath = path.join(tmp, "artifact.json");
    const seed = Date.now().toString();

    const artifact = await generateDebugArtifactToFile(
      seed,
      { mapWidth: 2, mapHeight: 2 },
      outPath,
    );
    expect(artifact).toBeDefined();
    // artifact file
    const stat = await fs.stat(outPath);
    expect(stat.isFile()).toBe(true);

    // counts file
    const countsPath = path.join(tmp, `generation-${String(seed)}-counts.json`);
    const countsStat = await fs.stat(countsPath);
    expect(countsStat.isFile()).toBe(true);

    const countsRaw = await fs.readFile(countsPath, "utf8");
    const counts = JSON.parse(countsRaw);
    expect(typeof counts.zones).toBe("number");
    expect(counts.zones).toBeGreaterThanOrEqual(1);

    // cleanup
    await fs.rm(tmp, { recursive: true, force: true });
  });
});
