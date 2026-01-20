/** @vitest-environment jsdom */

import React from "react";
import "fake-indexeddb/auto";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// This is a smoke test that ensures the PersonnelTab is reachable and renders
// core widgets when opened via the app's navigation.
import App from "../../src/App";

describe("integration: Personnel Open Smoke", () => {
  it("navigates to Personnel tab and renders widgets and profile", async () => {
    const { container } = render(React.createElement(App));

    // Find the navigation button/link for Personnel and click it.
    // Use text match 'Personnel' which appears in the tab header/menu.
    const nav = await screen.findByText(/Personnel/);
    fireEvent.click(nav);

    // Capacity widget should appear
    const agentsLabel = await screen.findByText(/^Agents$/i);
    const agentsWidget = agentsLabel.parentElement as HTMLElement;
    expect(within(agentsWidget).getByText(/\d+/)).toBeTruthy();

    // Chart should be present by aria-label
    const chart = await screen.findByLabelText(/Agent type breakdown/);
    expect(chart).toBeTruthy();

    // Profile panel header should be present
    expect(await screen.findByText("Profile")).toBeTruthy();
  });
});
