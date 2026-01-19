import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { loadGameState, listGameStates } from "../../services/persistence";
import { advanceTurn } from "../../services/turn";

export default function Main({ openSettings }: { openSettings?: () => void }) {
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // try to read the most recent saved game
      const states = await listGameStates();
      const rec = states[0] ? await loadGameState(states[0].name) : null;
      if (rec && typeof rec === "object") {
        const r = rec as { playerName?: string };
        if (r.playerName) setPlayerName(r.playerName);
      }
    }
    void load();
  }, []);

  async function handleEndTurn() {
    await advanceTurn();
    // simple visual feedback for now (console in tests/environments without window.alert)
    // eslint-disable-next-line no-console
    console.log("Turn advanced");
  }

  return (
    <Box>
      <Typography variant="h4">Main</Typography>
      <Typography sx={{ mb: 2 }}>
        Player: {playerName || "(unknown)"}
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleEndTurn}
          aria-label="end-turn"
        >
          End Turn
        </Button>
        <Button
          variant="outlined"
          onClick={() => openSettings && openSettings()}
          aria-label="open-settings"
        >
          Settings
        </Button>
      </Box>
    </Box>
  );
}
