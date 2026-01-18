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
        const name = `quick-new-${Date.now()}`;
        await saveConfig(name, defaultConfig);
        // minimal behavior: notify user that new game saved; app should navigate to game view
        // we keep this simple for now
        // eslint-disable-next-line no-alert
        alert(`New game created: ${name}`);
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
                onLoad={(name) => {
                    /* could navigate to game */
                }}
            />
        </Box>
    );
}
