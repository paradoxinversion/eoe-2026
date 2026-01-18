import { describe, it, expect } from "vitest";
import { createScienceProject } from "../../src/models/scienceProject";
import generateWorld from "../../src/services/generation";
import {
    reserveForProject,
    canReserve,
    releaseReservation,
    accumulateScience,
} from "../../src/services/science";

describe("science service reservation", () => {
    it("reserves science up-front when available", () => {
        const world = generateWorld(999);
        world.player.resources.science = 50;
        const proj = createScienceProject("p1", "ReserveTest", 20, 3);

        expect(canReserve(world.player, proj)).toBe(true);
        const ok = reserveForProject(world.player, proj);
        expect(ok).toBe(true);
        expect(proj.reserved_science).toBeGreaterThanOrEqual(20);
        expect(world.player.resources.science).toBe(30);
    });

    it("does not reserve if insufficient science", () => {
        const world = generateWorld("low");
        world.player.resources.science = 5;
        const proj = createScienceProject("p2", "TooPoor", 10, 2);

        expect(canReserve(world.player, proj)).toBe(false);
        const ok = reserveForProject(world.player, proj);
        expect(ok).toBe(false);
        expect(proj.reserved_science || 0).toBe(0);
        expect(world.player.resources.science).toBe(5);
    });

    it("releases reservation if project not completed", () => {
        const world = generateWorld("rel");
        world.player.resources.science = 30;
        const proj = createScienceProject("p3", "RelTest", 15, 3);
        reserveForProject(world.player, proj);
        expect(world.player.resources.science).toBe(15);
        // cancel project
        proj.status = "cancelled";
        releaseReservation(world.player, proj);
        expect(world.player.resources.science).toBe(30);
    });

    it("does not return reserved science when project completed", () => {
        const world = generateWorld("comp");
        world.player.resources.science = 40;
        const proj = createScienceProject("p4", "CompTest", 20, 2);
        reserveForProject(world.player, proj);
        expect(world.player.resources.science).toBe(20);
        proj.status = "completed";
        releaseReservation(world.player, proj);
        // reserved science consumed on completion
        expect(world.player.resources.science).toBe(20);
    });

    it("accumulates science into player resources", () => {
        const world = generateWorld("acc");
        world.player.resources.science = 2;
        accumulateScience(world.player, 5);
        expect(world.player.resources.science).toBe(7);
    });
});
