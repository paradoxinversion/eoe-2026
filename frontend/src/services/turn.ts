import type { RNG } from "../lib/rng";
import {
  ScienceProject,
  progressProjectOneDay,
} from "../models/scienceProject";
import scienceService from "./science";
import type { PlayerEmpire } from "./generation";

export type Resources = {
  gold: number;
  science: number;
};

export type Agent = {
  id: string;
  name?: string;
  role: "worker" | "scientist" | "merchant";
  // productivity is a small modifier used in production calculations
  productivity?: number;
};

export type Event = {
  id: string;
  name: string;
  description?: string;
  apply: (resources: Resources) => Resources;
};

export type GameState = {
  day: number;
  resources: Resources;
  agents?: Agent[];
  log?: string[];
  // optional player object for richer state (used by science integration)
  player?: PlayerEmpire;
  // optional science projects tracked in game state
  projects?: ScienceProject[];
  // optional event override/probabilities
  eventConfig?: { raid?: number; blessing?: number; discovery?: number };
  eventProbabilities?: { raid?: number; blessing?: number; discovery?: number };
};

function processAgents(
  resources: Resources,
  agents: Agent[],
  rng: RNG,
): { resources: Resources; log: string[] } {
  const r = { ...resources };
  const logs: string[] = [];
  for (const a of agents) {
    const prod = a.productivity || 1;
    if (a.role === "worker") {
      const gain = Math.max(0, Math.floor(rng.float() * 3) + 1) * prod; // 1..3 * prod
      r.gold += gain;
      logs.push(`${a.name || a.id} (worker): +${gain} gold`);
    } else if (a.role === "scientist") {
      const gain = Math.max(0, Math.floor(rng.float() * 2)) * prod; // 0..1 * prod
      r.science += gain;
      logs.push(`${a.name || a.id} (scientist): +${gain} science`);
    } else if (a.role === "merchant") {
      const gain = Math.max(0, Math.floor(rng.float() * 4) + 1) * prod; // 1..4 * prod
      r.gold += gain;
      logs.push(`${a.name || a.id} (merchant): +${gain} gold`);
    }
  }
  return { resources: r, log: logs };
}

function rollEvent(
  rng: RNG,
  probs?: { raid?: number; blessing?: number; discovery?: number },
): Event | null {
  const p = {
    raid: 0.08,
    blessing: 0.08,
    discovery: 0.08,
    ...(probs || {}),
  };
  // ensure non-negative and clamp
  const raidP = Math.max(0, Math.min(1, p.raid || 0));
  const blessP = Math.max(0, Math.min(1, p.blessing || 0));
  const discP = Math.max(0, Math.min(1, p.discovery || 0));
  const roll = rng.float();
  if (roll < raidP) {
    return {
      id: "raid",
      name: "Raid",
      description: "A band of raiders steals some gold.",
      apply: (resources) => ({
        ...resources,
        gold: Math.max(0, resources.gold - (Math.floor(rng.float() * 11) + 5)),
      }),
    };
  }
  if (roll < raidP + blessP) {
    return {
      id: "blessing",
      name: "Blessing",
      description: "A fortunate event grants extra gold.",
      apply: (resources) => ({
        ...resources,
        gold: resources.gold + (Math.floor(rng.float() * 11) + 5),
      }),
    };
  }
  if (roll < raidP + blessP + discP) {
    return {
      id: "discovery",
      name: "Discovery",
      description: "A small scientific discovery increases science.",
      apply: (resources) => ({
        ...resources,
        science: resources.science + (Math.floor(rng.float() * 3) + 1),
      }),
    };
  }
  return null;
}

export function resolveTurn(state: GameState, rng: RNG): GameState {
  // process agents first
  const agents = state.agents || [];
  const { resources: afterAgents, log: agentLogs } = processAgents(
    state.resources,
    agents,
    rng,
  );

  // baseline per-turn passive gains
  const goldGain = Math.floor(rng.float() * 5) + 1; // 1..5
  const scienceGain = Math.floor(rng.float() * 3); // 0..2

  let resources: Resources = {
    gold: afterAgents.gold + goldGain,
    science: afterAgents.science + scienceGain,
  };

  const logs: string[] = [];
  logs.push(...agentLogs);
  logs.push(`Day ${state.day + 1}: +${goldGain} gold, +${scienceGain} science`);

  // roll for a random event using provided event probabilities in state
  const ev = rollEvent(rng, state.eventConfig || state.eventProbabilities);
  if (ev) {
    resources = ev.apply(resources);
    logs.push(`Event: ${ev.name} - ${ev.description || ""}`);
  }

  const next: GameState = {
    day: state.day + 1,
    resources,
    agents: agents.map((a) => ({ ...a })),
    log: (state.log || []).concat(logs),
  };

  // Integrate science projects lifecycle if present in state and a player object exists
  const player = state.player;
  const projects = state.projects as ScienceProject[] | undefined;
  if (player && projects && projects.length > 0) {
    for (const proj of projects) {
      // if queued, try to reserve required science up-front
      if (proj.status === "queued") {
        const ok = scienceService.reserveForProject(player, proj);
        if (ok) {
          next.log = (next.log || []).concat(
            `Reserved ${proj.required_science} science for project ${proj.name}`,
          );
          proj.status = "active";
        } else {
          next.log = (next.log || []).concat(
            `Insufficient science to reserve for project ${proj.name}`,
          );
        }
      }

      // if active, advance progress
      if (proj.status === "active") {
        const before = proj.progress_days;
        progressProjectOneDay(proj);
        const gained = proj.progress_days - before;
        next.log = (next.log || []).concat(
          `Project ${proj.name} progressed by ${gained} (total ${proj.progress_days}/${proj.base_duration_days})`,
        );
        if (proj.status === "completed") {
          // reserved science is consumed on completion
          proj.reserved_science = 0;
          next.log = (next.log || []).concat(`Project ${proj.name} completed`);
        }
      }

      // if cancelled, release reservation
      if (proj.status === "cancelled") {
        scienceService.releaseReservation(player, proj);
        next.log = (next.log || []).concat(
          `Project ${proj.name} cancelled; reserved science released`,
        );
      }
    }
    // attach updated projects and player back into next state
    next.projects = projects;
    next.player = player;
  }

  return next;
}

export function resolveTurns(
  state: GameState,
  rng: RNG,
  days: number,
): GameState {
  let s: GameState = {
    ...state,
    resources: { ...state.resources },
    agents: state.agents ? [...state.agents] : [],
    log: state.log ? [...state.log] : [],
  };
  for (let i = 0; i < days; i++) {
    s = resolveTurn(s, rng);
  }
  return s;
}

export default { resolveTurn, resolveTurns };
