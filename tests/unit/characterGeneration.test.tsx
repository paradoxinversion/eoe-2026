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
