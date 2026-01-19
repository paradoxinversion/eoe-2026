import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CharacterGeneration from "../../frontend/src/pages/CharacterGeneration";
import * as persistence from "../../frontend/src/services/persistence";

vi.spyOn(persistence, "saveGameState").mockResolvedValue(undefined as any);
vi.spyOn(persistence, "saveConfig").mockResolvedValue(undefined as any);

describe("CharacterGeneration seed persistence", () => {
    it("saves starting seed to preferences and game state", async () => {
        render(<CharacterGeneration />);
        const input = screen.getByLabelText("character-name");
        await userEvent.type(input, "Alice");
        const button = screen.getByRole("button", { name: /confirm/i });
        await userEvent.click(button);

        await waitFor(() => {
            expect(persistence.saveConfig).toHaveBeenCalled();
            expect(persistence.saveGameState).toHaveBeenCalledWith(
                "Alice",
                expect.objectContaining({
                    playerName: "Alice",
                    world: expect.any(Object),
                }),
            );
        });

        const call = (persistence.saveConfig as any).mock.calls[0];
        expect(call[0]).toBe("preferences");
        expect(call[1]).toHaveProperty("playerName", "Alice");
        expect(call[1]).toHaveProperty("startingSeed");
    });
});
