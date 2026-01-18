import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import OptionsPage from "./pages/OptionsPage";

export default function App() {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <Box sx={{ p: 2 }}>
            <h1>Empire of Evil — Dev Shell</h1>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => setShowOptions(true)}
                >
                    Open Options
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => setShowOptions(false)}
                >
                    Close Options
                </Button>
            </Box>
            {showOptions ? (
                <OptionsPage />
            ) : (
                <p>Title Page, Options, and Game will be added here.</p>
            )}
        </Box>
    );
}
