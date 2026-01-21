import fs from "fs";
import path from "path";

export function writeDebugArtifact(
  artifact: unknown,
  seed?: string | number,
  outputDir = "tests_output",
): string {
  const dir = path.resolve(process.cwd(), outputDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const safeSeed = String(seed ?? Date.now()).replace(/[^a-z0-9._-]/gi, "_");
  const filename = `generation-debug-${safeSeed}.json`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2), "utf8");
  return filePath;
}

export default writeDebugArtifact;
