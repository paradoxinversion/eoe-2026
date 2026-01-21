import { loadGameState } from "./persistence";

export async function logSavedGame(name: string) {
  try {
    const s = await loadGameState(name);
    // eslint-disable-next-line no-console
    console.log("Saved game:", name, s);
    return s;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("logSavedGame failed", e);
    return null;
  }
}

export async function exportSavedGameToFile(
  name: string,
  outputDir = "tests_output",
) {
  const s = await loadGameState(name);
  if (!s) return null;

  // In Node (tests), write to disk; in browser, trigger download
  try {
    // detect Node environment
    if (typeof window === "undefined") {
      const fs = await import("fs");
      const path = await import("path");
      const dir = path.resolve(process.cwd(), outputDir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, `saved-game-${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(s, null, 2), "utf8");
      return filePath;
    } else {
      const blob = new Blob([JSON.stringify(s, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `saved-game-${name}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("exportSavedGameToFile failed", e);
    return null;
  }
}

export default { logSavedGame, exportSavedGameToFile };
