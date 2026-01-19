/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MainLayout from "../../src/pages/Dashboard/MainLayout";

describe("MainLayout Advanced toggle", () => {
  it("opens advanced panel when advanced button clicked and closes it", async () => {
    render(
      <MainLayout playerName="P" day={1} resources={{ gold: 0, science: 0 }} />,
    );

    const openBtn = screen.getByLabelText("open-advanced");
    expect(openBtn).toBeDefined();
    fireEvent.click(openBtn);

    // dialog should appear
    const dialog = await screen.findByRole("dialog", {
      name: /advanced-controls/i,
    });
    expect(dialog).toBeDefined();

    // close via close button
    const close = screen.getByLabelText("close-advanced");
    fireEvent.click(close);

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /advanced-controls/i }),
      ).toBeNull();
    });
  });
});
