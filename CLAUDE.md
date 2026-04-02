# CLAUDE.md — marwes

## What This Project Is

**marwes** is a framework-agnostic UI component library.
It is structured as a pnpm monorepo with three publishable packages and two app packages.

| Package | Purpose |
|---|---|
| `@marwes-ui/core` | Framework-agnostic recipes + a11y logic. No DOM, no framework. |
| `@marwes-ui/presets` | Static CSS files + design tokens (firstEdition brand). |
| `@marwes-ui/react` | Thin React adapter. Consumes core RenderKits. |
| `@marwes-ui/vue` | Thin Vue 3 adapter. Consumes core RenderKits. |
| `apps/playground-react` | Dev sandbox. Not published. |
| `apps/storybook-react/vue` | Component documentation. Not published. |

## Architecture Contract

Every component is built in three steps. Never skip a layer.

```
core recipe → RenderKit → framework adapter (React/Vue)
```

1. **Core recipe** (`packages/core/src/components/atoms/<name>/`): Pure TypeScript. Returns a `RenderKit` — an object with `tag`, `className`, `a11y`, `dataAttributes`, and `vars`. No imports from React, Vue, or the DOM.
2. **CSS preset** (`packages/presets/src/firstEdition/<name>.css`): Targets `[data-component="<name>"]` selectors. Uses CSS custom properties from the theme.
3. **Framework adapter**: Calls the core recipe, spreads the kit onto the native element. Keep adapters thin — no logic that belongs in core.

**RenderKit shape (reference):**
```ts
{
  tag: "button" | "a"
  className: string
  a11y: Record<string, string>
  dataAttributes: Record<string, string>
  vars: Record<string, string>  // CSS custom properties
}
```

## Adding a New Component

Follow this layer order strictly — never skip ahead or work across layers simultaneously:

```
1. core   <name>.types.ts    — public contracts, InteractionState, props
2. core   <name>.a11y.ts     — ARIA attribute mapping
3. core   <name>.styles.ts   — state × variant → CSS variables + class modifiers
4. core   <name>.recipe.ts   — combines into a RenderKit
5. presets <name>.css        — CSS classes + --mw-* variable consumption
6. react  component          — React adapter (applies RenderKit, wires events)
7. react  *.stories.ts       — Storybook stories covering all states and variants
8. vue    component          — Vue adapter (same RenderKit, same API surface)
9. vue    *.stories.ts       — Storybook stories matching React coverage
```

Each layer must be complete and passing before the next begins. A layer is done when:
- All tests pass
- `tsc --noEmit` clean
- Lint clean
- No regressions in visual snapshots (Chromatic)

File structure per component in `@marwes-ui/core`:
- `<name>.types.ts` — public contracts
- `<name>.a11y.ts` — accessibility mapping
- `<name>.styles.ts` — theme/state to CSS variables + modifiers
- `<name>.recipe.ts` — combines logic into a RenderKit
- `index.ts` — re-exports

Steps:
1. Create `packages/core/src/components/atoms/<name>/` with the files above.
2. Add CSS to `packages/presets/src/firstEdition/<name>.css`.
3. Create `packages/react/src/components/<name>/`:
   - `<name>.tsx` — React adapter
   - `variants.tsx` — purpose-driven semantic variants (if applicable)
   - `index.ts` — re-exports
4. Mirror in `packages/vue/src/components/<name>/`.
5. Export from each package's `src/index.ts`.
6. Add tests under `__tests__/` in core (and adapters if needed).
7. Add a changeset: `pnpm changeset`.

## Component Naming Conventions

- Recipe functions: `create<Name>Recipe` → returns `<Name>RenderKit`
- Props types: `<Name>Props` (adapters), `<Name>Options` (core)
- CSS class prefix: `.mw-<name>`
- Data attributes: `data-component="<name>"`, `data-variant`, `data-action`
- Purpose variants: Named by semantic intent (`DangerButton`, `SaveButton`) — not by style

## Key Commands

```bash
# Install
pnpm install

# Watch-build all packages (required before running apps)
pnpm dev:packages

# Run playground
pnpm dev:playground

# Storybook
pnpm dev:storybook:react
pnpm dev:storybook:vue

# Type check
pnpm typecheck

# Lint + format (auto-fix)
pnpm format

# Lint only (no write)
pnpm lint

# Tests
pnpm test               # all packages + apps
pnpm test:packages      # core, presets, react, vue only

# Build for publish
pnpm build:packages

# Release (changesets)
pnpm changeset          # add changeset entry
pnpm release            # publish (CI only)
```

## Variable Naming

All variable and parameter names must be pedagogical and self-documenting. Avoid cryptic abbreviations.

```typescript
// ❌ Avoid
def.nodes.map((n, i) => { const Tag = n.tag; return <Tag key={i} {...n.attrs} />; });
const btn = document.querySelector(".button");

// ✅ Use
def.nodes.map((iconNode, nodeIndex) => {
  const TagName = iconNode.tag;
  return <TagName key={nodeIndex} {...iconNode.attrs} />;
});
const buttonElement = document.querySelector(".button");
```

Allowed short names: `x/y/z` (coordinates), `T/K/V` (generics), `i/j/k` (pure numeric iteration), `id/url/html/css/svg` (universal abbreviations).

## Event Naming

- Prefer `onValueChange(value)` for value-based controls.
- Adapters may expose `onChange(value)` as an alias but internal contracts must use `onValueChange`.

## Code Style (project-specific)

These extend the global code philosophy. Biome enforces them automatically on commit.

- **No semicolons** — Biome will remove them
- **Double quotes** for strings
- **Trailing commas** everywhere (function params, arrays, objects)
- **100-char line width**
- **No `any`** — use `unknown` + type guards; Biome throws an error
- **No unused variables** — Biome throws an error
- Imports are auto-organized by Biome on save/commit

## Testing Conventions

- Tests live in `packages/<name>/src/components/<name>/__tests__/`
- Runner: Vitest 4. No Jest globals — use `import { it, expect } from "vitest"` explicitly if needed, though `vitest.config.ts` sets `globals: true`
- Core tests run in `node` environment (no DOM)
- React/Vue tests use `@testing-library/react` and `@testing-library/vue`
- Do not mock the core recipes in adapter tests — call the real recipe

## Package Boundaries

- `core` must never import from `react`, `vue`, or the DOM
- `react` and `vue` import from `@marwes-ui/core` (workspace alias)
- `presets` has no JS runtime — CSS only
- Apps can import from all packages but are never imported by packages

## Git Workflow

- All changes need a **changeset** entry (`pnpm changeset`) before merging
- Pre-commit hook runs `biome check --write` on staged files automatically (lefthook)
- Pre-push hook runs `pnpm check` — fix lint errors before pushing
- Branch naming: `<type>/<short-description>` (e.g. `add/tooltip-component`, `fix/button-focus`)

## Build System

All packages use **tsup** for bundling:
- Output: `dist/` with ESM bundle, TypeScript declarations, and source maps
- Entry: `src/index.ts`, format: ESM only
- `tsconfig.json` in packages has `noEmit: true` — only tsup writes to `dist/`

```bash
pnpm build:packages                              # build all
pnpm --filter @marwes-ui/react build             # build one
pnpm --filter @marwes-ui/react clean && pnpm --filter @marwes-ui/react build  # clean rebuild
```

RenderKit debug instrumentation is opt-in. Set `window.__MARWES_RENDERKIT_DEBUG__ = true` in development to emit `marwes/renderkit/renderkit-update` events.

## Common Pitfalls

- Do not add DOM logic to `core` — it breaks the framework-agnostic contract and the `node` test environment
- Do not use inline styles in adapters — use `kit.vars` spread onto the element's `style` prop
- Do not create new CSS classes — extend the existing `[data-component]` selector pattern
- Do not skip the CSS preset when adding a component — the adapter will render unstyled
- Do not hardcode colors or spacing — use CSS custom properties from the theme (`--mw-*`)
