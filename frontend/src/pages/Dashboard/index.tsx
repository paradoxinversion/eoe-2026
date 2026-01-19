import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Main from "./Main";
import Settings from "./Settings";

export default function Dashboard() {
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    // diagnostic log to help detect mounting in browser environments
    // keep minimal and safe for tests
    // eslint-disable-next-line no-console
    console.log("Dashboard mounted");
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="dashboard-tabs"
        >
          <Tab label="Main" />
          <Tab label="Intel" />
          <Tab label="Personnel" />
          <Tab label="Economy" />
          <Tab label="Infirmary" />
          <Tab label="Captives" />
          <Tab label="Settings" />
        </Tabs>
        <Button
          variant="outlined"
          onClick={() => setTab(6)}
          aria-label="open-settings-header"
        >
          Settings
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <div data-testid="dashboard-mounted" style={{ display: "none" }}>
          mounted
        </div>
        {tab === 0 && <Main openSettings={() => setTab(6)} />}
        {tab === 1 && <div>Intel (stub)</div>}
        {tab === 2 && <div>Personnel (stub)</div>}
        {tab === 3 && <div>Economy (stub)</div>}
        {tab === 4 && <div>Infirmary (stub)</div>}
        {tab === 5 && <div>Captives (stub)</div>}
        {tab === 6 && <Settings />}
      </Box>
    </Box>
  );
}
