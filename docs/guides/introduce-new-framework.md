# Introducing a New Framework Adapter

This guide captures everything learned from building the React, Vue, and Svelte adapters for
Marwes. Use it as a playbook when adding support for a new framework (e.g., Solid, Angular,
Web Components, Lit).

---

## 1. Architecture Overview

Every Marwes adapter follows the same architecture:

```
@marwes-ui/core          ← recipes, a11y mapping, theme resolution, semantic metadata
@marwes-ui/presets       ← default CSS consumed via CSS variables
@marwes-ui/<framework>   ← thin rendering adapter
```

The adapter's only job is to **call core recipe functions** and **render the result** using the
framework's native primitives. All variant logic, accessibility contracts, CSS class generation,
data attributes, and theme resolution live in core.

### What core provides per component

Every `create<Component>Recipe(options)` returns a render kit:

```ts
{
  className: string              // e.g. "mw-btn mw-btn--primary mw-btn--md"
  vars: Record<string, string>   // CSS custom properties to set via inline style
  a11y: {                        // Accessibility attributes to spread
    role?: string
    ariaLabel?: string
    ariaSelected?: boolean
    ariaDisabled?: boolean
    // ... component-specific
  }
  dataAttributes: Record<string, string>  // data-component, data-purpose, etc.
  // Component-specific: slots, labels, showCloseButton, etc.
}
```

The adapter destructures this kit and maps it to DOM attributes.

---

## 2. Shared Files (Copy As-Is)

These files are **identical** across React, Vue, and Svelte and should be copied verbatim:

| File | Purpose |
|------|---------|
| `provider/runtime-theme.ts` | Resolves `ThemeInput` → `ResolvedTheme` → CSS variables |
| `provider/theme-mode-runtime.ts` | Light/dark mode detection, system preference, storage |

These two files contain zero framework-specific code. They work with plain objects and
`window.matchMedia`. Copy them into the new adapter's `provider/` directory unchanged.

### SSR helpers

The simplest SSR implementation is a re-export:

```ts
// ssr.ts
export type { MarwesThemeScriptOptions, MarwesThemeStyleOptions } from "@marwes-ui/core"
export { createMarwesThemeScript, createMarwesThemeStyle } from "@marwes-ui/core"
```

React adds JSX wrapper components (`MarwesThemeScript`, `MarwesThemeStyle`). Add framework-native
wrappers only if the framework has a server-rendering convention that benefits from components
over raw strings.

---

## 3. Framework-Specific Work

### 3.1 Provider (context + theme)

Every adapter needs:

1. **Context mechanism** — React: `createContext`/`useContext`. Vue: `provide`/`inject`. Svelte: `setContext`/`getContext`.
2. **Provider component** — Wraps children, resolves theme, emits CSS variables on a wrapper element.
3. **`useTheme()`** — Returns the resolved theme from context.
4. **`useThemeMode()`** — Returns mode, preference, toggleMode, setPreference, etc.

The provider component is always the most complex adapter file. It must:
- Accept `ThemeInput` and resolve it via `runtime-theme.ts`
- Accept mode/preference props and manage them via `theme-mode-runtime.ts`
- Set `--mw-*` CSS variables on a wrapper `<div data-marwes-theme="true">`
- Apply `mw-theme--light` or `mw-theme--dark` class
- Optionally sync mode to `<html>` or `<body>` via `target`/`attribute` props
- Expose context to descendants

### 3.2 Internal helpers

Each framework needs a small set of internal utilities:

| Helper | Why |
|--------|-----|
| `mergeClass(...)` | Combine recipe class + user class. React uses `[a, b].filter(Boolean).join(" ")` inline. Vue/Svelte extract this. |
| `cssVarsToStyle(vars)` | Convert `{ "--mw-color-x": "#fff" }` to framework-native style format. React uses objects directly. Svelte needs strings. Vue needs objects. |
| `svgAttrsToKebab(attrs)` | Core generates camelCase SVG attrs (e.g. `strokeDasharray`). React handles this natively. Svelte and other frameworks need explicit conversion to kebab-case. |

### 3.3 Component rendering

For each component, the adapter file:

1. Accepts framework-native props (children/slots, event handlers, class/className, style)
2. Calls the core recipe function: `const kit = createXRecipe(options)`
3. Renders native DOM elements with the kit's output

**Simple atom pattern** (Badge, Divider, Spacing, Skeleton, Tooltip):
```
props → recipe(options) → single DOM element with class, a11y, dataAttributes
```

**Stateful atom pattern** (Input, Checkbox, Switch, Slider):
```
props → recipe(options) → native <input>/<button> with bind:value, event handlers
```

**Compound molecule pattern** (InputField, SwitchField, DialogModal):
```
props → a11y-id builder → wraps atom + label + helper + error with aria wiring
```

**Context-dependent pattern** (H1/H2/H3, ToastProvider):
```
props → useTheme()/useToast() from context → recipe(options, theme) → render
```

### 3.4 Children / slots / snippets

This is the primary divergence point between frameworks:

| Framework | Children mechanism | Footer/render-prop pattern |
|-----------|-------------------|---------------------------|
| React | `children: ReactNode` | `footer={({ close }) => <Button onClick={close}>OK</Button>}` |
| Vue | `slots.default?.()` | `#footer="{ close }"` template slot |
| Svelte | `{@render children?.()}` | `{#snippet footer({ close })}...{/snippet}` |

Design the adapter's prop types to match the framework's idiom. The core recipe doesn't care how
children are rendered — it only provides the shell structure.

### 3.5 Two-way binding

| Framework | Pattern |
|-----------|---------|
| React | `value` + `onChange` callback props |
| Vue | `v-model` via `modelValue` + `update:modelValue` |
| Svelte | `bind:value` via `$bindable()` + optional `onvaluechange` callback |

### 3.6 Event handler naming

| Framework | Convention |
|-----------|-----------|
| React | `onClick`, `onChange`, `onCheckedChange` |
| Vue | `@click`, `@change`, `onCheckedChange` emit |
| Svelte | `onclick`, `onchange`, `oncheckedchange` (lowercase) |

---

## 4. Component Family Tiers (Build Order)

Build components in this order. Each tier validates that the previous tier's patterns work.

### Tier 1: Foundation (validate core wiring)
1. **Button** — Tests recipe → class → element rendering. Purpose variants validate `createPurposeSemanticAttributes`.
2. **Badge** — Simplest atom. Validates mergeClass, dataAttributes, ariaLabel.
3. **Icon** — SVG rendering. Validates SVG attr handling (camelCase → kebab-case if needed).
4. **Divider** — `<hr>` with CSS vars. Validates cssVarsToStyle.
5. **Spacing** — Decorative `<div>` with aria-hidden. Validates decorative pattern.

### Tier 2: Provider + theme
6. **MarwesProvider** — Context, theme resolution, CSS variable emission, mode management.
7. **useTheme / useThemeMode** — Context consumers.
8. **H1/H2/H3** — First components that depend on provider context (headingRecipe needs theme).
9. **Paragraph** — Same pattern as headings.

### Tier 3: Form controls
10. **Input** — Native `<input>` with recipe styling, two-way binding.
11. **InputField** — Wraps Input with label, helper, error, aria wiring.
12. **Select / SelectField** — Custom chevron icon, option rendering.
13. **Textarea / TextareaField** — Multiline variant.
14. **Checkbox / CheckboxField** — Boolean binding, indeterminate state.
15. **Radio / RadioGroupField** — Group coordination.
16. **Switch / SwitchField** — `role="switch"`, aria-checked toggle.
17. **Slider / SliderField** — Range input with CSS vars for thumb position.

### Tier 4: Purpose field variants
18. **PasswordField, EmailField, SearchField**, etc. — Thin wrappers over InputField.
19. **InputOtp** — Multi-cell OTP input.
20. **RichText / RichTextField** — contentEditable with toolbar.
21. **Purpose buttons** — PrimaryButton, DestructiveButton, etc.
22. **Purpose badges** — StatusBadge, PriorityBadge, NotificationBadge.
23. **Purpose switches** — FeatureToggle, PreferenceSwitch, PermissionSwitch.
24. **Purpose sliders** — VolumeSlider, BrightnessSlider, RadiusSlider.

### Tier 5: Overlays and coordination
25. **Dialog / DialogModal** — Focus trapping, escape/scrim dismiss, portal (if framework supports it).
26. **ConfirmDialog / DestructiveDialog / InfoDialog** — Purpose dialog wrappers.
27. **Toast / ToastContainer / ToastProvider** — Context-based imperative API, intent routing to purpose toasts.
28. **Tooltip / TooltipGroup** — Hover/focus reveal, exit animation delay.

### Tier 6: Layout and content
29. **Card** — Title slot/prop, body slot. Purpose cards (ProductCard, ProfileCard, StatCard).
30. **Avatar / AvatarGroup** — Image, initials, icon modes. Variants (ProfileAvatar, PresenceAvatar).
31. **Skeleton** — Loading placeholder with animation variants.
32. **Spinner** — SVG spinner with variants. Purpose spinners (ButtonSpinner, EmptyStateSpinner).
33. **StatTile** — Stat display with trend.
34. **Accordion / AccordionField** — Collapsible panel with a11y.
35. **Tab / TabGroup / TabPanel** — Tablist/tab/tabpanel coordination with keyboard nav.
36. **DatePicker** — Calendar grid. Consumer provides data; component renders.

---

## 5. Package Setup

### 5.1 Directory structure

```
packages/<framework>/
  src/
    components/
      accordion/       ← one dir per family
        Accordion.*
        AccordionField.*
        index.ts
        types.ts
        README.md
      avatar/
      badge/
      button/
      card/
      checkbox/
      date-picker/
      dialog/
      divider/
      heading/
      icon/
      input/           ← includes Select, Textarea, all field variants
      paragraph/
      radio/
      skeleton/
      slider/
      spacing/
      spinner/
      stat-tile/
      switch/
      tab/
      toast/
      tooltip/
    internal/          ← framework-specific helpers (mergeClass, cssVars, svgAttrs)
    provider/
      MarwesProvider.* ← the context provider
      runtime-theme.ts ← SHARED (copy from existing adapter)
      theme-mode-runtime.ts ← SHARED (copy from existing adapter)
      use-theme.*
      use-theme-mode.*
      context.*        ← framework-specific context setup
      types.ts
    index.ts           ← public API barrel
    ssr.ts             ← SSR helpers re-export
  tests/               ← unit tests
  package.json
  tsconfig.json
  README.md
```

### 5.2 package.json essentials

```json
{
  "name": "@marwes-ui/<framework>",
  "version": "1.0.0",
  "dependencies": {
    "@marwes-ui/core": "workspace:*",
    "@marwes-ui/presets": "workspace:*"
  },
  "peerDependencies": {
    "<framework>": ">=<min-version>"
  },
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./ssr": { "types": "./dist/ssr.d.ts", "default": "./dist/ssr.js" }
  }
}
```

### 5.3 Build tool

- **React/Vue**: tsup (bundles TypeScript → ESM + DTS)
- **Svelte**: `@sveltejs/package` (svelte-package, processes .svelte files)
- **General rule**: Use the framework's canonical build tool for library packages.

---

## 6. Storybook App Setup

Create `apps/storybook-<framework>/` with:

```
.storybook/
  main.ts        ← framework-specific Storybook config
  preview.ts     ← imports @marwes-ui/presets CSS, wraps in provider
src/
  stories/
    accordion/   ← mirrors packages/<framework>/src/components/
    avatar/
    badge/
    ...
    color/       ← design system color showcase
```

### Story structure per family

Each family directory contains:

| File | Purpose |
|------|---------|
| `Introduction.mdx` | Architecture docs, usage examples, component reference |
| `<atom>.stories.ts` | Atom story with args |
| `<molecule>.stories.ts` | Molecule story (may need wrapper component) |
| `<purpose>.stories.ts` | One per purpose variant |
| `*Story.svelte` / `*Demo.vue` | Wrapper components for stories that need interactive state |

**Key lesson**: Storybook can't pass component children or render functions through args.
For Dialog, Toast, and DatePicker stories, create wrapper components that manage internal state
(open/close, trigger buttons, data providers) and accept data props from Storybook args.

### Matching React story structure

Use React's storybook stories as the canonical reference. Every story file in React should have
an equivalent in the new framework. Use the same `title`, same story names, same arg values
where possible.

---

## 7. Testing Strategy

### 7.1 Shared contracts

The `tests/contracts/` directory contains framework-agnostic test contracts. Each contract
defines a harness interface and test cases:

```ts
// tests/contracts/button.contract.ts
export type ButtonContractHarness = {
  renderPrimary(args?: { text?: string; disabled?: boolean }): Promise<void> | void
  getByRole(role: string, options: { name: RegExp }): HTMLElement
  click(element: HTMLElement): Promise<void>
}

export function runButtonContract(adapterName: string, h: ButtonContractHarness): void {
  describe(`Button contract: ${adapterName}`, () => {
    it("renders a button and calls onClick", async () => { ... })
  })
}
```

The adapter implements the harness and calls `runButtonContract("myframework", harness)`.
This ensures every adapter passes the same behavioral tests.

### 7.2 Adapter-specific tests

Beyond contracts, add tests for:

1. **Index exports** — Verify every component, hook, enum, and type is exported from the public API.
2. **Variant/purpose tests** — Verify data-purpose attributes on purpose components.
3. **Field compound tests** — Verify label, helper text, error wiring on field molecules.
4. **Interactive tests** — DialogModal focus trap, TooltipGroup hover/escape.
5. **SSR tests** — `createMarwesThemeScript` and `createMarwesThemeStyle` output.
6. **Adapter theme integrity** — Scan source for hardcoded color literals.

### 7.3 Test file organization

```
packages/<framework>/src/tests/
  index-exports.test.ts      ← all public API exports verified
  button.test.ts             ← atom tests
  checkbox.test.ts
  dialog.test.ts
  toast.test.ts
  switch.test.ts
  accordion.test.ts
  avatar.test.ts
  typography.test.ts
  icon.test.ts
  radio.test.ts
  spinner.test.ts
  slider.test.ts
  tab.test.ts
  date-picker.test.ts
  field-compounds.test.ts    ← CheckboxField, SwitchField, RadioGroupField, etc.
  select-textarea.test.ts    ← Select, SelectField, Textarea, TextareaField
  input-extras.test.ts       ← InputOtp, RichText, RichTextField
  variants.test.ts           ← purpose badge, button variant data attributes
  tooltip.test.ts
  passive-primitives.test.ts ← Badge, Card, Divider, Spacing, Skeleton
  ssr.test.ts
  adapter-theme-integrity.test.ts
  provider.test.ts
```

---

## 8. Public API Checklist

### 8.1 Required component exports (~112)

The full export list is in `packages/react/src/index.ts`. Match it exactly.

### 8.2 Required type exports

Every component that accepts props should export its prop type:
`ButtonProps`, `InputFieldProps`, `DialogModalProps`, `TabGroupProps`, etc.

**Lesson learned**: Don't define prop interfaces inline in component files. Extract them to
`types.ts` from the start so they can be exported from the barrel. This was a P0 fix for Svelte.

### 8.3 Required core re-exports

```ts
export {
  AvatarSize, AvatarType, BadgeVariant,
  ButtonAction, ButtonSize, ButtonVariant,
  createFontStack, IconName,
  mwAvailableFonts, mwFontFallbacks, mwGoogleFontFamilies,
  mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar,
  Spacings, SwitchSize, ThemeMode,
} from "@marwes-ui/core"
```

Plus the core type re-exports: `ThemeInput`, `Density`, `ToneName`, `SpacingSize`, `ResolvedTheme`, etc.

### 8.4 Required function exports

- `useTheme()` — returns resolved theme
- `useThemeMode()` — returns mode controls
- `useToast()` — returns toast controller
- `createMarwesThemeScript()` — SSR helper
- `createMarwesThemeStyle()` — SSR helper

---

## 9. Validation Pipeline

Run these checks before considering the adapter complete:

```bash
# Typecheck (0 errors)
pnpm --filter @marwes-ui/<framework> test:typecheck

# Unit tests (all pass)
pnpm --filter @marwes-ui/<framework> test

# Package build
pnpm --filter @marwes-ui/<framework> build

# Adapter boundary check (no direct DOM/style logic that should be in core)
pnpm check:adapter-boundaries

# Framework parity artifact
pnpm parity:summary
pnpm parity:summary:check

# Full monorepo build (including storybook)
pnpm build
```

---

## 10. Parity Artifact

Update `artifacts/framework-parity.json` to add the new framework column. Set each family to
`true` as it's implemented. Run `pnpm parity:summary` to regenerate
`docs/reference/framework-parity-summary.md`.

---

## 11. Documentation Checklist

- [ ] `packages/<framework>/README.md` — Full README matching React/Vue pattern
- [ ] `docs/guides/<framework>-adapter.md` — Installation, setup, framework-specific patterns
- [ ] Per-component `README.md` in each component directory — parity findings
- [ ] Storybook `Introduction.mdx` per family — architecture, usage, component reference
- [ ] Changeset entry for the initial release

---

## 12. Framework-Specific Gotchas (Lessons Learned)

### Svelte

- **`exactOptionalPropertyTypes: true`** — Causes type errors when spreading optional props to core
  recipes. Pattern: destructure the optional prop, then conditionally spread
  `...(prop ? { prop } : {})`.
- **SVG attributes** — Core generates camelCase (`strokeDasharray`). Svelte needs kebab-case.
  Created `svgAttrsToKebab()` helper.
- **Snippet children** — Storybook can't pass Svelte snippets through args. Any component that
  needs composed children (Dialog footer, Toast action, Card title) requires a `.svelte` wrapper
  component for its story.
- **`$state` initialization warnings** — Initializing `$state` from a destructured prop like
  `let x = $state(defaultValue)` triggers `state_referenced_locally`. This is intentional for
  uncontrolled defaults. Suppress in `svelte.config.js` via `onwarn`.
- **Build tool** — Uses `@sveltejs/package` (svelte-package), not tsup.
- **Provider context** — Svelte uses `setContext`/`getContext` (component init only, not in effects).
- **ToastContainer intent routing** — Must route `intent` prop to purpose toast components
  (SuccessToast, ErrorToast, etc.) — not just render raw Toast for everything.
- **Snippet shadowing** — `{#snippet title()}` inside `<Card title="...">` is an error. Use
  either the prop or the snippet, not both.
- **No portal** — Svelte doesn't have a built-in portal mechanism like React's `createPortal`.
  DialogModal renders in-place. This works fine for most apps.

### Vue

- **`defineComponent` + `h()`** — Vue adapter uses render functions, not SFC templates. This
  keeps components in `.ts` files and avoids template compilation issues.
- **`v-model` wiring** — Requires `modelValue` prop name and `update:modelValue` emit.
- **`useAttrs()` passthrough** — Vue components need to explicitly forward non-prop attributes.

### React

- **JSX inline** — Components are simple functions returning JSX. No wrapper needed.
- **`className` vs `class`** — React uses `className`. Core uses `className` in its kit output.
- **`useRef`/`useEffect`** — Required for DialogModal focus management, TooltipGroup timers.
- **`createPortal`** — Available for DialogModal, but `portalTarget={null}` disables it.

---

## 13. Estimated Timeline

Based on the Svelte adapter experience:

| Phase | Effort | Output |
|-------|--------|--------|
| Package scaffold + provider + first 5 atoms | 2 days | Build validates, basic theme works |
| Tier 3-4: Form controls + purpose variants | 3 days | ~60 components |
| Tier 5-6: Overlays + layout | 2 days | ~112 components |
| Storybook app + all stories | 2 days | 110 story files |
| Tests (330+) | 1-2 days | Full coverage |
| README, docs, parity artifact, changeset | 1 day | Release-ready |
| **Total** | **~11-12 days** | Full adapter at parity |

The Svelte adapter took longer because it was the first non-React/Vue adapter and patterns
were being discovered. With this guide, the next adapter should be faster.

---

## 14. Quick Reference: What to Copy vs What to Build

### Copy verbatim from any existing adapter
- `provider/runtime-theme.ts`
- `provider/theme-mode-runtime.ts`
- `ssr.ts` (re-export pattern)
- All `Introduction.mdx` files (change import paths and code examples)
- `artifacts/framework-parity.json` structure

### Copy and adapt (mechanical translation)
- Component atom files (same recipe calls, different rendering syntax)
- Component types.ts (same interfaces, framework-specific children/snippet/slot types)
- Purpose variant files (same `createPurposeSemanticAttributes` calls)
- Story files (same titles, args, structure — different imports and wrapper format)

### Build from scratch (framework-specific)
- `MarwesProvider` component
- Context setup (`context.ts` / `marwes-context.ts`)
- `useTheme()` / `useThemeMode()` hooks
- `ToastProvider` / `useToast()` (context-based)
- Internal helpers (`mergeClass`, `cssVarsToStyle`, `svgAttrsToKebab`)
- `DialogModal` (focus trap, escape handling)
- `TabGroup` (keyboard navigation)
- Storybook wrapper components for interactive stories

---

## 15. Potential Future Improvements

### Shared adapter scaffold generator
A CLI or script that generates the boilerplate for a new adapter:
- Package scaffold with `package.json`, `tsconfig.json`
- Component directory structure with empty files
- Storybook app scaffold
- Index barrel with all exports

### Shared internal helpers package
`runtime-theme.ts` and `theme-mode-runtime.ts` could move to `@marwes-ui/core` or a new
`@marwes-ui/adapter-utils` package to avoid copying.

### Contract test harness per framework
Standardize the test harness pattern so each new adapter can implement a small adapter-specific
test helper and get all contract tests for free.
