import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DownloadIcon from '@mui/icons-material/Download'

import {
  listConfigs,
  loadConfig,
  saveConfig,
  deleteConfig,
  exportConfig,
  importConfig
} from '../services/persistence'
import { defaultConfig } from '../config/schema'

export default function OptionsPage() {
  const [form, setForm] = useState(defaultConfig)
  const [configs, setConfigs] = useState<Array<{ name: string; updatedAt: number }>>([])
  const [saveName, setSaveName] = useState('default')

  useEffect(() => {
    refreshList()
  }, [])

  async function refreshList() {
    const list = await listConfigs()
    setConfigs(list)
  }

  async function handleLoad(name: string) {
    const cfg = await loadConfig(name)
    if (cfg) setForm(cfg)
  }

  async function handleSave() {
    await saveConfig(saveName || `save-${Date.now()}`, form)
    await refreshList()
  }

  async function handleDelete(name: string) {
    await deleteConfig(name)
    await refreshList()
  }

  async function handleExport(name: string) {
    const txt = await exportConfig(name)
    if (!txt) return
    const blob = new Blob([txt], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File) {
    const text = await file.text()
    await importConfig(text)
    await refreshList()
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Options
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Save Name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>

      <Box component="form" sx={{ display: 'grid', gap: 2, maxWidth: 480 }}>
        <TextField
          label="Player Name"
          value={form.playerName}
          onChange={(e) => setForm({ ...form, playerName: e.target.value })}
        />
        <TextField
          label="Starting Seed"
          type="number"
          value={form.startingSeed}
          onChange={(e) => setForm({ ...form, startingSeed: Number(e.target.value) })}
        />
        <TextField
          label="Autosave Interval Seconds"
          type="number"
          value={form.autosaveIntervalSeconds}
          onChange={(e) => setForm({ ...form, autosaveIntervalSeconds: Number(e.target.value) })}
        />
        <TextField
          label="Grace Period Days"
          type="number"
          value={form.gracePeriodDays}
          onChange={(e) => setForm({ ...form, gracePeriodDays: Number(e.target.value) })}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Saved Configurations</Typography>
        <List>
          {configs.map((c) => (
            <ListItem key={c.name} secondaryAction={
              <Box>
                <IconButton edge="end" onClick={() => handleExport(c.name)} aria-label="export">
                  <DownloadIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(c.name)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
            }>
              <ListItemText primary={c.name} secondary={new Date(c.updatedAt).toLocaleString()} />
              <Button size="small" onClick={() => handleLoad(c.name)}>
                Load
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button component="label" startIcon={<FileUploadIcon />}>
          Import JSON
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files && e.target.files[0]
              if (f) handleImport(f)
            }}
          />
        </Button>
      </Box>
    </Box>
  )
}
