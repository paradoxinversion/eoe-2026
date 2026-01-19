import type { Person as PersonModel } from "../models/person";
import type { Agent as AgentModel } from "../models/agent";
import { loadGameState } from "./persistence";

export type OccupantWithAgent = {
  person: PersonModel | Record<string, unknown>;
  agent?: AgentModel | Record<string, unknown>;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function getOccupants(
  zoneId: string,
  state?: unknown,
): Array<PersonModel | Record<string, unknown>> {
  const s = (state as Record<string, unknown>) || {};
  const people: unknown[] = Array.isArray(s.people)
    ? (s.people as unknown[])
    : [];
  const zones: unknown[] = Array.isArray(s.zones) ? (s.zones as unknown[]) : [];

  // If zone has currentOccupants as ids, use that, else infer from homeZoneId
  const zone =
    zones.find(
      (z) =>
        isObject(z) && String((z as Record<string, unknown>).id) === zoneId,
    ) || ({} as Record<string, unknown>);
  // Support legacy `currentOccupants` formats: array, comma/space-separated string, or numbers
  let occupantIds: string[] = [];
  if (Array.isArray((zone as Record<string, unknown>).currentOccupants)) {
    occupantIds = (
      (zone as Record<string, unknown>).currentOccupants as unknown[]
    ).map((id) => String(id));
  } else if (
    typeof (zone as Record<string, unknown>).currentOccupants === "string"
  ) {
    occupantIds = String((zone as Record<string, unknown>).currentOccupants)
      .split(/[\s,;]+/)
      .map((s2) => s2.trim())
      .filter(Boolean);
  } else if (
    typeof (zone as Record<string, unknown>).currentOccupants === "number"
  ) {
    occupantIds = [String((zone as Record<string, unknown>).currentOccupants)];
  }

  if (occupantIds.length) {
    return (people as unknown[]).filter(
      (p) =>
        isObject(p) &&
        occupantIds.includes(String((p as Record<string, unknown>).id)),
    );
  }

  return (people as unknown[]).filter(
    (p) =>
      isObject(p) &&
      (String((p as Record<string, unknown>).homeZoneId) === zoneId ||
        String((p as Record<string, unknown>).zoneId) === zoneId),
  );
}

export function getOccupantsWithAgents(
  zoneId: string,
  state?: unknown,
): Array<OccupantWithAgent> {
  const s = (state as Record<string, unknown>) || {};
  const agents: unknown[] = Array.isArray(s.agents)
    ? (s.agents as unknown[])
    : [];
  const occupants = getOccupants(zoneId, s);
  const out: OccupantWithAgent[] = (occupants as unknown[]).map((p) => {
    const a = (agents as unknown[]).find(
      (ag) =>
        isObject(ag) &&
        isObject(p) &&
        ((ag as Record<string, unknown>).personId ===
          (p as Record<string, unknown>).id ||
          (ag as Record<string, unknown>).person_id ===
            (p as Record<string, unknown>).id ||
          (ag as Record<string, unknown>).id ===
            (p as Record<string, unknown>).agentId),
    );
    return {
      person: p as PersonModel | Record<string, unknown>,
      agent: a as AgentModel | Record<string, unknown> | undefined,
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
