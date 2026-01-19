/** @vitest-environment jsdom */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";

/**
 * Integration test: ensure clicking End Turn advances the day via `advanceTurn`.
 * We mount the Dashboard page (tabs -> Main) and click the End Turn button.
 */

describe("End Turn integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("advances turn when End Turn clicked", async () => {
    // mock persistence and turn services
    const savedState = { day: 0, resources: { gold: 0, science: 0 } };
    const saveGameState = vi.fn().mockResolvedValue(undefined);
    const loadGameState = vi.fn().mockResolvedValue(savedState);
    const listGameStates = vi.fn().mockResolvedValue([]);
    const advanceTurn = vi.fn().mockImplementation(async () => {
      // simulate side-effect of incrementing day in persisted autosave
      savedState.day += 1;
      await saveGameState("autosave", savedState);
      return savedState;
    });

    vi.doMock("../../src/services/persistence", () => ({
      saveGameState,
      loadGameState,
      listGameStates,
      loadConfig: vi.fn().mockResolvedValue(null),
    }));
    vi.doMock("../../src/services/turn", () => ({
      advanceTurn,
    }));

    const { default: Dashboard } =
      await import("../../src/pages/Dashboard/index");
    render(React.createElement(Dashboard));

    // ensure Main tab button is visible
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Main/i })).toBeTruthy(),
    );

    const endBtn = screen.getByLabelText("end-turn");
    fireEvent.click(endBtn);

    await waitFor(() => expect(advanceTurn).toHaveBeenCalled());
  });
});
