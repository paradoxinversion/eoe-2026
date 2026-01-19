import { describe, it, expect } from "vitest";
import type { Person } from "../../src/models/person";
import type { Agent } from "../../src/models/agent";
import { hirePerson } from "../../src/services/hiring";

describe("Person/Agent models", () => {
  it("serializes and deserializes Person and Agent shapes", () => {
    const person: Person = {
      id: "person-xyz",
      firstName: "Test",
      lastName: "User",
      intelligenceLevel: 50,
      governingOrganizationSentiments: {},
      attributes: {
        health: 100,
        intelligence: 50,
        strength: 10,
        agility: 10,
        endurance: 10,
        empathy: 10,
        charisma: 10,
      },
      skills: {
        fighting: 0,
        medicine: 0,
        business: 0,
        finance: 0,
        publicPlanning: 0,
        science: 0,
      },
    } as unknown as Person;

    const agent: Agent = hirePerson(person, "Recruit");

    const pJson = JSON.parse(JSON.stringify(person));
    const aJson = JSON.parse(JSON.stringify(agent));

    expect(pJson.id).toBe(person.id);
    expect(aJson.personId).toBe(person.id);
  });
});
