export interface PlayerConfig {
  playerName: string
  startingSeed: number
  autosaveIntervalSeconds: number
  gracePeriodDays: number
}

export const defaultConfig: PlayerConfig = {
  playerName: 'Player 1',
  startingSeed: 42,
  autosaveIntervalSeconds: 30,
  gracePeriodDays: 7
}

export type Config = PlayerConfig
