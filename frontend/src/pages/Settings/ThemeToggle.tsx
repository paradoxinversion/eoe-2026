import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { saveThemeMode, loadThemeMode } from "../../services/persistence";

export default function ThemeToggle() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const m = await loadThemeMode();
        if (!mounted) return;
        if (m === "light" || m === "dark") setMode(m);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleToggle(
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) {
    setLoading(true);
    const newMode: "dark" | "light" = checked ? "dark" : "light";
    setMode(newMode);
    try {
      await saveThemeMode(newMode);
      try {
        window.dispatchEvent(
          new CustomEvent("preferences:changed", {
            detail: { theme: newMode },
          }),
        );
      } catch (_) {
        // ignore
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("failed to save theme", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Appearance</Typography>
      <FormControlLabel
        control={<Switch checked={mode === "dark"} onChange={handleToggle} />}
        label={`Theme: ${mode === "dark" ? "Dark" : "Light"}`}
        disabled={loading}
      />
    </Box>
  );
}
