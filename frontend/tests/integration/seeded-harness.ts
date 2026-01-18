import createRng from "../../src/lib/rng";
import { resolveTurns, GameState } from "../../src/services/turn";

export type ScenarioOptions = {
  seed: number | string;
  days?: number;
  initial?: Partial<GameState>;
};

export function runSeededScenario(opts: ScenarioOptions) {
  const days = opts.days ?? 10;
  const rng = createRng(opts.seed);
  const initial: GameState = {
    day: opts.initial?.day ?? 0,
    resources: opts.initial?.resources ?? { gold: 0, science: 0 },
    agents: opts.initial?.agents ?? [],
    log: opts.initial?.log ?? [],
  };

  const result = resolveTurns(initial, rng, days);
  return {
    seed: opts.seed,
    days,
    result,
  };
}

export function runManySeeds(seeds: Array<number | string>, days = 10) {
  return seeds.map((s) => runSeededScenario({ seed: s, days }));
}

export default { runSeededScenario, runManySeeds };
