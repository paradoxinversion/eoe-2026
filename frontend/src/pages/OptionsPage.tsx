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
import FormHelperText from "@mui/material/FormHelperText";
import Alert from "@mui/material/Alert";

import {
    listConfigs,
    loadConfig,
    saveConfig,
    deleteConfig,
    exportConfig,
    importConfig,
} from "../services/persistence";
import { defaultConfig } from "../config/schema";
import validateConfig from "../config/validator";

export default function OptionsPage() {
    const [form, setForm] = useState(defaultConfig);
    const [configs, setConfigs] = useState<
        Array<{ name: string; updatedAt: number }>
    >([]);
    const [saveName, setSaveName] = useState("default");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        refreshList();
    }, []);

    async function refreshList() {
        const list = await listConfigs();
        setConfigs(list);
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
        const txt = await exportConfig(name);
        if (!txt) return;
        const blob = new Blob([txt], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    async function handleImport(file: File) {
        const text = await file.text();
        await importConfig(text);
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
                    const key =
                        path ||
                        (err.params && (err.params as any).missingProperty) ||
                        "__form";
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

            <Box
                component="form"
                sx={{ display: "grid", gap: 2, maxWidth: 480 }}
            >
                <TextField
                    label="Player Name"
                    value={form.playerName}
                    onChange={(e) =>
                        setForm({ ...form, playerName: e.target.value })
                    }
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
            </Box>

            {statusMessage && (
                <Box sx={{ mt: 2 }} role="status" aria-live="polite">
                    <Alert
                        severity={
                            Object.keys(errors).length ? "warning" : "success"
                        }
                    >
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
                                secondary={new Date(
                                    c.updatedAt,
                                ).toLocaleString()}
                            />
                            <Button
                                size="small"
                                onClick={() => handleLoad(c.name)}
                            >
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
                    onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                    }
                >
                    Import JSON
                </Button>
            </Box>
        </Box>
    );
}
