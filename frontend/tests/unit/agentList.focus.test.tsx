/** @vitest-environment jsdom */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";

import AgentList from "../../../frontend/src/components/personnel/AgentList";

describe("AgentList focus behavior", () => {
  it("navigates with arrow keys and triggers onFocus on Enter and Focus button", async () => {
    const agents = [
      { id: "a1", name: "Astra One", agentType: "Scientist" },
      { id: "a2", name: "Borin Two", agentType: "Worker" },
    ];
    const onFocus = vi.fn();

    render(<AgentList agents={agents as any} onFocus={onFocus} />);

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);

    // initial focus should be on first row (tabIndex 0)
    rows[0].focus();
    expect(rows[0]).toHaveAttribute("tabindex", "0");

    // ArrowDown moves focus to second row
    fireEvent.keyDown(rows[0], { key: "ArrowDown" });
    expect(rows[1]).toHaveAttribute("aria-selected", "true");

    // Press Enter on the focused row triggers onFocus
    fireEvent.keyDown(rows[1], { key: "Enter" });
    expect(onFocus).toHaveBeenCalledWith(expect.objectContaining({ id: "a2" }));

    // Clicking the Focus button calls onFocus for the specific agent
    const focusButton = screen.getByLabelText("Focus Astra One");
    fireEvent.click(focusButton);
    expect(onFocus).toHaveBeenCalledWith(expect.objectContaining({ id: "a1" }));
  });
});
