import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PersonnelList from "../../src/components/personnel/PersonnelList";

const sample = [
  { id: "a1", name: "Zeta", agentType: "Scout" },
  { id: "a2", name: "Alpha", agentType: "Soldier" },
  { id: "a3", name: "Beta", agentType: "Soldier" },
];

describe("PersonnelList", () => {
  it("renders and sorts by name by default", () => {
    render(<PersonnelList agents={sample as any} />);
    const items = screen.getAllByRole("listitem");
    // sorted by name: Alpha, Beta, Zeta
    expect(items[0].textContent).toContain("Alpha");
    expect(items[1].textContent).toContain("Beta");
    expect(items[2].textContent).toContain("Zeta");
  });

  it("filters by type and updates list", () => {
    const { container } = render(<PersonnelList agents={sample as any} />);
    const within = require("@testing-library/react").within(container);
    const filter = within.getByLabelText("filter-type") as HTMLSelectElement;
    filter.value = "Soldier";
    filter.dispatchEvent(new Event("change", { bubbles: true }));
    const items = within.getAllByRole("listitem");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Alpha");
  });
});
