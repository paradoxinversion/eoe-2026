import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import OptionsPage from "./pages/OptionsPage";
import TitlePage from "./pages/TitlePage";
import CharacterGeneration from "./pages/CharacterGeneration";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [route, setRoute] = useState<string>(
    () => window.location.hash || "#/",
  );

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function renderRoute() {
    if (showOptions) return <OptionsPage />;
    switch (route) {
      case "#/character-generation":
        return <CharacterGeneration />;
      case "#/dashboard":
        return <Dashboard />;
      case "#/":
      default:
        return <TitlePage />;
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <h1>Empire of Evil — Dev Shell</h1>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setShowOptions(true)}>
          Open Options
        </Button>
        <Button variant="outlined" onClick={() => setShowOptions(false)}>
          Close Options
        </Button>
      </Box>
      {renderRoute()}
    </Box>
  );
}
