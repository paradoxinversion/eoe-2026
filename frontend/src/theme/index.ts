import tokensByMode, { ThemeMode, ThemeTokens, darkTokens, lightTokens } from './tokens';

export { ThemeMode, ThemeTokens, darkTokens, lightTokens, tokensByMode };

export function getTokens(mode: ThemeMode): ThemeTokens {
  return tokensByMode[mode] ?? tokensByMode.dark;
}

export default getTokens;
