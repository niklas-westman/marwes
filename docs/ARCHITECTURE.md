# Marwes Architecture

This document explains how the full stack hangs together — from Figma design to a working Storybook story — using **Button** as the canonical reference. Every component in this project, current and future, follows the same thread.

Read this when you want to understand where anything lives, why it's there, and how Phase 0 through Phase 5 build on each other without breaking what already works.

---

## The Canonical Stack — Button End to End

```
Figma design (.figma/nodes.json)
    │
    ▼
packages/core/src/components/atoms/button/
    ├── button-types.ts       Types, enums, RenderKit shape
    ├── button-a11y.ts        ARIA logic — resolveButtonA11y()
    ├── button-recipe.ts      createButtonRecipe(opts) → RenderKit
    └── index.ts              Exports
    │
    ▼
packages/presets/src/firstEdition/
    └── button.css            .mw-btn, .mw-btn--primary, etc.
                              Reads only CSS variables — never raw hex
    │
    ▼
packages/react/src/components/button/
    └── button.tsx            createButtonRecipe(opts) → <button> or <a>
    │
    ▼
apps/storybook-react/src/stories/button/
    └── primary-button.stories.tsx
    │
    ▼
packages/vue/src/components/button/
    └── button.ts             createButtonRecipe(opts) → h("button", ...)
    │
    ▼
apps/storybook-vue/src/stories/button/
    └── primary-button.stories.ts
```

---

## What Each Layer Does

### 1. Core — Types (`button-types.ts`)

Defines everything about the component's public surface:

- **Enums** as const objects so consumers get autocomplete: `ButtonVariant.primary`, `ButtonSize.md`
- **`ButtonOptions`** — the props a caller passes
- **`ButtonA11yProps`** — the typed ARIA output shape
- **`ButtonRenderKit`** — what the recipe returns: `{ tag, className, vars, a11y, blockClick, dataAttributes }`

No framework code. No DOM. No styling logic.

### 2. Core — A11y (`button-a11y.ts`)

`resolveButtonA11y(opts)` → `{ tag, a11y, blockClick }`

Handles the accessibility edge cases once, for all frameworks:
- `<button>` vs `<a>` decision based on `as` / `href`
- Native `disabled` (button) vs `aria-disabled` + `tabIndex=-1` (link-as-button)
- `aria-pressed` for toggle buttons, `aria-busy` for loading state
- Dev-mode warning for icon-only buttons without `ariaLabel`

**Rule: ARIA logic lives here only — never duplicated in adapters.**

### 3. Core — Recipe (`button-recipe.ts`)

`createButtonRecipe(opts)` → `ButtonRenderKit`

Calls `resolveButtonA11y`, then assembles the kit:

```ts
return {
  tag,
  blockClick,
  a11y,
  className: ["mw-btn", `mw-btn--${size}`, `mw-btn--${variant}`].join(" "),
  dataAttributes: { "data-component": "button", "data-action": action, ... },
  vars: {},   // Provider owns all theme CSS vars — recipe owns class names and a11y only
}
```

**Recipes that don't need per-instance theme overrides have no vars.**
`MarwesProvider` stamps all 69 CSS variables on its root element via `applyTheme()`. Components inherit them through the CSS cascade — no per-element injection needed.

### 4. Presets — CSS (`button.css`)

Pure CSS. Zero JavaScript. Reads only CSS variables:

```css
.mw-btn--primary {
  background: var(--mw-color-primary-base);
  color: var(--mw-color-primary-label);
}
.mw-btn--secondary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--mw-color-primary-base) 8%, transparent);
}
.mw-theme--dark .mw-btn:disabled { opacity: 0.4; }
```

**No hex values. No theme objects. Only class selectors and CSS variables from the provider cascade.**

### 5. React Adapter (`button.tsx`)

```tsx
export const Button = defineComponent((props: ButtonProps, { slots, emit }) => {
  const kit = computed(() => createButtonRecipe(props))   // no theme — provider cascade covers it

  return () => (
    <button
      type={kit.value.a11y.type}
      disabled={kit.value.a11y.disabled}
      aria-label={kit.value.a11y.ariaLabel}
      class={mergeClassNames(kit.value.className, props.className)}
      style={mergeStyles(kit.value.vars, {})}
      {...kit.value.dataAttributes}
    >
      {slots.default?.()}
    </button>
  )
})
```

The adapter is thin. No `useTheme()` needed — the recipe returns class names and a11y only. CSS vars cascade from `MarwesProvider`.

### 6. Vue Adapter (`button.ts`)

Exact same pattern, Vue syntax:

```ts
export const Button = defineComponent((props, { slots, emit }) => {
  const attrs = useAttrs()
  const kit = computed(() => createButtonRecipe(props))   // no theme — provider cascade covers it

  return () => h("button", {
    type: kit.value.a11y.type,
    class: mergeClassNames(kit.value.className, props.className, attrs.class),
    style: mergeStyles(kit.value.vars, attrs.style),
    ...kit.value.dataAttributes,
  }, getDefaultSlotChildren(slots))
})
```

`computed()` wraps the recipe so it re-runs reactively when props change. Theme vars cascade from `MarwesProvider` — no `useTheme()` needed in the button adapter.

### 7. Storybook Stories

React (`apps/storybook-react/src/stories/button/primary-button.stories.tsx`):
```tsx
import { PrimaryButton } from "@marwes-ui/react"
import { storybookButtonGeneralArgTypes } from "@marwes-ui/core"  // shared with Vue

const meta = { title: "Buttons/General/Primary", component: PrimaryButton,
               argTypes: storybookButtonGeneralArgTypes }
```

Vue (`apps/storybook-vue/src/stories/button/primary-button.stories.ts`):
```ts
import { PrimaryButton } from "@marwes-ui/vue"
import { storybookButtonGeneralArgTypes } from "@marwes-ui/core"  // same import

export const PrimaryExample: Story = {
  render: (args) => ({ components: { PrimaryButton },
    template: `<PrimaryButton v-bind="args">Primary Button</PrimaryButton>` }),
}
```

`storybookButtonGeneralArgTypes` lives in core — defined once, shared by both frameworks. The story files themselves are intentionally minimal.

---

## The Data Flow (Phase 0 complete ✓)

**Before Phase 0 (v1 — replaced):**

```
createButtonRecipe(theme, opts)
    └── vars: {
          "--mw-primary":    theme.color.primary,    // raw hex, e.g. "#141414"
          "--mw-on-primary": theme.color.onPrimary,  // raw hex, e.g. "#F9FAFB"
          "--mw-danger":     theme.color.danger,
          ...
        }
        Applied as inline style on every <button> element.
        Every button re-injects the same theme values.
        Hover/pressed/disabled colors are approximated with opacity in CSS.
```

**After Phase 0 (current state ✓):**

```
MarwesProvider mounts
    └── applyTheme(providerRootElement, resolvedTheme)
          Sets 69 CSS vars on [data-marwes-theme] element:
            --mw-color-primary-base:              #5B8CFF
            --mw-color-primary-hover:             #4A7AE0   ← derived (OKLCH)
            --mw-color-primary-pressed:           #3A68C0   ← derived (OKLCH)
            --mw-color-primary-disabled:          rgba(91,140,255,0.35) ← derived
            --mw-color-primary-label:             #FFFFFF   ← WCAG contrast
            --mw-color-primary-label-disabled:    rgba(255,255,255,0.5)
            --mw-color-secondary-*:               (derived from primary)
            --mw-color-danger-*, --mw-color-success-*, --mw-color-warning-*
            --mw-color-background, --mw-color-surface, --mw-color-text, ...
            --mw-font-primary, --mw-font-secondary, --mw-font-mono
            --mw-ui-radius
            --mw-typography-h1-*, --mw-typography-h2-*, --mw-typography-h3-*
            --mw-typography-paragraph-{sm,md,lg}-*

createButtonRecipe(opts)          ← no theme arg
    └── vars: {}                  ← provider owns all theme vars
        className: "mw-btn mw-btn--md mw-btn--primary"

button.css reads from provider scope via CSS cascade:
    .mw-btn--primary         { background: var(--mw-color-primary-base); }
    .mw-btn--primary:hover   { background: var(--mw-color-primary-hover); }
    .mw-btn--secondary       { color: var(--mw-color-primary-base); border-color: var(--mw-color-primary-base); }
```

The provider owns theme injection once at the root. Recipes own class names and a11y. CSS variables cascade to every component in the subtree — no per-element injection.

---

## The Full Phase Map

```
Pre-Phase 0  Preset CSS audit + visual regression baseline (gate)

Phase 0 — Theme Engine  ✓ COMPLETE
──────────────────────────────────────────────────────────────────
  color-utils.ts          Pure color math (OKLCH pipeline, WCAG contrast)
  color-resolve.ts        resolveColorRole() → ColorRole
  theme-css.ts            themeToCSSVars() + applyTheme() — 69 CSS vars
  theme-types.ts          ColorInput, ColorRole; on* fields removed (never types)
  resolveThemeInput.ts    ThemeInput → ResolvedTheme pipeline
  MarwesProvider (R+V)    applyTheme on mount + theme change; no system context
  useTheme() (R+V)        Returns ResolvedTheme directly (no System wrapper)
  Preset CSS rename       All files: --mw-primary → --mw-color-primary-base etc.
  Recipe cleanup          button/input/divider/checkbox/icon: vars: {}, no theme arg
                          heading/paragraph: theme → ResolvedTheme for typography scale

  ✓ End state: provider injects all vars. Components read vars only. No hex in CSS.

Phase 1 — Update Existing Components
──────────────────────────────────────────────────────────────────
  Components: Button, Divider, Input, Checkbox, Typography
  For each — same layer order:
    core recipe     → remove manual var injection, adopt new token names
    preset CSS      → rename --mw-* vars to --mw-color-* pattern
    react adapter   → no changes
    react stories   → update to show all V3 states + variants
    vue adapter     → no changes
    vue stories     → match React coverage

  ✓ End state: all existing components render from CSS vars only.
               Chromatic: zero unintentional visual regressions.

Phase 2 — New Simple Components (Badge, Tab, Card)
Phase 3 — New Interactive Components (Switch, Accordion, Radio Button)
Phase 4 — New Complex Components (Toast, Purpose Buttons)
──────────────────────────────────────────────────────────────────
  For each new component — same 9-step layer order (all new files):
    1. core/*-types.ts
    2. core/*-a11y.ts
    3. core/*-styles.ts     (state × variant → CSS class modifiers)
    4. core/*-recipe.ts
    5. presets/*.css
    6. react/*.tsx
    7. react/*.stories.tsx
    8. vue/*.ts
    9. vue/*.stories.ts

  ✓ Each follows the exact same thread as Button.

Phase 5 — Storybook, Contracts & Cleanup
──────────────────────────────────────────────────────────────────
  - All stories cover V3 Figma states and variants
  - Integration tests in tests/contracts/
  - Remove deprecated Theme fields (onPrimary, onSecondary, etc.)
  - Archive V1 node references

  ✓ End state: both Storybooks fully cover all V3 components.
```

---

## End State — Storybook Structure

Both React and Vue Storybooks will have this structure:

```
Buttons/
  General/        Primary, Secondary, Text
  Actions/        Submit, Save, Cancel, Confirm, Delete, Verify...
Theme/
  Engine/         Live color derivation demo
Forms/
  Input/          Text, Textarea, Search, Password, DateOfBirth, Phone, Zip
  Checkbox/       All states × Unchecked/Checked/Indeterminate + CheckboxGroup
  Radio/          All states + RadioGroup
Navigation/
  Tab/            5 states
Feedback/
  Badge/          6 semantic variants
  Toast/          3 display × 4 semantic types
Layout/
  Card/           5 interaction states
  Divider/        7 height variants
Controls/
  Switch/         3 sizes × On/Off × 5 states
  Accordion/      Expanded/Collapsed × 5 states
Typography/
  Headings, Paragraphs, Scale
```

---

## How to Add Any New Component

```
1. Read the Figma node in .figma/nodes.json
2. Add REQ-XXX to spec.md
3. Run Research → Spec → Tickets → Implement
4. In layer order:
   [ ] packages/core/src/components/[name]/[name]-types.ts
   [ ] packages/core/src/components/[name]/[name]-a11y.ts
   [ ] packages/core/src/components/[name]/[name]-styles.ts
   [ ] packages/core/src/components/[name]/[name]-recipe.ts
   [ ] packages/core/src/components/[name]/index.ts
   [ ] packages/presets/src/firstEdition/[name].css
   [ ] packages/react/src/components/[name]/[name].tsx
   [ ] apps/storybook-react/src/stories/[name]/[name].stories.tsx
   [ ] packages/vue/src/components/[name]/[name].ts
   [ ] apps/storybook-vue/src/stories/[name]/[name].stories.ts
5. Export from packages/core/src/index.ts, react/src/index.ts, vue/src/index.ts
6. Import CSS in packages/presets/src/firstEdition/styles.css
```

---

## Where Things Live — Quick Reference

| What | Where |
|------|-------|
| Figma V3 node IDs | `.figma/nodes.json` |
| Migration phases | `docs/MIGRATION.md` |
| Architecture decisions (D1–D11) | `docs/SPEC.md` |
| Spec requirements (REQ-*) | `spec.md` |
| Engineering rules + layer order | `docs/ENGINEERING.md` |
| This document | `docs/ARCHITECTURE.md` |
| Color math (Phase 0 — new) | `packages/core/src/theme/color-utils.ts` |
| Color derivation (Phase 0 — new) | `packages/core/src/theme/color-resolve.ts` |
| CSS variable bridge (Phase 0 — new) | `packages/core/src/theme/theme-css.ts` |
| Theme types | `packages/core/src/theme/theme-types.ts` |
| Theme defaults | `packages/core/src/theme/theme-defaults.ts` |
| React provider | `packages/react/src/provider/` |
| Vue provider | `packages/vue/src/provider/` |
| Preset CSS | `packages/presets/src/firstEdition/` |
| Shared Storybook argTypes | `packages/core/src/storybook/` |

---

## The Three Layers

Marwes separates concerns into three distinct packages:

```
┌─────────────────────────────────────────────────────────────┐
│                    @marwes-ui/core                             │
│  Framework-agnostic logic (TypeScript only)                 │
│  • Theme system (merge, normalize, defaults)                │
│  • Component recipes (Button, Input, etc.)                  │
│  • A11y logic (props → ARIA attributes)                     │
│  • State machines (for stateful components)                 │
│  • Zero runtime dependencies                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  @marwes-ui/presets                            │
│  Design system tokens + CSS (Vanilla CSS + CSS Variables)  │
│  • firstEdition preset (theme defaults)                     │
│  • CSS files with .mw-* classes                             │
│  • Token definitions (radius, density, etc.)                │
│  • No runtime JavaScript, only static CSS                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  @marwes-ui/react                              │
│  React adapter (framework-specific rendering)               │
│  • MarwesProvider (injects 69 CSS vars via applyTheme)      │
│  • Component wrappers (Button, Input, etc.)                 │
│  • Hooks (useTheme → ResolvedTheme)                         │
│  • Applies RenderKit from core to React elements            │
└─────────────────────────────────────────────────────────────┘
```

## Complete Flow: Button Example

Let's trace how a Button goes from user code → rendered HTML:

### 1. User Code (React App)

```tsx
import { MarwesProvider, Button, ButtonVariant } from "@marwes-ui/react"
import "@marwes-ui/presets/firstEdition/styles.css"

function App() {
  return (
    <MarwesProvider theme={{ color: { primary: "#5B8CFF" } }}>
      <Button variant={ButtonVariant.primary} onClick={handleSave}>
        Save Changes
      </Button>
    </MarwesProvider>
  )
}
```

### 2. MarwesProvider

On mount, `applyTheme(rootElement, resolvedTheme)` stamps 69 CSS vars on the provider's root div:

```html
<div data-marwes-theme="true" class="mw-theme--light"
     style="
       --mw-color-primary-base: #5B8CFF;
       --mw-color-primary-hover: #4A7AE0;
       --mw-color-primary-label: #FFFFFF;
       --mw-color-danger-base: #DC2626;
       --mw-ui-radius: 10px;
       --mw-font-primary: Inter, sans-serif;
       ... (69 vars total)">
```

All components inside inherit these vars through the normal CSS cascade.

### 3. React Adapter Layer

File: `packages/react/src/components/button/button.tsx`

```tsx
export const Button = defineComponent((props: ButtonProps, { slots, emit }) => {
  const attrs = useAttrs()
  const kit = computed(() => createButtonRecipe(props))   // no theme — cascade handles it

  return () => h("button", {
    type: kit.value.a11y.type,
    disabled: kit.value.a11y.disabled,
    "aria-label": kit.value.a11y.ariaLabel,
    class: mergeClassNames(kit.value.className, props.className, attrs.class),
    style: mergeStyles(kit.value.vars, attrs.style),
    ...kit.value.dataAttributes,
    onClick: (e) => emit("click", e),
  }, getDefaultSlotChildren(slots))
})
```

### 4. Core Recipe Layer

File: `packages/core/src/components/atoms/button/button-recipe.ts`

```ts
export function createButtonRecipe(opts: ButtonOptions): ButtonRenderKit {
  const { tag, a11y, blockClick } = resolveButtonA11y(opts)
  const size = opts.size ?? "md"
  const variant = opts.variant ?? "primary"

  return {
    tag,
    blockClick,
    a11y,
    className: ["mw-btn", `mw-btn--${size}`, `mw-btn--${variant}`].join(" "),
    dataAttributes: { "data-component": "button", ... },
    vars: {},   // provider owns all theme vars
  }
}
```

**Output RenderKit:**
```js
{
  tag: "button",
  className: "mw-btn mw-btn--md mw-btn--primary",
  vars: {},
  a11y: { type: "button", disabled: false },
  blockClick: false
}
```

### 5. Preset CSS Layer

File: `packages/presets/src/firstEdition/button.css`

```css
.mw-btn {
  border-radius: var(--mw-ui-radius);             /* inherited from provider */
  font-family: var(--mw-font-primary, inherit);   /* inherited from provider */
}

.mw-btn--primary {
  background: var(--mw-color-primary-base);       /* inherited from provider */
  color: var(--mw-color-primary-label);           /* inherited from provider */
  border-color: var(--mw-color-primary-base);
}
```

### 6. Final Rendered HTML

```html
<!-- Provider root sets all vars once -->
<div data-marwes-theme="true" class="mw-theme--light"
     style="--mw-color-primary-base: #5B8CFF; --mw-ui-radius: 10px; ...">

  <!-- Button has no inline vars — inherits from ancestor -->
  <button class="mw-btn mw-btn--md mw-btn--primary" data-component="button" type="button">
    Save Changes
  </button>

</div>
```

CSS cascade resolves:
- `.mw-btn` → `border-radius: 10px` (via `--mw-ui-radius` on ancestor)
- `.mw-btn--primary` → `background: #5B8CFF` (via `--mw-color-primary-base` on ancestor)
- `.mw-btn--primary:hover` → `opacity: 0.9`

## Why This Architecture?

### ✅ Framework Agnostic
Core has zero React dependencies. Adding Vue/Svelte is just:
```ts
// packages/vue/src/components/button/button.ts
const kit = computed(() => createButtonRecipe(props))
// Apply kit to Vue element
```

### ✅ Testable Without DOM
```ts
// packages/core/test/recipes/button.test.ts
it('builds button render kit with default metadata', () => {
  const kit = createButtonRecipe({ as: "button", ariaLabel: "Save", iconOnly: true })
  expect(kit.tag).toBe("button")
  expect(kit.className).toContain("mw-btn")
  expect(kit.vars).toEqual({})   // no theme vars — provider handles all
})
```

### ✅ Swappable Presets
Import a different CSS file for a different visual theme — the components and recipes are unchanged:
```tsx
import "@marwes-ui/presets/material/styles.css"  // different CSS, same components
```

### ✅ Consistent A11y
Accessibility logic is centralized in core. All frameworks get the same ARIA behavior.

### ✅ Zero Runtime CSS Overhead
CSS is static files, not runtime JS. No CSS-in-JS performance cost.

## Repository Structure

```
marwes/
├── packages/
│   ├── core/              # Pure TypeScript logic
│   │   └── src/
│   │       ├── components/
│   │       │   ├── button/
│   │       │   │   ├── button-types.ts
│   │       │   │   ├── button-a11y.ts
│   │       │   │   ├── button-recipe.ts
│   │       │   │   └── index.ts
│   │       │   └── input/
│   │       └── theme/
│   │
│   ├── presets/           # Design tokens + CSS
│   │   └── src/
│   │       └── firstEdition/
│   │           ├── index.ts       # Theme defaults
│   │           └── styles.css     # Component CSS
│   │
│   └── react/             # React adapter
│       └── src/
│           ├── provider/
│           │   └── marwes-provider.tsx
│           └── components/
│               ├── button.tsx
│               └── input.tsx
│
├── apps/
│   ├── storybook-react/   # Component development
│   └── playground-react/  # Integration testing
│
└── docs/
    └── ARCHITECTURE.md    # This file
```

## Developer Journey

When working on a component, you'll touch files in this order:

1. **Define contract** → `packages/core/src/components/atoms/button/button-types.ts`
2. **Implement a11y** → `packages/core/src/components/atoms/button/button-a11y.ts`
3. **Create recipe** → `packages/core/src/components/atoms/button/button-recipe.ts`
4. **Write CSS** → `packages/presets/src/firstEdition/styles.css`
5. **Create adapter** → `packages/react/src/components/button.tsx`
6. **Document** → `apps/storybook-react/src/stories/button/*.stories.tsx`
7. **Test integration** → `apps/playground-react/src/App.tsx`

Each step is independent and testable. The architecture ensures you only need to understand one layer at a time.

## Related Documentation

- [Core Components](../packages/core/src/components/README.md)
- [Button Component](../packages/core/src/components/atoms/button/README.md)
- [Input Component](../packages/core/src/components/atoms/input/README.md)
- [Specification](../SPEC.md)
