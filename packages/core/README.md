<div align="center">

<img alt="Marwes Design System" src="https://raw.githubusercontent.com/niklas-westman/marwes/main/.github/assets/banner-light.png" width="100%">

<br>
<br>

# Marwes Design System - Core

**The framework-agnostic engine behind Marwes themes, recipes, accessibility, and semantic metadata.**

Pure TypeScript • No React/Vue dependency • Typed RenderKit • Shared ThemeInput • AI-readable contracts

[Documentation](https://github.com/niklas-westman/marwes/tree/main/docs) • [Storybook](https://d3hobet9plpuvm.cloudfront.net/storybook-react/latest/) • [GitHub](https://github.com/niklas-westman/marwes)

</div>

---

## Why Use It

Most app teams should install `@marwes-ui/react` or `@marwes-ui/vue`. Install core directly when you are building an adapter, validating design-system contracts, or using Marwes theme and recipe utilities without a framework.

Core gives every adapter the same:

- `ThemeInput` contract
- resolved theme model
- CSS variable generation
- component recipes
- accessibility mapping
- semantic `data-*` metadata
- typed enums and token helpers

## Package Map

Core is the contract layer, not the normal app entry point.

| Package | Use it when |
| --- | --- |
| `@marwes-ui/react` | You are building a React app. |
| `@marwes-ui/vue` | You are building a Vue app. |
| `@marwes-ui/core` | You need framework-agnostic recipes, theme utilities, accessibility contracts, or adapter/tooling APIs. |
| `@marwes-ui/presets` | You need standalone preset CSS or preset theme exports. |

This package is useful for humans and AI agents that need stable contracts without framework rendering: component recipes, theme variable names, semantic attributes, and accessibility mapping all live here.

## Install

```bash
pnpm add @marwes-ui/core
```

## Theme Engine

```ts
import { mwAvailableFonts, resolveThemeInput, themeToCSSVars } from "@marwes-ui/core"

const theme = resolveThemeInput({
  color: {
    primary: "#2457FF",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#111827",
    border: "#D1D5DB",
    focus: "#2457FF",
  },
  font: {
    primary: mwAvailableFonts.Poppins,
    secondary: mwAvailableFonts.Lora,
  },
  ui: {
    radius: 10,
    density: "comfortable",
  },
})

const cssVars = themeToCSSVars(theme)
```

React and Vue providers apply these variables to the provider root. Preset CSS consumes them across buttons, inputs, typography, cards, toasts, overlays, and layout primitives.

## Theme Variables

Marwes components are styled by CSS custom properties on the `MarwesProvider` root. The theme variable helpers expose that same token surface to application code, adapters, and tooling without creating a second runtime theme system.

Use these helpers when custom styling needs to stay connected to the active provider theme:

- `mwThemeVars` is the default custom styling API. It returns CSS `var(...)` references such as `"var(--mw-spacing-sp-24)"`.
- `mwThemeVarNames` returns raw custom property names such as `"--mw-spacing-sp-24"` for assignment, inspection, tests, and bridge packages.
- `mwVar()` wraps a custom `--mw-*` property name in `var(...)`, with optional fallback support.
- `mwStyledTheme` mirrors `mwThemeVars` as a plain object for styled-components and Emotion theme providers.

```ts
import { mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar } from "@marwes-ui/core"

mwThemeVars.spacing.sp24 // "var(--mw-spacing-sp-24)"
mwThemeVars.color.text // "var(--mw-color-text)"
mwThemeVars.color.primary.base // "var(--mw-color-primary-base)"
mwThemeVars.ui.radius // "var(--mw-ui-radius)"

mwThemeVarNames.spacing.sp24 // "--mw-spacing-sp-24"
mwVar("--mw-color-text", "#141414") // "var(--mw-color-text, #141414)"
mwStyledTheme.spacing.sp24 // "var(--mw-spacing-sp-24)"
```

This enables one theme contract across plain CSS, CSS Modules, CSS-in-JS, vanilla-extract, Tailwind-style config files, inline style objects, React, Vue, and future adapters. Because the helpers only expose CSS variable references and names, they remain framework-agnostic and follow any `ThemeInput` resolved by the provider.

Keep the APIs separate:
- `Spacings.sp24` returns `"sp-24"` for Marwes component props.
- `mwThemeVars.spacing.sp24` returns `"var(--mw-spacing-sp-24)"` for custom styling.
- `mwThemeVarNames.spacing.sp24` returns `"--mw-spacing-sp-24"` when code needs the property name itself.
- `themeToCSSVars()` maps resolved theme values into custom property declarations.
- Adapter `useTheme()` hooks return resolved runtime values for logic and inspection.

## Recipe Engine

Core recipes return a typed RenderKit object instead of framework elements. Adapters map that object to React, Vue, or future renderers.

RenderKit includes:
- `tag`
- `className`
- `vars`
- `a11y`
- optional data attributes and component-specific control fields

## Available Component Contracts

Core currently powers these component families:

- Buttons and semantic button purposes
- Inputs, textareas, selects, rich text, OTP, and field wrappers
- Checkbox and radio families
- Switches and sliders
- Cards, typography, icons, avatars, dividers, and spacing
- Badges and contextual badge variants
- Toasts, tooltips, dialogs, tabs, accordions, and spinners

React and Vue expose the public components. Core exposes the shared recipes, types, enum objects, semantic utilities, and theme helpers that keep those adapters consistent.

## Accessibility Contract

Core is where Marwes accessibility is made reusable. Recipes return typed `a11y` output alongside classes, vars, and semantic metadata, so every adapter receives the same source of truth.

That contract covers:

- native-first semantics for controls that should stay native
- label and description wiring for fields and grouped controls
- invalid, disabled, selected, expanded, checked, and busy state mapping
- coordinated widget roles such as dialog, tablist, tab, tabpanel, tooltip, status, and alert
- stable `data-*` metadata for purpose components and agent-readable intent

Example: field helpers generate the ids that adapters use to connect helper text and errors to the control:

```ts
import { buildInputFieldA11yIds } from "@marwes-ui/core"

buildInputFieldA11yIds({
  id: "email",
  hasHelperText: true,
  hasError: true,
})
// {
//   helperTextId: "email-helper",
//   errorId: "email-error",
//   describedBy: "email-helper email-error"
// }
```

React and Vue tests run the same shared contracts against their DOM output. Storybook a11y smoke checks then add an axe-powered browser-level signal for the promoted families.

## Semantic Metadata

Purpose components use the core semantic registry to emit stable metadata. That makes components easier for tests, audits, and AI agents to reason about.

```ts
import { createPurposeSemanticAttributes } from "@marwes-ui/core"

createPurposeSemanticAttributes("destructive")
// {
//   "data-purpose": "destructive",
//   "data-action": "delete",
//   "data-destructive": "true",
//   "data-confirmation-required": "true"
// }
```

This is intentionally practical. A destructive action can carry `data-destructive="true"` and `data-confirmation-required="true"`, which gives an AI agent or browser automation rule a clear signal to ask before clicking. It also gives tests a stable assertion target that does not depend on button text, color, or visual styling.

## Public API Highlights

Theme:
- `resolveThemeInput`
- `themeToCSSVars`
- `mwThemeVars`
- `mwThemeVarNames`
- `mwStyledTheme`
- `mwVar`
- `lightThemeDefaults`
- `darkThemeDefaults`
- `mwAvailableFonts`
- `mwFontFallbacks`
- `mwGoogleFontFamilies`
- `createFontStack`

Recipe and semantic helpers:
- component recipe functions such as `createButtonRecipe`, `createInputRecipe`, `checkboxRecipe`, `radioRecipe`, `createDialogRecipe`, `createToastRecipe`
- accessibility helpers for supported families
- semantic builders and validators

Types and tokens:
- `Theme`, `ThemeInput`, `ThemeMode`, `ResolvedTheme`
- `ColorRole`, `SecondaryColorRole`, `ColorInput`
- `ButtonVariant`, `ButtonSize`, `ButtonAction`
- `BadgeVariant`, `AvatarSize`, `AvatarType`, `SwitchSize`, `IconName`, `Spacings`

## Package Boundaries

- Core has no React, Vue, DOM, or CSS runtime dependency.
- Presets own static CSS and the default visual layer.
- React and Vue own rendering, provider lifecycle, and framework APIs.

## Scripts

```bash
pnpm --filter @marwes-ui/core build
pnpm --filter @marwes-ui/core typecheck
pnpm --filter @marwes-ui/core test
```

## Related Docs

- [Docs index](https://github.com/niklas-westman/marwes/tree/main/docs)
- [Architecture](https://github.com/niklas-westman/marwes/blob/main/docs/reference/architecture.md)
- [Figma to Marwes](https://github.com/niklas-westman/marwes/blob/main/docs/guides/figma-to-marwes.md)
