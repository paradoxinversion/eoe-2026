/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("Settings theme toggle", () => {
  it("loads preference and saves theme on toggle", async () => {
    const loadConfig = vi.fn().mockResolvedValue({ theme: "light" });
    const saveConfig = vi.fn().mockResolvedValue(undefined);

    vi.doMock("../../src/services/persistence", () => ({
      loadConfig,
      saveConfig,
    }));

    const { default: Settings } =
      await import("../../src/pages/Dashboard/Settings");
    render(React.createElement(Settings));

    // initial label should show Light
    await waitFor(() => expect(screen.getByText(/Theme:/i)).toBeTruthy());
    expect(screen.getByText(/Light/i)).toBeTruthy();

    const toggle = screen.getByRole("checkbox");
    fireEvent.click(toggle);

    await waitFor(() => expect(saveConfig).toHaveBeenCalled());
    const call = (saveConfig as any).mock.calls[0];
    expect(call[0]).toBe("preferences");
    expect(call[1]).toHaveProperty("theme", "dark");
  });
});
