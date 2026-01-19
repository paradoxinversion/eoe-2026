import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { loadGameState, listGameStates } from "../../services/persistence";
import { advanceTurn } from "../../services/turn";

export default function Main() {
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // try to read the most recent saved game
      const states = await listGameStates();
      const rec = states[0] ? await loadGameState(states[0].name) : null;
      if (rec && (rec as any).playerName)
        setPlayerName((rec as any).playerName);
    }
    void load();
  }, []);

  async function handleEndTurn() {
    await advanceTurn();
    // simple visual feedback via alert for now
    // eslint-disable-next-line no-alert
    alert("Turn advanced");
  }

  return (
    <Box>
      <Typography variant="h4">Main</Typography>
      <Typography sx={{ mb: 2 }}>
        Player: {playerName || "(unknown)"}
      </Typography>
      <Button variant="contained" onClick={handleEndTurn} aria-label="end-turn">
        End Turn
      </Button>
    </Box>
  );
}
