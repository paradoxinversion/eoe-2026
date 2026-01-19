import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LoadModal from "../components/LoadModal";
import { saveConfig } from "../services/persistence";
import { defaultConfig } from "../config/schema";

export default function TitlePage() {
  const [openLoad, setOpenLoad] = useState(false);

  async function handleNewGame() {
    // Navigate to the character generation flow (will handle creation)
    window.location.hash = "#/character-generation";
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Empire of Evil
      </Typography>
      <Stack spacing={2} sx={{ maxWidth: 320 }}>
        <Button variant="contained" onClick={handleNewGame}>
          New Game
        </Button>
        <Button variant="outlined" onClick={() => setOpenLoad(true)}>
          Load Game
        </Button>
        <Button
          variant="text"
          onClick={() => (window.location.hash = "#/options")}
        >
          Options
        </Button>
      </Stack>

      <LoadModal
        open={openLoad}
        onClose={() => setOpenLoad(false)}
        onLoad={() => {
          /* could navigate to game */
        }}
      />
    </Box>
  );
}
