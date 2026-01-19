import React from "react";
import { render, screen } from "@testing-library/react";
import Main from "../../frontend/src/pages/Dashboard/Main";

describe("Dashboard Main", () => {
    it("renders End Turn button", async () => {
        render(<Main />);
        const btn = await screen.findByLabelText("end-turn");
        expect(btn).toBeTruthy();
    });
});
