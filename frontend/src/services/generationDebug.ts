import { generateDebugWorld, type DebugArtifact } from "./generation";

export type DebugGenerateOpts = {
  mapWidth?: number;
  mapHeight?: number;
  zoneSizeMin?: number;
  zoneSizeMax?: number;
  peoplePerZone?: number;
  orgCount?: number;
};

export async function generateDebugArtifactToFile(
  seed: number | string,
  opts?: DebugGenerateOpts,
  outPath?: string,
): Promise<DebugArtifact> {
  const artifact = generateDebugWorld(seed, opts as any);

  // write to disk only when running in Node (developer script)
  const isNode =
    typeof process !== "undefined" &&
    !!(process.versions && process.versions.node);
  if (isNode) {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const writePath = outPath || `generation-${String(seed)}-artifact.json`;
      await fs.promises.writeFile(
        writePath,
        JSON.stringify(artifact, null, 2),
        "utf8",
      );

      // also write a simple counts file next to the artifact for quick checks
      try {
        const counts = {
          zones: Array.isArray(artifact.zones) ? artifact.zones.length : 0,
          people: Array.isArray(artifact.people) ? artifact.people.length : 0,
          buildings: Array.isArray(artifact.buildings)
            ? artifact.buildings.length
            : 0,
          organizations: Array.isArray(artifact.organizations)
            ? artifact.organizations.length
            : 0,
        } as const;
        const countsName = `generation-${String(seed)}-counts.json`;
        const countsPath = path.join(path.dirname(writePath), countsName);
        await fs.promises.writeFile(
          countsPath,
          JSON.stringify(counts, null, 2),
          "utf8",
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(
          "generateDebugArtifactToFile: failed to write counts file",
          e,
        );
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("generateDebugArtifactToFile: failed to write artifact", e);
    }
  }

  return artifact;
}

// Minimal CLI: node -r ts-node/register frontend/src/services/generationDebug.ts <seed> [outPath]
if (typeof process !== "undefined" && require.main === module) {
  (async () => {
    try {
      const argv = process.argv.slice(2);
      const seed = argv[0] ?? Date.now().toString();
      const out = argv[1];
      const artifact = await generateDebugArtifactToFile(seed, undefined, out);
      // eslint-disable-next-line no-console
      console.log(
        `Generated artifact with seed=${seed}, zones=${artifact.zones.length}`,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("generationDebug CLI failed", e);
      process.exit(1);
    }
  })();
}
// Thin compatibility wrapper: forward debug generation to the canonical generator
export { generateDebugWorld } from "./generation";

export default generateDebugWorld;
