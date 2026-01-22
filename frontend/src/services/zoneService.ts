import type { Person as PersonModel } from "../models/person";
import type { Agent as AgentModel } from "../models/agent";
import { loadGameState } from "./persistence";
import type { ZoneLike, PersonLike, AgentLike } from "../types/game";

export type OccupantWithAgent = {
  person: PersonModel | PersonLike;
  agent?: AgentModel | AgentLike;
};

export function getOccupants(
  zoneId: string,
  state?: unknown,
): Array<PersonModel | PersonLike> {
  const sRec =
    state && typeof state === "object" && state !== null
      ? (state as Record<string, unknown>)
      : {};
  const people: PersonLike[] = Array.isArray(sRec.people)
    ? (sRec.people as PersonLike[])
    : [];
  const zones: ZoneLike[] = Array.isArray(sRec.zones)
    ? (sRec.zones as ZoneLike[])
    : [];

  // If zone has currentOccupants as ids, use that, else infer from homeZoneId
  const zone =
    zones.find((z) => z && String(z.id) === zoneId) || ({} as ZoneLike);
  // Support legacy `currentOccupants` formats: array, comma/space-separated string, or numbers
  let occupantIds: string[] = [];
  if (Array.isArray(zone.currentOccupants)) {
    occupantIds = (zone.currentOccupants as unknown[]).map((id) => String(id));
  } else if (typeof zone.currentOccupants === "string") {
    occupantIds = String(zone.currentOccupants)
      .split(/[\s,;]+/)
      .map((s2) => s2.trim())
      .filter(Boolean);
  } else if (typeof zone.currentOccupants === "number") {
    occupantIds = [String(zone.currentOccupants)];
  }

  if (occupantIds.length) {
    return people.filter((p) => p && occupantIds.includes(String(p.id)));
  }

  return people.filter(
    (p) => String(p.homeZoneId) === zoneId || String(p.zoneId) === zoneId,
  );
}

export function getOccupantsWithAgents(
  zoneId: string,
  state?: unknown,
): Array<OccupantWithAgent> {
  const sRec =
    state && typeof state === "object" && state !== null
      ? (state as Record<string, unknown>)
      : {};
  const agents: AgentLike[] = Array.isArray(sRec.agents)
    ? (sRec.agents as AgentLike[])
    : [];
  const occupants = getOccupants(zoneId, state);
  const out: OccupantWithAgent[] = occupants.map((p) => {
    const a = agents.find((ag) =>
      Boolean(
        ag &&
        p &&
        (ag.personId === (p as PersonLike).id ||
          ag.person_id === (p as PersonLike).id ||
          String(ag.id) === String((p as Record<string, unknown>).agentId)),
      ),
    );
    return {
      person: p as PersonModel | PersonLike,
      agent: a as AgentModel | AgentLike | undefined,
    };
  });
  return out;
}

export async function getOccupantsFromSavedGame(
  gameName: string,
  zoneId: string,
) {
  const state = await loadGameState(gameName);
  return getOccupantsWithAgents(zoneId, state as unknown);
}

export default {
  getOccupants,
  getOccupantsWithAgents,
  getOccupantsFromSavedGame,
};
