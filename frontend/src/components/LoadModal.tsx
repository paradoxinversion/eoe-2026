import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { listConfigs, deleteConfig } from "../services/persistence";
import importExport from "../services/importExport";

type Props = {
  open: boolean;
  onClose: () => void;
  onLoad?: (name: string) => void;
};

export default function LoadModal({ open, onClose, onLoad }: Props) {
  const [configs, setConfigs] = useState<
    Array<{ name: string; updatedAt: number }>
  >([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  async function refresh() {
    const list = await listConfigs();
    setConfigs(list);
  }

  async function handleLoad(name: string) {
    if (onLoad) onLoad(name);
    onClose();
  }

  async function handleDelete(name: string) {
    await deleteConfig(name);
    await refresh();
  }

  async function handleImport(file: File | null) {
    if (!file) return;
    await importExport.importFromFile(file);
    await refresh();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="load-dialog"
    >
      <DialogTitle id="load-dialog">Load Game</DialogTitle>
      <DialogContent>
        <List>
          {configs.map((c) => (
            <ListItem
              key={c.name}
              secondaryAction={
                <div>
                  <IconButton
                    edge="end"
                    aria-label={`delete-${c.name}`}
                    onClick={() => handleDelete(c.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemText
                primary={c.name}
                secondary={new Date(c.updatedAt).toLocaleString()}
              />
              <Button
                size="small"
                onClick={() => handleLoad(c.name)}
                sx={{ ml: 1 }}
              >
                Load
              </Button>
            </ListItem>
          ))}
          {configs.length === 0 && <div>No saved configurations.</div>}
        </List>
      </DialogContent>
      <DialogActions>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            void handleImport(f || null);
            if (e.target) e.target.value = "";
          }}
        />
        <Button
          startIcon={<UploadFileIcon />}
          onClick={() => fileRef.current && fileRef.current.click()}
        >
          Import JSON
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
