import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Profile from "../../src/components/personnel/Profile";

describe("Profile component", () => {
  it("renders first and last name when present", () => {
    const person = {
      id: "p-1",
      firstName: "Jane",
      lastName: "Doe",
      intelligenceLevel: 50,
    } as any;
    const { container } = render(<Profile person={person} />);
    const { getByTestId } = require("@testing-library/react").within(container);
    expect(getByTestId("person-name").textContent).toBe("Jane Doe");
  });

  it("falls back to legacy name or id when names missing", () => {
    const personWithLegacy = { id: "p-2", name: "Citizen X" } as any;
    const r1 = render(<Profile person={personWithLegacy} />);
    const within1 = require("@testing-library/react").within(r1.container);
    expect(within1.getByTestId("person-name").textContent).toBe("Citizen X");
    cleanup();

    const personWithIdOnly = { id: "p-3" } as any;
    const r2 = render(<Profile person={personWithIdOnly} />);
    const within2 = require("@testing-library/react").within(r2.container);
    expect(within2.getByTestId("person-name").textContent).toBe("p-3");
  });

  it("renders placeholders for missing fields", () => {
    const person = { id: "p-4", firstName: "A", lastName: "B" } as any;
    const r = render(<Profile person={person} />);
    // Role cell should show placeholder — which has aria-label="missing"
    const withinR = require("@testing-library/react").within(r.container);
    const missing = withinR.getAllByLabelText("missing");
    expect(missing.length).toBeGreaterThan(0);
  });
});
