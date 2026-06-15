# Marwes CLI

Public installation tooling for Marwes UI.

## Existing Apps

```bash
pnpm dlx @marwes-ui/cli init --adapter react
pnpm dlx @marwes-ui/cli init --adapter vue
pnpm dlx @marwes-ui/cli init --adapter svelte
```

The CLI installs the public adapter package, wraps a recognized Vite starter root
with `MarwesProvider`, and avoids direct app dependencies on `@marwes-ui/core` or
`@marwes-ui/presets`.

## Commands

```bash
marwes init --adapter react
marwes doctor --adapter react
marwes ai-prompt --adapter react
marwes create my-app --template react-ts
```

Use `--dry-run` to see planned changes without editing files. Use `--no-install`
or `--no-patch` when you want only part of the setup.

## New Apps

For Vite-style starters, use the create package:

```bash
pnpm create marwes@latest my-app --template react-ts
```

Supported templates are `react-ts`, `vue-ts`, and `svelte-ts`.
