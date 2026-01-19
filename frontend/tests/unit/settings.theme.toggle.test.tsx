/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

beforeEach(() => {
  vi.resetModules();
});

describe("Settings theme toggle", () => {
  it("loads preference and saves theme on toggle", async () => {
    const loadThemeMode = vi.fn().mockResolvedValue("light");
    const saveThemeMode = vi.fn().mockResolvedValue(undefined);

    vi.doMock("../../src/services/persistence", () => ({
      loadThemeMode,
      saveThemeMode,
    }));

    const { default: Settings } =
      await import("../../src/pages/Dashboard/Settings");
    render(React.createElement(Settings));

    // initial label should show Light (from mocked loadThemeMode)
    await waitFor(() => expect(screen.getByText(/Theme:/i)).toBeTruthy());
    expect(screen.getByText(/Light/i)).toBeTruthy();

    const toggle = screen.getByRole("checkbox");
    fireEvent.click(toggle);

    await waitFor(() => expect(saveThemeMode).toHaveBeenCalled());
    expect((saveThemeMode as any).mock.calls[0][0]).toBe("dark");
  });
});
