import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import generateWorld, { generateAndSaveWorld } from "../services/generation";
import { saveConfig, deleteConfig } from "../services/persistence";
import { defaultConfig } from "../config/schema";

export default function CharacterGeneration() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    try {
      // choose or derive a seed; use timestamp-based number for determinism
      const seed = Date.now();
      // generate and persist the debug artifact as game state
      const artifact = await generateAndSaveWorld(seed, undefined, name);

      const world = artifact; // existing code expects `world` variable

      // remove any autosave left behind by dev helpers
      try {
        await deleteConfig("game:autosave");
      } catch (e) {
        // ignore delete failures
      }

      // persist the generated world as a game state
      // saved via generateAndSaveWorld; ensure preferences saved

      // persist player preferences / starting seed so the app can recall it
      // merge with defaults to satisfy config shape
      await saveConfig("preferences", {
        ...defaultConfig,
        playerName: name,
        startingSeed: seed,
      });

      // navigate to dashboard using internal SPA navigation
      const { navigate } = await import("../lib/navigate");
      navigate("/dashboard");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 480 }}>
      <Typography variant="h5" gutterBottom>
        Character Generation
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        inputProps={{ "aria-label": "character-name" }}
        sx={{ mb: 2 }}
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleConfirm} disabled={loading}>
          Confirm
        </Button>
        <Button
          variant="outlined"
          onClick={async () => {
            const mod = await import("../lib/navigate");
            mod.navigate("/");
          }}
        >
          Cancel
        </Button>
      </Box>

      <Dialog open={loading} aria-labelledby="generating-dialog">
        <DialogTitle id="generating-dialog">Generating World</DialogTitle>
        <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress />
          <div>Preparing your world. This may take a few seconds...</div>
        </DialogContent>
        <DialogActions>
          <Button disabled>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
