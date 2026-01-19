import fs from "fs/promises";
import { test } from "@playwright/test";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

test.describe("a11y: CharacterGeneration", () => {
  test("has no critical/serious violations", async ({ page }) => {
    const axeSrc = await fs.readFile(axePath, "utf8");
    await page.goto("http://localhost:5173/#/character-generation", {
      waitUntil: "networkidle",
    });
    await page.addScriptTag({ content: axeSrc });

    const result = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document);
    });

    console.log(
      `axe results for CharacterGeneration:`,
      JSON.stringify(result.violations, null, 2),
    );

    const bad = result.violations.filter(
      (v: any) => v.impact === "critical" || v.impact === "serious",
    );
    if (bad.length > 0) {
      const summary = bad
        .map((v: any) => `${v.id} (${v.impact}): ${v.help}`)
        .join("; ");
      throw new Error(`Accessibility violations found: ${summary}`);
    }
  });
});

test.describe("a11y: Dashboard", () => {
  test("has no critical/serious violations", async ({ page }) => {
    const axeSrc = await fs.readFile(axePath, "utf8");
    await page.goto("http://localhost:5173/#/dashboard", {
      waitUntil: "networkidle",
    });
    await page.addScriptTag({ content: axeSrc });

    const result = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document);
    });

    console.log(
      `axe results for Dashboard:`,
      JSON.stringify(result.violations, null, 2),
    );

    const bad = result.violations.filter(
      (v: any) => v.impact === "critical" || v.impact === "serious",
    );
    if (bad.length > 0) {
      const summary = bad
        .map((v: any) => `${v.id} (${v.impact}): ${v.help}`)
        .join("; ");
      throw new Error(`Accessibility violations found: ${summary}`);
    }
  });
});
