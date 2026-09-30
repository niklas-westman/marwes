# @marwes-ui/cli

The official installer for Marwes UI. Sets up an existing React, Vue, or Svelte app in one command.

<div align="center">

**Recommended in every adapter README.**

[**marwes.io**](https://marwes.io) — official site, theme builder, and install guides
[GitHub](https://github.com/niklas-westman/marwes) • [React package](https://www.npmjs.com/package/@marwes-ui/react) • [Vue package](https://www.npmjs.com/package/@marwes-ui/vue) • [Svelte package](https://www.npmjs.com/package/@marwes-ui/svelte)

</div>

---

## What It Does

The CLI installs the matching adapter package (`@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte`), wraps a recognized Vite starter root with `MarwesProvider`, and runs the static `doctor` checks. Default Marwes styling is loaded by the adapter — no manual CSS setup. Normal `init` does not run your app's typecheck or production build; use `doctor --run-build` afterward.

Automatic provider patching intentionally targets the standard React, Vue, and Svelte Vite layouts. Other app structures still get dependency installation, an exact provider example, a framework setup link, and exit code `2` so automated callers can detect the required manual step.

Apps never need to depend on `@marwes-ui/core` or `@marwes-ui/presets` directly.

## Existing Apps

Run from the root of your project. Pick your package manager — all four work:

```bash
pnpm dlx @marwes-ui/cli init --adapter react
npx @marwes-ui/cli init --adapter react
yarn dlx @marwes-ui/cli init --adapter react
bunx @marwes-ui/cli init --adapter react
```

Replace `--adapter react` with `vue` or `svelte` as needed.

## New Apps

For a fresh Vite starter with Marwes preinstalled, use the create package instead:

```bash
pnpm create marwes@latest my-app --template react-ts
```

Supported templates: `react-ts`, `vue-ts`, `svelte-ts`. See [`create-marwes`](https://www.npmjs.com/package/create-marwes).

## AI-Assisted Setup

Agentic mode is for AI coding agents (Claude Code, Cursor, etc.). Every non-dry-run `init` that reaches setup verification runs the static `doctor` checks. Successful normal setup prints theme guidance; agentic mode also prints a complete typed provider example for the selected framework. Manual setup prints that example so you can wire the provider yourself:

```bash
pnpm dlx @marwes-ui/cli init --adapter react --agentic
pnpm dlx @marwes-ui/cli doctor --run-build
```

The setup guidance keeps these boundaries explicit:

- Import Marwes APIs from the selected adapter root, not `@marwes-ui/core` or `@marwes-ui/presets`.
- The adapter includes preset CSS. Do not add a second Marwes stylesheet.
- Render components and app-owned styles below `MarwesProvider`. Theme CSS variables are scoped to its DOM descendants, not `:root`.
- Use `mwTheme`, `mwThemeVars`, or `mwVar()` for CSS references. Use the adapter's `useTheme()` when JavaScript needs resolved theme values.
- Run `doctor --run-build` before claiming setup is build-verified.

Follow the selected framework's setup guide for customization: [React](https://marwes.io/docs/get-started/react/), [Vue](https://marwes.io/docs/get-started/vue/), or [Svelte](https://marwes.io/docs/get-started/svelte/). See [theming](https://marwes.io/docs/theming/) for theme configuration.

## Commands

```bash
marwes init --adapter <react|vue|svelte> [--agentic] [--pm <pnpm|npm|yarn|bun>]
marwes doctor [--adapter <react|vue|svelte>] [--run-build]
marwes ai-prompt --adapter <react|vue|svelte>
marwes create <name> --template <react-ts|vue-ts|svelte-ts>
```

| Command      | Purpose |
| ------------ | ------- |
| `init`       | Install the adapter, wrap the app root, verify setup. |
| `doctor`     | Audit an existing setup for provider wiring, package boundaries, and (with `--run-build`) build health. |
| `ai-prompt`  | Print the setup prompt an AI agent should follow. |
| `create`     | Scaffold a new Vite app (same as `pnpm create marwes@latest`). |

Use `--help` on any subcommand for its focused options, for example `marwes doctor --help`.

## Verification and Exit Codes

```bash
marwes doctor --run-build
```

Run from the consumer app root. `doctor` searches `src/`, `app/`, `pages/`, and common root entry files for an imported and rendered provider from the selected adapter. It recognizes framework aliases and supported JSX, template, and render-function forms. These are static source checks, not proof that every component is wrapped at runtime. Direct internal-package imports and an extra preset stylesheet are reported as warnings; review them even when the command exits successfully.

With `--run-build`, a `build` script is required. The CLI runs `typecheck` first when present, then `build`, stopping on the first failed script and preserving its exit code. A missing `build` script fails verification. Without `--run-build`, neither script runs.

| Exit code | Meaning |
| --------- | ------- |
| `0` | The requested checks passed; review any warnings. Only `doctor --run-build` verifies the app's build. |
| `2` with a manual-action-required setup message | `init` or `create` needs a manual provider-wiring step. Installation may have been skipped with `--no-install`. Apply the printed example, then rerun `doctor --run-build`. |
| Any non-zero with a failure message | Installation, verification, typecheck, or build failed. The underlying command code is preserved when available, including `2`. |

Do not interpret exit code `2` alone as partial setup: `doctor` does not install packages, and an installation or app script can itself fail with code `2`. Read the printed outcome before deciding how to recover.

## Global Flags

| Flag             | Meaning |
| ---------------- | ------- |
| `--pm <manager>` | Force a package manager: `pnpm`, `npm`, `yarn`, or `bun`. Auto-detected otherwise. |
| `--dry-run`      | Print planned changes without touching files. |
| `--no-install`   | Skip dependency install. |
| `--no-patch`     | Skip wrapping the app root — you'll wire up `MarwesProvider` yourself. |
| `--agentic`      | Enable agentic mode (`init` only). |

## Learn More

- Full setup guides, theme customization, and the theme builder: [marwes.io](https://marwes.io)
- Adapter READMEs: [`@marwes-ui/react`](https://www.npmjs.com/package/@marwes-ui/react), [`@marwes-ui/vue`](https://www.npmjs.com/package/@marwes-ui/vue), [`@marwes-ui/svelte`](https://www.npmjs.com/package/@marwes-ui/svelte)
