export type UUID = string;

export interface PersonAttributes {
  health: number;
  intelligence: number;
  strength: number;
  agility: number;
  endurance: number;
  empathy: number;
  charisma: number;
}

export interface PersonSkills {
  fighting: number;
  medicine: number;
  business: number;
  finance: number;
  publicPlanning: number;
  science: number;
}

export interface Person {
  id: UUID;
  firstName: string;
  lastName: string;
  homeZoneId?: UUID;
  governingOrganizationSentiments: {
    [governingOrganizationId: string]: number;
  };
  intelligenceLevel: number;
  occupation?: string;
  attributes: PersonAttributes;
  skills: PersonSkills;
}

export type Person = {
  id: string;
  name: string;
  role?: string;
  pay: number;
  attributes?: Record<string, unknown>;
};

export function createPerson(
  id: string,
  name: string,
  pay = 0,
  opts?: Partial<Pick<Person, "role" | "attributes">>,
): Person {
  return {
    id,
    name,
    pay: Math.max(0, Math.floor(pay)),
    role: opts?.role,
    attributes: opts?.attributes ?? {},
  };
}

export default Person;
