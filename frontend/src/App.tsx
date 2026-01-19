import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { loadConfig } from "./services/persistence";
import { registerNavigator } from "./lib/navigate";
import OptionsPage from "./pages/OptionsPage";
import TitlePage from "./pages/TitlePage";
import CharacterGeneration from "./pages/CharacterGeneration";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [route, setRoute] = useState<string>(() => "/");
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // register internal navigator so pages can call `navigate()`
    registerNavigator((p: string) => {
      // allow callers to pass either '/dashboard' or '#/dashboard'
      const normalized = p.startsWith("#") ? p.slice(1) : p;
      setRoute(normalized || "/");
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prefs = await loadConfig("preferences");
        if (!mounted) return;
        if (prefs && typeof prefs === "object") {
          const p = prefs as { theme?: string };
          if (p.theme === "light") setMode("light");
          else setMode("dark");
        }
      } catch (e) {
        // ignore
      }
    })();

    const onPrefs = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { theme?: string };
        if (detail && detail.theme)
          setMode(detail.theme === "light" ? "light" : "dark");
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener("preferences:changed", onPrefs as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener(
        "preferences:changed",
        onPrefs as EventListener,
      );
    };
  }, []);

  function renderRoute() {
    if (showOptions) return <OptionsPage />;
    // route values are normalized as '/path'
    switch (route) {
      case "/character-generation":
        return <CharacterGeneration />;
      case "/dashboard":
        return <Dashboard />;
      case "/":
      default:
        return <TitlePage />;
    }
  }

  return (
    <ThemeProvider theme={createTheme({ palette: { mode } })}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <h1 style={{ margin: 0 }}>Empire of Evil — Dev Shell</h1>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="text" onClick={() => setRoute("/")}>
              Home
            </Button>
            <Button
              variant="text"
              onClick={() => setRoute("/character-generation")}
            >
              New Game
            </Button>
            <Button variant="text" onClick={() => setRoute("/dashboard")}>
              Dashboard
            </Button>
            <Button
              variant="text"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("preferences:changed", { detail: {} }),
                )
              }
            >
              Settings
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button variant="contained" onClick={() => setShowOptions(true)}>
            Open Options
          </Button>
          <Button variant="outlined" onClick={() => setShowOptions(false)}>
            Close Options
          </Button>
        </Box>
        {renderRoute()}
      </Box>
    </ThemeProvider>
  );
}
