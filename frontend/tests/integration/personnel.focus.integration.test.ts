/** @vitest-environment jsdom */

import React from "react";
import "fake-indexeddb/auto";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";

describe("integration: Personnel Focus", () => {
  it("focuses agent via click and keyboard navigation", async () => {
    // mock personnelPersistence to return two agents
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

    // Click the Focus button for the first agent and verify Profile updates
    const focusBtn = await screen.findByLabelText(/Focus Astra One/);
    fireEvent.click(focusBtn);

    const profileHeading = await screen.findByText("Profile");
    const profileSection = profileHeading.parentElement as HTMLElement;
    expect(within(profileSection).getByText("Astra One")).toBeTruthy();

    // Use keyboard to navigate to second agent and press Enter
    const rows = await screen.findAllByRole("listitem");
    rows[0].focus();
    fireEvent.keyDown(rows[0], { key: "ArrowDown" });
    // press Enter on the now-focused second row
    fireEvent.keyDown(rows[1], { key: "Enter" });

    // Profile should show the second agent now
    expect(await within(profileSection).findByText("Borin Two")).toBeTruthy();
  });
});
