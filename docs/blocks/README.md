# Marwes Blocks

Blocks are copyable product patterns built from Marwes components and Marwes theme variables.

They are not new package APIs and they are not exported from `@marwes-ui/*`. They are starting points for real screens: copy a block into your app, rename it for your domain, and keep the styling aligned through `--mw-*` variables.

## React Blocks

- [Dashboard Shell](./react/dashboard-shell.md) — page shell with summary cards, activity, and a primary action.
- [Login Panel](./react/login-panel.md) — centered authentication card with accessible fields and actions.
- [Settings Form](./react/settings-form.md) — account/preferences form pattern with field copy and actions.
- [Empty State](./react/empty-state.md) — focused empty-state panel for first-run or no-results surfaces.
- [Stats Grid](./react/stats-grid.md) — responsive KPI/stat card pattern.

## Block rules

- Keep blocks app-owned. They should not hide product behavior behind a generic abstraction too early.
- Use Marwes components for controls, content, and cards.
- Use `--mw-*` variables or `mwThemeVars` for app-owned layout styling.
- Prefer semantic/purpose components when intent matters.
- Extract reusable local components only after a pattern appears in more than one product surface.
- Promote a block idea into `packages/**` only after it has repeated product evidence, a clear public contract, React/Vue parity expectations, and validation coverage.

## When to use blocks vs components

Use components when you need a single primitive such as `Button`, `InputField`, or `Card`.

Use blocks when you need a product-level starting point such as a dashboard, login page, form section, or empty state.
