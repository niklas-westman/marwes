# @marwes-ui/cli

The official installer for Marwes UI. Sets up an existing React, Vue, or Svelte app in one command.

<div align="center">

**Recommended in every adapter README.**

[**marwes.io**](https://marwes.io) — official site, theme builder, and install guides
[GitHub](https://github.com/niklas-westman/marwes) • [React package](https://www.npmjs.com/package/@marwes-ui/react) • [Vue package](https://www.npmjs.com/package/@marwes-ui/vue) • [Svelte package](https://www.npmjs.com/package/@marwes-ui/svelte)

</div>

---

## What It Does

The CLI installs the matching adapter package (`@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte`), wraps a recognized Vite starter root with `MarwesProvider`, and leaves your app ready to render with default Marwes styling — no manual CSS setup.

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

Agentic mode is for AI coding agents (Claude Code, Cursor, etc.). It runs the normal `init` flow, then runs `doctor` and prints the boundaries the agent should follow (import from the adapter only, no direct `core`/`presets` imports, no extra stylesheet):

```bash
pnpm dlx @marwes-ui/cli init --adapter react --agentic
```

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
