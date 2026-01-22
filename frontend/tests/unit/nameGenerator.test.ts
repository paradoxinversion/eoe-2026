import { describe, it, expect } from "vitest";
import NameGenerator from "../../src/services/nameGenerator";
import createRng from "../../src/lib/rng";

const nameRegex = /^[A-Za-z][A-Za-z'\- ]{0,40}$/;

describe("NameGenerator", () => {
  it("generates names matching the sanity regex", () => {
    const rng = createRng("test-seed-1");
    const gen = new NameGenerator({ rng });
    for (let i = 0; i < 200; i++) {
      const { firstName, lastName } = gen.generate();
      expect(nameRegex.test(firstName)).toBe(true);
      expect(nameRegex.test(lastName)).toBe(true);
    }
  });

  it("generates 1k names with >=95% unique pairs and >=99% conforming to regex", () => {
    const rng = createRng("uniqueness-seed");
    const gen = new NameGenerator({ rng });
    const pairs: string[] = [];
    let conforming = 0;
    const N = 1000;
    for (let i = 0; i < N; i++) {
      const { firstName, lastName } = gen.generate();
      const pair = `${firstName} ${lastName}`;
      pairs.push(pair);
      if (nameRegex.test(firstName) && nameRegex.test(lastName)) conforming++;
    }
    const unique = new Set(pairs).size;
    const uniqueFrac = unique / N;
    const conformFrac = conforming / N;
    expect(uniqueFrac).toBeGreaterThanOrEqual(0.95);
    expect(conformFrac).toBeGreaterThanOrEqual(0.99);
  });
});
