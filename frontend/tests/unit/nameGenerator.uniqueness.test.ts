import { describe, test, expect } from "vitest";
import NameGenerator from "../../src/services/nameGenerator";
import createRng from "../../src/lib/rng";

describe("NameGenerator uniqueness and format", () => {
  test("generates 1000 names with acceptable uniqueness and correct format", () => {
    const seed = 12345;
    const rng = createRng(seed);
    const ng = new NameGenerator({ rng });

    const total = 1000;
    const seen = new Set<string>();
    const firstNameRegex = /^[A-Z][a-z]+$/;
    const lastNameRegex = /^[A-Z][a-z]+(?:son|man|field|stone|wood)?$/;

    for (let i = 0; i < total; i++) {
      const { firstName, lastName } = ng.generate();
      // format checks
      expect(firstName).toMatch(firstNameRegex);
      expect(lastName).toMatch(lastNameRegex);

      seen.add(`${firstName} ${lastName}`);
    }

    const uniqueCount = seen.size;
    const uniqueness = uniqueCount / total;

    // Expect at least 95% unique full names in this sample per spec
    expect(uniqueness).toBeGreaterThanOrEqual(0.95);
  });

  test("deterministic for same seed", () => {
    const seed = 9999;
    const rng1 = createRng(seed);
    const rng2 = createRng(seed);
    const a = new NameGenerator({ rng: rng1 });
    const b = new NameGenerator({ rng: rng2 });

    for (let i = 0; i < 100; i++) {
      expect(a.generate()).toEqual(b.generate());
    }
  });
});
