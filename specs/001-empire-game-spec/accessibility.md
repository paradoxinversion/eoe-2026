# Accessibility Audit — Options Page & Load Modal (T032)

Status: In progress

Scope

- Components: `frontend/src/pages/OptionsPage.tsx`, `frontend/src/components/LoadModal.tsx`
- Supporting checks: keyboard navigation, focus order, labels, ARIA usage, color contrast, semantic HTML

Goal

- Identify accessibility issues, provide reproduction steps, and propose fixes.

How to run local checks

1. Run accessibility tests (axe + jsdom):

```bash
cd frontend
npm run test:a11y
```

2. Run component-level checks in browser (manual):

```bash
npm run dev
# open http://localhost:5173 and exercise the Options and Load UI with keyboard only
```

Automated checks performed

- Vitest + axe-core automated accessibility test files:
    - `frontend/tests/accessibility/optionspage.a11y.test.tsx`
    - (add `loadmodal.a11y.test.tsx` as needed)

Initial findings (placeholders — fill after running tests)

- OptionsPage:
    - [ ] Color contrast: TODO
    - [ ] Missing form labels for one or more inputs: TODO
    - [ ] Keyboard focus trap behavior: TODO
- LoadModal:
    - [ ] Modal element lacks `aria-modal`/dialog role: TODO
    - [ ] Tab order includes hidden elements: TODO

Suggested fixes

- Ensure form inputs have associated labels (use MUI `TextField` `label` prop or `<label for>`).
- Use `role="dialog"` and `aria-modal="true"` on modal containers; manage focus trap and return focus on close.
- Verify color contrast and adjust theme variables if failing.

Acceptance criteria

- All automated a11y tests pass (`npm run test:a11y`).
- Manual keyboard navigation yields no inaccessible controls and focus order is logical.

Next steps

1. Run `npm run test:a11y` and record failures.
2. Convert failures into concrete fix tasks (files/lines) and apply patches on branch `chore/a11y-audit`.
3. Re-run automated tests and manual checks until green.

Maintainers: assign to frontend reviewers after fixes are implemented.
