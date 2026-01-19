import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Player Name</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body1">Day 1 · Turn 1</Typography>
          <Button variant="contained">End Turn</Button>
        </Box>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
      >
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="h6">Metric 1</Typography>
          <Typography variant="h5">42</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="h6">Metric 2</Typography>
          <Typography variant="h5">7</Typography>
        </Box>
        <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
          <Typography variant="h6">Metric 3</Typography>
          <Typography variant="h5">100</Typography>
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
