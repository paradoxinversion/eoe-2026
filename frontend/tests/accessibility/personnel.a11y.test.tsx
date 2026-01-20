import React from "react";
import { render } from "@testing-library/react";
import "fake-indexeddb/auto";
import axe from "axe-core";
import { describe, it, expect } from "vitest";
/* @vitest-environment jsdom */

import PersonnelTab from "../../src/components/personnel/PersonnelTab";

describe("a11y: PersonnelTab", () => {
  it("has no detectable accessibility violations", async () => {
    // ensure canvas stub exists for axe internals
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (
      typeof HTMLCanvasElement !== "undefined" &&
      HTMLCanvasElement.prototype &&
      !HTMLCanvasElement.prototype.getContext
    ) {
      // @ts-ignore
      HTMLCanvasElement.prototype.getContext = () => null;
    }

    const { container } = render(<PersonnelTab />);
    const results = await (axe as any).run(container);
    if (results.violations.length) {
      // eslint-disable-next-line no-console
      console.error(
        "A11Y violations:",
        JSON.stringify(results.violations, null, 2),
      );
    }
    expect(results.violations).toHaveLength(0);
  });
});
