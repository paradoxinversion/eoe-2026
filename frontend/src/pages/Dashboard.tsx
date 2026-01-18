import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { defaultConfig } from "../config/schema";
import createRng from "../lib/rng";
import { resolveTurn, GameState } from "../services/turn";
import EndDayButton from "../components/EndDayButton";
import { createAgent, assignAgentToProject, Agent } from "../models/agent";
import {
  createScienceProject,
  assignScientist,
  ScienceProject,
} from "../models/scienceProject";
import {
  saveGameState,
  loadGameState,
  listGameStates,
} from "../services/persistence";
import { deleteConfig } from "../services/persistence";

export default function Dashboard() {
  const cfg = defaultConfig;
  const [rng] = useState(() => createRng(cfg.startingSeed));

  const [state, setState] = useState<GameState>({
    day: 0,
    resources: { gold: 0, science: 0 },
    agents: [],
    projects: [],
    log: [],
  });
  const [saveName, setSaveName] = useState("autosave");
  const [savedGames, setSavedGames] = useState<
    Array<{ name: string; updatedAt: number }>
  >([]);

  function handleEndDay() {
    const next = resolveTurn(state, rng);
    setState(next);
  }

  function handleHireScientist() {
    const id = `ag-${Date.now()}`;
    const ag = createAgent(id, `Scientist ${id.slice(-4)}`, 50, {
      role: "scientist",
    });
    setState((s) => {
      const next = { ...s, agents: [...(s.agents || []), ag] };
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  function handleAddProject() {
    const id = `pr-${Date.now()}`;
    const p = createScienceProject(id, `Project ${id.slice(-4)}`, 10, 3);
    setState((s) => {
      const next = { ...s, projects: [...(s.projects || []), p] };
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  function handleAssign(agentId: string, projectId: string) {
    setState((s) => {
      const agents = (s.agents || []).map((a) =>
        a.id === agentId ? assignAgentToProject({ ...a }, projectId) : a,
      );
      const projects = (s.projects || []).map((p) => {
        if (p.id !== projectId) return p;
        const copy = { ...p } as ScienceProject;
        assignScientist(copy, agentId);
        return copy;
      });
      const next = { ...s, agents, projects };
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  // Load autosave on mount
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = await loadGameState("autosave");
      if (!mounted || !loaded) return;
      try {
        const g = loaded as Partial<GameState>;
        setState((s) => ({ ...s, ...(g || {}) }) as GameState);
      } catch (e) {
        // ignore malformed autosave
      }
    })();
    (async () => {
      const list = await listGameStates();
      if (mounted) setSavedGames(list);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function refreshSavedGames() {
    const list = await listGameStates();
    setSavedGames(list);
  }

  async function handleManualSave() {
    const name = saveName || `save-${Date.now()}`;
    await saveGameState(name, state);
    await refreshSavedGames();
  }

  async function handleLoadSaved(name: string) {
    const loaded = await loadGameState(name);
    if (!loaded) return;
    try {
      const g = loaded as Partial<GameState>;
      setState((s) => ({ ...s, ...(g || {}) }) as GameState);
    } catch (e) {
      // log and ignore malformed save
      // eslint-disable-next-line no-console
      console.warn("failed to apply saved game", e);
    }
  }

  async function handleDeleteSaved(name: string) {
    await deleteConfig(`game:${name}`);
    await refreshSavedGames();
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
          <Typography variant="h6">{state.resources.science}</Typography>
        </Paper>
      </Box>

      <EndDayButton onEndDay={handleEndDay} />

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleHireScientist}>
          Hire Scientist
        </Button>
        <Button variant="outlined" onClick={handleAddProject}>
          Add Project
        </Button>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          size="small"
          label="Save name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
        />
        <Button variant="contained" onClick={handleManualSave}>
          Save
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Saved Games</Typography>
        <List>
          {savedGames.map((g) => (
            <ListItem
              key={g.name}
              secondaryAction={
                <div>
                  <Button size="small" onClick={() => handleLoadSaved(g.name)}>
                    Load
                  </Button>
                  <IconButton
                    onClick={() => handleDeleteSaved(g.name)}
                    aria-label={`delete-${g.name}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemText
                primary={g.name}
                secondary={new Date(g.updatedAt).toLocaleString()}
              />
            </ListItem>
          ))}
          {savedGames.length === 0 && (
            <ListItem>
              <ListItemText primary="No saved games" />
            </ListItem>
          )}
        </List>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Paper sx={{ p: 2, minWidth: 240 }}>
          <Typography variant="subtitle1">Agents</Typography>
          {state.agents && state.agents.length ? (
            state.agents.map((a: Agent) => (
              <Box
                key={a.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Typography variant="body2">
                  {a.name} ({a.role})
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No agents hired.</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 2, minWidth: 360 }}>
          <Typography variant="subtitle1">Projects</Typography>
          {state.projects && state.projects.length ? (
            state.projects.map((p: ScienceProject) => (
              <Box
                key={p.id}
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {p.name} — {p.status}
                  </Typography>
                  <Typography variant="caption">
                    Progress: {p.progress_days}/{p.base_duration_days} —
                    Reserved: {p.reserved_science || 0}
                  </Typography>
                </Box>
                <Box>
                  {(state.agents || []).map((a: Agent) => (
                    <Button
                      key={a.id}
                      size="small"
                      onClick={() => handleAssign(a.id, p.id)}
                      sx={{ ml: 0.5 }}
                    >
                      Assign {a.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No projects.</Typography>
          )}
        </Paper>
      </Box>

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
