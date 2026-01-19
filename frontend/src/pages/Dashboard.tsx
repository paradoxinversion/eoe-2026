import React from "react";
import Box from "@mui/material/Box";
// unused imports removed
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Main from "./Dashboard/Main";
import Settings from "./Dashboard/Settings";
// persistence helpers not needed in this view

export default function Dashboard() {
  const [tab, setTab] = React.useState(0);

  // savedGames/day not required in this view; removed to satisfy lint

  React.useEffect(() => {
    // diagnostic log to help detect mounting in browser environments
    // keep minimal and safe for tests
    // eslint-disable-next-line no-console
    console.log("Dashboard mounted");
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Left sidebar navigation */}
        <Box
          component="nav"
          sx={{
            width: 220,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            pr: 2,
            bgcolor: "background.paper",
            p: 1,
            minHeight: "60vh",
            boxShadow: 1,
          }}
          aria-label="dashboard-sidebar"
        >
          <List>
            {[
              "Main",
              "Intel",
              "Personnel",
              "Economy",
              "Infirmary",
              "Captives",
              "Settings",
            ].map((label, idx) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  selected={tab === idx}
                  onClick={() => setTab(idx)}
                  aria-label={`dashboard-nav-${label.toLowerCase()}`}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main content area */}
        <Box sx={{ flex: 1 }}>
          <div data-testid="dashboard-mounted" style={{ display: "none" }}>
            mounted
          </div>
          {tab === 0 && (
            <Box>
              <Main openSettings={() => setTab(6)} />
            </Box>
          )}
          {tab === 1 && <div>Intel (stub)</div>}
          {tab === 2 && <div>Personnel (stub)</div>}
          {tab === 3 && <div>Economy (stub)</div>}
          {tab === 4 && <div>Infirmary (stub)</div>}
          {tab === 5 && <div>Captives (stub)</div>}
          {tab === 6 && <Settings />}
        </Box>
      </Box>
    </Box>
  );
}
