import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

describe("CapacityWidgets", () => {
  it("displays current count and capacity", async () => {
    vi.doMock("../../src/services/personnelPersistence", () => ({
      default: {
        listAgents: async () => [
          { id: "a1", updatedAt: 0, agent: { id: "a1", leadership: 2 } },
          { id: "a2", updatedAt: 0, agent: { id: "a2", leadership: 1 } },
        ],
      },
    }));

    const { default: CapacityWidgets } =
      await import("../../src/components/personnel/CapacityWidgets");

    render(React.createElement(CapacityWidgets));

    await waitFor(() => expect(screen.getByText("Agents")).toBeTruthy());
    // current agents should be 2
    expect(screen.getByText("2")).toBeTruthy();
    // max capacity should be computed as sum of leadership -> 3
    expect(screen.getByText("3")).toBeTruthy();
  });
});
