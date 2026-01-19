/** @vitest-environment jsdom */
import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Main from "../../src/pages/Dashboard/Main";
import AppThemeProvider from "../../src/theme/Provider";

function setViewport(width: number, height = 800) {
  (globalThis as any).innerWidth = width;
  (globalThis as any).innerHeight = height;
  globalThis.dispatchEvent(new Event("resize"));
}

describe("Dashboard Main visual snapshots", () => {
  it("desktop snapshot", () => {
    setViewport(1280);
    const { container } = render(
      <AppThemeProvider>
        <Main />
      </AppThemeProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it("tablet snapshot", () => {
    setViewport(768);
    const { container } = render(
      <AppThemeProvider>
        <Main />
      </AppThemeProvider>,
    );
    expect(container).toMatchSnapshot();
  });

  it("mobile snapshot", () => {
    setViewport(375);
    const { container } = render(
      <AppThemeProvider>
        <Main />
      </AppThemeProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
