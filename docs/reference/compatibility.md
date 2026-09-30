# Consumer compatibility

Use one framework adapter and import consumer components from that package's root entry point.

| Adapter | Framework peer requirement | Setup guide |
| --- | --- | --- |
| `@marwes-ui/react` | React and React DOM 18 or newer | [React](https://marwes.io/docs/get-started/react/) |
| `@marwes-ui/vue` | Vue 3.4 or newer | [Vue](https://marwes.io/docs/get-started/vue/) |
| `@marwes-ui/svelte` | Svelte 5.20 or newer | [Svelte](https://marwes.io/docs/get-started/svelte/) |

Package installation, application builds, and the CLI require Node.js 20 or newer. Automatic `marwes init` provider patching targets known Vite starter layouts. Other bundlers and custom app layouts can use the packages, but provider wiring is a manual step.

Marwes ships ES modules and static preset CSS backed by CSS custom properties. Consumer browsers must support the JavaScript output produced by the app's build tool and CSS custom properties. Theme preference uses `localStorage` and `matchMedia` when those APIs exist; their absence must not prevent the provider from rendering.

## Package boundaries

- Install one of `@marwes-ui/react`, `@marwes-ui/vue`, or `@marwes-ui/svelte` in an application.
- Import components, prop types, theme helpers, and SSR helpers from that adapter's documented public exports.
- Do not import application components directly from `@marwes-ui/core` or `@marwes-ui/presets`.
- Do not import adapter source files or internal atoms. The public form API is Field/Purpose-first.
- Do not add the preset stylesheet separately; each adapter includes the default first-edition preset.

The machine-readable export inventory is published at [`/ai/v1/public-api.json`](https://marwes.io/ai/v1/public-api.json).

## Verify a consumer app

From the app root, run:

```bash
pnpm dlx @marwes-ui/cli doctor --run-build
```

A successful run verifies adapter dependencies, recognised provider import/render syntax, and the app's production build after optional typecheck. Provider detection is a static source check, not proof that every component is wrapped at runtime. Import-boundary findings remain warnings and must be reviewed even when the command succeeds. A missing build script fails `--run-build` verification.

When `init` or `create` prints `manual-action-required`, exit code `2` means provider wiring needs the printed manual step. Installation, typecheck, or build failures preserve their underlying non-zero code, which can also be `2`; read the printed outcome rather than the code alone.
