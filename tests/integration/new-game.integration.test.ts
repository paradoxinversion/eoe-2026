import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import CharacterGeneration from "../../frontend/src/pages/CharacterGeneration";
import Main from "../../frontend/src/pages/Dashboard/Main";

import * as persistence from "../../frontend/src/services/persistence";

describe("New Game flow (integration)", () => {
  let saveSpy: any;
  let listSpy: any;
  let loadSpy: any;
  let savedState: any = null;

  beforeEach(() => {
    savedState = null;
    saveSpy = vi
      .spyOn(persistence, "saveGameState")
      .mockImplementation(async (name: string, state: unknown) => {
        savedState = { name, state };
        return Promise.resolve();
      });
    listSpy = vi.spyOn(persistence, "listGameStates").mockResolvedValue([]);
    loadSpy = vi.spyOn(persistence, "loadGameState").mockResolvedValue(null as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a new game and navigates to dashboard showing player name", async () => {
    render(<CharacterGeneration />);

    const input = screen.getByLabelText("character-name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Alice" } });

    const btn = screen.getByText("Confirm");
    fireEvent.click(btn);

    await waitFor(() => expect(saveSpy).toHaveBeenCalled());

    // Ensure savedState captured
    expect(savedState).toBeTruthy();
    expect(savedState.name).toBe("Alice");

    // Mock listing/loading to return the saved state for Main to consume
    listSpy.mockResolvedValue([{ name: "Alice", updatedAt: Date.now() }]);
    loadSpy.mockResolvedValue(savedState.state);

    // Render Dashboard Main and assert player name is displayed
    render(<Main />);
    await waitFor(() => expect(screen.getByText(/Player:/)).toBeTruthy());
    expect(screen.getByText("Player: Alice")).toBeTruthy();
  });
});
