/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("Dashboard End Turn integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("calls advanceTurn and updates UI day", async () => {
    const advanceTurn = vi
      .fn()
      .mockResolvedValue({ day: 1, resources: { gold: 1, science: 0 } });

    vi.doMock("../../src/services/turn", () => ({
      advanceTurn,
    }));

    const { default: Dashboard } = await import("../../src/pages/Dashboard");

    render(React.createElement(Dashboard));

    // ensure initial UI mounted
    await waitFor(() => expect(screen.getByText(/Day\s*0/)).toBeTruthy());

    const btn = screen.getByLabelText("end-turn");
    fireEvent.click(btn);

    await waitFor(() => expect(advanceTurn).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Day\s*1/)).toBeTruthy());
  });
});
