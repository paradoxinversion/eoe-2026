/** @vitest-environment jsdom */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdvancedPanel from "../../src/components/AdvancedPanel";

describe("AdvancedPanel", () => {
  it("renders and calls onClose when close clicked", async () => {
    const onClose = vi.fn();
    render(<AdvancedPanel open={true} onClose={onClose} />);

    expect(
      screen.getByRole("dialog", { name: /advanced-controls/i }),
    ).toBeDefined();
    const close = screen.getByLabelText("close-advanced");
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });
});
