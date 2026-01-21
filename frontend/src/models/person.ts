export type UUID = string;

export interface PersonAttributes {
  health: number;
  intelligence: number;
  leadership: number;
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

export function createPerson(
  id: string,
  firstName: string,
  lastName: string,
  opts?: Partial<
    Pick<
      Person,
      | "attributes"
      | "homeZoneId"
      | "governingOrganizationSentiments"
      | "intelligenceLevel"
      | "occupation"
      | "skills"
    >
  >,
): Person {
  return {
    id,
    firstName,
    lastName,
    homeZoneId: opts?.homeZoneId,
    governingOrganizationSentiments:
      opts?.governingOrganizationSentiments ?? {},
    intelligenceLevel:
      typeof opts?.intelligenceLevel === "number"
        ? opts!.intelligenceLevel!
        : 50,
    occupation: opts?.occupation,
    attributes: (opts?.attributes as PersonAttributes) ?? defaultAttributes,
    skills: (opts?.skills as PersonSkills) ?? defaultSkills,
  };
}

const defaultAttributes: PersonAttributes = {
  health: 50,
  intelligence: 50,
  leadership: 50,
  strength: 50,
  agility: 50,
  endurance: 50,
  empathy: 50,
  charisma: 50,
};

const defaultSkills: PersonSkills = {
  fighting: 0,
  medicine: 0,
  business: 0,
  finance: 0,
  publicPlanning: 0,
  science: 0,
};

export default Person;
