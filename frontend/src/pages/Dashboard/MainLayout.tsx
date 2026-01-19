import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { GameState } from "../../services/turn";

export interface MainLayoutProps {
  playerName?: string;
  day?: number;
  resources?: { gold: number; science: number };
  startingSeed?: number;
  onEndTurn?: () => Promise<void> | void;
}

export default function MainLayout({
  playerName = "Player",
  day = 0,
  resources = { gold: 0, science: 0 },
  startingSeed,
  onEndTurn,
}: MainLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{playerName}</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body1">Day {day}</Typography>
          <Button
            variant="contained"
            onClick={() => {
              if (onEndTurn) void onEndTurn();
            }}
            aria-label="end-turn"
          >
            End Turn
          </Button>
        </Box>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
      >
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="subtitle2">Gold</Typography>
          <Typography variant="h5">{resources.gold}</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="subtitle2">Science</Typography>
          <Typography variant="h5">{resources.science}</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="subtitle2">Seed</Typography>
          <Typography variant="h5">{startingSeed ?? "—"}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Quick actions and summaries will appear here.
        </Typography>
      </Box>
    </Box>
  );
}
