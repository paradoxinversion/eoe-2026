import React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getTokens, { ThemeMode } from "./index";

export interface AppThemeProviderProps {
  mode: ThemeMode;
  children: React.ReactNode;
}

export default function AppThemeProvider({
  mode,
  children,
}: AppThemeProviderProps) {
  const tokens = getTokens(mode);

  const theme = createTheme({
    palette: {
      mode: tokens.mode,
      background: {
        default: tokens.colors.background,
        paper: tokens.colors.surface,
      },
      primary: {
        main: tokens.colors.primary,
      },
      text: {
        primary: tokens.colors.text,
        disabled: tokens.colors.muted,
      },
    },
    typography: {
      fontSize: tokens.typography.scale[2],
    },
    spacing: tokens.spacing.md,
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
