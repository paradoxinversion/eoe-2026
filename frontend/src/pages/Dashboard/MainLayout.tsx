import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MetricCard from "./MetricCard";
import AdvancedPanel from "../../components/AdvancedPanel";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";

export interface MainLayoutProps {
  playerName?: string;
  day?: number;
  resources?: { gold: number; science: number };
  startingSeed?: number;
  onEndTurn?: () => Promise<void> | void;
  metrics?: Array<{ title: string; value: string | number; subtitle?: string }>;
}

export default function MainLayout({
  playerName = "Player",
  day = 0,
  resources = { gold: 0, science: 0 },
  startingSeed,
  onEndTurn,
  metrics = [],
}: MainLayoutProps) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  return (
    <>
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
            <IconButton
              aria-label="open-advanced"
              title="Advanced"
              onClick={() => setAdvancedOpen(true)}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
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

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {metrics.length > 0 ? (
            metrics.map((m, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <MetricCard
                  title={m.title}
                  value={m.value}
                  subtitle={m.subtitle}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2">No metrics available</Typography>
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
            <Typography variant="subtitle2" component="div">
              Gold
            </Typography>
            <Typography variant="h5">{resources.gold}</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
            <Typography variant="subtitle2" component="div">
              Science
            </Typography>
            <Typography variant="h5">{resources.science}</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}>
            <Typography variant="subtitle2" component="div">
              Seed
            </Typography>
            <Typography variant="h5">{startingSeed ?? "—"}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Quick actions and summaries will appear here.
          </Typography>
        </Box>
      </Box>
      <AdvancedPanel
        open={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
      />
    </>
  );
}
