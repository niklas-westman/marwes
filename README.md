# Marwes

Marwes is a small, high‑quality component system with a framework‑agnostic core, static preset CSS, and thin framework adapters.

**What it is**
- A UI component system with strong defaults and a simple theme override API.
- A three‑layer architecture: core logic, preset styling, and framework adapters.
- A monorepo optimized for clarity, consistent accessibility, and predictable styling.

**Docs**
- `docs/PROJECT.md` — purpose, goals, and scope
- `docs/ARCHITECTURE.md` — how the three layers connect
- `docs/ENGINEERING.md` — developer rules and conventions
- `docs/FIGMA_TO_MARWES.md` — Figma token/component mapping and sync workflow
- `SPEC.md` — canonical product and engineering specification

**Repo map**
- `packages/core` — framework‑agnostic TypeScript logic (theme, recipes, a11y)
- `packages/presets` — design tokens and static CSS (`.mw-*` classes)
- `packages/react` — React adapter (provider, hooks, components)
- `apps/storybook-react` — component development
- `apps/playground-react` — integration testing

**Common dev scripts**
- `pnpm dev` — packages + playground (development mode)
- `pnpm dev:storybook` — Storybook component development
- `pnpm dev:playground` — React playground app
- `pnpm build` — build all packages and apps (generates `dist/` folders)
- `pnpm typecheck` — type-check all packages without emitting files
- `pnpm test` — run tests

**Build outputs**
- `packages/*/dist/` — npm-ready package bundles (ESM + TypeScript declarations)
- `apps/storybook-react/storybook-static/` — deployable Storybook static site

If you are new to the codebase, start with `docs/PROJECT.md` and `docs/ARCHITECTURE.md`, then read `SPEC.md` and `docs/ENGINEERING.md` before implementing changes.
