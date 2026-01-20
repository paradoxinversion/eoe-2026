/** @vitest-environment jsdom */

import React from "react";
import "fake-indexeddb/auto";
import { render, screen, within } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";

describe("integration: Personnel Profile rendering", () => {
  it("shows 100% confidence for persisted Agent and mapped confidence for non-agent Person", async () => {
    // Mock personnelPersistence to return a single agent (no intelligenceLevel persisted)
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
                // no intelligenceLevel => UI should treat agent as max/confident
              },
            },
          ],
        },
      };
    });

    const { default: PersonnelTab } =
      await import("../../src/components/personnel/PersonnelTab");
    render(React.createElement(PersonnelTab));

    // Profile should show the agent name and 100% confidence
    const profileHeading = await screen.findByText("Profile");
    const profileSection = profileHeading.parentElement as HTMLElement;
    expect(within(profileSection).getByText("Astra One")).toBeTruthy();
    expect(
      within(profileSection).getByText(/Confidence:/).textContent,
    ).toContain("100");

    // Now verify non-agent Person rendering using the Profile component directly
    const { default: Profile } =
      await import("../../src/components/personnel/Profile");
    // Render a non-agent person with intelligenceLevel = 3
    const nonAgent = {
      id: "p1",
      name: "Citizen X",
      intelligenceLevel: 3,
    } as any;
    const { container } = render(
      React.createElement(Profile, { person: nonAgent }),
    );
    expect(within(container).getByText("Citizen X")).toBeTruthy();
    // 3 -> 30%
    expect(within(container).getByText(/Confidence:/).textContent).toContain(
      "30",
    );
  });
});
