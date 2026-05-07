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

- [ ] Do not import Svelte from `packages/core`, `packages/react`, or `packages/vue`.
- [ ] Do not import React or Vue from `packages/svelte`.
- [ ] Do not build Web Components or custom elements in MVP.
- [ ] Do not move behavior, variants, a11y rules, or theme normalization into Svelte.
- [ ] Do not hardcode colors/tokens/variant class maps in Svelte components.
- [ ] Do not import `@marwes-ui/presets` in `packages/svelte/src/lib/index.ts` for MVP.
- [ ] Do not use SvelteKit-only imports such as `$app/*` in package code.
- [ ] Use Svelte 5 runes: `$props`, `$props.id()`, `$state`, `$derived`, `$effect`, `$bindable`.
- [ ] Avoid legacy `export let`, `$:`, `<slot>`, `on:click`, and `createEventDispatcher` for simple native event forwarding.
- [ ] Use native elements first: `button`, `a`, `input`, `textarea`, `select`, `hr`, `h1`, `p`, `span`, etc.
- [ ] For every family: core recipe output must own `className`, `vars`, `a11y`, and `dataAttributes`.

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

- [ ] `packages/svelte/package.json`
- [ ] `packages/svelte/svelte.config.js`
- [ ] `packages/svelte/tsconfig.json`
- [ ] `packages/svelte/vitest.config.ts`
- [ ] `packages/svelte/README.md`
- [ ] `packages/svelte/CHANGELOG.md`
- [ ] `packages/svelte/src/lib/index.ts`
- [ ] `packages/svelte/src/lib/ssr.ts`
- [ ] `packages/svelte/src/lib/internal/merge-class.ts`
- [ ] `packages/svelte/src/lib/internal/css-vars.ts`
- [ ] `packages/svelte/src/lib/internal/attrs.ts`
- [ ] `packages/svelte/src/lib/provider/`
- [ ] `packages/svelte/src/lib/components/`
- [ ] `packages/svelte/src/tests/`

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

- [ ] In public package source, use `.js` suffixes for relative TypeScript module imports that survive into published ESM, for example `import type { ButtonProps } from "./types.js"`.
- [ ] This applies inside `.ts` files and inside `<script lang="ts">` blocks in `.svelte` files.
- [ ] Svelte component imports keep their `.svelte` suffix, for example `import Icon from "../icon/Icon.svelte"`.

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

- [ ] `pnpm install`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm build:packages`

Do not continue until the empty package builds.

---

## 6. Phase 1 — Provider/theme/SSR

### 6.1 Source files to re-read first

Provider/theme sources:

- [ ] `packages/react/src/provider/marwes-provider.tsx`
- [ ] `packages/react/src/provider/marwes-context.ts`
- [ ] `packages/react/src/provider/use-theme.ts`
- [ ] `packages/react/src/provider/use-theme-mode.ts`
- [ ] `packages/react/src/provider/runtime-theme.ts`
- [ ] `packages/react/src/provider/theme-mode-runtime.ts`
- [ ] `packages/react/src/ssr.tsx`
- [ ] `packages/vue/src/provider/marwes-provider.ts`
- [ ] `packages/vue/src/provider/marwes-context.ts`
- [ ] `packages/vue/src/provider/use-theme.ts`
- [ ] `packages/vue/src/provider/use-theme-mode.ts`
- [ ] `packages/vue/src/provider/runtime-theme.ts`
- [ ] `packages/vue/src/provider/theme-mode-runtime.ts`
- [ ] `packages/vue/src/ssr.ts`
- [ ] `packages/core/src/theme/*`
- [ ] `packages/core/src/index.ts`

### 6.2 Files to create

- [ ] `packages/svelte/src/lib/provider/types.ts`
- [ ] `packages/svelte/src/lib/provider/context.ts`
- [ ] `packages/svelte/src/lib/provider/MarwesProvider.svelte`
- [ ] `packages/svelte/src/lib/provider/use-theme.ts`
- [ ] `packages/svelte/src/lib/provider/use-theme-mode.ts`
- [ ] `packages/svelte/src/lib/provider/runtime-theme.ts`
- [ ] `packages/svelte/src/lib/provider/theme-mode-runtime.ts`
- [ ] `packages/svelte/src/lib/ssr.ts`

### 6.3 Provider behavior parity checklist

- [ ] Supports `theme`.
- [ ] Supports `defaultPreference` and `preference`.
- [ ] Supports `defaultMode` and `mode` as compatibility aliases.
- [ ] Supports `fontLoading`.
- [ ] Supports `onPreferenceChange`.
- [ ] Supports `onModeChange`.
- [ ] Supports `storageKey`.
- [ ] Supports `enableSystem`.
- [ ] Supports `target` = `provider` / `html` / `body`.
- [ ] Supports `attribute` = `class` / `data-theme` / `data-mode`.
- [ ] Supports `disableTransitionOnChange`.
- [ ] Supports `variableStrategy` minimally for `inline`; keep `style-tag` behavior compatible if core supports it.
- [ ] Renders wrapper `div` with `data-marwes-theme="true"`.
- [ ] Renders wrapper `div` with `data-marwes-mode={resolvedTheme.mode}`.
- [ ] Renders wrapper `div` with `class="mw-theme--light|dark"`.
- [ ] Applies same CSS variable output as React/Vue provider through core `themeToCSSVars`.
- [ ] Does not access `window`, `document`, `localStorage`, or `matchMedia` at unsafe module top level.
- [ ] Loads theme fonts only in browser-safe runtime.
- [ ] System preference subscription cleans up when preference/enableSystem changes and on unmount.
- [ ] Context consumers update when mode/theme changes; add a test for this before considering Provider done.

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

- [ ] `useTheme()` should return the Svelte context value or a small object with reactive getters, not a plain `ResolvedTheme` snapshot.
- [ ] Components that need the resolved theme, such as `H1`/`Paragraph`, should read `themeContext.state.theme` or a getter inside `$derived(...)` so theme updates can flow through.
- [ ] `useThemeMode()` should return reactive getters for `mode`, `preference`, `systemMode`, `isDark`, `isLight`, and `isSystem`, plus setters.
- [ ] Document this Svelte-specific return shape in `packages/svelte/README.md`; it intentionally differs from the current React/Vue helper shape to avoid dead snapshots in Svelte.

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

- [ ] Provider renders children.
- [ ] Provider sets `data-marwes-theme="true"`.
- [ ] Provider sets `data-marwes-mode`.
- [ ] Provider emits inline `--mw-*` variables.
- [ ] Custom `theme` changes at least one CSS variable.
- [ ] `useTheme` throws outside provider.
- [ ] `useThemeMode` works inside provider.
- [ ] `toggleMode` causes a visible nested consumer update.
- [ ] No SSR crash: import provider/SSR helpers in test without browser globals.

### 6.7 Phase 1 validation

- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte test`
- [ ] `pnpm --filter @marwes-ui/svelte build`

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

- [ ] `docs/registry/families/button/README.md`
- [ ] `docs/registry/families/button/registry.generated.json`
- [ ] `docs/audits/button-family-accessibility.md`
- [ ] `packages/core/src/components/atoms/button/button-types.ts`
- [ ] `packages/core/src/components/atoms/button/button-a11y.ts`
- [ ] `packages/core/src/components/atoms/button/button-loading.ts`
- [ ] `packages/core/src/components/atoms/button/button-recipe.ts`
- [ ] `packages/react/src/components/button/button.tsx`
- [ ] `packages/react/src/components/button/variants.tsx`
- [ ] `packages/react/src/components/button/__tests__/button.test.tsx`
- [ ] `packages/vue/src/components/button/button.ts`
- [ ] `packages/vue/src/components/button/variants.ts`
- [ ] `packages/vue/src/components/button/__tests__/button.test.ts`
- [ ] `tests/contracts/button.contract.ts`
- [ ] `packages/presets/src/firstEdition/button.css`

### 7.3 Button files

- [ ] `packages/svelte/src/lib/components/button/types.ts`
- [ ] `packages/svelte/src/lib/components/button/Button.svelte`
- [ ] `packages/svelte/src/lib/components/button/index.ts`
- [ ] Optional after base Button: purpose wrappers in `purpose-buttons.ts` or separate `.svelte` files.

Button requirements:

- [ ] Calls `createButtonRecipe(props)`.
- [ ] Supports native button path.
- [ ] Supports anchor path when core recipe returns anchor.
- [ ] Renders `children` snippet.
- [ ] Renders `ButtonSpinner` while loading.
- [ ] Renders `Icon` for `iconLeft` / `iconRight` when not loading.
- [ ] Uses core `kit.loading` for loading label/spinner variant.
- [ ] Uses core `kit.blockClick` to prevent anchor clicks when disabled/loading.
- [ ] Supports `onclick` callback prop.
- [ ] Merges `class` with `kit.className`.
- [ ] Merges user `style` with `kit.vars`.
- [ ] Spreads core `dataAttributes`.
- [ ] Applies explicit a11y attrs from `kit.a11y`.
- [ ] Does not duplicate variant class logic.

Button test requirements:

- [ ] renders visible children.
- [ ] renders `button` by default.
- [ ] includes `mw-btn` class.
- [ ] merges user class.
- [ ] respects `disabled`.
- [ ] sets `aria-busy` while loading.
- [ ] shows loading label when supplied.
- [ ] blocks click when core says blockClick.
- [ ] renders anchor path for link usage if current core supports it.
- [ ] passes data attributes.

### 7.4 Icon source map

Read:

- [ ] `docs/registry/families/icon/registry.generated.json`
- [ ] `packages/core/src/components/atoms/icon/icon-registry.ts`
- [ ] `packages/core/src/components/atoms/icon/icon-scales.ts`
- [ ] `packages/core/src/components/atoms/icon/icon-a11y.ts`
- [ ] `packages/react/src/components/icon/icon.tsx`
- [ ] `packages/vue/src/components/icon/icon.ts`
- [ ] `tests/contracts/icon.contract.ts`
- [ ] `packages/presets/src/firstEdition/icon.css`

Icon files:

- [ ] `packages/svelte/src/lib/components/icon/Icon.svelte`
- [ ] `packages/svelte/src/lib/components/icon/types.ts`
- [ ] `packages/svelte/src/lib/components/icon/index.ts`

Icon requirements:

- [ ] Uses `iconRegistry`, `resolveIconSize`, `resolveIconStrokeWidth`, and `resolveIconA11y` from core.
- [ ] Renders SVG nodes from core registry.
- [ ] Supports `decorative` and `aria-label`.
- [ ] Supports `class`.
- [ ] Does not hardcode SVG paths outside core registry.

### 7.5 Spinner source map

Read:

- [ ] `docs/registry/families/spinner/registry.generated.json`
- [ ] `packages/core/src/components/atoms/spinner/spinner-types.ts`
- [ ] `packages/core/src/components/atoms/spinner/spinner-recipe.ts`
- [ ] `packages/core/src/components/atoms/spinner/spinner-svg.ts`
- [ ] `packages/react/src/components/spinner/spinner.tsx`
- [ ] `packages/react/src/components/spinner/variants.tsx`
- [ ] `packages/vue/src/components/spinner/spinner.ts`
- [ ] `packages/vue/src/components/spinner/variants.ts`
- [ ] `tests/contracts/spinner.contract.ts`
- [ ] `packages/presets/src/firstEdition/spinner.css`

Spinner files:

- [ ] `packages/svelte/src/lib/components/spinner/Spinner.svelte`
- [ ] `packages/svelte/src/lib/components/spinner/ButtonSpinner.svelte`
- [ ] `packages/svelte/src/lib/components/spinner/EmptyStateSpinner.svelte` optional MVP+
- [ ] `packages/svelte/src/lib/components/spinner/types.ts`
- [ ] `packages/svelte/src/lib/components/spinner/index.ts`

Spinner requirements:

- [ ] Calls `createSpinnerRecipe`.
- [ ] Renders `span` shell and inner `svg`.
- [ ] Renders core SVG nodes.
- [ ] Supports decorative default and status mode via `ariaLabel`.
- [ ] Supports `ButtonSpinner` purpose wrapper for Button loading.
- [ ] Merges class/style/data attributes.

### 7.6 Phase 2 validation

- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte test`
- [ ] `pnpm --filter @marwes-ui/svelte build`

---

## 8. Phase 3 — Input + InputField

### 8.1 Input source map

Read:

- [ ] `docs/registry/families/input/README.md`
- [ ] `docs/registry/families/input/registry.generated.json`
- [ ] `docs/audits/input-family-accessibility.md`
- [ ] `packages/core/src/components/atoms/input/input-types.ts`
- [ ] `packages/core/src/components/atoms/input/input-a11y.ts`
- [ ] `packages/core/src/components/atoms/input/input-recipe.ts`
- [ ] `packages/core/src/shared/field-helpers.ts`
- [ ] `packages/react/src/components/input/input.tsx`
- [ ] `packages/react/src/components/input/input-field.tsx`
- [ ] `packages/react/src/components/input/__tests__/input.test.tsx`
- [ ] `packages/react/src/components/input/__tests__/input-field.test.tsx`
- [ ] `packages/vue/src/components/input/input.ts`
- [ ] `packages/vue/src/components/input/input-field.ts`
- [ ] `packages/vue/src/components/input/__tests__/input.test.ts`
- [ ] `packages/vue/src/components/input/__tests__/input-field.test.ts`
- [ ] `tests/contracts/input.contract.ts`
- [ ] `tests/contracts/input-field.contract.ts`
- [ ] `packages/presets/src/firstEdition/input.css`
- [ ] `packages/presets/src/firstEdition/molecules/input-field.css`

### 8.2 Input files

- [ ] `packages/svelte/src/lib/components/input/types.ts`
- [ ] `packages/svelte/src/lib/components/input/Input.svelte`
- [ ] `packages/svelte/src/lib/components/input/InputField.svelte`
- [ ] `packages/svelte/src/lib/components/input/index.ts`

### 8.3 Input requirements

- [ ] Calls `createInputRecipe({ ...props, value })`.
- [ ] Supports `bind:value` using `$bindable`.
- [ ] Supports controlled value via normal prop usage.
- [ ] Supports `oninput` callback prop.
- [ ] Applies `id`, `name`, `type`, `inputMode`, `autoComplete`, `placeholder`, `disabled`, `readOnly`, `required` from core a11y.
- [ ] Applies `aria-label`, `aria-invalid`, `aria-describedby` from core a11y.
- [ ] Merges class/style.
- [ ] Does not create separate Svelte input variant logic.

### 8.4 InputField requirements

Use `$props.id()` for SSR-safe generated ids.

- [ ] Supports `id` prop and respects it when supplied.
- [ ] Generates `mw-input-${$props.id()}` when `id` omitted.
- [ ] Supports `label` required visible label.
- [ ] Supports `helperText`.
- [ ] Supports `error`.
- [ ] Supports `input` object forwarded to Input atom.
- [ ] Supports `ariaDescribedBy` merged with helper/error ids.
- [ ] Supports `leadingSymbol`.
- [ ] Supports `bind:value` at field level using `$bindable`.
- [ ] Calls `buildInputFieldA11yIds` from core.
- [ ] `label[for]` matches `input[id]`.
- [ ] `aria-describedby` includes helper id when helper exists.
- [ ] `aria-describedby` includes error id when error exists.
- [ ] `aria-invalid` is true when error exists.
- [ ] Error region uses `aria-live="polite"`.
- [ ] Empty helper/error strings are treated as absent.
- [ ] Search/password affordances can be ported from React/Vue after base field works; do not block base a11y on those enhancements.

### 8.5 Input tests

- [ ] Input renders textbox.
- [ ] Input includes `mw-input` class.
- [ ] Input merges user class.
- [ ] Input `bind:value` updates parent fixture.
- [ ] Input `oninput` receives native event.

### 8.6 InputField tests

- [ ] Label is associated with control.
- [ ] Custom id is respected.
- [ ] Generated id is stable enough for rendered field.
- [ ] Helper id appears in `aria-describedby`.
- [ ] Error id appears in `aria-describedby`.
- [ ] Error sets `aria-invalid`.
- [ ] Error region has `aria-live="polite"`.
- [ ] External `ariaDescribedBy` is merged.
- [ ] `bind:value` works through the field wrapper.

### 8.7 Phase 3 validation

- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte test`
- [ ] `pnpm --filter @marwes-ui/svelte build`

---

## 9. Phase 4 — MVP passive primitives

Implement passive primitives after Provider/Button/InputField prove the adapter shape.

### 9.1 Badge

Source map:

- [ ] `docs/registry/families/badge/registry.generated.json`
- [ ] `packages/core/src/components/atoms/badge/*`
- [ ] `packages/react/src/components/badge/*`
- [ ] `packages/vue/src/components/badge/*`
- [ ] `tests/contracts/badge.contract.ts`
- [ ] `packages/presets/src/firstEdition/badge.css`

Svelte target:

- [ ] `components/badge/Badge.svelte`
- [ ] `components/badge/BadgeGroup.svelte`
- [ ] `components/badge/types.ts`
- [ ] `components/badge/index.ts`

Requirements:

- [ ] `Badge` calls `createBadgeRecipe`.
- [ ] Supports `children` snippet.
- [ ] Supports `class`, `id`, optional `dataAttributes`.
- [ ] Spreads core data attrs and purpose data attrs.
- [ ] `BadgeGroup` mirrors React/Vue group class structure.

### 9.2 Card

Source map:

- [ ] `docs/registry/families/card/registry.generated.json`
- [ ] `packages/core/src/components/atoms/card/*`
- [ ] `packages/react/src/components/card/*`
- [ ] `packages/vue/src/components/card/*`
- [ ] `packages/presets/src/firstEdition/card.css`

Svelte target:

- [ ] `components/card/Card.svelte`
- [ ] `components/card/types.ts`
- [ ] `components/card/index.ts`

Requirements:

- [ ] `Card` calls `createCardRecipe`.
- [ ] Supports `title` snippet or prop consistent with Svelte ergonomics.
- [ ] Supports default `children` snippet.
- [ ] Renders `mw-card__header`, `mw-card__title`, `mw-card__body` like React/Vue.
- [ ] Merges class and native div attrs.

### 9.3 Divider

Source map:

- [ ] `docs/registry/families/divider/registry.generated.json`
- [ ] `packages/core/src/components/atoms/divider/*`
- [ ] `packages/react/src/components/divider/divider.tsx`
- [ ] `packages/vue/src/components/divider/divider.ts`
- [ ] `tests/contracts/divider.contract.ts`
- [ ] `packages/presets/src/firstEdition/divider.css`

Svelte target:

- [ ] `components/divider/Divider.svelte`
- [ ] `components/divider/types.ts`
- [ ] `components/divider/index.ts`

Requirements:

- [ ] Calls `createDividerRecipe`.
- [ ] Renders semantic `hr` unless core currently indicates another tag.
- [ ] Applies orientation/size a11y/data attrs from core.
- [ ] Merges class/style.

### 9.4 Spacing / Spacer

Source map:

- [ ] `docs/registry/families/spacing/registry.generated.json`
- [ ] `packages/core/src/components/atoms/spacing/*`
- [ ] `packages/react/src/components/spacing/spacing.tsx`
- [ ] `packages/vue/src/components/spacing/spacing.ts`
- [ ] `tests/contracts/spacing.contract.ts`
- [ ] `packages/presets/src/firstEdition/spacing.css`
- [ ] `packages/presets/src/firstEdition/tokens.css`

Svelte target:

- [ ] `components/spacing/Spacing.svelte`
- [ ] `components/spacing/Spacer.svelte` or alias export if Svelte packaging supports it cleanly.
- [ ] `components/spacing/types.ts`
- [ ] `components/spacing/index.ts`

Requirements:

- [ ] Calls `createSpacingRecipe`.
- [ ] Supports `size` and `spacing` alias.
- [ ] Renders decorative `div` with core a11y/data attrs.
- [ ] Merges class/style.

### 9.5 Heading

Source map:

- [ ] `docs/registry/families/heading/registry.generated.json`
- [ ] `packages/core/src/components/atoms/heading/*`
- [ ] `packages/react/src/components/heading/*`
- [ ] `packages/vue/src/components/heading/*`
- [ ] `tests/contracts/heading.contract.ts`
- [ ] `packages/presets/src/firstEdition/typography.css`

Svelte target:

- [ ] `components/typography/H1.svelte`
- [ ] `components/typography/H2.svelte`
- [ ] `components/typography/H3.svelte`
- [ ] `components/typography/types.ts`
- [ ] `components/typography/index.ts`

Requirements:

- [ ] Calls `headingRecipe` with level 1/2/3.
- [ ] Uses `useTheme` or provider context as React does.
- [ ] Renders semantic `h1`, `h2`, `h3`.
- [ ] Supports visual size override.
- [ ] Merges class/style.

### 9.6 Paragraph

Source map:

- [ ] `docs/registry/families/paragraph/registry.generated.json`
- [ ] `packages/core/src/components/atoms/paragraph/*`
- [ ] `packages/react/src/components/paragraph/paragraph.tsx`
- [ ] `packages/vue/src/components/paragraph/paragraph.ts`
- [ ] `tests/contracts/paragraph.contract.ts`
- [ ] `packages/presets/src/firstEdition/typography.css`

Svelte target:

- [ ] `components/typography/Paragraph.svelte`

Requirements:

- [ ] Calls `paragraphRecipe`.
- [ ] Renders semantic `p`.
- [ ] Supports `children` snippet.
- [ ] Supports size/tone props from core.
- [ ] Merges class/style.

### 9.7 Phase 4 validation

- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte test`
- [ ] `pnpm --filter @marwes-ui/svelte build`

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

- [ ] `packages/svelte/src/tests/provider.test.ts`
- [ ] `packages/svelte/src/tests/button.test.ts`
- [ ] `packages/svelte/src/tests/input-field.test.ts`
- [ ] `packages/svelte/src/tests/passive-primitives.test.ts` optional.
- [ ] `packages/svelte/src/tests/type-fixtures/ButtonFixture.svelte`
- [ ] `packages/svelte/src/tests/type-fixtures/InputFixture.svelte`
- [ ] `packages/svelte/src/tests/type-fixtures/ProviderFixture.svelte`

### 12.2 Test strategy

Do not mock core recipes. Render real components and assert DOM output.

MVP tests must prove:

- [ ] Provider data attrs and CSS variables.
- [ ] Button core class/data/a11y output.
- [ ] Button native `onclick` behavior.
- [ ] Button loading behavior.
- [ ] Input `bind:value`.
- [ ] InputField label/helper/error wiring.
- [ ] No CSS auto-import from Svelte root. This can be a static source test that reads `src/lib/index.ts` and asserts it does not contain `@marwes-ui/presets`.

### 12.3 README requirements

`packages/svelte/README.md` must include:

- [ ] Package positioning: native Svelte 5 adapter over Marwes core contracts.
- [ ] Installation:

```bash
pnpm add @marwes-ui/svelte @marwes-ui/presets
```

- [ ] CSS import:

```svelte
<script lang="ts">
  import "@marwes-ui/presets/firstEdition/styles.css";
</script>
```

- [ ] Quick start with `MarwesProvider`, `Input bind:value`, and `Button`.
- [ ] Theme example with `ThemeInput`.
- [ ] SSR helper note for `@marwes-ui/svelte/ssr`.
- [ ] Explicit non-goal: not Web Components.
- [ ] Explicit dependency boundary: Svelte only affects `@marwes-ui/svelte` users.

### 12.4 Phase 5 validation

- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte test`
- [ ] `pnpm --filter @marwes-ui/svelte build`

---

## 13. Phase 6 — Root validation + boundary updates

### 13.1 Adapter boundary script

Update `scripts/check-adapter-boundaries.mjs`.

Checklist:

- [ ] Add `packages/svelte/src/lib` or `packages/svelte/src/lib/components` to scanned roots.
- [ ] Add `.svelte` to `sourceExtensions`.
- [ ] Core must not import `svelte`, `@sveltejs/*`, or `packages/svelte`.
- [ ] React must not import `svelte` or `packages/svelte`.
- [ ] Vue must not import `svelte` or `packages/svelte`.
- [ ] Svelte must not import `react`, `react-dom`, `vue`, `@marwes-ui/react`, or `@marwes-ui/vue`.
- [ ] Framework component adapters must not import preset CSS/runtime. For MVP this includes Svelte components and Svelte root index.
- [ ] Keep hardcoded color check active for Svelte components.

### 13.2 Root validation

Run:

- [ ] `pnpm test:typecheck:packages`
- [ ] `pnpm build:packages`
- [ ] `pnpm test:packages`
- [ ] `pnpm check:adapter-boundaries`
- [ ] `pnpm validate:packages`

If docs/registry/parity scripts fail because they do not know Svelte yet, either:

1. update them in this PR, or
2. explicitly document that Svelte registry/parity integration is Phase 7 and ensure existing checks still pass.

Do not leave root validation broken silently.

---

## 14. Phase 7 — Optional docs/registry/parity integration

This can be a follow-up PR if MVP package is already large.

### 14.1 Docs to update

- [ ] `docs/reference/architecture.md` — include Svelte in adapter layer diagrams/tables.
- [ ] `docs/reference/repo-map.md` — add Svelte edges and change matrix rows.
- [ ] `docs/reference/spec.md` — add `REQ-SVELTE-001`.
- [ ] `docs/reference/testing.md` — add Svelte package tests and future Storybook stance.
- [ ] `docs/guides/adding-components.md` — update layer rule to `core recipe → preset CSS → React adapter → Vue adapter → Svelte adapter` or explain adapter parity without forcing order.
- [ ] `docs/guides/figma-to-marwes.md` — include Svelte as a consumer adapter, not a design source.
- [ ] New `docs/guides/svelte-adapter.md` or `docs/adapters/svelte.md` if docs structure prefers it.

### 14.2 Registry/parity scripts

- [ ] `scripts/component-registry-sources.ts` — add optional `svelteDir` / `storybookSvelteDir` support.
- [ ] `scripts/generate-component-registry.ts` — include Svelte links when files exist.
- [ ] `scripts/generate-framework-parity-summary.mjs` — add Svelte column.
- [ ] `artifacts/framework-parity.json` — add Svelte values for families implemented in Svelte.
- [ ] `docs/reference/framework-parity-summary.md` — regenerate, do not hand edit.
- [ ] `scripts/storybook-consistency.mjs` — add Svelte only after `apps/storybook-svelte` exists; otherwise explicitly ignore.

### 14.3 Svelte Storybook or playground

Prefer a small `apps/playground-svelte` before full Storybook if MVP validation needs a consumer app.

Future Storybook files:

- [ ] `apps/storybook-svelte/src/stories/button/*`
- [ ] `apps/storybook-svelte/src/stories/input/*`
- [ ] `apps/storybook-svelte/src/preview.ts`
- [ ] root script `dev:storybook:svelte`
- [ ] later `test:storybook:a11y` includes Svelte smoke only after stories exist.

---

## 15. Phase 8 — Next-family rollout after MVP

After the MVP is green, continue in this order:

### PR 2 — More forms

- [ ] Textarea
- [ ] TextareaField
- [ ] Select
- [ ] SelectField
- [ ] Checkbox
- [ ] CheckboxField
- [ ] CheckboxGroupField
- [ ] Radio
- [ ] RadioGroupField
- [ ] Switch
- [ ] SwitchField

### PR 3 — Additional passive/content families

- [ ] Avatar
- [ ] AvatarBadge
- [ ] AvatarGroup
- [ ] Skeleton
- [ ] StatTile
- [ ] Badge purpose wrappers
- [ ] Card purpose wrappers
- [ ] Spinner purpose wrappers

### PR 4 — Coordinated widgets

- [ ] Accordion
- [ ] AccordionField
- [ ] Tab
- [ ] TabGroup
- [ ] Slider
- [ ] SliderField

### PR 5 — High-risk interactive families

- [ ] Tooltip
- [ ] Toast
- [ ] Dialog
- [ ] DatePicker
- [ ] RichText
- [ ] InputOtp

High-risk rule: these require extra a11y review and should not block the initial Svelte adapter MVP.

---

## 16. Final MVP Definition of Done

MVP is done only when all are checked:

- [ ] `packages/svelte` exists and builds with `@sveltejs/package`.
- [ ] `@marwes-ui/svelte` has `svelte` as peer dependency.
- [ ] `@marwes-ui/svelte` has only `@marwes-ui/core` as runtime dependency.
- [ ] `@marwes-ui/svelte` root does not import preset CSS.
- [ ] README shows explicit CSS import from `@marwes-ui/presets/firstEdition/styles.css`.
- [ ] `MarwesProvider` renders and applies theme variables.
- [ ] `useTheme` / `useThemeMode` work and update reactively.
- [ ] `Button` uses `createButtonRecipe` and passes behavior tests.
- [ ] `Input` supports `bind:value`.
- [ ] `InputField` has correct label/helper/error/aria wiring.
- [ ] MVP passive primitives are exported and typecheck.
- [ ] Root scripts include Svelte package tests/typecheck.
- [ ] Adapter boundary check protects core/React/Vue from Svelte imports.
- [ ] `pnpm --filter @marwes-ui/svelte build` passes.
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck` passes.
- [ ] `pnpm --filter @marwes-ui/svelte test` passes.
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

### Known remaining work for a future session

1. **High-risk interactive widgets** (PR5 from original plan):
   - Tooltip, Toast, Dialog, DatePicker, RichText, InputOtp
   - These require extra a11y review, positioning logic, and portal/overlay patterns
   - Recommend researching Svelte 5 portal patterns before implementing

2. **Storybook Svelte** (`apps/storybook-svelte`):
   - Scaffolding and 22 story files are in place
   - Blocked by upstream bug: `@storybook/svelte-vite` ships raw `.svelte` files in `static/` that Vite's `import-analysis` plugin rejects in pnpm monorepos
   - Tracked: https://github.com/storybookjs/storybook/issues/29424
   - Workaround: wait for Storybook fix, or use Histoire as alternative
   - Stories will work immediately once the upstream fix ships

3. **Additional tests**:
   - Current 17 tests cover Provider, Button, Input basics and boundary check
   - Should add: InputField a11y wiring, Checkbox bind:checked, Switch toggle, TabGroup keyboard nav
   - Consider contract tests mirroring `tests/contracts/*.contract.ts`

4. **Minor missing field variants**:
   - `DateOfBirthField`, `ZipCodeField` (same trivial pattern as EmailField/PhoneField)
   - `DropdownField` (SelectField with specific appearance)

### Technical notes for next session

- **`exactOptionalPropertyTypes: true`** in tsconfig causes frequent type issues when spreading props to core recipe functions. Pattern: destructure the optional prop, then conditionally spread `...(prop ? { prop } : {})`.
- **SVG attributes**: Core generates camelCase attrs (strokeDasharray). Svelte needs kebab-case. Use `svgAttrsToKebab()` from `internal/svg-attrs.ts`.
- **Provider warnings**: 7 benign Svelte warnings about `$state` initial values referencing other reactive values. These are intentional — the `$effect` below keeps them synced.
- **Preset CSS class names**: Use `mw-p` not `mw-paragraph`. The preset only defines `.mw-p`.
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
