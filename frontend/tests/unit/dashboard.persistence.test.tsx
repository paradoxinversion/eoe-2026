/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

describe("Dashboard persistence UI", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("saves a named game and refreshes saved list", async () => {
    const saveGameState = vi.fn().mockResolvedValue(undefined);
    const loadGameState = vi.fn().mockResolvedValue(null);
    const listGameStates = vi
      .fn()
      .mockResolvedValueOnce([]) // initial mount
      .mockResolvedValue([{ name: "mysave", updatedAt: Date.now() }]); // after save
    const deleteConfig = vi.fn().mockResolvedValue(undefined);

    vi.doMock("../../src/services/persistence", () => ({
      saveGameState,
      loadGameState,
      listGameStates,
      deleteConfig,
      loadConfig: vi.fn().mockResolvedValue(null),
    }));

    const { default: Dashboard } = await import("../../src/pages/Dashboard");

    render(React.createElement(Dashboard));

    // wait for initial listGameStates call
    await waitFor(() => expect(listGameStates).toHaveBeenCalled());

    const input = screen.getByLabelText("Save name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "mysave" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(saveGameState).toHaveBeenCalledWith("mysave", expect.any(Object)),
    );

    // savedGames list should show the entry returned by the mocked listGameStates
    await waitFor(() => expect(screen.getByText("mysave")).toBeTruthy());
  });

  it("loads a saved game and applies state", async () => {
    const saveGameState = vi.fn().mockResolvedValue(undefined);
    const loadGameState = vi
      .fn()
      .mockResolvedValue({ day: 5, resources: { gold: 10, science: 2 } });
    const listGameStates = vi
      .fn()
      .mockResolvedValue([{ name: "loaded", updatedAt: Date.now() }]);
    const deleteConfig = vi.fn().mockResolvedValue(undefined);

    vi.doMock("../../src/services/persistence", () => ({
      saveGameState,
      loadGameState,
      listGameStates,
      deleteConfig,
      loadConfig: vi.fn().mockResolvedValue(null),
    }));

    const { default: Dashboard } = await import("../../src/pages/Dashboard");
    render(React.createElement(Dashboard));

    // saved entry should appear
    await waitFor(() => expect(screen.getByText("loaded")).toBeTruthy());

    const savedItem = screen.getByText("loaded");
    const listItem = savedItem.closest("li");
    const { within } = await import("@testing-library/react");
    if (!listItem) throw new Error("saved list item not found");
    const loadBtn = within(listItem).getByText("Load");
    fireEvent.click(loadBtn);

    // After loading, UI should reflect day 5 (look for 'Day 5')
    await waitFor(() => expect(screen.getByText(/Day\s*5/)).toBeTruthy());
  });
});
