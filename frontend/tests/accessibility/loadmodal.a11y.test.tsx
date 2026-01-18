import React from "react";
import { render } from "@testing-library/react";
import "fake-indexeddb/auto";
import LoadModal from "../../src/components/LoadModal";
import axe from "axe-core";
import { describe, it, expect } from "vitest";
/* @vitest-environment jsdom */

describe("a11y: LoadModal", () => {
  it("has no detectable accessibility violations", async () => {
    // jsdom does not implement canvas; stub getContext used by axe internals
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

    const { container } = render(
      <LoadModal open={true} onClose={() => {}} onLoad={() => {}} />,
    );
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
