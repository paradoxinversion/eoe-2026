import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MetricCard from "../../../frontend/src/pages/Dashboard/MetricCard";

describe("MetricCard", () => {
  it("renders title and value", () => {
    render(<MetricCard title="Gold" value={42} subtitle="per turn" />);
    expect(screen.getByText("Gold")).toBeDefined();
    expect(screen.getByText("42")).toBeDefined();
    expect(screen.getByText("per turn")).toBeDefined();
  });

  it("renders without subtitle", () => {
    render(<MetricCard title="Seed" value={"—"} />);
    expect(screen.getByText("Seed")).toBeDefined();
    expect(screen.getByText("—")).toBeDefined();
  });
});
