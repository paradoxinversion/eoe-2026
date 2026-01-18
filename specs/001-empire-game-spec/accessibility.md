```markdown
# Accessibility Audit — Empire of Evil (Options Page & Load Modal)

**Date:** 2026-01-18
**Scope:** Automated axe-core audits run under jsdom for the following test files:

- frontend/tests/accessibility/optionspage.a11y.test.tsx
- frontend/tests/accessibility/loadmodal.a11y.test.tsx

## Summary

- Results: No detectable accessibility violations found by axe-core for the tested pages/components.
- Test runner: Vitest + jsdom + axe-core.

## Observations

- During test runs, axe emitted repeated jsdom warnings: `Not implemented: window.getComputedStyle(elt, pseudoElt)`. These warnings are non-fatal under jsdom but may limit some pseudo-element checks (contrast calculations involving ::before/::after).
- A minimal canvas polyfill is applied for tests at `frontend/tests/setup/a11y-polyfill.ts` to suppress canvas/getContext warnings.

## Files Tested

- `frontend/tests/accessibility/optionspage.a11y.test.tsx` — no violations
- `frontend/tests/accessibility/loadmodal.a11y.test.tsx` — no violations

## Recommendations / Next Steps

- For higher-fidelity audits (especially for pseudo-element color contrast and computed styles), consider running axe in a real browser environment (Playwright/Puppeteer) for the pages in question.
- Monitor the jsdom `getComputedStyle` warnings; if audit coverage needs to include pseudo-elements, add targeted browser-based a11y tests.
- Keep the canvas polyfill in `frontend/tests/setup/` as it prevents spurious errors in the jsdom environment.

## Attachments

- Test logs: `frontend/tests_output/` (contains the Vitest run artifacts and any recorded JSON outputs).
```
