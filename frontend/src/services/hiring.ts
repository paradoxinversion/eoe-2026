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
  const codeName = opts?.codeName ?? generateCodeName();
  const agent: Agent = {
    id,
    personId: person.id,
    codeName,
    role: (role as Agent["role"]) || "Recruit",
    affiliationId: opts?.affiliationId,
    inventory: opts?.inventory ?? [],
    health: opts?.health ?? 100,
  } as Agent;
  return agent;
}

export default {
  hirePerson,
};
