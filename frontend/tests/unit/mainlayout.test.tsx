import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MainLayout from "../../../frontend/src/pages/Dashboard/MainLayout";

describe("MainLayout", () => {
  it("displays player name and day, and calls onEndTurn when End Turn clicked", async () => {
    const onEndTurn = vi.fn();

    render(
      <MainLayout
        playerName="Tester"
        day={3}
        resources={{ gold: 10, science: 5 }}
        startingSeed={12345}
        onEndTurn={onEndTurn}
        metrics={[
          { title: "Gold", value: 10 },
          { title: "Science", value: 5 },
        ]}
      />,
    );

    expect(screen.getByText("Tester")).toBeDefined();
    expect(screen.getByText("Day 3")).toBeDefined();
    const button = screen.getByLabelText("end-turn");
    fireEvent.click(button);
    expect(onEndTurn).toHaveBeenCalled();
  });
});
