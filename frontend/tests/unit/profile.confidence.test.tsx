import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { intelligenceToConfidence } from "../../../frontend/src/services/personnelService";
import Profile from "../../../frontend/src/components/personnel/Profile";

describe("personnelService.intelligenceToConfidence", () => {
  it("maps numeric levels 0..10 to 0..100 percent", () => {
    expect(intelligenceToConfidence(0)).toBe(0);
    expect(intelligenceToConfidence(5)).toBe(50);
    expect(intelligenceToConfidence(10)).toBe(100);
    // rounding
    expect(intelligenceToConfidence(4.6)).toBe(50);
  });

  it("handles out-of-range and non-finite inputs", () => {
    expect(intelligenceToConfidence(-3)).toBe(0);
    expect(intelligenceToConfidence(Infinity)).toBe(0);
    // NaN
    // @ts-ignore
    expect(intelligenceToConfidence(NaN)).toBe(0);
  });
});

describe("Profile confidence rendering", () => {
  it("shows 100% when intelligenceLevel is undefined", () => {
    const { container } = render(
      <Profile person={{ id: "p1", name: "Test" }} />,
    );
    expect(within(container).getByText(/Confidence:/).textContent).toContain(
      "100",
    );
  });

  it("renders mapped confidence when intelligenceLevel is provided", () => {
    const { container } = render(
      <Profile person={{ id: "p2", name: "A", intelligenceLevel: 7 }} />,
    );
    expect(within(container).getByText(/Confidence:/).textContent).toContain(
      "70",
    );
  });
});
