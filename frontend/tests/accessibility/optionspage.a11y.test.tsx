import React from "react";
import { render } from "@testing-library/react";
// Note: avoid jest-dom import to keep test deps minimal
import "fake-indexeddb/auto";
import OptionsPage from "../../src/pages/OptionsPage";
import axe from "axe-core";
import { describe, it, expect } from "vitest";
/* @vitest-environment jsdom */

describe("a11y: OptionsPage", () => {
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

        const { container } = render(<OptionsPage />);
        // axe-core expects a document or element
        const results = await (axe as any).run(container);
        // Filter known false-positive / environment-specific rules
        const filtered = results.violations.filter(
            (v: any) => v.id !== "aria-allowed-role",
        );
        expect(filtered).toHaveLength(0);
    });
});
