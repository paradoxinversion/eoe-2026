import { describe, it, expect } from "vitest";
import { agentTypeSummary } from "../../src/services/personnelService";

describe("agentTypeSummary", () => {
  it("counts agent types including Unknown", () => {
    const agents = [
      { agentType: "Scientist" },
      { agentType: "Worker" },
      { agentType: "Scientist" },
      {},
    ];
    const summary = agentTypeSummary(agents as any);
    expect(summary["Scientist"]).toBe(2);
    expect(summary["Worker"]).toBe(1);
    expect(summary["Unknown"]).toBe(1);
  });
});
