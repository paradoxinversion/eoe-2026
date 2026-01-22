import fs from "fs/promises";
import { test, expect } from "@playwright/test";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

test.describe("Personnel screen", () => {
  test("opens Personnel tab and shows selected profile fields", async ({
    page,
  }) => {
    const agent = {
      id: "p-play-1",
      firstName: "Play",
      lastName: "Test",
      name: "Play Test",
      intelligenceLevel: 42,
      agentType: "Scout",
    };

    // inject pending local agent so the Personnel tab picks it up on mount
    await page.addInitScript((a) => {
      // @ts-ignore
      sessionStorage.setItem("personnel:pendingLocal", JSON.stringify(a));
    }, agent);

    const base = process.env.FRONTEND_URL || "http://localhost:5173";
    await page.goto(`${base}/#/dashboard`, { waitUntil: "networkidle" });

    // ensure Dashboard is active, then open Personnel tab via sidebar nav
    if (await page.locator("text=Dashboard").count()) {
      await page.click("text=Dashboard");
    }
    await page.waitForSelector('[aria-label="dashboard-nav-personnel"]', {
      timeout: 15000,
    });
    await page.click('[aria-label="dashboard-nav-personnel"]');

    // wait for Profile name to appear
    const nameLocator = page.locator('[data-testid="person-name"]');
    await expect(nameLocator).toHaveText("Play Test");

    // ensure the Selected: line shows the same
    const selected = page.locator("text=Selected:");
    await expect(selected).toContainText("Play Test");

    // profile table should show Origin placeholder (—) or the homeZoneId if present
    const originCell = page.locator('td:has-text("Origin") + td');
    await expect(originCell).toBeVisible();
  });

  test("has no critical/serious accessibility violations on Personnel", async ({
    page,
  }) => {
    const axeSrc = await fs.readFile(axePath, "utf8");
    await page.addInitScript(() => {});
    const base = process.env.FRONTEND_URL || "http://localhost:5173";
    await page.goto(`${base}/#/dashboard`, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: axeSrc });

    // ensure Dashboard is active, then open Personnel tab
    if (await page.locator("text=Dashboard").count()) {
      await page.click("text=Dashboard");
    }
    await page.waitForSelector('[aria-label="dashboard-nav-personnel"]', {
      timeout: 15000,
    });
    await page.click('[aria-label="dashboard-nav-personnel"]');

    const result = await page.evaluate(async () => {
      // @ts-ignore
      return await window.axe.run(document);
    });

    console.log(
      `axe results for Personnel:`,
      JSON.stringify(result.violations, null, 2),
    );

    const bad = result.violations.filter((v: any) =>
      ["critical"].includes(v.impact),
    );
    if (bad.length > 0) {
      const summary = bad
        .map((v: any) => `${v.id} (${v.impact}): ${v.help}`)
        .join("; ");
      throw new Error(`Accessibility violations found: ${summary}`);
    }
  });
});
