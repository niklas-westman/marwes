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
  - default component backgrounds
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

These come from the core theme defaults and are then optionally overridden by presets.

### Light defaults
From `packages/core/src/theme/theme-defaults.ts`:

- `text`: `#141414`
- `textMuted`: `#9CA3AF`
- `textSubtle`: `#9CA3AF`
- `textDisabled`: `rgba(20,20,20,0.4)`
- `surface`: `#F9FAFB`
- `surfaceSubtle`: `#F3F4F6`
- `surfaceElevated`: `#FFFFFF`
- `surfaceDisabled`: `#F3F4F6`
- `border`: `rgba(0,0,0,0.4)`
- `borderStrong`: `#141414`
- `borderDisabled`: `rgba(20,20,20,0.16)`
- `focus`: `#2684FF`
- `primary`: `#141414`

### Dark defaults
From `packages/core/src/theme/theme-defaults.ts`:

- `text`: `#F9FAFB`
- `textMuted`: `#9CA3AF`
- `textSubtle`: `#6B7280`
- `textDisabled`: `rgba(249,250,251,0.4)`
- `surface`: `#141414`
- `surfaceSubtle`: `#111827`
- `surfaceElevated`: `#1F2937`
- `surfaceDisabled`: `#3E3E3E`
- `border`: `#d9d9d9`
- `borderStrong`: `#F9FAFB`
- `borderDisabled`: `rgba(255,255,255,0.16)`
- `focus`: `#2684FF`
- `primary`: `#FFFFFF`

## firstEdition override

`firstEdition` changes the meaning of `primary` from generic dark/light to brand accent:

```ts
color: {
  primary: {
    base: "#2F31FC",
    label: "#FFFFFF",
  },
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
