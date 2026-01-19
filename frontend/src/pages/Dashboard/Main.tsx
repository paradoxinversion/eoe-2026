import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { defaultConfig } from "../../config/schema";
import createRng from "../../lib/rng";
import { resolveTurn, GameState } from "../../services/turn";
import EndDayButton from "../../components/EndDayButton";
import { createAgent, assignAgentToProject, Agent } from "../../models/agent";
import {
  createScienceProject,
  assignScientist,
  ScienceProject,
} from "../../models/scienceProject";
import {
  saveGameState,
  loadGameState,
  listGameStates,
  deleteConfig,
} from "../../services/persistence";

export default function Main({ openSettings }: { openSettings?: () => void }) {
  const cfg = defaultConfig;
  const [startingSeed, setStartingSeed] = useState<number>(cfg.startingSeed);
  const [state, setState] = useState<GameState>({
    day: 0,
    resources: { gold: 0, science: 0 },
    agents: [],
    projects: [],
    log: [],
  });
  const [savedGames, setSavedGames] = useState<
    Array<{ name: string; updatedAt: number }>
  >([]);
  const [saveName, setSaveName] = useState<string>("");

  const rng = React.useMemo(() => createRng(startingSeed), [startingSeed]);

  useEffect(() => {
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
      if (mounted) setSavedGames(list || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("../../services/persistence");
        const prefs = await mod.loadConfig("preferences");
        if (!mounted || !prefs) return;
        try {
          if (typeof prefs === "object") {
            const p = prefs as { startingSeed?: number; playerName?: string };
            if (typeof p.startingSeed === "number")
              setStartingSeed(p.startingSeed);
            if (p.playerName && (!state || !state.player)) {
              // no-op: playerName handled elsewhere
            }
          }
        } catch (e) {
          // ignore
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleEndDay() {
    const next = resolveTurn(state, rng);
    setState(next);
    await saveGameState("autosave", next);
  }

  function handleHireScientist() {
    const id = `ag-${Date.now()}`;
    const ag = createAgent(id, `Scientist ${id.slice(-4)}`, 50, {
      role: "scientist",
    });
    setState((s) => {
      const next = { ...s, agents: [...(s.agents || []), ag] } as GameState;
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  function handleAddProject() {
    const id = `pr-${Date.now()}`;
    const p = createScienceProject(id, `Project ${id.slice(-4)}`, 10, 3);
    setState((s) => {
      const next = { ...s, projects: [...(s.projects || []), p] } as GameState;
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  function handleAssign(agentId: string, projectId: string) {
    setState((s) => {
      const agents = (s.agents || []).map((a) =>
        a.id === agentId ? assignAgentToProject({ ...a } as any, projectId) : a,
      );
      const projects = (s.projects || []).map((p) => {
        if (p.id !== projectId) return p;
        const copy = { ...p } as ScienceProject;
        assignScientist(copy, agentId);
        return copy;
      });
      const next = { ...s, agents, projects } as GameState;
      void saveGameState("autosave", next).catch(() => {});
      return next;
    });
  }

  async function handleManualSave(name?: string) {
    const n = name || `save-${Date.now()}`;
    await saveGameState(n, state);
    const list = await listGameStates();
    setSavedGames(list || []);
  }

  async function handleLoadSaved(name: string) {
    const loaded = await loadGameState(name);
    if (!loaded) return;
    try {
      const g = loaded as Partial<GameState>;
      setState((s) => ({ ...s, ...(g || {}) }) as GameState);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("failed to apply saved game", e);
    }
  }

  async function handleDeleteSaved(name: string) {
    await deleteConfig(`game:${name}`);
    const list = await listGameStates();
    setSavedGames(list || []);
  }

  return (
    <Box>
      <Typography variant="h4">Main</Typography>
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
        <Paper sx={{ p: 2, minWidth: 160 }}>
          <Typography variant="subtitle2">Seed</Typography>
          <Typography variant="h6">{String(startingSeed)}</Typography>
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
          onChange={(e) => setSaveName((e.target as HTMLInputElement).value)}
        />
        <Button
          variant="contained"
          onClick={() => void handleManualSave(saveName)}
          aria-label="save-game"
        >
          Save
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Saved Games</Typography>
        <Box>
          <ul>
            {savedGames.map((g) => (
              <li key={g.name}>
                {g.name}
                <Button
                  size="small"
                  onClick={() => void handleLoadSaved(g.name)}
                >
                  Load
                </Button>
                <Button
                  size="small"
                  onClick={() => void handleDeleteSaved(g.name)}
                >
                  Delete
                </Button>
              </li>
            ))}
            {savedGames.length === 0 && <div>No saved games</div>}
          </ul>
        </Box>
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
                <Button
                  size="small"
                  onClick={() =>
                    void handleAssign(a.id, state.projects?.[0]?.id || "")
                  }
                >
                  Assign
                </Button>
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
                      onClick={() => void handleAssign(a.id, p.id)}
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
