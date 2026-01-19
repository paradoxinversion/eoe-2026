# Visual Baseline: UI Refresh — Dashboard Simplification

This folder stores visual snapshot baselines for the Dashboard Main component across breakpoints.

How to generate/update baselines:

1. Run the visual snapshot test or storybook snapshot generator locally.
2. Place committed baseline images or serialized snapshots in this folder under descriptive names, e.g.:
    - `dashboard-main_desktop.png`
    - `dashboard-main_tablet.png`
    - `dashboard-main_mobile.png`
3. When updating baselines, include a short note in the commit message explaining the reason for visual changes.

Tips:

- Use headless browser screenshot tooling (Playwright, Puppeteer) or the project's visual-test helper to capture images.
- Keep images reasonably sized and name them with the story/component and breakpoint.
