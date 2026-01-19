export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    scale: number[];
  };
}

export const darkTokens: ThemeTokens = {
  mode: 'dark',
  colors: {
    background: '#0f1115',
    surface: '#121418',n+    primary: '#7dd3fc',
    accent: '#60a5fa',
    text: '#e6eef8',
    muted: '#9aa6b2',
    error: '#ff7b7b',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    scale: [12, 14, 16, 20, 24, 32],
  },
};

export const lightTokens: ThemeTokens = {
  mode: 'light',
  colors: {
    background: '#f7f9fb',
    surface: '#ffffff',
    primary: '#0369a1',
    accent: '#075985',
    text: '#0f1724',
    muted: '#6b7280',
    error: '#b91c1c',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  typography: {
    scale: [12, 14, 16, 20, 24, 32],
  },
};

export const tokensByMode: Record<ThemeMode, ThemeTokens> = {
  dark: darkTokens,
  light: lightTokens,
};

export default tokensByMode;
