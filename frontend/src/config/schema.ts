export interface PlayerConfig {
  playerName: string;
  startingSeed: number;
  autosaveIntervalSeconds: number;
  gracePeriodDays: number;
  eventProbabilities?: {
    raid?: number;
    blessing?: number;
    discovery?: number;
  };
  organizationCount?: number;
  mapWidth?: number;
  mapHeight?: number;
  zoneSizeMin?: number;
  zoneSizeMax?: number;
}

export const defaultConfig: PlayerConfig = {
  playerName: "Player 1",
  startingSeed: 42,
  autosaveIntervalSeconds: 30,
  gracePeriodDays: 7,
  eventProbabilities: {
    raid: 0.08,
    blessing: 0.08,
    discovery: 0.08,
  },
  organizationCount: 5,
  mapWidth: 10,
  mapHeight: 10,
  zoneSizeMin: 1,
  zoneSizeMax: 5,
};

export type Config = PlayerConfig;
