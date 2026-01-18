import { describe, it, expect } from "vitest";
import { createAgent, assignAgentToProject } from "../../src/models/agent";
import {
    createScienceProject,
    assignScientist,
    progressProjectOneDay,
} from "../../src/models/scienceProject";

describe("Agent and ScienceProject integration", () => {
    it("assignAgentToProject adds project id and sets agent active", () => {
        const ag = createAgent("a1", "Alice", 100);
        expect(ag.assigned_project_ids).toHaveLength(0);

        assignAgentToProject(ag, "p1");
        expect(ag.assigned_project_ids).toContain("p1");
        expect(ag.status).toBe("active");
    });

    it("assignScientist reserves scientist on project and activates project", () => {
        const proj = createScienceProject("p2", "Test", 10, 3);
        expect(proj.status).toBe("queued");
        expect(proj.assigned_scientists).toHaveLength(0);

        assignScientist(proj, "agent-x");
        expect(proj.assigned_scientists).toContain("agent-x");
        expect(proj.status).toBe("active");
    });

    it("progressProjectOneDay advances progress by number of assigned scientists", () => {
        const proj = createScienceProject("p3", "Progress Test", 5, 4);
        assignScientist(proj, "s1");
        assignScientist(proj, "s2");
        expect(proj.assigned_scientists.length).toBe(2);

        progressProjectOneDay(proj);
        expect(proj.progress_days).toBe(2);
        expect(proj.status).toBe("active");

        // progress to completion
        progressProjectOneDay(proj); // +2 -> 4
        expect(proj.progress_days).toBeGreaterThanOrEqual(
            proj.base_duration_days,
        );
        expect(proj.status).toBe("completed");
    });

    it("assignScientist is idempotent for same agent", () => {
        const proj = createScienceProject("p4", "Idempotent Test", 2, 2);
        assignScientist(proj, "s-a");
        assignScientist(proj, "s-a");
        expect(proj.assigned_scientists).toEqual(["s-a"]);
    });
});
