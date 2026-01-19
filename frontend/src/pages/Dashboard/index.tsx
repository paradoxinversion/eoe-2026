import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Main from "./Main";

export default function Dashboard() {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ p: 2 }}>
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

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <Main />}
        {tab === 1 && <div>Intel (stub)</div>}
        {tab === 2 && <div>Personnel (stub)</div>}
        {tab === 3 && <div>Economy (stub)</div>}
        {tab === 4 && <div>Infirmary (stub)</div>}
        {tab === 5 && <div>Captives (stub)</div>}
        {tab === 6 && <div>Settings (stub)</div>}
      </Box>
    </Box>
  );
}
