import { describe, it, expect } from "vitest";
import {
  intelligenceToConfidence,
  agentTypeSummary,
  computeCapacity,
} from "../../src/services/personnelService";

describe("personnelService (frontend)", () => {
  it("maps intelligence to confidence linearly", () => {
    expect(intelligenceToConfidence(0)).toBe(0);
    expect(intelligenceToConfidence(5)).toBe(50);
    expect(intelligenceToConfidence(10)).toBe(100);
  });

  it("computes agent type summary", () => {
    const agents = [
      { agentType: "Scientist" },
      { agentType: "Worker" },
      { agentType: "Scientist" },
    ];
    const summary = agentTypeSummary(agents as any);
    expect(summary["Scientist"]).toBe(2);
    expect(summary["Worker"]).toBe(1);
  });

  it("computes capacity from leadership", () => {
    expect(computeCapacity(0)).toBe(0);
    expect(computeCapacity(3.9)).toBe(3);
    expect(computeCapacity(5)).toBe(5);
  });
});
