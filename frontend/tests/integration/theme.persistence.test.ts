/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect } from "vitest";
import Settings from "../../src/pages/Dashboard/Settings";
import { loadThemeMode, clearAllConfigs } from "../../src/services/persistence";

describe("Theme persistence", () => {
  beforeEach(async () => {
    // ensure DB is clean
    try {
      await clearAllConfigs();
    } catch (e) {
      // ignore
    }
  });

  it("saves chosen theme to persistence when toggled", async () => {
    render(React.createElement(Settings));

    // initial switch should be present
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeDefined();

    // toggle to light (switch off)
    fireEvent.click(checkbox);

    // persistence should be updated to 'light'
    await waitFor(async () => {
      const saved = await loadThemeMode();
      expect(saved).toBe("light");
    });
  });
});
