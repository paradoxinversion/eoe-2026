import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CharacterGeneration from "../../src/pages/CharacterGeneration";
import {
  loadGameState,
  loadConfig,
  clearAllConfigs,
} from "../../src/services/persistence";

describe("integration: new game flow", () => {
  beforeEach(async () => {
    await clearAllConfigs();
  });

  it("saves generated world and preferences after confirmation", async () => {
    render(<CharacterGeneration />);

    const nameInput = screen.getByLabelText(
      "character-name",
    ) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "TestPlayer" } });

    const btn = screen.getByText("Confirm");
    fireEvent.click(btn);

    // wait for save to complete (CharacterGeneration hides loading when done)
    await waitFor(async () => {
      const state = await loadGameState("TestPlayer");
      expect(state).not.toBeNull();
      // state should include playerName and world
      const s = state as any;
      expect(s.playerName).toBe("TestPlayer");
      expect(s.world).toBeTruthy();
      expect(s.world.seed).toBeDefined();

      const prefs = await loadConfig("preferences");
      expect(prefs).toBeTruthy();
      expect((prefs as any).playerName).toBe("TestPlayer");
      expect(typeof (prefs as any).startingSeed).toBe("number");
    });
  });
});
