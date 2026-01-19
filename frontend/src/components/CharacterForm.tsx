import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

type Props = {
  name: string;
  onChange: (v: string) => void;
};

export default function CharacterForm({ name, onChange }: Props) {
  return (
    <Box>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        required
        inputProps={{ "aria-label": "character-name" }}
      />
    </Box>
  );
}
