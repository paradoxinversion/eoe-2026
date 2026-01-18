import { PlayerEmpire } from "./generation";
import { ScienceProject } from "../models/scienceProject";

export function canReserve(
    player: PlayerEmpire,
    project: ScienceProject,
): boolean {
    const already = project.reserved_science || 0;
    const needed = Math.max(0, project.required_science - already);
    return player.resources.science >= needed;
}

export function reserveForProject(
    player: PlayerEmpire,
    project: ScienceProject,
): boolean {
    if (
        project.reserved_science &&
        project.reserved_science >= project.required_science
    )
        return true;
    const needed = Math.max(
        0,
        project.required_science - (project.reserved_science || 0),
    );
    if (player.resources.science < needed) return false;
    // deduct up-front and mark reserved
    player.resources.science -= needed;
    project.reserved_science = (project.reserved_science || 0) + needed;
    return true;
}

export function releaseReservation(
    player: PlayerEmpire,
    project: ScienceProject,
): void {
    const reserved = project.reserved_science || 0;
    if (reserved <= 0) return;
    // only return reserved science if project is not completed
    if (project.status !== "completed") {
        player.resources.science += reserved;
    }
    project.reserved_science = 0;
}

export function accumulateScience(player: PlayerEmpire, amount: number): void {
    player.resources.science = Math.max(
        0,
        player.resources.science + Math.floor(amount),
    );
}

export default {
    canReserve,
    reserveForProject,
    releaseReservation,
    accumulateScience,
};
