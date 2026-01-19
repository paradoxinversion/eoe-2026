import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { saveConfig, loadConfig } from "../../services/persistence";
import { defaultConfig } from "../../config/schema";

export default function Settings() {
  const [theme, setTheme] = useState<string>(defaultConfig ? "dark" : "dark");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prefs = await loadConfig("preferences");
        if (!mounted) return;
        if (prefs && typeof prefs === "object") {
          const p = prefs as { theme?: string };
          if (p.theme) setTheme(p.theme);
        }
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
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    try {
      // merge with defaults to ensure required fields
      await saveConfig("preferences", {
        ...defaultConfig,
        theme: newTheme,
      });
      // notify app of preference change so global theme updates
      try {
        window.dispatchEvent(
          new CustomEvent("preferences:changed", {
            detail: { theme: newTheme },
          }),
        );
      } catch (err) {
        // ignore dispatch errors in older test environments
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("failed to save theme", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <FormControlLabel
        control={<Switch checked={theme === "dark"} onChange={handleToggle} />}
        label={`Theme: ${theme === "dark" ? "Dark" : "Light"}`}
        disabled={loading}
      />
    </Box>
  );
}
