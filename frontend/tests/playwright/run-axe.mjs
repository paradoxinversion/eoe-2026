import { chromium } from "playwright";
import fs from "fs/promises";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const port = process.env.PREVIEW_PORT || process.env.PORT || "5173";
const pages = [
  {
    name: "CharacterGeneration",
    url: `http://localhost:${port}/#/character-generation`,
  },
  { name: "Dashboard", url: `http://localhost:${port}/#/dashboard` },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const axeSrc = await fs.readFile(axePath, "utf8");

  let overallFailures = 0;

  for (const p of pages) {
    console.log(`Testing ${p.name} -> ${p.url}`);
    await page.goto(p.url, { waitUntil: "load" });
    await page.addScriptTag({ content: axeSrc });

    const result = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document);
    });

    console.log(`Violations for ${p.name}: ${result.violations.length}`);
    if (result.violations.length > 0) {
      for (const v of result.violations) {
        console.log(`- ${v.id} (${v.impact}): ${v.help}`);
        for (const node of v.nodes) {
          console.log(
            `  Target: ${node.target.join(", ")}\n  HTML: ${node.html}\n`,
          );
        }
      }
    }

    const bad = result.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    if (bad.length > 0) {
      overallFailures += bad.length;
    }
  }

  await browser.close();

  if (overallFailures > 0) {
    console.error(`Found ${overallFailures} critical/serious violations`);
    process.exit(2);
  }

  console.log("No critical/serious accessibility violations found");
  process.exit(0);
})();
