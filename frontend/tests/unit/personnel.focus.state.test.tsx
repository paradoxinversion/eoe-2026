/** @vitest-environment jsdom */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";

import PersonnelTab from "../../../frontend/src/components/personnel/PersonnelTab";

describe("PersonnelTab focus wiring", () => {
  it("loads Profile when an agent is focused via AgentList", async () => {
    // Mock personnelPersistence to provide agents to the tab
    vi.mock("../../../frontend/src/services/personnelPersistence", async () => {
      return {
        default: {
          listAgents: async () => [
            {
              id: "a1",
              updatedAt: Date.now(),
              agent: {
                id: "a1",
                firstName: "Astra",
                lastName: "One",
                agentType: "Scientist",
                leadership: 2,
              },
            },
          ],
        },
      };
    });

    render(React.createElement(PersonnelTab));

    // Wait for the Personnel header to render and then click the Focus button
    const focusButton = await screen.findByLabelText(/Focus Astra One/);
    fireEvent.click(focusButton);

    // Profile should show the agent name
    expect(await screen.findByText("Astra One")).toBeTruthy();
  });
});
