# MwTheme CSS Provider Integration

`mwTheme` is the Marwes CSS-provider theme object for CSS-in-JS libraries, app style helpers, and adapter bridges. It exposes stable TypeScript paths whose leaf values are CSS-ready `var(--mw-*)` references, plus numeric breakpoints and media query strings.

Use `mwTheme` when the app wants IDE autocomplete and package-owned token names without adding a Marwes dependency to a styling library integration.

## Public API

All Marwes package roots export the same static reference object and type:

```ts
import { mwTheme } from "@marwes-ui/core"
import type { MwTheme } from "@marwes-ui/core"

import { mwTheme as reactMwTheme } from "@marwes-ui/react"
import type { MwTheme as ReactMwTheme } from "@marwes-ui/react"

import { mwTheme as vueMwTheme } from "@marwes-ui/vue"
import type { MwTheme as VueMwTheme } from "@marwes-ui/vue"

import { mwTheme as svelteMwTheme } from "@marwes-ui/svelte"
import type { MwTheme as SvelteMwTheme } from "@marwes-ui/svelte"
```

Top-level groups:

| Group | Values |
|---|---|
| `color` | Theme color CSS variable references |
| `font` | Font-family CSS variable references |
| `typography` | Typography CSS variable references |
| `spacing` | Static spacing CSS variable references |
| `density` | Density CSS variable references |
| `ui` | UI primitive CSS variable references |
| `breakpoint` | Numeric breakpoint values |
| `media` | Complete media query strings |

## styled-components

React provider render prop:

```tsx
import { MarwesProvider, type MwTheme } from "@marwes-ui/react"
import { ThemeProvider as StyledThemeProvider } from "styled-components"

export function Root() {
  return (
    <MarwesProvider>
      {(mwTheme) => (
        <StyledThemeProvider theme={mwTheme}>
          <App />
        </StyledThemeProvider>
      )}
    </MarwesProvider>
  )
}
```

Local styled-components augmentation:

```ts
import type { MwTheme } from "@marwes-ui/react"

declare module "styled-components" {
  export interface DefaultTheme extends MwTheme {}
}
```

Using the theme in styled-components:

```tsx
import styled from "styled-components"

export const Panel = styled.section`
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.borderSubtle};
  border-radius: ${({ theme }) => theme.ui.radius};
  color: ${({ theme }) => theme.color.text};
  padding: ${({ theme }) => theme.spacing.sp24};

  ${({ theme }) => theme.media.tabletAndBelow} {
    padding: ${({ theme }) => theme.spacing.sp16};
  }
`
```

The React, Vue, and Svelte adapters do not depend on `styled-components`. Keep augmentation and `ThemeProvider` wiring inside the consuming app.

## Custom Breakpoints

`mwTheme` is the static default object. If an app resolves a custom Marwes theme and needs matching media helpers, create a scoped object from the resolved theme:

```ts
import { createMwTheme } from "@marwes-ui/core"

const appTheme = createMwTheme(resolvedTheme)
```

Provider render props and scoped slots already receive the active CSS-provider theme object, so app code usually does not need to call `createMwTheme` directly.

## Reference Table

This table is generated from the current `mwTheme` object. Update it when `packages/core/src/theme/theme-vars.ts` changes.

| Path | CSS-ready value |
|---|---|
| `color.primary.base` | `var(--mw-color-primary-base)` |
| `color.primary.hover` | `var(--mw-color-primary-hover)` |
| `color.primary.pressed` | `var(--mw-color-primary-pressed)` |
| `color.primary.disabled` | `var(--mw-color-primary-disabled)` |
| `color.primary.label` | `var(--mw-color-primary-label)` |
| `color.primary.labelDisabled` | `var(--mw-color-primary-label-disabled)` |
| `color.secondary.base` | `var(--mw-color-secondary-base)` |
| `color.secondary.hover` | `var(--mw-color-secondary-hover)` |
| `color.secondary.pressed` | `var(--mw-color-secondary-pressed)` |
| `color.secondary.disabled` | `var(--mw-color-secondary-disabled)` |
| `color.secondary.label` | `var(--mw-color-secondary-label)` |
| `color.secondary.labelDisabled` | `var(--mw-color-secondary-label-disabled)` |
| `color.secondary.border` | `var(--mw-color-secondary-border)` |
| `color.secondary.borderDisabled` | `var(--mw-color-secondary-border-disabled)` |
| `color.danger.base` | `var(--mw-color-danger-base)` |
| `color.danger.hover` | `var(--mw-color-danger-hover)` |
| `color.danger.pressed` | `var(--mw-color-danger-pressed)` |
| `color.danger.disabled` | `var(--mw-color-danger-disabled)` |
| `color.danger.label` | `var(--mw-color-danger-label)` |
| `color.danger.labelDisabled` | `var(--mw-color-danger-label-disabled)` |
| `color.success.base` | `var(--mw-color-success-base)` |
| `color.success.hover` | `var(--mw-color-success-hover)` |
| `color.success.pressed` | `var(--mw-color-success-pressed)` |
| `color.success.disabled` | `var(--mw-color-success-disabled)` |
| `color.success.label` | `var(--mw-color-success-label)` |
| `color.success.labelDisabled` | `var(--mw-color-success-label-disabled)` |
| `color.warning.base` | `var(--mw-color-warning-base)` |
| `color.warning.hover` | `var(--mw-color-warning-hover)` |
| `color.warning.pressed` | `var(--mw-color-warning-pressed)` |
| `color.warning.disabled` | `var(--mw-color-warning-disabled)` |
| `color.warning.label` | `var(--mw-color-warning-label)` |
| `color.warning.labelDisabled` | `var(--mw-color-warning-label-disabled)` |
| `color.info.base` | `var(--mw-color-info-base)` |
| `color.info.hover` | `var(--mw-color-info-hover)` |
| `color.info.pressed` | `var(--mw-color-info-pressed)` |
| `color.info.disabled` | `var(--mw-color-info-disabled)` |
| `color.info.label` | `var(--mw-color-info-label)` |
| `color.info.labelDisabled` | `var(--mw-color-info-label-disabled)` |
| `color.background` | `var(--mw-color-background)` |
| `color.surface` | `var(--mw-color-surface)` |
| `color.surfaceSubtle` | `var(--mw-color-surface-subtle)` |
| `color.surfaceElevated` | `var(--mw-color-surface-elevated)` |
| `color.surfaceDisabled` | `var(--mw-color-surface-disabled)` |
| `color.surfaceInverted` | `var(--mw-color-surface-inverted)` |
| `color.text` | `var(--mw-color-text)` |
| `color.textMuted` | `var(--mw-color-text-muted)` |
| `color.textSubtle` | `var(--mw-color-text-subtle)` |
| `color.textDisabled` | `var(--mw-color-text-disabled)` |
| `color.textInverted` | `var(--mw-color-text-inverted)` |
| `color.textBrand` | `var(--mw-color-text-brand)` |
| `color.border` | `var(--mw-color-border)` |
| `color.borderSubtle` | `var(--mw-color-border-subtle)` |
| `color.borderStrong` | `var(--mw-color-border-strong)` |
| `color.borderDisabled` | `var(--mw-color-border-disabled)` |
| `color.borderBrand` | `var(--mw-color-border-brand)` |
| `color.focus` | `var(--mw-color-focus)` |
| `color.status.success.background` | `var(--mw-color-status-success-background)` |
| `color.status.success.text` | `var(--mw-color-status-success-text)` |
| `color.status.success.icon` | `var(--mw-color-status-success-icon)` |
| `color.status.success.border` | `var(--mw-color-status-success-border)` |
| `color.status.success.borderStrong` | `var(--mw-color-status-success-border-strong)` |
| `color.status.warning.background` | `var(--mw-color-status-warning-background)` |
| `color.status.warning.text` | `var(--mw-color-status-warning-text)` |
| `color.status.warning.icon` | `var(--mw-color-status-warning-icon)` |
| `color.status.warning.border` | `var(--mw-color-status-warning-border)` |
| `color.status.warning.borderStrong` | `var(--mw-color-status-warning-border-strong)` |
| `color.status.error.background` | `var(--mw-color-status-error-background)` |
| `color.status.error.text` | `var(--mw-color-status-error-text)` |
| `color.status.error.icon` | `var(--mw-color-status-error-icon)` |
| `color.status.error.border` | `var(--mw-color-status-error-border)` |
| `color.status.error.borderStrong` | `var(--mw-color-status-error-border-strong)` |
| `color.status.info.background` | `var(--mw-color-status-info-background)` |
| `color.status.info.text` | `var(--mw-color-status-info-text)` |
| `color.status.info.icon` | `var(--mw-color-status-info-icon)` |
| `color.status.info.border` | `var(--mw-color-status-info-border)` |
| `color.status.info.borderStrong` | `var(--mw-color-status-info-border-strong)` |
| `spacing.sp0` | `var(--mw-spacing-sp-0)` |
| `spacing.sp2` | `var(--mw-spacing-sp-2)` |
| `spacing.sp4` | `var(--mw-spacing-sp-4)` |
| `spacing.sp8` | `var(--mw-spacing-sp-8)` |
| `spacing.sp16` | `var(--mw-spacing-sp-16)` |
| `spacing.sp24` | `var(--mw-spacing-sp-24)` |
| `spacing.sp32` | `var(--mw-spacing-sp-32)` |
| `spacing.sp40` | `var(--mw-spacing-sp-40)` |
| `spacing.sp48` | `var(--mw-spacing-sp-48)` |
| `spacing.sp56` | `var(--mw-spacing-sp-56)` |
| `spacing.sp64` | `var(--mw-spacing-sp-64)` |
| `spacing.sp72` | `var(--mw-spacing-sp-72)` |
| `spacing.sp80` | `var(--mw-spacing-sp-80)` |
| `spacing.sp88` | `var(--mw-spacing-sp-88)` |
| `spacing.sp96` | `var(--mw-spacing-sp-96)` |
| `spacing.sp104` | `var(--mw-spacing-sp-104)` |
| `spacing.sp112` | `var(--mw-spacing-sp-112)` |
| `spacing.sp120` | `var(--mw-spacing-sp-120)` |
| `font.primary` | `var(--mw-font-primary)` |
| `font.secondary` | `var(--mw-font-secondary)` |
| `font.mono` | `var(--mw-font-mono)` |
| `ui.radius` | `var(--mw-ui-radius)` |
| `density.height` | `var(--mw-density-height)` |
| `density.paddingX` | `var(--mw-density-padding-x)` |
| `density.paddingY` | `var(--mw-density-padding-y)` |
| `density.gap` | `var(--mw-density-gap)` |
| `density.fontSize` | `var(--mw-density-font-size)` |
| `density.iconSize` | `var(--mw-density-icon-size)` |
| `density.checkboxSize` | `var(--mw-density-checkbox-size)` |
| `density.fieldGap` | `var(--mw-density-field-gap)` |
| `density.spacingMultiplier` | `var(--mw-density-spacing-multiplier)` |
| `density.fontSizeSm` | `var(--mw-density-font-size-sm)` |
| `typography.h1.fontSize` | `var(--mw-typography-h1-font-size)` |
| `typography.h1.lineHeight` | `var(--mw-typography-h1-line-height)` |
| `typography.h1.fontWeight` | `var(--mw-typography-h1-font-weight)` |
| `typography.h1.letterSpacing` | `var(--mw-typography-h1-letter-spacing)` |
| `typography.h2.fontSize` | `var(--mw-typography-h2-font-size)` |
| `typography.h2.lineHeight` | `var(--mw-typography-h2-line-height)` |
| `typography.h2.fontWeight` | `var(--mw-typography-h2-font-weight)` |
| `typography.h2.letterSpacing` | `var(--mw-typography-h2-letter-spacing)` |
| `typography.h3.fontSize` | `var(--mw-typography-h3-font-size)` |
| `typography.h3.lineHeight` | `var(--mw-typography-h3-line-height)` |
| `typography.h3.fontWeight` | `var(--mw-typography-h3-font-weight)` |
| `typography.h3.letterSpacing` | `var(--mw-typography-h3-letter-spacing)` |
| `typography.paragraph.sm.fontSize` | `var(--mw-typography-paragraph-sm-font-size)` |
| `typography.paragraph.sm.lineHeight` | `var(--mw-typography-paragraph-sm-line-height)` |
| `typography.paragraph.md.fontSize` | `var(--mw-typography-paragraph-md-font-size)` |
| `typography.paragraph.md.lineHeight` | `var(--mw-typography-paragraph-md-line-height)` |
| `typography.paragraph.lg.fontSize` | `var(--mw-typography-paragraph-lg-font-size)` |
| `typography.paragraph.lg.lineHeight` | `var(--mw-typography-paragraph-lg-line-height)` |
| `breakpoint.mobile` | `640` |
| `breakpoint.tablet` | `900` |
| `breakpoint.desktop` | `1200` |
| `breakpoint.wideDesktop` | `1440` |
| `media.mobileAndAbove` | `@media (min-width: 640px)` |
| `media.tabletAndAbove` | `@media (min-width: 900px)` |
| `media.desktopAndAbove` | `@media (min-width: 1200px)` |
| `media.wideDesktopAndAbove` | `@media (min-width: 1440px)` |
| `media.mobileAndBelow` | `@media (max-width: 639.98px)` |
| `media.tabletAndBelow` | `@media (max-width: 899.98px)` |
| `media.desktopAndBelow` | `@media (max-width: 1199.98px)` |
| `media.wideDesktopAndBelow` | `@media (max-width: 1439.98px)` |
