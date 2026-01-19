import makeId from "../lib/id";
import { generateCodeName } from "./migration";
import type { Person } from "../models/person";
import type { Agent } from "../models/agent";

export function hirePerson(
  person: Person,
  role: string,
  opts?: Partial<Agent>,
): Agent {
  const id = makeId("agent");
  const codeName = (opts && (opts as any).codeName) || generateCodeName();
  const agent: Agent = {
    id,
    personId: person.id,
    codeName,
    role: (role as any) || "Recruit",
    affiliationId: (opts && (opts as any).affiliationId) || undefined,
    inventory: (opts && (opts as any).inventory) || [],
    health: (opts && (opts as any).health) ?? 100,
  } as Agent;
  return agent;
}

export default {
  hirePerson,
};
