# UI Contracts: Options Page & Load Modal

## Title Page

- Buttons: `New Game`, `Load Game` (visible if saved configs exist), `Options`.

## Load Modal

- Tabs: `Saved`, `Import`.
- `Saved` tab: lists saved configs with fields: `id`, `name`, `timestamp`, `size_bytes`.
- Actions: `Load`, `Delete`, `Rename`.
- `Import` tab: file picker; JSON validation against `contracts/indexeddb-schema.json` and `data-model` rules; shows validation errors with field-level messages.

## Options Page

- Form fields are generated from the game config JSON schema:
    - `seed` (number)
    - `difficulty` (enum)
    - `starting_resources` (group)
    - `autosave` (boolean)
    - `autosave_interval_seconds` (number)
    - Save controls: `Save as...` (named config), `Export`, `Import`

## Accessibility

- Keyboard navigation for modal and tabs.
- Proper ARIA roles for modal, tablist, and form controls.
