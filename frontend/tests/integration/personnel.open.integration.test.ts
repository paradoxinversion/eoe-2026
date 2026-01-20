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

    // Navigate to the Dashboard where the Personnel tab is exposed.
    const dashboardNav = await screen.findByText(/Dashboard/);
    fireEvent.click(dashboardNav);

    // Click the Personnel item in the dashboard sidebar using its aria-label
    const sidebarNav = await screen.findByLabelText(/dashboard-nav-personnel/);
    fireEvent.click(sidebarNav);

    // Capacity widget should appear
    const agentsLabel = await screen.findByText(/^Agents$/i);
    const agentsWidget = agentsLabel.parentElement as HTMLElement;
    expect(within(agentsWidget).getByText(/\d+/)).toBeTruthy();

    // Chart should be present by aria-label, or if there are no agents
    // the chart component renders a fallback 'No agents' message.
    let chart: HTMLElement | null = null;
    try {
      chart = await screen.findByLabelText(/Agent type breakdown/);
      expect(chart).toBeTruthy();
    } catch (err) {
      expect(await screen.findByText(/No agents/i)).toBeTruthy();
    }

    // Profile panel header should be present
    expect(await screen.findByText("Profile")).toBeTruthy();
  });
});
