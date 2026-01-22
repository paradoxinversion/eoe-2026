import createRng, { type RNG } from "../lib/rng";

/**
 * NameGenerator
 *
 * Produces deterministic first/last name pairs when constructed with a
 * deterministic RNG or when supplied a `seed`. Callers may pass either
 * `opts.seed` (a number or string) or `opts.rng` (an RNG instance). When the
 * same seed or RNG is used across runs the sequence of generated names will
 * be identical.
 *
 * Type guarantees:
 * - `generate()` returns a `NamePair` with `firstName` and `lastName` both
 *   strongly typed as `string`.
 * - The implementation avoids `any` and uses the `RNG` type from
 *   `src/lib/rng` for random operations.
 */

export type NamePair = { firstName: string; lastName: string };

export class NameGenerator {
  private rng: RNG;
  private syllables: string[];

  constructor(opts?: { seed?: string | number; rng?: RNG }) {
    if (opts?.rng) this.rng = opts.rng;
    else this.rng = createRng(opts?.seed ?? Date.now());

    this.syllables = [
      "al",
      "ben",
      "cor",
      "dan",
      "el",
      "fin",
      "gor",
      "hal",
      "in",
      "jen",
      "kel",
      "lor",
      "mar",
      "nel",
      "or",
      "per",
      "quil",
      "rin",
      "sel",
      "tor",
      "ul",
      "vin",
      "wen",
      "xor",
      "yor",
      "zen",
    ];
  }

  private cap(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  generateFirstName(): string {
    // combine 1 or 2 syllables
    const parts = this.rng.int(1, 2);
    let name = "";
    for (let i = 0; i < parts; i++) {
      name += this.rng.choice(this.syllables);
    }
    return this.cap(name);
  }

  generateLastName(): string {
    // combine 2 syllables and optional suffix
    const parts = 2;
    let name = "";
    for (let i = 0; i < parts; i++) {
      name += this.rng.choice(this.syllables);
    }
    // optional suffix
    if (this.rng.float() < 0.15) {
      const suffixes = ["son", "man", "field", "stone", "wood"];
      name += this.rng.choice(suffixes);
    }
    return this.cap(name);
  }

  generate(): NamePair {
    return {
      firstName: this.generateFirstName(),
      lastName: this.generateLastName(),
    };
  }
}

export default NameGenerator;
