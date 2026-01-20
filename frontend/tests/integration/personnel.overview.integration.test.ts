/** @vitest-environment jsdom */

import React from "react";
import "fake-indexeddb/auto";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";

describe("integration: Personnel Overview", () => {
  beforeEach(async () => {
    vi.resetModules();
    // clear persistence
    const { clearAllConfigs } = await import("../../src/services/persistence");
    await clearAllConfigs();
  });

  it("renders capacity widgets and agent type breakdown from persisted agents", async () => {
    // mock personnelPersistence to return two agents for the UI
    vi.mock("../../src/services/personnelPersistence", async () => {
      const actual = await vi.importActual(
        "../../src/services/personnelPersistence",
      );
      const now = Date.now();
      return {
        default: {
          ...(actual as any).default,
          listAgents: async () => [
            {
              id: "a1",
              updatedAt: now,
              agent: {
                id: "a1",
                firstName: "Astra",
                lastName: "One",
                agentType: "Scientist",
                leadership: 2,
              },
            },
            {
              id: "a2",
              updatedAt: now,
              agent: {
                id: "a2",
                firstName: "Borin",
                lastName: "Two",
                agentType: "Worker",
                leadership: 1,
              },
            },
          ],
        },
      };
    });

    const { default: PersonnelTab } =
      await import("../../src/components/personnel/PersonnelTab");
    render(React.createElement(PersonnelTab));

    await waitFor(() => expect(screen.getByText(/Agents/)).toBeTruthy());

    // chart should show total agents (scoped to the chart)
    const chart = screen.getByLabelText("Agent type breakdown");
    expect(within(chart).getByText("2")).toBeTruthy();

    // agent type labels should be present
    expect(screen.getByText("Scientist (1)")).toBeTruthy();
    expect(screen.getByText("Worker (1)")).toBeTruthy();

    // capacity should be sum of leadership (2 + 1 = 3) (scoped to the Capacity widget)
    const capacityLabel = screen.getByText(/^Capacity$/);
    const capacityWidget = capacityLabel.parentElement;
    expect(within(capacityWidget as Element).getByText("3")).toBeTruthy();
  });
});
