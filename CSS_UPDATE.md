# CSS Update Plan

## Objective

Make Marwes theme tokens easy to consume from any styling layer, not only from Marwes components.

The target developer experience is:

```ts
import { mwThemeVars } from "@marwes-ui/react"

const Panel = styled.div`
  margin-bottom: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
  border-radius: ${mwThemeVars.ui.radius};
`
```

The same token surface must also work in plain CSS, CSS Modules, Emotion, vanilla-extract, Tailwind-style config files, inline styles, and framework-agnostic code.

## Current State

Marwes already has a strong CSS foundation:

- `MarwesProvider` resolves `ThemeInput` into CSS custom properties on the provider root.
- `@marwes-ui/presets` ships static CSS that consumes `--mw-*` variables.
- `themeToCSSVars()` maps a resolved theme into CSS variable declarations.
- `Spacings.sp24` returns the token name `"sp-24"` for component props like `<Spacer spacing={Spacings.sp24} />`.
- The first edition preset defines spacing variables such as `--mw-spacing-sp-24`.
- React and Vue expose `useTheme()` for resolved theme values.

What is missing:

- A public JavaScript object that returns CSS variable references such as `var(--mw-spacing-sp-24)`.
- A public map from token names to CSS variable names such as `--mw-spacing-sp-24`.
- A low-friction styled-components / Emotion theme object.
- Documentation showing how the same tokens work across different CSS systems.

## Design Principles

- CSS variables remain the runtime source of truth for styling.
- Marwes should not depend on styled-components, Emotion, Tailwind, or vanilla-extract.
- Token helpers must live in `@marwes-ui/core` and be re-exported by React and Vue.
- Helpers should be plain objects and pure functions so they are usable in any build tool.
- Token names must use dot notation for good DevEx: `mwThemeVars.spacing.sp24`, not `["sp-24"]`.
- Legacy token names can remain available where useful, but docs should prefer dot notation.
- The API should support both direct CSS variable references and raw CSS variable names.
- The feature should not create a second runtime theme system competing with `MarwesProvider`.

## Proposed Public API

### 1. CSS Variable References

Add `mwThemeVars` in `@marwes-ui/core` and re-export from `@marwes-ui/react` and `@marwes-ui/vue`.

```ts
import { mwThemeVars } from "@marwes-ui/react"

mwThemeVars.spacing.sp24 // "var(--mw-spacing-sp-24)"
mwThemeVars.color.text // "var(--mw-color-text)"
mwThemeVars.color.primary.base // "var(--mw-color-primary-base)"
mwThemeVars.font.primary // "var(--mw-font-primary)"
mwThemeVars.ui.radius // "var(--mw-ui-radius)"
mwThemeVars.density.height // "var(--mw-density-height)"
mwThemeVars.typography.h1.fontSize // "var(--mw-typography-h1-font-size)"
```

This is the default API most app code should use.

### 2. Raw CSS Variable Names

Add `mwThemeVarNames` for tooling that needs the custom property name without `var(...)`.

```ts
import { mwThemeVarNames } from "@marwes-ui/core"

mwThemeVarNames.spacing.sp24 // "--mw-spacing-sp-24"
mwThemeVarNames.color.text // "--mw-color-text"
```

This helps with:

- inline style objects
- dynamic CSS var assignment
- theme inspection tools
- tests
- bridge packages

### 3. Helper Function

Add a tiny helper for custom or advanced variable names.

```ts
import { mwVar } from "@marwes-ui/core"

mwVar("--mw-spacing-sp-24") // "var(--mw-spacing-sp-24)"
mwVar("--mw-spacing-sp-24", "24px") // "var(--mw-spacing-sp-24, 24px)"
```

This keeps escape hatches ergonomic without making consumers hand-write `var(...)`.

### 4. Styled Theme Object

Add `mwStyledTheme` as a plain object that mirrors `mwThemeVars`.

```ts
import { mwStyledTheme } from "@marwes-ui/react"
import { ThemeProvider } from "styled-components"

<ThemeProvider theme={mwStyledTheme}>
  <App />
</ThemeProvider>
```

```ts
const Panel = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sp24};
  color: ${({ theme }) => theme.color.text};
`
```

`mwStyledTheme` should not require styled-components as a dependency. It is just a plain object. Emotion can use the same object.

### 5. Runtime Theme Values

Keep `useTheme()` for resolved runtime values:

```tsx
const theme = useTheme()
theme.color.primary.base // "#2F31FC"
```

Do not position `useTheme()` as the main styling API. It is useful for logic, visualization, and tooling, while `mwThemeVars` is better for CSS.

## Token Surface

The first implementation should cover every CSS variable that Marwes emits or documents.

### Color

```ts
mwThemeVars.color.primary.base
mwThemeVars.color.primary.hover
mwThemeVars.color.primary.pressed
mwThemeVars.color.primary.disabled
mwThemeVars.color.primary.label
mwThemeVars.color.primary.labelDisabled

mwThemeVars.color.secondary.base
mwThemeVars.color.secondary.border
mwThemeVars.color.secondary.borderDisabled

mwThemeVars.color.danger.base
mwThemeVars.color.success.base
mwThemeVars.color.warning.base
mwThemeVars.color.info.base

mwThemeVars.color.background
mwThemeVars.color.surface
mwThemeVars.color.surfaceSubtle
mwThemeVars.color.surfaceElevated
mwThemeVars.color.surfaceDisabled
mwThemeVars.color.surfaceInverted
mwThemeVars.color.text
mwThemeVars.color.textMuted
mwThemeVars.color.textSubtle
mwThemeVars.color.textDisabled
mwThemeVars.color.textInverted
mwThemeVars.color.border
mwThemeVars.color.borderSubtle
mwThemeVars.color.borderStrong
mwThemeVars.color.borderDisabled
mwThemeVars.color.focus
```

### Spacing

```ts
mwThemeVars.spacing.sp0
mwThemeVars.spacing.sp2
mwThemeVars.spacing.sp4
mwThemeVars.spacing.sp8
mwThemeVars.spacing.sp16
mwThemeVars.spacing.sp24
mwThemeVars.spacing.sp32
mwThemeVars.spacing.sp40
mwThemeVars.spacing.sp48
mwThemeVars.spacing.sp56
mwThemeVars.spacing.sp64
mwThemeVars.spacing.sp72
mwThemeVars.spacing.sp80
mwThemeVars.spacing.sp88
mwThemeVars.spacing.sp96
mwThemeVars.spacing.sp104
mwThemeVars.spacing.sp112
mwThemeVars.spacing.sp120
```

These values should resolve to `var(--mw-spacing-sp-*)`, not raw pixels. That keeps custom CSS responsive to the same provider and preset scope as Marwes components.

### Font

```ts
mwThemeVars.font.primary
mwThemeVars.font.secondary
mwThemeVars.font.mono
```

### UI

```ts
mwThemeVars.ui.radius
```

### Density

```ts
mwThemeVars.density.height
mwThemeVars.density.paddingX
mwThemeVars.density.paddingY
mwThemeVars.density.gap
mwThemeVars.density.fontSize
mwThemeVars.density.iconSize
mwThemeVars.density.checkboxSize
mwThemeVars.density.fieldGap
mwThemeVars.density.spacingMultiplier
mwThemeVars.density.fontSizeSm
```

### Typography

```ts
mwThemeVars.typography.h1.fontSize
mwThemeVars.typography.h1.lineHeight
mwThemeVars.typography.h1.fontWeight
mwThemeVars.typography.h1.letterSpacing

mwThemeVars.typography.h2.fontSize
mwThemeVars.typography.h3.fontSize

mwThemeVars.typography.paragraph.sm.fontSize
mwThemeVars.typography.paragraph.md.lineHeight
mwThemeVars.typography.paragraph.lg.fontSize
```

## Usage Patterns

### Plain CSS

```css
.project-panel {
  margin-bottom: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
  background: var(--mw-color-surface);
  border: 1px solid var(--mw-color-border);
  border-radius: var(--mw-ui-radius);
}
```

Plain CSS already works today. The docs should make this obvious.

### CSS Modules

```css
.panel {
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
}
```

```tsx
import styles from "./panel.module.css"

<div className={styles.panel} />
```

CSS Modules need no JavaScript bridge because CSS variables are inherited from `MarwesProvider`.

### styled-components

Recommended simple path:

```ts
import { mwThemeVars } from "@marwes-ui/react"

const Panel = styled.div`
  padding: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
`
```

Optional callback path:

```ts
import { mwStyledTheme } from "@marwes-ui/react"

const Panel = styled.div`
  padding: ${({ theme }) => theme.spacing.sp24};
`
```

### Emotion

```ts
import { css } from "@emotion/react"
import { mwThemeVars } from "@marwes-ui/react"

export const panel = css`
  padding: ${mwThemeVars.spacing.sp24};
  color: ${mwThemeVars.color.text};
`
```

Emotion can also use `mwStyledTheme` as a plain theme object.

### vanilla-extract

```ts
import { style } from "@vanilla-extract/css"
import { mwThemeVars } from "@marwes-ui/core"

export const panel = style({
  padding: mwThemeVars.spacing.sp24,
  color: mwThemeVars.color.text,
})
```

Because the values are CSS variable references, vanilla-extract does not need to own Marwes theme state.

### Inline Styles

```tsx
import { mwThemeVars } from "@marwes-ui/react"

<div
  style={{
    marginBottom: mwThemeVars.spacing.sp24,
    color: mwThemeVars.color.text,
  }}
/>
```

For setting variables:

```tsx
import { mwThemeVarNames } from "@marwes-ui/react"

<div style={{ [mwThemeVarNames.color.focus]: "#FF00AA" }} />
```

### Tailwind Or Utility Configs

Marwes should not require a Tailwind plugin for 1.0.0. A simple config bridge is enough:

```ts
import { mwThemeVars } from "@marwes-ui/core"

export default {
  theme: {
    extend: {
      spacing: {
        mw24: mwThemeVars.spacing.sp24,
      },
      colors: {
        mwText: mwThemeVars.color.text,
        mwSurface: mwThemeVars.color.surface,
      },
      borderRadius: {
        mw: mwThemeVars.ui.radius,
      },
    },
  },
}
```

Later, we can consider a tiny `@marwes-ui/tailwind` helper, but that should not be part of the first implementation.

### Vue Style Blocks

```vue
<template>
  <section class="panel">
    <slot />
  </section>
</template>

<style scoped>
.panel {
  padding: var(--mw-spacing-sp-24);
  color: var(--mw-color-text);
}
</style>
```

Vue users can also import `mwThemeVars` in script-driven style objects.

## Implementation Plan

### Phase 1: Core Token Helpers

Add a new core module:

```text
packages/core/src/theme/theme-vars.ts
```

Exports:

- `mwThemeVarNames`
- `mwThemeVars`
- `mwStyledTheme`
- `mwVar`
- types for the token object shape

Rules:

- No framework imports.
- No CSS-in-JS imports.
- All values are string literals.
- Objects use `as const`.
- `mwStyledTheme` can be an alias of `mwThemeVars` unless we need a separate type name.

### Phase 2: Export Surface

Export from:

- `@marwes-ui/core`
- `@marwes-ui/react`
- `@marwes-ui/vue`

React and Vue should re-export the core helpers exactly. They should not create adapter-specific variants.

### Phase 3: Tests

Add core tests:

- `mwThemeVars.spacing.sp24` equals `var(--mw-spacing-sp-24)`.
- `mwThemeVarNames.spacing.sp24` equals `--mw-spacing-sp-24`.
- `mwThemeVars.color.primary.base` equals `var(--mw-color-primary-base)`.
- `mwVar("--mw-color-text")` equals `var(--mw-color-text)`.
- `mwVar("--mw-color-text", "#141414")` equals `var(--mw-color-text, #141414)`.
- `mwStyledTheme` exposes the same references as `mwThemeVars`.

Add export tests in React and Vue:

- public package index exports `mwThemeVars`
- public package index exports `mwThemeVarNames`
- public package index exports `mwStyledTheme`
- public package index exports `mwVar`

### Phase 4: Documentation

Update:

- root README
- `packages/core/README.md`
- `packages/react/README.md`
- `packages/vue/README.md`
- `packages/presets/README.md`

Docs should clearly separate:

- `Spacings.sp24`: token name for Marwes component props.
- `mwThemeVars.spacing.sp24`: CSS variable reference for custom CSS.
- `useTheme()`: resolved runtime theme values for logic and inspection.
- `themeToCSSVars()`: low-level conversion for tooling and provider internals.

### Phase 5: Examples

Add one small example to the React playground or docs examples showing:

- `mwThemeVars` in styled-components
- plain CSS variable usage
- a component inside `MarwesProvider` proving inherited variables work

Avoid adding styled-components as a dependency to packages. Existing playground dependency is enough for examples if needed.

### Phase 6: Validation

Run:

```bash
pnpm --filter @marwes-ui/core test
pnpm --filter @marwes-ui/react test
pnpm --filter @marwes-ui/vue test
pnpm --filter @marwes-ui/core build
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/vue build
pnpm check:compass
pnpm check:compass
```

If package READMEs change, also run:

```bash
npm_config_cache=/tmp/marwes-npm-cache npm pack --dry-run
```

inside `packages/core`, `packages/react`, and `packages/vue`.

## Naming Decision

Recommended names:

- `mwThemeVars`: primary API for CSS variable references.
- `mwThemeVarNames`: raw custom property names.
- `mwStyledTheme`: optional theme object for styled-components and Emotion.
- `mwVar`: low-level helper.

Avoid:

- `theme`: too generic and conflicts with many styling libraries.
- `tokens`: ambiguous between token names, raw values, and CSS variable references.
- `cssVars`: less ergonomic and does not communicate that this is the app-facing theme bridge.
- `marwesTheme`: too broad; could imply resolved runtime values.

## Compatibility Notes

This should be a minor public API addition before 1.0.0 and part of the 1.0.0 stable surface.

It should not break existing consumers because:

- no existing exports need to change
- `Spacings` keeps its current role
- provider behavior stays unchanged
- preset CSS stays unchanged
- no new peer dependencies are introduced

## Risks

- If the token object is incomplete, users will fall back to hand-written CSS variables.
- If docs blur token names and CSS variable references, users may put `"sp-24"` into CSS and get invalid styling.
- If `mwStyledTheme` is documented as required, it may make Marwes look coupled to styled-components.
- If the token object contains raw values instead of `var(...)`, custom CSS will stop following provider-scoped theme changes.

## Acceptance Criteria

- Users can write `mwThemeVars.spacing.sp24` and get `var(--mw-spacing-sp-24)`.
- Users can use the same helper from React, Vue, and Core.
- styled-components can use either direct imports or `ThemeProvider theme={mwStyledTheme}`.
- Emotion, vanilla-extract, inline styles, CSS Modules, and plain CSS are documented.
- `Spacings` remains the component prop token helper.
- `useTheme()` remains the resolved runtime value hook.
- Package READMEs make the difference clear.
- Tests prove export availability and token correctness.
