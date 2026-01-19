import tokensByMode, { darkTokens, lightTokens } from "./tokens";

import type { ThemeMode, ThemeTokens } from "./tokens";

export type { ThemeMode, ThemeTokens };
export { darkTokens, lightTokens, tokensByMode };

export function getTokens(mode: ThemeMode): ThemeTokens {
  return tokensByMode[mode] ?? tokensByMode.dark;
}

export default getTokens;
