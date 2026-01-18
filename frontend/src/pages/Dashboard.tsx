import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { defaultConfig } from "../config/schema";
import createRng from "../lib/rng";
import { resolveTurn, GameState } from "../services/turn";
import EndDayButton from "../components/EndDayButton";

export default function Dashboard() {
    const cfg = defaultConfig;
    const [rng] = useState(() => createRng(cfg.startingSeed));

    const [state, setState] = useState<GameState>({
        day: 0,
        resources: { gold: 0, science: 0 },
        agents: [],
        log: [],
    });

    function handleEndDay() {
        const next = resolveTurn(state, rng);
        setState(next);
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Paper sx={{ p: 2, minWidth: 160 }}>
                    <Typography variant="subtitle2">Day</Typography>
                    <Typography variant="h6">{state.day}</Typography>
                </Paper>
                <Paper sx={{ p: 2, minWidth: 160 }}>
                    <Typography variant="subtitle2">Gold</Typography>
                    <Typography variant="h6">{state.resources.gold}</Typography>
                </Paper>
                <Paper sx={{ p: 2, minWidth: 160 }}>
                    <Typography variant="subtitle2">Science</Typography>
                    <Typography variant="h6">
                        {state.resources.science}
                    </Typography>
                </Paper>
            </Box>

            <EndDayButton onEndDay={handleEndDay} />

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">Log</Typography>
                <Paper sx={{ p: 2, maxHeight: 240, overflow: "auto" }}>
                    {state.log && state.log.length ? (
                        state.log.map((l, i) => (
                            <Typography key={i} variant="body2">
                                {l}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2">No events yet.</Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}
