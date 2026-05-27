# Preset Color Guide

This guide explains how to choose the correct `--mw-color-*` token when writing preset CSS.

## Core rule

Use semantic roles, not raw color names.

- `primary` means **brand/accent**
- `text` means **neutral foreground emphasis**
- `border` means **neutral boundary**
- `surface` means **component background**
- `focus` means **focus ring/accessibility outline**

If you mean “black” in light mode, you usually want:

- `var(--mw-color-text)`

Not:

- `var(--mw-color-primary-base)`

## Why this matters

In `firstEdition`, `primary` is intentionally overridden to the brand blue:

- `packages/presets/src/firstEdition/index.ts`
- `primary.base = #2F31FC`

So `--mw-color-primary-base` is **not** the generic neutral dark color in this preset.
It is the brand accent color.

## Use these tokens by intent

### Neutral content and controls
- `--mw-color-text`
  - primary text
  - emphasized neutral borders/icons
  - open-state neutral emphasis when the design calls for black/dark, not brand
- `--mw-color-text-muted`
  - placeholders
  - helper icons
  - secondary readable text
- `--mw-color-text-subtle`
  - tertiary/decorative neutral text
- `--mw-color-text-disabled`
  - disabled text and labels
- `--mw-color-border`
  - default control borders
  - dividers
- `--mw-color-border-subtle`
  - softer separators and pressed surfaces
- `--mw-color-border-strong`
  - stronger neutral borders and active/open emphasis
- `--mw-color-border-disabled`
  - disabled control boundaries
- `--mw-color-surface`
  - secondary component backgrounds
- `--mw-color-surface-primary`
  - primary component backgrounds
- `--mw-color-surface-subtle`
  - soft neutral fills and hover surfaces
- `--mw-color-surface-elevated`
  - floating surfaces such as dropdowns and popovers
- `--mw-color-surface-disabled`
  - disabled control backgrounds
- `--mw-color-surface-inverted`
  - inverted surfaces

### Brand / semantic emphasis
- `--mw-color-primary-base`
  - brand-accent borders, fills, icons, emphasis
- `--mw-color-primary-label`
  - text/icon color on a primary fill
- `--mw-color-secondary-*`
  - outline/secondary button treatment derived from primary
- `--mw-color-danger-base`
  - destructive/error emphasis
- `--mw-color-success-base`
  - success emphasis
- `--mw-color-warning-base`
  - warning emphasis
- `--mw-color-focus`
  - focus ring only

## Shared preset variables first

When writing CSS in `packages/presets`, prefer existing global semantic variables before creating
component-local ones.

Rules:
- reach for shared tokens like `--mw-color-*`, `--mw-font-*`, `--mw-ui-*`, and shared spacing vars first
- only introduce component-local variables when a component truly needs a private alias or composed value
- if the same meaning appears across multiple components, promote that meaning to a shared preset variable instead of duplicating local vars
- keep component CSS thin: local CSS should mostly consume shared variables, not redefine the same semantics over and over

This keeps components aligned with each other and makes the core/preset CSS structure simpler to maintain.

## Practical examples

### Good: neutral open dropdown state
```css
.mw-select-field__control--open .mw-select-field__trigger {
  border-color: var(--mw-color-text);
}

.mw-select-field__control--open .mw-select-field__trigger-icon {
  color: var(--mw-color-text);
}
```

### Good: brand-accent selected/check state
```css
.mw-select-field__option-check {
  color: var(--mw-color-primary-base);
}
```

### Good: default input styling
```css
.mw-input {
  border: 1px solid var(--mw-color-border);
  background: var(--mw-color-surface);
  color: var(--mw-color-text);
}

.mw-input::placeholder {
  color: var(--mw-color-text-muted);
}
```

### Avoid: using primary as generic black
```css
/* Avoid when the design means neutral black/dark emphasis */
border-color: var(--mw-color-primary-base);
```

## Default color values

These come from `docs/marwes-colors.json` through the core theme defaults.

### Light defaults
From `packages/core/src/theme/theme-defaults.ts`:

- `text`: `#141414`
- `textMuted`: `#595959`
- `textSubtle`: `#595959`
- `textDisabled`: `#737373`
- `surface`: `#F8F8F8`
- `surfacePrimary`: `#FFFFFF`
- `surfaceSubtle`: `#F5F5F5`
- `surfaceElevated`: `#FFFFFF`
- `surfaceDisabled`: `#F5F5F5`
- `border`: `#D8D8D8`
- `borderStrong`: `#A3A3A3`
- `borderDisabled`: `#D8D8D8`
- `focus`: `#2F31FC`
- `primary`: `#2F31FC`

### Dark defaults
From `packages/core/src/theme/theme-defaults.ts`:

- `text`: `#F9FAFB`
- `textMuted`: `#A3A3A3`
- `textSubtle`: `#A3A3A3`
- `textDisabled`: `#595959`
- `surface`: `#1A1A1A`
- `surfacePrimary`: `#0F0F0F`
- `surfaceSubtle`: `#050505`
- `surfaceElevated`: `#2B2B2B`
- `surfaceDisabled`: `#1A1A1A`
- `border`: `#474747`
- `borderStrong`: `#A3A3A3`
- `borderDisabled`: `#474747`
- `focus`: `#5859FC`
- `primary`: `#5859FC`

## firstEdition override

`firstEdition` uses the same source-token baseline as the core defaults:

```ts
color: {
  primary: {
    base: "#2F31FC",
    hover: "#2527CA",
    pressed: "#1B1D97",
    label: "#FFFFFF",
  },
  success: "#006633",
  warning: "#B45309",
  danger: "#D90429",
}
```

That means:

- use `text` for neutral black/white emphasis
- use `primary` for brand blue emphasis

## When to add a new token

Do **not** add a dedicated `black` token just to get a neutral dark color in light mode.

Only add a new token if you truly need:
- a new semantic role that is not covered by `text`, `border`, `surface`, or existing semantic states
- a reusable palette step with a distinct design meaning across multiple components

If the need is simply “this should look black here”, prefer `--mw-color-text`.
