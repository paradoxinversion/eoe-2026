import { describe, it, expect } from "vitest";
import { hirePerson } from "../../src/services/hiring";
import type { Person } from "../../src/models/person";

describe("hirePerson", () => {
  it("creates an Agent referencing the Person with defaults", () => {
    const person: Person = {
      id: "person-abc123",
      firstName: "Ada",
      lastName: "Lovelace",
      intelligenceLevel: 90,
      governingOrganizationSentiments: {},
      attributes: {
        health: 100,
        intelligence: 90,
        strength: 10,
        agility: 10,
        endurance: 10,
        empathy: 20,
        charisma: 30,
      },
      skills: {
        fighting: 0,
        medicine: 0,
        business: 0,
        finance: 0,
        publicPlanning: 0,
        science: 10,
      },
    } as unknown as Person;

    const agent = hirePerson(person, "Scientist");
    expect(agent.personId).toBe(person.id);
    expect(agent.role).toBe("Scientist");
    expect(agent.codeName).toBeTruthy();
    expect(agent.health).toBeGreaterThan(0);
  });
});
