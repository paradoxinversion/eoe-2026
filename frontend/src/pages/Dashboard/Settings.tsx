import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../Settings/ThemeToggle";

export default function Settings() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <ThemeToggle />
    </Box>
  );
}
