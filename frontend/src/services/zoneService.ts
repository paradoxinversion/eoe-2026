import type { Person as PersonModel } from "../models/person";
import type { Agent as AgentModel } from "../models/agent";
import { loadGameState } from "./persistence";

export type OccupantWithAgent = {
  person: PersonModel | any;
  agent?: AgentModel | any;
};

export function getOccupants(zoneId: string, state?: any): Array<any> {
  const s = state || {};
  const people: any[] = s.people || [];
  const zones: any[] = s.zones || [];

  // If zone has currentOccupants as ids, use that, else infer from homeZoneId
  const zone = zones.find((z: any) => z.id === zoneId) || {};
  const occupantIds: string[] = Array.isArray(zone.currentOccupants)
    ? zone.currentOccupants
    : [];

  if (occupantIds.length) {
    return people.filter((p) => occupantIds.includes(p.id));
  }

  return people.filter((p) => p.homeZoneId === zoneId || p.zoneId === zoneId);
}

export function getOccupantsWithAgents(
  zoneId: string,
  state?: any,
): Array<OccupantWithAgent> {
  const s = state || {};
  const agents: any[] = s.agents || [];
  const occupants = getOccupants(zoneId, s);
  const out: OccupantWithAgent[] = occupants.map((p: any) => {
    const a = agents.find(
      (ag) =>
        ag.personId === p.id || ag.person_id === p.id || ag.id === p.agentId,
    );
    return { person: p, agent: a };
  });
  return out;
}

export async function getOccupantsFromSavedGame(
  gameName: string,
  zoneId: string,
) {
  const state = await loadGameState(gameName);
  return getOccupantsWithAgents(zoneId, state as any);
}

export default {
  getOccupants,
  getOccupantsWithAgents,
  getOccupantsFromSavedGame,
};
