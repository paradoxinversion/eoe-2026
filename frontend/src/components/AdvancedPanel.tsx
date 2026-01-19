import React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from "@mui/icons-material/Close";

export interface AdvancedPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AdvancedPanel({ open, onClose }: AdvancedPanelProps) {
  const [seed, setSeed] = React.useState<string>("");
  const [debug, setDebug] = React.useState<boolean>(false);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{ width: 360, p: 2 }}
        role="dialog"
        aria-label="advanced-controls"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Advanced Controls</Typography>
          <IconButton aria-label="close-advanced" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Seed"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            size="small"
          />

          <FormControlLabel
            control={
              <Switch checked={debug} onChange={(_, v) => setDebug(v)} />
            }
            label="Enable debug"
          />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                // apply seed action placeholder
                // consumers may listen to custom events or integrate later
                try {
                  window.dispatchEvent(
                    new CustomEvent("advanced:apply", {
                      detail: { seed, debug },
                    }),
                  );
                } catch (_) {}
              }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSeed("");
                setDebug(false);
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
