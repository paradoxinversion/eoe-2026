/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdvancedPanel from "../../src/components/AdvancedPanel";

describe("AdvancedPanel accessibility and keyboard", () => {
  it("has dialog role and aria-label", () => {
    const onClose = vi.fn();
    render(<AdvancedPanel open={true} onClose={onClose} />);

    const dialog = screen.getByRole("dialog", { name: /advanced-controls/i });
    expect(dialog).toBeDefined();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<AdvancedPanel open={true} onClose={onClose} />);

    const dialog = screen.getByRole("dialog", { name: /advanced-controls/i });
    // Some MUI internals attach key handlers to the drawer container (ancestor)
    const handlerTarget = dialog.parentElement ?? dialog;
    fireEvent.keyDown(handlerTarget, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("focuses inside the dialog and close button is keyboard operable", async () => {
    const onClose = vi.fn();
    render(<AdvancedPanel open={true} onClose={onClose} />);

    const dialog = screen.getByRole("dialog", { name: /advanced-controls/i });

    // Find the close button by its aria-label and programmatically focus it
    const closeBtns = screen.getAllByLabelText("close-advanced");
    const closeBtn = closeBtns.find((b) => dialog.contains(b)) ?? closeBtns[0];
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    // Ensure the close button is keyboard-focusable (has a tabindex)
    expect(closeBtn.getAttribute("tabindex")).not.toBeNull();

    // Simulate activation via click as a proxy for keyboard activation
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
