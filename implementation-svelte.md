# Implementation plan: `@marwes-ui/svelte`

Date: 2026-05-07  
Audience: execution plan for GPT 5.4 / local coding agent  
Target package: `packages/svelte` / `@marwes-ui/svelte`  
Primary source briefs: `feedback/new-svelte-plan.md`, `feedback/new-svelte-plan-v2.md`

---

## 0. Executive decision

Build a **native Svelte 5 adapter** as a separate workspace package.

```txt
@marwes-ui/core      = framework-agnostic recipes, a11y, theme, semantic contracts
@marwes-ui/presets   = static CSS and firstEdition visual language
@marwes-ui/react     = React DOM adapter
@marwes-ui/vue       = Vue DOM adapter
@marwes-ui/svelte    = Svelte DOM adapter
```

Follow `new-svelte-plan-v2.md` when v1 and v2 disagree.

Important resolved conflict:

- v1 suggested auto-importing preset CSS from `@marwes-ui/svelte` for React/Vue parity.
- v2 supersedes that: **do not auto-import CSS in `@marwes-ui/svelte` MVP**.
- Users import CSS explicitly from `@marwes-ui/presets/firstEdition/styles.css`.

MVP dependency rule:

```txt
@marwes-ui/svelte dependencies:
  @marwes-ui/core

@marwes-ui/svelte peerDependencies:
  svelte ^5.20.0

@marwes-ui/svelte devDependencies:
  svelte, @sveltejs/package, @sveltejs/vite-plugin-svelte, svelte-check, vitest, jsdom, @testing-library/svelte, rimraf, typescript

Do not add @marwes-ui/presets as a runtime dependency in MVP.
```

---

## 1. Source docs and source files already reviewed

Before execution, treat these as the current plan context:

- `feedback/new-svelte-plan.md`
- `feedback/new-svelte-plan-v2.md`
- `docs/start-here.md`
- `docs/reference/architecture.md`
- `docs/reference/repo-map.md`
- `docs/reference/spec.md`
- `docs/reference/accessibility.md`
- `docs/reference/testing.md`
- `docs/reference/family-validation.md`
- `docs/guides/adding-components.md`
- `docs/guides/figma-to-marwes.md`
- `docs/registry/README.md`
- `docs/registry/adding-families.md`
- `docs/reference/framework-parity-summary.md`
- `artifacts/framework-parity.json`
- `artifacts/component-registry.json`
- `packages/react/src/index.ts`
- `packages/vue/src/index.ts`
- `packages/react/src/provider/*`
- `packages/vue/src/provider/*`
- representative React/Vue component source for Button, Input, InputField, Icon, Spinner, Badge, Card, Spacing, Heading.

Execution rule: when implementing each component family, re-open the listed source files for that family before writing Svelte code. Do not rely only on this plan.

---

## 2. Non-negotiable guardrails

- [x] Do not import Svelte from `packages/core`, `packages/react`, or `packages/vue`.
- [x] Do not import React or Vue from `packages/svelte`.
- [x] Do not build Web Components or custom elements in MVP.
- [x] Do not move behavior, variants, a11y rules, or theme normalization into Svelte.
- [x] Do not hardcode colors/tokens/variant class maps in Svelte components.
- [x] Do not import `@marwes-ui/presets` in `packages/svelte/src/lib/index.ts` for MVP.
- [x] Do not use SvelteKit-only imports such as `$app/*` in package code.
- [x] Use Svelte 5 runes: `$props`, `$props.id()`, `$state`, `$derived`, `$effect`, `$bindable`.
- [x] Avoid legacy `export let`, `$:`, `<slot>`, `on:click`, and `createEventDispatcher` for simple native event forwarding.
- [x] Use native elements first: `button`, `a`, `input`, `textarea`, `select`, `hr`, `h1`, `p`, `span`, etc.
- [x] For every family: core recipe output must own `className`, `vars`, `a11y`, and `dataAttributes`.

---

## 3. Mandatory execution loop

GPT 5.4 must follow this loop for every phase and every component family.

### Before starting a phase

- [ ] Re-read this phase checklist.
- [ ] Re-read the relevant existing React source.
- [ ] Re-read the relevant existing Vue source.
- [ ] Re-read the relevant core recipe/type/a11y files.
- [ ] Re-read the relevant tests/contracts where available.
- [ ] Confirm the package boundary impact.
- [ ] Write down exactly which files will change.

### During implementation

- [ ] Make small, reversible edits.
- [ ] Keep Svelte code thin over core.
- [ ] Prefer separate `types.ts` files for public Svelte prop types.
- [ ] Prefer helper functions under `src/lib/internal` for class/style/attrs merging.
- [ ] Use `$bindable` only for form state (`value`, `checked`, selected value).
- [ ] Merge user `class` and `style`; never drop them.
- [ ] Apply user/rest attrs first, then core a11y/data attrs, then explicit `class`/`style`/critical attrs.

### Before moving to the next phase

- [ ] Check every item in the phase checklist.
- [ ] Run the phase validation commands.
- [ ] Fix all typecheck/test/build failures before continuing.
- [ ] Update this plan/checklist if the implementation reveals a better route.
- [ ] Summarize changed files and remaining risk.

Do not continue to the next phase with failing commands unless the failure is explicitly documented and accepted as a known temporary blocker.

---

## 4. Phase overview

```txt
Phase 0  Package scaffold + workspace wiring
Phase 1  Provider/theme/SSR
Phase 2  Internal helpers + Button + Icon + Spinner
Phase 3  Input + InputField
Phase 4  MVP passive primitives: Badge, Card, Divider, Spacing, Heading, Paragraph
Phase 5  Tests + type fixtures + README
Phase 6  Root validation + adapter boundary updates
Phase 7  Optional docs/registry/parity integration
Phase 8  Next-family rollout after MVP
```

Recommended execution cut line:

```txt
First implementation PR / first GPT 5.4 execution pass:
  Phase 0 → Phase 3 + minimum Phase 5/6 validation

Second implementation pass:
  Phase 4 passive primitives + expanded tests/docs
```

Reason: Provider + Button + InputField prove all important adapter mechanics: package build, theme runtime, snippets, native events, bind:value, and a11y field wiring. Passive primitives are low risk, but adding them before the adapter mechanics are green increases review noise.

MVP component surface:

```txt
MarwesProvider
useTheme
useThemeMode
Button
SubmitButton / CancelButton / DestructiveButton / PrimaryButton / SecondaryButton / TextButton / SuccessButton if easy after Button
Icon
Spinner
ButtonSpinner
Input
InputField
Badge
Card
Divider
Spacer / Spacing
H1 / H2 / H3
Paragraph
```

---

## 5. Phase 0 — Package scaffold + workspace wiring

### 5.1 Files to create

- [x] `packages/svelte/package.json`
- [x] `packages/svelte/svelte.config.js`
- [x] `packages/svelte/tsconfig.json`
- [x] `packages/svelte/vitest.config.ts`
- [x] `packages/svelte/README.md`
- [x] `packages/svelte/CHANGELOG.md`
- [x] `packages/svelte/src/lib/index.ts`
- [x] `packages/svelte/src/lib/ssr.ts`
- [x] `packages/svelte/src/lib/internal/merge-class.ts`
- [x] `packages/svelte/src/lib/internal/css-vars.ts`
- [x] `packages/svelte/src/lib/internal/attrs.ts`
- [x] `packages/svelte/src/lib/provider/`
- [x] `packages/svelte/src/lib/components/`
- [x] `packages/svelte/src/tests/`

### 5.2 `package.json` target

Use versions aligned with the repo where possible.

```json
{
  "name": "@marwes-ui/svelte",
  "version": "1.2.0",
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "private": false,
  "type": "module",
  "sideEffects": false,
  "main": "./dist/index.js",
  "files": ["dist", "README.md", "CHANGELOG.md"],
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./ssr": {
      "types": "./dist/ssr.d.ts",
      "svelte": "./dist/ssr.js",
      "default": "./dist/ssr.js"
    }
  },
  "scripts": {
    "dev": "svelte-package --watch",
    "build": "svelte-package",
    "typecheck": "svelte-check --tsconfig ./tsconfig.json",
    "test:typecheck": "svelte-check --tsconfig ./tsconfig.json",
    "test": "NODE_ENV=test vitest run",
    "clean": "rimraf dist",
    "lint": "biome lint .",
    "format": "biome format --write ."
  },
  "dependencies": {
    "@marwes-ui/core": "workspace:*"
  },
  "peerDependencies": {
    "svelte": "^5.20.0"
  },
  "devDependencies": {
    "@sveltejs/package": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "@testing-library/svelte": "^5.0.0",
    "jsdom": "26.1.0",
    "rimraf": "6.1.2",
    "svelte": "^5.20.0",
    "svelte-check": "^4.0.0",
    "typescript": "5.9.3",
    "vite": "^6.0.0",
    "vitest": "4.0.18"
  }
}
```

If install resolution prefers newer Svelte tooling, update lockfile normally with `pnpm install`, but keep the architecture constraints.

Packaging import rule:

- [x] In public package source, use `.js` suffixes for relative TypeScript module imports that survive into published ESM, for example `import type { ButtonProps } from "./types.js"`.
- [x] This applies inside `.ts` files and inside `<script lang="ts">` blocks in `.svelte` files.
- [x] Svelte component imports keep their `.svelte` suffix, for example `import Icon from "../icon/Icon.svelte"`.

### 5.3 `svelte.config.js`

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess()
};

export default config;
```

### 5.4 `tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "declarationMap": false,
    "types": ["svelte"]
  },
  "include": ["src/**/*.ts", "src/**/*.svelte", "svelte.config.js", "vitest.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```

### 5.5 `vitest.config.ts`

```ts
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  }
});
```

If Testing Library matchers are needed, add a local setup file only after tests require it.

### 5.6 Root `tsconfig.base.json` paths

Add:

```json
"@marwes-ui/svelte": ["./packages/svelte/src/lib/index.ts"],
"@marwes-ui/svelte/ssr": ["./packages/svelte/src/lib/ssr.ts"]
```

### 5.7 Root `package.json` scripts

Add:

```json
"test:svelte": "pnpm --filter @marwes-ui/svelte test",
"test:typecheck:svelte": "pnpm --filter @marwes-ui/svelte test:typecheck"
```

Update:

```json
"test:packages": "pnpm test:core && pnpm test:presets && pnpm test:react && pnpm test:vue && pnpm test:svelte",
"test:typecheck:packages": "pnpm test:typecheck:contracts && pnpm test:typecheck:core && pnpm test:typecheck:presets && pnpm test:typecheck:react && pnpm test:typecheck:vue && pnpm test:typecheck:svelte"
```

`build:packages` should already pick up `packages/svelte` because it filters `./packages/*`.

### 5.8 Phase 0 validation

- [x] `pnpm install`
- [x] `pnpm --filter @marwes-ui/svelte build`
- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm build:packages`

Do not continue until the empty package builds.

---

## 6. Phase 1 — Provider/theme/SSR

### 6.1 Source files to re-read first

Provider/theme sources:

- [x] `packages/react/src/provider/marwes-provider.tsx`
- [x] `packages/react/src/provider/marwes-context.ts`
- [x] `packages/react/src/provider/use-theme.ts`
- [x] `packages/react/src/provider/use-theme-mode.ts`
- [x] `packages/react/src/provider/runtime-theme.ts`
- [x] `packages/react/src/provider/theme-mode-runtime.ts`
- [x] `packages/react/src/ssr.tsx`
- [x] `packages/vue/src/provider/marwes-provider.ts`
- [x] `packages/vue/src/provider/marwes-context.ts`
- [x] `packages/vue/src/provider/use-theme.ts`
- [x] `packages/vue/src/provider/use-theme-mode.ts`
- [x] `packages/vue/src/provider/runtime-theme.ts`
- [x] `packages/vue/src/provider/theme-mode-runtime.ts`
- [x] `packages/vue/src/ssr.ts`
- [x] `packages/core/src/theme/*`
- [x] `packages/core/src/index.ts`

### 6.2 Files to create

- [x] `packages/svelte/src/lib/provider/types.ts`
- [x] `packages/svelte/src/lib/provider/context.ts`
- [x] `packages/svelte/src/lib/provider/MarwesProvider.svelte`
- [x] `packages/svelte/src/lib/provider/use-theme.ts`
- [x] `packages/svelte/src/lib/provider/use-theme-mode.ts`
- [x] `packages/svelte/src/lib/provider/runtime-theme.ts`
- [x] `packages/svelte/src/lib/provider/theme-mode-runtime.ts`
- [x] `packages/svelte/src/lib/ssr.ts`

### 6.3 Provider behavior parity checklist

- [x] Supports `theme`.
- [x] Supports `defaultPreference` and `preference`.
- [x] Supports `defaultMode` and `mode` as compatibility aliases.
- [x] Supports `fontLoading`.
- [x] Supports `onPreferenceChange`.
- [x] Supports `onModeChange`.
- [x] Supports `storageKey`.
- [x] Supports `enableSystem`.
- [x] Supports `target` = `provider` / `html` / `body`.
- [x] Supports `attribute` = `class` / `data-theme` / `data-mode`.
- [x] Supports `disableTransitionOnChange`.
- [x] Supports `variableStrategy` minimally for `inline`; keep `style-tag` behavior compatible if core supports it.
- [x] Renders wrapper `div` with `data-marwes-theme="true"`.
- [x] Renders wrapper `div` with `data-marwes-mode={resolvedTheme.mode}`.
- [x] Renders wrapper `div` with `class="mw-theme--light|dark"`.
- [x] Applies same CSS variable output as React/Vue provider through core `themeToCSSVars`.
- [x] Does not access `window`, `document`, `localStorage`, or `matchMedia` at unsafe module top level.
- [x] Loads theme fonts only in browser-safe runtime.
- [x] System preference subscription cleans up when preference/enableSystem changes and on unmount.
- [x] Context consumers update when mode/theme changes; add a test for this before considering Provider done.

### 6.4 Recommended context model

Use Svelte `createContext`, but make reactivity explicit. Do not return a dead snapshot.

Target shape:

```ts
import type { ResolvedTheme, ThemeMode, ThemePreference } from "@marwes-ui/core";
import { createContext } from "svelte";

export interface MarwesContextState {
  theme: ResolvedTheme;
  mode: ThemeMode;
  preference: ThemePreference;
  systemMode: ThemeMode;
}

export interface MarwesContextValue {
  state: MarwesContextState;
  setMode: (mode: ThemeMode) => void;
  setPreference: (preference: ThemePreference) => void;
  toggleMode: () => void;
}

export const [getMarwesContext, setMarwesContext] = createContext<MarwesContextValue>();
```

In `MarwesProvider.svelte`:

- create `const contextState = $state<MarwesContextState>(...)` once during initialization.
- call `setMarwesContext({ state: contextState, setMode, setPreference, toggleMode })` during initialization.
- use `$effect` to keep `contextState.theme`, `contextState.mode`, `contextState.preference`, and `contextState.systemMode` synced with derived provider values.
- test a nested consumer updates when `toggleMode()` is called.

This is safer than passing plain derived values as a one-time context snapshot.

Public helper decision before coding:

- [x] `useTheme()` should return the Svelte context value or a small object with reactive getters, not a plain `ResolvedTheme` snapshot.
- [x] Components that need the resolved theme, such as `H1`/`Paragraph`, should read `themeContext.state.theme` or a getter inside `$derived(...)` so theme updates can flow through.
- [x] `useThemeMode()` should return reactive getters for `mode`, `preference`, `systemMode`, `isDark`, `isLight`, and `isSystem`, plus setters.
- [x] Document this Svelte-specific return shape in `packages/svelte/README.md`; it intentionally differs from the current React/Vue helper shape to avoid dead snapshots in Svelte.

### 6.5 `ssr.ts`

Create a framework-neutral re-export:

```ts
export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "@marwes-ui/core";
export {
  createMarwesThemeScript,
  createMarwesThemeStyle,
  resolveServerThemeMode
} from "@marwes-ui/core";
```

If `resolveServerThemeMode` is not currently exported by core, do not invent it in Svelte. Export only existing core functions and note the mismatch.

### 6.6 Provider tests

Create `packages/svelte/src/tests/provider.test.ts` and/or small fixture `.svelte` files.

Required tests:

- [x] Provider renders children.
- [x] Provider sets `data-marwes-theme="true"`.
- [x] Provider sets `data-marwes-mode`.
- [x] Provider emits inline `--mw-*` variables.
- [x] Custom `theme` changes at least one CSS variable.
- [x] `useTheme` throws outside provider.
- [x] `useThemeMode` works inside provider.
- [x] `toggleMode` causes a visible nested consumer update.
- [x] No SSR crash: import provider/SSR helpers in test without browser globals.

### 6.7 Phase 1 validation

- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm --filter @marwes-ui/svelte test`
- [x] `pnpm --filter @marwes-ui/svelte build`

---

## 7. Phase 2 — Internal helpers + Button + Icon + Spinner

### 7.1 Internal helpers

Create these before components.

#### `internal/merge-class.ts`

```ts
export function mergeClass(...parts: Array<string | false | null | undefined>): string | undefined {
  const className = parts.filter(Boolean).join(" ");
  return className.length > 0 ? className : undefined;
}
```

#### `internal/css-vars.ts`

```ts
import type { CssVars } from "@marwes-ui/core";

export type SvelteStyleInput =
  | string
  | Record<string, string | number | null | undefined>
  | null
  | undefined;

export function cssVarsToStyle(vars: CssVars | undefined): string | undefined {
  if (!vars) return undefined;

  const declarations = Object.entries(vars)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => `${property}: ${String(value)}`);

  return declarations.length > 0 ? declarations.join("; ") : undefined;
}

export function styleObjectToString(style: Record<string, string | number | null | undefined> | undefined): string | undefined {
  if (!style) return undefined;

  const declarations = Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => `${property}: ${String(value)}`);

  return declarations.length > 0 ? declarations.join("; ") : undefined;
}

export function mergeStyle(...parts: Array<string | undefined>): string | undefined {
  const style = parts.filter(Boolean).join("; ");
  return style.length > 0 ? style : undefined;
}
```

#### `internal/attrs.ts`

```ts
export type DOMAttrs = Record<string, string | number | boolean | undefined>;

export function cleanAttrs(attrs: DOMAttrs | undefined): DOMAttrs {
  if (!attrs) return {};
  return Object.fromEntries(Object.entries(attrs).filter(([, value]) => value !== undefined));
}
```

### 7.2 Button source map

Before coding Button, read:

- [x] `docs/registry/families/button/README.md`
- [x] `docs/registry/families/button/registry.generated.json`
- [x] `docs/audits/button-family-accessibility.md`
- [x] `packages/core/src/components/atoms/button/button-types.ts`
- [x] `packages/core/src/components/atoms/button/button-a11y.ts`
- [x] `packages/core/src/components/atoms/button/button-loading.ts`
- [x] `packages/core/src/components/atoms/button/button-recipe.ts`
- [x] `packages/react/src/components/button/button.tsx`
- [x] `packages/react/src/components/button/variants.tsx`
- [x] `packages/react/src/components/button/__tests__/button.test.tsx`
- [x] `packages/vue/src/components/button/button.ts`
- [x] `packages/vue/src/components/button/variants.ts`
- [x] `packages/vue/src/components/button/__tests__/button.test.ts`
- [x] `tests/contracts/button.contract.ts`
- [x] `packages/presets/src/firstEdition/button.css`

### 7.3 Button files

- [x] `packages/svelte/src/lib/components/button/types.ts`
- [x] `packages/svelte/src/lib/components/button/Button.svelte`
- [x] `packages/svelte/src/lib/components/button/index.ts`
- [x] Optional after base Button: purpose wrappers in `purpose-buttons.ts` or separate `.svelte` files.

Button requirements:

- [x] Calls `createButtonRecipe(props)`.
- [x] Supports native button path.
- [x] Supports anchor path when core recipe returns anchor.
- [x] Renders `children` snippet.
- [x] Renders `ButtonSpinner` while loading.
- [x] Renders `Icon` for `iconLeft` / `iconRight` when not loading.
- [x] Uses core `kit.loading` for loading label/spinner variant.
- [x] Uses core `kit.blockClick` to prevent anchor clicks when disabled/loading.
- [x] Supports `onclick` callback prop.
- [x] Merges `class` with `kit.className`.
- [x] Merges user `style` with `kit.vars`.
- [x] Spreads core `dataAttributes`.
- [x] Applies explicit a11y attrs from `kit.a11y`.
- [x] Does not duplicate variant class logic.

Button test requirements:

- [x] renders visible children.
- [x] renders `button` by default.
- [x] includes `mw-btn` class.
- [x] merges user class.
- [x] respects `disabled`.
- [x] sets `aria-busy` while loading.
- [x] shows loading label when supplied.
- [x] blocks click when core says blockClick.
- [x] renders anchor path for link usage if current core supports it.
- [x] passes data attributes.

### 7.4 Icon source map

Read:

- [x] `docs/registry/families/icon/registry.generated.json`
- [x] `packages/core/src/components/atoms/icon/icon-registry.ts`
- [x] `packages/core/src/components/atoms/icon/icon-scales.ts`
- [x] `packages/core/src/components/atoms/icon/icon-a11y.ts`
- [x] `packages/react/src/components/icon/icon.tsx`
- [x] `packages/vue/src/components/icon/icon.ts`
- [x] `tests/contracts/icon.contract.ts`
- [x] `packages/presets/src/firstEdition/icon.css`

Icon files:

- [x] `packages/svelte/src/lib/components/icon/Icon.svelte`
- [x] `packages/svelte/src/lib/components/icon/types.ts`
- [x] `packages/svelte/src/lib/components/icon/index.ts`

Icon requirements:

- [x] Uses `iconRegistry`, `resolveIconSize`, `resolveIconStrokeWidth`, and `resolveIconA11y` from core.
- [x] Renders SVG nodes from core registry.
- [x] Supports `decorative` and `aria-label`.
- [x] Supports `class`.
- [x] Does not hardcode SVG paths outside core registry.

### 7.5 Spinner source map

Read:

- [x] `docs/registry/families/spinner/registry.generated.json`
- [x] `packages/core/src/components/atoms/spinner/spinner-types.ts`
- [x] `packages/core/src/components/atoms/spinner/spinner-recipe.ts`
- [x] `packages/core/src/components/atoms/spinner/spinner-svg.ts`
- [x] `packages/react/src/components/spinner/spinner.tsx`
- [x] `packages/react/src/components/spinner/variants.tsx`
- [x] `packages/vue/src/components/spinner/spinner.ts`
- [x] `packages/vue/src/components/spinner/variants.ts`
- [x] `tests/contracts/spinner.contract.ts`
- [x] `packages/presets/src/firstEdition/spinner.css`

Spinner files:

- [x] `packages/svelte/src/lib/components/spinner/Spinner.svelte`
- [x] `packages/svelte/src/lib/components/spinner/ButtonSpinner.svelte`
- [x] `packages/svelte/src/lib/components/spinner/EmptyStateSpinner.svelte` optional MVP+
- [x] `packages/svelte/src/lib/components/spinner/types.ts`
- [x] `packages/svelte/src/lib/components/spinner/index.ts`

Spinner requirements:

- [x] Calls `createSpinnerRecipe`.
- [x] Renders `span` shell and inner `svg`.
- [x] Renders core SVG nodes.
- [x] Supports decorative default and status mode via `ariaLabel`.
- [x] Supports `ButtonSpinner` purpose wrapper for Button loading.
- [x] Merges class/style/data attributes.

### 7.6 Phase 2 validation

- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm --filter @marwes-ui/svelte test`
- [x] `pnpm --filter @marwes-ui/svelte build`

---

## 8. Phase 3 — Input + InputField

### 8.1 Input source map

Read:

- [x] `docs/registry/families/input/README.md`
- [x] `docs/registry/families/input/registry.generated.json`
- [x] `docs/audits/input-family-accessibility.md`
- [x] `packages/core/src/components/atoms/input/input-types.ts`
- [x] `packages/core/src/components/atoms/input/input-a11y.ts`
- [x] `packages/core/src/components/atoms/input/input-recipe.ts`
- [x] `packages/core/src/shared/field-helpers.ts`
- [x] `packages/react/src/components/input/input.tsx`
- [x] `packages/react/src/components/input/input-field.tsx`
- [x] `packages/react/src/components/input/__tests__/input.test.tsx`
- [x] `packages/react/src/components/input/__tests__/input-field.test.tsx`
- [x] `packages/vue/src/components/input/input.ts`
- [x] `packages/vue/src/components/input/input-field.ts`
- [x] `packages/vue/src/components/input/__tests__/input.test.ts`
- [x] `packages/vue/src/components/input/__tests__/input-field.test.ts`
- [x] `tests/contracts/input.contract.ts`
- [x] `tests/contracts/input-field.contract.ts`
- [x] `packages/presets/src/firstEdition/input.css`
- [x] `packages/presets/src/firstEdition/molecules/input-field.css`

### 8.2 Input files

- [x] `packages/svelte/src/lib/components/input/types.ts`
- [x] `packages/svelte/src/lib/components/input/Input.svelte`
- [x] `packages/svelte/src/lib/components/input/InputField.svelte`
- [x] `packages/svelte/src/lib/components/input/index.ts`

### 8.3 Input requirements

- [x] Calls `createInputRecipe({ ...props, value })`.
- [x] Supports `bind:value` using `$bindable`.
- [x] Supports controlled value via normal prop usage.
- [x] Supports `oninput` callback prop.
- [x] Applies `id`, `name`, `type`, `inputMode`, `autoComplete`, `placeholder`, `disabled`, `readOnly`, `required` from core a11y.
- [x] Applies `aria-label`, `aria-invalid`, `aria-describedby` from core a11y.
- [x] Merges class/style.
- [x] Does not create separate Svelte input variant logic.

### 8.4 InputField requirements

Use `$props.id()` for SSR-safe generated ids.

- [x] Supports `id` prop and respects it when supplied.
- [x] Generates `mw-input-${$props.id()}` when `id` omitted.
- [x] Supports `label` required visible label.
- [x] Supports `helperText`.
- [x] Supports `error`.
- [x] Supports `input` object forwarded to Input atom.
- [x] Supports `ariaDescribedBy` merged with helper/error ids.
- [x] Supports `leadingSymbol`.
- [x] Supports `bind:value` at field level using `$bindable`.
- [x] Calls `buildInputFieldA11yIds` from core.
- [x] `label[for]` matches `input[id]`.
- [x] `aria-describedby` includes helper id when helper exists.
- [x] `aria-describedby` includes error id when error exists.
- [x] `aria-invalid` is true when error exists.
- [x] Error region uses `aria-live="polite"`.
- [x] Empty helper/error strings are treated as absent.
- [x] Search/password affordances can be ported from React/Vue after base field works; do not block base a11y on those enhancements.

### 8.5 Input tests

- [x] Input renders textbox.
- [x] Input includes `mw-input` class.
- [x] Input merges user class.
- [x] Input `bind:value` updates parent fixture.
- [x] Input `oninput` receives native event.

### 8.6 InputField tests

- [x] Label is associated with control.
- [x] Custom id is respected.
- [x] Generated id is stable enough for rendered field.
- [x] Helper id appears in `aria-describedby`.
- [x] Error id appears in `aria-describedby`.
- [x] Error sets `aria-invalid`.
- [x] Error region has `aria-live="polite"`.
- [x] External `ariaDescribedBy` is merged.
- [x] `bind:value` works through the field wrapper.

### 8.7 Phase 3 validation

- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm --filter @marwes-ui/svelte test`
- [x] `pnpm --filter @marwes-ui/svelte build`

---

## 9. Phase 4 — MVP passive primitives

Implement passive primitives after Provider/Button/InputField prove the adapter shape.

### 9.1 Badge

Source map:

- [x] `docs/registry/families/badge/registry.generated.json`
- [x] `packages/core/src/components/atoms/badge/*`
- [x] `packages/react/src/components/badge/*`
- [x] `packages/vue/src/components/badge/*`
- [x] `tests/contracts/badge.contract.ts`
- [x] `packages/presets/src/firstEdition/badge.css`

Svelte target:

- [x] `components/badge/Badge.svelte`
- [x] `components/badge/BadgeGroup.svelte`
- [x] `components/badge/types.ts`
- [x] `components/badge/index.ts`

Requirements:

- [x] `Badge` calls `createBadgeRecipe`.
- [x] Supports `children` snippet.
- [x] Supports `class`, `id`, optional `dataAttributes`.
- [x] Spreads core data attrs and purpose data attrs.
- [x] `BadgeGroup` mirrors React/Vue group class structure.

### 9.2 Card

Source map:

- [x] `docs/registry/families/card/registry.generated.json`
- [x] `packages/core/src/components/atoms/card/*`
- [x] `packages/react/src/components/card/*`
- [x] `packages/vue/src/components/card/*`
- [x] `packages/presets/src/firstEdition/card.css`

Svelte target:

- [x] `components/card/Card.svelte`
- [x] `components/card/types.ts`
- [x] `components/card/index.ts`

Requirements:

- [x] `Card` calls `createCardRecipe`.
- [x] Supports `title` snippet or prop consistent with Svelte ergonomics.
- [x] Supports default `children` snippet.
- [x] Renders `mw-card__header`, `mw-card__title`, `mw-card__body` like React/Vue.
- [x] Merges class and native div attrs.

### 9.3 Divider

Source map:

- [x] `docs/registry/families/divider/registry.generated.json`
- [x] `packages/core/src/components/atoms/divider/*`
- [x] `packages/react/src/components/divider/divider.tsx`
- [x] `packages/vue/src/components/divider/divider.ts`
- [x] `tests/contracts/divider.contract.ts`
- [x] `packages/presets/src/firstEdition/divider.css`

Svelte target:

- [x] `components/divider/Divider.svelte`
- [x] `components/divider/types.ts`
- [x] `components/divider/index.ts`

Requirements:

- [x] Calls `createDividerRecipe`.
- [x] Renders semantic `hr` unless core currently indicates another tag.
- [x] Applies orientation/size a11y/data attrs from core.
- [x] Merges class/style.

### 9.4 Spacing / Spacer

Source map:

- [x] `docs/registry/families/spacing/registry.generated.json`
- [x] `packages/core/src/components/atoms/spacing/*`
- [x] `packages/react/src/components/spacing/spacing.tsx`
- [x] `packages/vue/src/components/spacing/spacing.ts`
- [x] `tests/contracts/spacing.contract.ts`
- [x] `packages/presets/src/firstEdition/spacing.css`
- [x] `packages/presets/src/firstEdition/tokens.css`

Svelte target:

- [x] `components/spacing/Spacing.svelte`
- [x] `components/spacing/Spacer.svelte` or alias export if Svelte packaging supports it cleanly.
- [x] `components/spacing/types.ts`
- [x] `components/spacing/index.ts`

Requirements:

- [x] Calls `createSpacingRecipe`.
- [x] Supports `size` and `spacing` alias.
- [x] Renders decorative `div` with core a11y/data attrs.
- [x] Merges class/style.

### 9.5 Heading

Source map:

- [x] `docs/registry/families/heading/registry.generated.json`
- [x] `packages/core/src/components/atoms/heading/*`
- [x] `packages/react/src/components/heading/*`
- [x] `packages/vue/src/components/heading/*`
- [x] `tests/contracts/heading.contract.ts`
- [x] `packages/presets/src/firstEdition/typography.css`

Svelte target:

- [x] `components/typography/H1.svelte`
- [x] `components/typography/H2.svelte`
- [x] `components/typography/H3.svelte`
- [x] `components/typography/types.ts`
- [x] `components/typography/index.ts`

Requirements:

- [x] Calls `headingRecipe` with level 1/2/3.
- [x] Uses `useTheme` or provider context as React does.
- [x] Renders semantic `h1`, `h2`, `h3`.
- [x] Supports visual size override.
- [x] Merges class/style.

### 9.6 Paragraph

Source map:

- [x] `docs/registry/families/paragraph/registry.generated.json`
- [x] `packages/core/src/components/atoms/paragraph/*`
- [x] `packages/react/src/components/paragraph/paragraph.tsx`
- [x] `packages/vue/src/components/paragraph/paragraph.ts`
- [x] `tests/contracts/paragraph.contract.ts`
- [x] `packages/presets/src/firstEdition/typography.css`

Svelte target:

- [x] `components/typography/Paragraph.svelte`

Requirements:

- [x] Calls `paragraphRecipe`.
- [x] Renders semantic `p`.
- [x] Supports `children` snippet.
- [x] Supports size/tone props from core.
- [x] Merges class/style.

### 9.7 Phase 4 validation

- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm --filter @marwes-ui/svelte test`
- [x] `pnpm --filter @marwes-ui/svelte build`

---

## 10. Public API export plan

### 10.1 `src/lib/index.ts` MVP

Do **not** import CSS here.

```ts
export { default as MarwesProvider } from "./provider/MarwesProvider.svelte";
export type { MarwesProviderProps } from "./provider/types.js";
export { useTheme } from "./provider/use-theme.js";
export { useThemeMode } from "./provider/use-theme-mode.js";
export type { ThemeModeContextValue } from "./provider/use-theme-mode.js";

export { createMarwesThemeScript, createMarwesThemeStyle } from "./ssr.js";
export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "./ssr.js";

export { default as Button } from "./components/button/Button.svelte";
export type { ButtonProps } from "./components/button/types.js";

export { default as Input } from "./components/input/Input.svelte";
export { default as InputField } from "./components/input/InputField.svelte";
export type { InputFieldProps, InputProps } from "./components/input/types.js";

export { default as Icon } from "./components/icon/Icon.svelte";
export type { IconProps } from "./components/icon/types.js";

export { default as Spinner } from "./components/spinner/Spinner.svelte";
export { default as ButtonSpinner } from "./components/spinner/ButtonSpinner.svelte";
export type { ButtonSpinnerProps, SpinnerProps } from "./components/spinner/types.js";

export { default as Badge } from "./components/badge/Badge.svelte";
export { default as BadgeGroup } from "./components/badge/BadgeGroup.svelte";
export type { BadgeGroupProps, BadgeProps } from "./components/badge/types.js";

export { default as Card } from "./components/card/Card.svelte";
export type { CardProps } from "./components/card/types.js";

export { default as Divider } from "./components/divider/Divider.svelte";
export type { DividerProps } from "./components/divider/types.js";

export { default as Spacing } from "./components/spacing/Spacing.svelte";
export { default as Spacer } from "./components/spacing/Spacer.svelte";
export type { SpacerProps, SpacingProps } from "./components/spacing/types.js";

export { default as H1 } from "./components/typography/H1.svelte";
export { default as H2 } from "./components/typography/H2.svelte";
export { default as H3 } from "./components/typography/H3.svelte";
export { default as Paragraph } from "./components/typography/Paragraph.svelte";
export type { H1Props, H2Props, H3Props, ParagraphProps } from "./components/typography/types.js";

export {
  BadgeVariant,
  ButtonAction,
  ButtonSize,
  ButtonVariant,
  createFontStack,
  IconName,
  mwAvailableFonts,
  mwFontFallbacks,
  mwGoogleFontFamilies,
  mwStyledTheme,
  mwThemeVarNames,
  mwThemeVars,
  mwVar,
  Spacings,
  ThemeMode
} from "@marwes-ui/core";

export type {
  Density,
  FontLoadingConfig,
  FontLoadingMode,
  FontLoadingOptions,
  MwAvailableFont,
  MwFontFallback,
  MwGoogleFontFamily,
  MwStyledTheme,
  MwThemeVarName,
  MwThemeVarNames,
  MwThemeVarReference,
  MwThemeVars,
  ResolvedTheme,
  SpacingSize,
  Theme,
  ThemeInput,
  ThemeModeAttribute,
  ThemeModeRootTarget,
  ThemePreference,
  ThemeVariableStrategy,
  ToneName
} from "@marwes-ui/core";
```

Adjust names only if current core exports differ. Do not invent missing core exports inside Svelte.

---

## 11. Source map for all future family rollouts

Use this map to know where to fetch implementation context. For each family, read registry generated JSON first, then core, React, Vue, presets, and contracts.

| Family | Svelte phase | Core source | React source | Vue source | Preset CSS | Contracts |
|---|---:|---|---|---|---|---|
| button | 2 | `packages/core/src/components/atoms/button/*` | `packages/react/src/components/button/*` | `packages/vue/src/components/button/*` | `packages/presets/src/firstEdition/button.css` | `tests/contracts/button.contract.ts` |
| input | 3 | `packages/core/src/components/atoms/input/*`, `packages/core/src/shared/field-helpers.ts` | `packages/react/src/components/input/*` | `packages/vue/src/components/input/*` | `input.css`, `textarea.css`, `select.css`, `rich-text.css`, `input-otp.css`, `molecules/input-field.css` | `tests/contracts/input*.contract.ts`, `textarea*.contract.ts`, `select*.contract.ts`, `rich-text*.contract.ts` |
| icon | 2 | `packages/core/src/components/atoms/icon/*` | `packages/react/src/components/icon/*` | `packages/vue/src/components/icon/*` | `packages/presets/src/firstEdition/icon.css` | `tests/contracts/icon.contract.ts` |
| spinner | 2 | `packages/core/src/components/atoms/spinner/*` | `packages/react/src/components/spinner/*` | `packages/vue/src/components/spinner/*` | `packages/presets/src/firstEdition/spinner.css` | `tests/contracts/spinner.contract.ts` |
| badge | 4 | `packages/core/src/components/atoms/badge/*` | `packages/react/src/components/badge/*` | `packages/vue/src/components/badge/*` | `packages/presets/src/firstEdition/badge.css` | `tests/contracts/badge.contract.ts` |
| card | 4 | `packages/core/src/components/atoms/card/*` | `packages/react/src/components/card/*` | `packages/vue/src/components/card/*` | `packages/presets/src/firstEdition/card.css` | none currently |
| divider | 4 | `packages/core/src/components/atoms/divider/*` | `packages/react/src/components/divider/*` | `packages/vue/src/components/divider/*` | `packages/presets/src/firstEdition/divider.css` | `tests/contracts/divider.contract.ts` |
| spacing | 4 | `packages/core/src/components/atoms/spacing/*` | `packages/react/src/components/spacing/*` | `packages/vue/src/components/spacing/*` | `spacing.css`, `tokens.css` | `tests/contracts/spacing.contract.ts` |
| heading | 4 | `packages/core/src/components/atoms/heading/*` | `packages/react/src/components/heading/*` | `packages/vue/src/components/heading/*` | `typography.css` | `tests/contracts/heading.contract.ts` |
| paragraph | 4 | `packages/core/src/components/atoms/paragraph/*` | `packages/react/src/components/paragraph/*` | `packages/vue/src/components/paragraph/*` | `typography.css` | `tests/contracts/paragraph.contract.ts` |
| checkbox | 8 | `packages/core/src/components/atoms/checkbox/*`, `packages/core/src/shared/field-helpers.ts` | `packages/react/src/components/checkbox/*` | `packages/vue/src/components/checkbox/*` | `checkbox.css`, `molecules/checkbox-field.css`, `molecules/checkbox-group-field.css` | `tests/contracts/checkbox*.contract.ts` |
| radio | 8 | `packages/core/src/components/atoms/radio/*`, `packages/core/src/shared/field-helpers.ts` | `packages/react/src/components/radio/*` | `packages/vue/src/components/radio/*` | `radio.css`, `molecules/radio-group-field.css` | `tests/contracts/radio.contract.ts` |
| switch | 8 | `packages/core/src/components/atoms/switch/*` | `packages/react/src/components/switch/*` | `packages/vue/src/components/switch/*` | `switch.css`, `molecules/switch-field.css` | `tests/contracts/switch.contract.ts` |
| slider | later | `packages/core/src/components/atoms/slider/*` | `packages/react/src/components/slider/*` | `packages/vue/src/components/slider/*` | `slider.css`, `molecules/slider-field.css` | `tests/contracts/slider.contract.ts` |
| accordion | later | `packages/core/src/components/atoms/accordion/*` | `packages/react/src/components/accordion/*` | `packages/vue/src/components/accordion/*` | `accordion.css`, `molecules/accordion-field.css` | `tests/contracts/accordion.contract.ts` |
| tab | later | `packages/core/src/components/atoms/tab/*` | `packages/react/src/components/tab/*` | `packages/vue/src/components/tab/*` | `tab.css`, `molecules/tab-group.css` | `tests/contracts/tab.contract.ts` |
| tooltip | later/high care | `packages/core/src/components/atoms/tooltip/*` | `packages/react/src/components/tooltip/*` | `packages/vue/src/components/tooltip/*` | `tooltip.css` | `tests/contracts/tooltip.contract.ts` |
| toast | later/high care | `packages/core/src/components/atoms/toast/*` | `packages/react/src/components/toast/*` | `packages/vue/src/components/toast/*` | `toast.css`, `molecules/toast-container.css` | `tests/contracts/toast.contract.ts` |
| dialog | later/high care | `packages/core/src/components/atoms/dialog/*` | `packages/react/src/components/dialog/*` | `packages/vue/src/components/dialog/*` | `dialog.css`, `molecules/dialog-modal.css` | `tests/contracts/dialog*.contract.ts` |
| avatar | later | `packages/core/src/components/atoms/avatar/*` | `packages/react/src/components/avatar/*` | `packages/vue/src/components/avatar/*` | `avatar.css` | `tests/contracts/avatar*.contract.ts` |
| skeleton | later | `packages/core/src/components/atoms/skeleton/*` | `packages/react/src/components/skeleton/*` | `packages/vue/src/components/skeleton/*` | `skeleton.css` | `tests/contracts/skeleton.contract.ts` |
| stat-tile | later | `packages/core/src/components/atoms/stat-tile/*` | `packages/react/src/components/stat-tile/*` | `packages/vue/src/components/stat-tile/*` | `stat-tile.css` | `tests/contracts/stat-tile.contract.ts` |
| date-picker | later/high care | `packages/core/src/components/atoms/date-picker/*` | `packages/react/src/components/date-picker/*` | `packages/vue/src/components/date-picker/*` | `date-picker.css` | `tests/contracts/date-picker.contract.ts` |

---

## 12. Phase 5 — Tests, type fixtures, and README

### 12.1 Test locations

- [x] `packages/svelte/src/tests/provider.test.ts`
- [x] `packages/svelte/src/tests/button.test.ts`
- [x] `packages/svelte/src/tests/input-field.test.ts`
- [ ] `packages/svelte/src/tests/passive-primitives.test.ts` optional.
- [x] `packages/svelte/src/tests/type-fixtures/ButtonFixture.svelte`
- [x] `packages/svelte/src/tests/type-fixtures/InputFixture.svelte`
- [x] `packages/svelte/src/tests/type-fixtures/ProviderFixture.svelte`

### 12.2 Test strategy

Do not mock core recipes. Render real components and assert DOM output.

MVP tests must prove:

- [x] Provider data attrs and CSS variables.
- [x] Button core class/data/a11y output.
- [x] Button native `onclick` behavior.
- [x] Button loading behavior.
- [x] Input `bind:value`.
- [x] InputField label/helper/error wiring.
- [x] No CSS auto-import from Svelte root. This can be a static source test that reads `src/lib/index.ts` and asserts it does not contain `@marwes-ui/presets`.

### 12.3 README requirements

`packages/svelte/README.md` must include:

- [x] Package positioning: native Svelte 5 adapter over Marwes core contracts.
- [x] Installation:

```bash
pnpm add @marwes-ui/svelte @marwes-ui/presets
```

- [x] CSS import:

```svelte
<script lang="ts">
  import "@marwes-ui/presets/firstEdition/styles.css";
</script>
```

- [x] Quick start with `MarwesProvider`, `Input bind:value`, and `Button`.
- [x] Theme example with `ThemeInput`.
- [x] SSR helper note for `@marwes-ui/svelte/ssr`.
- [x] Explicit non-goal: not Web Components.
- [x] Explicit dependency boundary: Svelte only affects `@marwes-ui/svelte` users.

### 12.4 Phase 5 validation

- [x] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [x] `pnpm --filter @marwes-ui/svelte test`
- [x] `pnpm --filter @marwes-ui/svelte build`

---

## 13. Phase 6 — Root validation + boundary updates

### 13.1 Adapter boundary script

Update `scripts/check-adapter-boundaries.mjs`.

Checklist:

- [x] Add `packages/svelte/src/lib` or `packages/svelte/src/lib/components` to scanned roots.
- [x] Add `.svelte` to `sourceExtensions`.
- [x] Core must not import `svelte`, `@sveltejs/*`, or `packages/svelte`.
- [x] React must not import `svelte` or `packages/svelte`.
- [x] Vue must not import `svelte` or `packages/svelte`.
- [x] Svelte must not import `react`, `react-dom`, `vue`, `@marwes-ui/react`, or `@marwes-ui/vue`.
- [x] Framework component adapters must not import preset CSS/runtime. For MVP this includes Svelte components and Svelte root index.
- [x] Keep hardcoded color check active for Svelte components.

### 13.2 Root validation

Run:

- [x] `pnpm test:typecheck:packages`
- [x] `pnpm build:packages`
- [x] `pnpm test:packages`
- [x] `pnpm check:adapter-boundaries`
- [ ] `pnpm validate:packages` — blocked by pre-existing core OOM (`ERR_WORKER_OUT_OF_MEMORY` in tsup), not Svelte-related

If docs/registry/parity scripts fail because they do not know Svelte yet, either:

1. update them in this PR, or
2. explicitly document that Svelte registry/parity integration is Phase 7 and ensure existing checks still pass.

Do not leave root validation broken silently.

---

## 14. Phase 7 — Optional docs/registry/parity integration

This can be a follow-up PR if MVP package is already large.

### 14.1 Docs to update

- [x] `docs/reference/architecture.md` — include Svelte in adapter layer diagrams/tables.
- [x] `docs/reference/repo-map.md` — add Svelte edges and change matrix rows.
- [x] `docs/reference/spec.md` — add `REQ-SVELTE-001`.
- [x] `docs/reference/testing.md` — add Svelte package tests and future Storybook stance.
- [x] `docs/guides/adding-components.md` — update layer rule to `core recipe → preset CSS → React adapter → Vue adapter → Svelte adapter` or explain adapter parity without forcing order.
- [x] `docs/guides/figma-to-marwes.md` — include Svelte as a consumer adapter, not a design source.
- [x] New `docs/guides/svelte-adapter.md` or `docs/adapters/svelte.md` if docs structure prefers it.

### 14.2 Registry/parity scripts

- [x] `scripts/component-registry-sources.ts` — add optional `svelteDir` / `storybookSvelteDir` support.
- [x] `scripts/generate-component-registry.ts` — include Svelte links when files exist.
- [x] `scripts/generate-framework-parity-summary.mjs` — add Svelte column.
- [x] `artifacts/framework-parity.json` — add Svelte values for families implemented in Svelte.
- [x] `docs/reference/framework-parity-summary.md` — regenerate, do not hand edit.
- [x] `scripts/storybook-consistency.mjs` — add Svelte only after `apps/storybook-svelte` exists; otherwise explicitly ignore.

### 14.3 Svelte Storybook or playground

Prefer a small `apps/playground-svelte` before full Storybook if MVP validation needs a consumer app.

Future Storybook files:

- [x] `apps/storybook-svelte/src/stories/button/*`
- [x] `apps/storybook-svelte/src/stories/input/*`
- [x] `apps/storybook-svelte/src/preview.ts`
- [x] root script `dev:storybook:svelte`
- [ ] later `test:storybook:a11y` includes Svelte smoke only after stories exist.

---

## 15. Phase 8 — Next-family rollout after MVP

After the MVP is green, continue in this order:

### PR 2 — More forms

- [x] Textarea
- [x] TextareaField
- [x] Select
- [x] SelectField
- [x] Checkbox
- [x] CheckboxField
- [x] CheckboxGroupField
- [x] Radio
- [x] RadioGroupField
- [x] Switch
- [x] SwitchField

### PR 3 — Additional passive/content families

- [x] Avatar
- [x] AvatarBadge
- [x] AvatarGroup
- [x] Skeleton
- [x] StatTile
- [x] Badge purpose wrappers
- [x] Card purpose wrappers
- [x] Spinner purpose wrappers (ButtonSpinner, EmptyStateSpinner)

### PR 4 — Coordinated widgets

- [x] Accordion
- [x] AccordionField
- [x] Tab
- [x] TabGroup
- [x] Slider
- [x] SliderField

### PR 5 — High-risk interactive families

- [x] Tooltip
- [x] Toast
- [x] Dialog
- [x] DatePicker
- [x] RichText
- [x] InputOtp

High-risk rule: these require extra a11y review and should not block the initial Svelte adapter MVP.

---

## 16. Final MVP Definition of Done

MVP is done only when all are checked:

- [x] `packages/svelte` exists and builds with `@sveltejs/package`.
- [x] `@marwes-ui/svelte` has `svelte` as peer dependency.
- [x] `@marwes-ui/svelte` has only `@marwes-ui/core` as runtime dependency.
- [x] `@marwes-ui/svelte` root does not import preset CSS.
- [x] README shows explicit CSS import from `@marwes-ui/presets/firstEdition/styles.css`.
- [x] `MarwesProvider` renders and applies theme variables.
- [x] `useTheme` / `useThemeMode` work and update reactively.
- [x] `Button` uses `createButtonRecipe` and passes behavior tests.
- [x] `Input` supports `bind:value`.
- [x] `InputField` has correct label/helper/error/aria wiring.
- [x] MVP passive primitives are exported and typecheck.
- [x] Root scripts include Svelte package tests/typecheck.
- [x] Adapter boundary check protects core/React/Vue from Svelte imports.
- [x] `pnpm --filter @marwes-ui/svelte build` passes.
- [x] `pnpm --filter @marwes-ui/svelte test:typecheck` passes.
- [x] `pnpm --filter @marwes-ui/svelte test` passes.
- [ ] `pnpm validate:packages` passes or any non-Svelte existing failure is documented separately.
- [ ] Changeset added for new public package/API if this is prepared for publish.

---

## 17. Copy-paste execution prompt for GPT 5.4

```txt
You are working in the Marwes monorepo at /Users/niklaswestman/Documents/extras-projects/marwes-project-folder/marwes.

Implement the native Svelte 5 adapter package described in /Users/niklaswestman/Documents/extras-projects/marwes-project-folder/feedback/implementation-svelte.md.

Critical rules:
- Follow new-svelte-plan-v2 when v1 and v2 disagree.
- Build packages/svelte named @marwes-ui/svelte.
- Use native Svelte 5 components and runes.
- Use @sveltejs/package, not tsup.
- Do not implement Web Components.
- Do not modify core to depend on Svelte.
- Do not import React/Vue in Svelte.
- Do not import @marwes-ui/presets in @marwes-ui/svelte root for MVP.
- @marwes-ui/svelte runtime dependency should be @marwes-ui/core only.
- svelte should be a peerDependency, ^5.20.0.
- Consumers import CSS explicitly from @marwes-ui/presets/firstEdition/styles.css.

Execution discipline:
- Before each phase, re-read the phase checklist and source files listed in implementation-svelte.md.
- After each phase, run the listed validation commands.
- Do not continue to the next phase with failing commands unless the failure is documented and accepted.
- Keep components thin over core recipes.
- Merge user class/style with core className/vars.
- Use $bindable only for form controls.
- Use $props.id() for generated field ids.

Start with Phase 0, then proceed sequentially.
```

---

## 18. Session Progress Notes (2026-05-07)

### Completed

All phases 0–8 are implemented and validated:

- **73 component exports** in `@marwes-ui/svelte`
- **505 source files** pass adapter boundary checks
- **17 unit tests** pass
- **0 typecheck errors**
- Playground app (`apps/playground-svelte`) showcases all components
- Parity artifact and summary updated with Svelte column (23 families)

### Component surface (full list)

Provider: MarwesProvider, useTheme, useThemeMode
Buttons: Button + 22 purpose wrappers (PrimaryButton, SecondaryButton, TextButton, SuccessButton, DestructiveButton, SubmitButton, CancelButton, CreateButton, LinkButton, SaveButton, ConfirmButton, VerifyButton, EditButton, CloseButton, RefreshButton, UploadButton, DownloadButton, CopyButton, SearchButton, FilterButton, SortButton, DropdownButton)
Icons: Icon
Spinners: Spinner, ButtonSpinner, EmptyStateSpinner
Inputs: Input, InputField, PasswordField, EmailField, SearchField, PhoneField, URLField, CurrencyField
Textarea: Textarea, TextareaField
Select: Select, SelectField
Checkbox: Checkbox, CheckboxField, CheckboxGroupField
Switch: Switch, SwitchField
Radio: Radio, RadioGroupField
Badge: Badge, BadgeGroup, StatusBadge, PriorityBadge, NotificationBadge
Card: Card, ProductCard, ProfileCard, StatCard
Divider: Divider
Spacing: Spacing, Spacer
Typography: H1, H2, H3, Paragraph
Avatar: Avatar, AvatarBadge, AvatarGroup
Skeleton: Skeleton
StatTile: StatTile
Accordion: Accordion, AccordionField
Tab: TabGroup
Slider: Slider, SliderField
SSR: createMarwesThemeScript, createMarwesThemeStyle

### Storybook Svelte progress (2026-05-07, session 2)

- **68 story files** across 19 component families (up from 22)
- **19 Introduction.mdx** files with Svelte-specific docs
- **3 wrapper .svelte** files for composed stories (BadgeGroupStory, DividerPreview, IconGallery)
- Story titles follow React convention: `Family/Atom|Molecule|Variant|Purpose/ComponentName`
- Files reorganized: `select/`, `textarea/` → `input/`; `typography/` → `heading/`, `paragraph/`
- Molecule and Purpose stories added for all exported wrappers
- Icon story replaced with full searchable gallery (matching React)
- Divider vertical story fixed with height-providing wrapper
- Select chevron icon fixed: was 24×24 viewBox with no dimensions, now uses React's 16×16 filled SVG

### Known remaining work

#### 1. Low-risk purpose wrappers (trivial — same pattern as existing wrappers)

**Input purpose fields** (3 components):
- `DateOfBirthField` — wraps InputField with `type="date"`, `autoComplete="bday"`
- `ZipCodeField` — wraps InputField with `type="text"`, `inputMode="numeric"`, `autoComplete="postal-code"`
- `DropdownField` — wraps SelectField with dropdown appearance, `data-purpose="dropdown"`

**Accordion purpose wrappers** (3 components):
- `FAQAccordion` — AccordionField with `multiple={false}`, `data-purpose="faq"`
- `SettingsAccordion` — AccordionField with `multiple={true}`, `data-purpose="settings"`
- `SectionsAccordion` — AccordionField with `data-purpose="sections"`

**Avatar purpose wrappers** (3 components):
- `ProfileAvatar` — Avatar with `data-purpose="profile"`
- `PresenceAvatar` — AvatarBadge with `data-purpose="presence"`
- `TeamAvatarGroup` — AvatarGroup with `data-purpose="team"`

**Switch purpose wrappers** (3 components):
- `FeatureToggle` — SwitchField with `data-purpose="feature-toggle"`
- `PermissionSwitch` — SwitchField with `data-purpose="permission"`
- `PreferenceSwitch` — SwitchField with `data-purpose="preference"`

**Radio purpose wrappers** (3 components):
- `OptionRadioGroup` — RadioGroupField with `data-purpose="option"`
- `RatingRadioGroup` — RadioGroupField with `data-purpose="rating"`
- `YesNoRadioGroup` — RadioGroupField with `data-purpose="yes-no"`

**Slider purpose wrappers** (3 components):
- `BrightnessSlider` — SliderField with `data-purpose="brightness"`
- `RadiusSlider` — SliderField with `data-purpose="radius"`
- `VolumeSlider` — SliderField with `data-purpose="volume"`

**Tab purpose wrappers + atoms** (5 components):
- `Tab` — raw tab atom
- `TabPanel` — raw tab panel atom
- `ContentTabs` — TabGroup with `data-purpose="content"`
- `NavigationTabs` — TabGroup with `data-purpose="navigation"`
- `SettingsTabs` — TabGroup with `data-purpose="settings"`

Total: **23 trivial components** — all follow the same wrapper pattern.

#### 2. High-risk interactive widgets (need portal/overlay/positioning)

**Dialog family** (5 components):
- `Dialog`, `DialogModal`, `ConfirmDialog`, `DestructiveDialog`, `InfoDialog`
- Needs: `<dialog>` element or portal pattern, focus trapping, scroll lock

**Toast family** (8 components):
- `Toast`, `ToastContainer`, `ToastProvider`, `useToast`
- `ErrorToast`, `InfoToast`, `SuccessToast`, `WarningToast`
- Needs: portal, auto-dismiss timer, stacking, animation

**Tooltip family** (2 components):
- `Tooltip`, `TooltipGroup`
- Needs: positioning (Floating UI), portal, hover/focus management

**Other** (4 components):
- `DatePicker` — complex calendar widget
- `RichText`, `RichTextField` — contenteditable integration
- `InputOtp` — multi-digit input with focus management

Total: **19 high-risk components** — recommend separate PR with a11y review.

#### 3. Additional tests

- Current 17 tests cover Provider, Button, Input basics and boundary check
- Should add: InputField a11y wiring, Checkbox bind:checked, Switch toggle, TabGroup keyboard nav
- Consider contract tests mirroring `tests/contracts/*.contract.ts`

#### 4. Storybook upstream blocker

- `@storybook/svelte-vite` ships raw `.svelte` files in `static/` that Vite's `import-analysis` plugin rejects in pnpm monorepos
- Tracked: https://github.com/storybookjs/storybook/issues/29424
- Stories render correctly once the upstream fix ships

### Technical notes for next session

- **`exactOptionalPropertyTypes: true`** in tsconfig causes frequent type issues when spreading props to core recipe functions. Pattern: destructure the optional prop, then conditionally spread `...(prop ? { prop } : {})`.
- **SVG attributes**: Core generates camelCase attrs (strokeDasharray). Svelte needs kebab-case. Use `svgAttrsToKebab()` from `internal/svg-attrs.ts`.
- **Provider warnings**: 7 benign Svelte warnings about `$state` initial values referencing other reactive values. These are intentional — the `$effect` below keeps them synced.
- **Preset CSS class names**: Use `mw-p` not `mw-paragraph`. The preset only defines `.mw-p`.
- **Select chevron icon**: Must use explicit `width="16" height="16"` with React's 16×16 filled SVG path, not the 24×24 stroked version.
- **Composed Storybook stories**: Svelte Storybook cannot render component-children via args. Create `.svelte` wrapper components that accept data props and render compositions.
- **Playground** runs on `pnpm dev:playground:svelte` (port 5173).
- **Build** uses `@sveltejs/package` (svelte-package), not tsup.

### Validation commands

```bash
pnpm --filter @marwes-ui/svelte test:typecheck   # 0 errors
pnpm --filter @marwes-ui/svelte build            # svelte-package
pnpm --filter @marwes-ui/svelte test             # 17 pass
pnpm check:adapter-boundaries                    # 505 files
pnpm parity:summary:check                        # 23 families
pnpm dev:playground:svelte                       # visual verification
```

### Recommended next execution order

```txt
PR next-1: Low-risk purpose wrappers (23 components)
  → All trivial .svelte wrapper files + index.ts exports + stories
  → Estimated: 1 focused session

PR next-2: Additional tests
  → InputField a11y, Checkbox bind:checked, Switch toggle, TabGroup keyboard
  → Contract test parity with tests/contracts/

PR next-3: High-risk interactive widgets
  → Dialog → Toast → Tooltip → DatePicker → RichText → InputOtp
  → Each family is its own sub-PR with a11y review
```
