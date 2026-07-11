Vite-style starter for Marwes UI. Scaffolds a fresh React, Vue, or Svelte app with Marwes preinstalled, wired up, and ready to render.

<div align="center">

<img alt="Marwes Design System" src="https://raw.githubusercontent.com/niklas-westman/marwes/main/.github/assets/cover-v3.png" width="100%" style="border-radius: 40px;">

<br>
<br>

# create-marwes

**Create a new Marwes app in one command.**

React • Vue • Svelte • TypeScript-first • Default Marwes CSS • Ready to run

[**marwes.io**](https://marwes.io) — official site, theme builder, and install guides
[GitHub](https://github.com/niklas-westman/marwes) • [CLI package](https://www.npmjs.com/package/@marwes-ui/cli)

</div>

---

## Quick Start

Pick the package manager you already use — they all work:

```bash
pnpm create marwes@latest my-app --template react-ts
npm create marwes@latest my-app -- --template react-ts
yarn create marwes my-app --template react-ts
bun create marwes my-app --template react-ts
```

Supported templates:

| Template     | Framework |
| ------------ | --------- |
| `react-ts`   | React 18+ (TypeScript) |
| `vue-ts`     | Vue 3.4+ (TypeScript) |
| `svelte-ts`  | Svelte 5 (TypeScript) |

## What You Get

`create-marwes` delegates base app scaffolding to Vite, then runs the Marwes CLI `init` flow for the selected adapter. The result:

- A fresh Vite starter (`my-app/`) with TypeScript, React/Vue/Svelte, and dev tooling wired up.
- The matching Marwes adapter package installed (`@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte`) with its peer dependencies.
- Your app root wrapped in `MarwesProvider`, so default Marwes styling is active on first render.
- No extra CSS setup — the adapter loads the preset stylesheet automatically.

## Next Steps

After scaffold:

```bash
cd my-app
pnpm install   # if you passed --no-install
pnpm dev
```

Start building with Marwes components. See the adapter README on npm (`@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte`) for the full component list and theming guide.

For the theme builder, brand-token customization, and full setup guides, visit [marwes.io](https://marwes.io).

## Options

| Flag              | Purpose |
| ----------------- | ------- |
| `--template`      | One of `react-ts`, `vue-ts`, `svelte-ts` (required). |
| `--pm`            | Force a package manager: `pnpm`, `npm`, `yarn`, or `bun`. |
| `--no-install`    | Skip dependency install after scaffolding. |
| `--dry-run`       | Print planned actions without writing to disk. |

## Existing App?

Already have a Vite app? Use the Marwes CLI directly instead:

```bash
pnpm dlx @marwes-ui/cli init --adapter react
```

See [`@marwes-ui/cli`](https://www.npmjs.com/package/@marwes-ui/cli) for the full command reference.
