import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
// FormHelperText not used; kept imports minimal
import Alert from "@mui/material/Alert";

import {
  listConfigs,
  loadConfig,
  saveConfig,
  deleteConfig,
} from "../services/persistence";
import importExport from "../services/importExport";
import type { Config } from "../config/schema";
import { defaultConfig } from "../config/schema";
import validateConfig from "../config/validator";

export default function OptionsPage() {
  const [form, setForm] = useState(defaultConfig);
  const [configs, setConfigs] = useState<
    Array<{ name: string; updatedAt: number }>
  >([]);
  const [configMap, setConfigMap] = useState<Record<string, Config>>({});
  const [saveName, setSaveName] = useState("default");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    // validate live when form changes to surface errors before save
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  async function refreshList() {
    const list = await listConfigs();
    setConfigs(list);
    // load each config for display
    const entries = await Promise.all(
      list.map(async (c) => {
        const cfg = await loadConfig(c.name);
        return [c.name, cfg] as const;
      }),
    );
    const map: Record<string, Config> = {};
    for (const [name, cfg] of entries) {
      if (cfg) map[name] = cfg;
    }
    setConfigMap(map);
  }

  async function handleLoad(name: string) {
    const cfg = await loadConfig(name);
    if (cfg) setForm(cfg);
  }

  async function handleSave() {
    const valid = validateForm();
    if (!valid) {
      setStatusMessage("Please fix validation errors before saving.");
      return;
    }
    await saveConfig(saveName || `save-${Date.now()}`, form);
    await refreshList();
    setStatusMessage("Saved configuration.");
  }

  async function handleDelete(name: string) {
    await deleteConfig(name);
    await refreshList();
  }

  async function handleExport(name: string) {
    await importExport.downloadConfig(name);
  }

  async function handleImport(file: File) {
    await importExport.importFromFile(file);
    await refreshList();
    setStatusMessage("Imported configuration.");
  }

  function validateForm() {
    const res = validateConfig(form);
    const e: Record<string, string> = {};
    if (!res.valid && res.errors && res.errors.length) {
      for (const err of res.errors) {
        try {
          const path = (err.instancePath || "").replace(/^\//, "");
          const params = err.params as Record<string, unknown> | undefined;
          const missingProp =
            params && typeof params.missingProperty === "string"
              ? (params.missingProperty as string)
              : undefined;
          const key = path || missingProp || "__form";
          const msg = err.message || "Invalid value";
          e[key] = e[key] ? `${e[key]}; ${msg}` : msg;
        } catch (ex) {
          e.__form =
            (e.__form ? e.__form + "; " : "") +
            (err.message || "validation error");
        }
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Options
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <TextField
          label="Save Name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          size="small"
          inputProps={{ "aria-label": "save-name" }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          aria-disabled={Object.keys(errors).length > 0}
          disabled={Object.keys(errors).length > 0}
        >
          Save
        </Button>
      </Box>

      <Box component="form" sx={{ display: "grid", gap: 2, maxWidth: 480 }}>
        <TextField
          label="Player Name"
          value={form.playerName}
          onChange={(e) => setForm({ ...form, playerName: e.target.value })}
          error={!!errors.playerName}
          helperText={errors.playerName}
          inputProps={{ "aria-describedby": "playerName-help" }}
        />
        <TextField
          label="Starting Seed"
          type="number"
          value={form.startingSeed}
          onChange={(e) =>
            setForm({
              ...form,
              startingSeed: Number(e.target.value),
            })
          }
          error={!!errors.startingSeed}
          helperText={errors.startingSeed}
        />
        <TextField
          label="Map Width"
          type="number"
          value={form.mapWidth ?? 100}
          onChange={(e) =>
            setForm({
              ...form,
              mapWidth: Math.max(1, Number(e.target.value)),
            })
          }
          error={!!errors.mapWidth}
          helperText={errors.mapWidth}
        />
        <TextField
          label="Map Height"
          type="number"
          value={form.mapHeight ?? 100}
          onChange={(e) =>
            setForm({
              ...form,
              mapHeight: Math.max(1, Number(e.target.value)),
            })
          }
          error={!!errors.mapHeight}
          helperText={errors.mapHeight}
        />
        <TextField
          label="Autosave Interval Seconds"
          type="number"
          value={form.autosaveIntervalSeconds}
          onChange={(e) =>
            setForm({
              ...form,
              autosaveIntervalSeconds: Number(e.target.value),
            })
          }
          error={!!errors.autosaveIntervalSeconds}
          helperText={errors.autosaveIntervalSeconds}
        />
        <TextField
          label="Organization Count"
          type="number"
          value={form.organizationCount ?? 1}
          onChange={(e) =>
            setForm({
              ...form,
              organizationCount: Math.max(1, Number(e.target.value)),
            })
          }
          error={!!errors.organizationCount}
          helperText={errors.organizationCount}
        />
        <Typography variant="body2" color="text.secondary">
          Controls how many Governing Organizations are created during world
          generation (minimum 1). Useful for tuning faction density in the map.
        </Typography>
        <TextField
          label="Grace Period Days"
          type="number"
          value={form.gracePeriodDays}
          onChange={(e) =>
            setForm({
              ...form,
              gracePeriodDays: Number(e.target.value),
            })
          }
          error={!!errors.gracePeriodDays}
          helperText={errors.gracePeriodDays}
        />
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Event Probabilities (0.0 - 1.0)
        </Typography>
        <TextField
          label="Raid Probability"
          type="number"
          inputProps={{ step: 0.01, min: 0, max: 1 }}
          value={form.eventProbabilities?.raid ?? 0}
          onChange={(e) =>
            setForm({
              ...form,
              eventProbabilities: {
                ...(form.eventProbabilities || {}),
                raid: Number(e.target.value),
              },
            })
          }
          error={!!errors["eventProbabilities/raid"]}
          helperText={errors["eventProbabilities/raid"]}
        />
        <TextField
          label="Blessing Probability"
          type="number"
          inputProps={{ step: 0.01, min: 0, max: 1 }}
          value={form.eventProbabilities?.blessing ?? 0}
          onChange={(e) =>
            setForm({
              ...form,
              eventProbabilities: {
                ...(form.eventProbabilities || {}),
                blessing: Number(e.target.value),
              },
            })
          }
          error={!!errors["eventProbabilities/blessing"]}
          helperText={errors["eventProbabilities/blessing"]}
        />
        <TextField
          label="Discovery Probability"
          type="number"
          inputProps={{ step: 0.01, min: 0, max: 1 }}
          value={form.eventProbabilities?.discovery ?? 0}
          onChange={(e) =>
            setForm({
              ...form,
              eventProbabilities: {
                ...(form.eventProbabilities || {}),
                discovery: Number(e.target.value),
              },
            })
          }
          error={!!errors["eventProbabilities/discovery"]}
          helperText={errors["eventProbabilities/discovery"]}
        />
      </Box>

      {statusMessage && (
        <Box sx={{ mt: 2 }} role="status" aria-live="polite">
          <Alert severity={Object.keys(errors).length ? "warning" : "success"}>
            {statusMessage}
          </Alert>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Saved Configurations</Typography>
        <List>
          {configs.map((c) => (
            <ListItem
              key={c.name}
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    onClick={() => handleExport(c.name)}
                    aria-label="export"
                  >
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(c.name)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={c.name}
                secondary={(() => {
                  const cfg = configMap[c.name];
                  if (!cfg) return new Date(c.updatedAt).toLocaleString();
                  const probs = cfg.eventProbabilities;
                  const probsStr = probs
                    ? `raid:${probs.raid ?? 0}, bless:${probs.blessing ?? 0}, disc:${probs.discovery ?? 0}`
                    : "";
                  const orgStr =
                    typeof cfg.organizationCount === "number"
                      ? ` — orgs:${cfg.organizationCount}`
                      : "";
                  return `${cfg.playerName} — seed ${cfg.startingSeed} ${probsStr ? ` — ${probsStr}` : ""}${orgStr}`;
                })()}
              />
              <Button size="small" onClick={() => handleLoad(c.name)}>
                Load
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f) handleImport(f);
            // reset value so same file can be re-imported if needed
            if (e.target) e.target.value = "";
          }}
        />
        <Button
          startIcon={<FileUploadIcon />}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Import JSON
        </Button>
      </Box>
    </Box>
  );
}
