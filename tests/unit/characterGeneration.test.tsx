import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import CharacterGeneration from "../../frontend/src/pages/CharacterGeneration";
import * as persistence from "../../frontend/src/services/persistence";

describe("CharacterGeneration component", () => {
    let saveGameSpy: any;
    let saveConfigSpy: any;

    beforeEach(() => {
        saveGameSpy = vi
            .spyOn(persistence, "saveGameState")
            .mockResolvedValue(undefined as any);
        saveConfigSpy = vi
            .spyOn(persistence, "saveConfig")
            .mockResolvedValue(undefined as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders name input and confirm button", () => {
        render(<CharacterGeneration />);
        expect(screen.getByLabelText("character-name")).toBeTruthy();
        expect(screen.getByText("Confirm")).toBeTruthy();
    });

    it("shows validation error when name is empty", async () => {
        render(<CharacterGeneration />);
        const btn = screen.getByText("Confirm");
        fireEvent.click(btn);
        expect(await screen.findByText("Name is required")).toBeTruthy();
    });

    it("saves world and prefs when name provided", async () => {
        const genMod = require("../../frontend/src/services/generation");
        const worldSpy = vi.spyOn(genMod, "generateAndSaveWorld");
        worldSpy.mockResolvedValue({
            zones: [],
            people: [],
            buildings: [],
            organizations: [],
            placementErrors: [],
            playerCharacterId: "p",
            playerOrgId: "o",
        } as any);

        render(<CharacterGeneration />);
        const input = screen.getByLabelText(
            "character-name",
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: "Tester" } });
        const btn = screen.getByText("Confirm");
        fireEvent.click(btn);

        await waitFor(() => expect(saveGameSpy).toHaveBeenCalled());
        expect(saveConfigSpy).toHaveBeenCalled();
    });
});
import React from "react";
import { render, screen } from "@testing-library/react";
import CharacterGeneration from "../../frontend/src/pages/CharacterGeneration";

describe("CharacterGeneration", () => {
    it("renders name input", () => {
        render(<CharacterGeneration />);
        const input = screen.getByLabelText("character-name");
        expect(input).toBeTruthy();
    });
});
