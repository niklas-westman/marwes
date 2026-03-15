# THEME-REWORK BRIEF

## For: Claude Opus 4.6 via Claude Code CLI
## Repo: github.com/niklas-westman/marwes

---

## Objective

Rework the theme system so a developer only passes **one hex string per color role** (e.g. `primary: "#5B8CFF"`) and the library automatically derives every interaction state (hover, pressed, disabled, label, labelDisabled) from that single value.

The developer should never need to define hover colors, disabled opacities, or label contrast — but can override any individual value if their brand guide demands it.

---

## Architecture — How It Flows

```
USER API                          INTERNAL ENGINE                      CSS OUTPUT
─────────────────────────────────────────────────────────────────────────────────

                                  ┌─────────────────────┐
  theme: {                        │  resolveColorRole()  │
    color: {                      │                      │
      primary: "#5B8CFF"  ──────▶│  1. Parse hex        │
    }                             │  2. Detect light/dark│
  }                               │  3. Derive states:   │
                                  │     hover   (-10% L) │
        OR (power user):          │     pressed (-20% L) │
                                  │     disabled (35% α) │
  theme: {                        │     label   (auto)   │
    color: {                      │     labelDisabled     │
      primary: {                  │  4. Apply overrides   │
        base: "#5B8CFF",          │                      │
        hover: "#4A7AE0" ──────▶ │  (override replaces  │
      }                           │   only that key)     │
    }                             └──────────┬──────────┘
  }                                          │
                                             ▼
                                  ┌─────────────────────┐
                                  │  applyTheme()        │
                                  │                      │
                                  │  Flattens resolved   │
                                  │  role into CSS vars: │
                                  │                      │      ┌──────────────────────┐
                                  │  --mw-primary-base   │─────▶│  .mw-button--primary │
                                  │  --mw-primary-hover  │      │  {                   │
                                  │  --mw-primary-pressed│      │    background:        │
                                  │  --mw-primary-disabled      │      var(--mw-primary │
                                  │  --mw-primary-label  │      │          -base);      │
                                  │  --mw-primary-label- │      │  }                   │
                                  │      disabled        │      │  :hover {            │
                                  └─────────────────────┘      │    background:        │
                                                                │      var(--mw-primary │
                                                                │          -hover);     │
                                                                │  }                   │
                                                                └──────────────────────┘
                                                                Components ONLY read
                                                                CSS variables. Never
                                                                raw hex values.
```

---

## The Type Contract

```
ColorInput = string | { base: string, hover?: string, pressed?: string, ... }

ThemeInput = {
  color?: {
    primary?:   ColorInput      ◄── user passes this
    secondary?: ColorInput
    danger?:    ColorInput
  }
  ui?:         { radius?, borderWidth?, focusRingWidth? }
  typography?: { fontFamily?, sizeBase?, weightNormal?, weightMedium? }
  motion?:     { durationFast?, durationNormal?, easing? }
}

ColorRole = {                   ◄── library resolves to this
  base:          string
  hover:         string
  pressed:       string
  disabled:      string
  label:         string
  labelDisabled: string
}
```

**Key rule:** `ColorInput` is what the user writes. `ColorRole` is what exists internally after resolution. Components and CSS only ever see `ColorRole` values via CSS variables.

---

## Core Function: resolveColorRole

This is the heart of the rework. It lives in `packages/core/src/theme/`.

```
INPUT:  "#5B8CFF"
OUTPUT: {
  base:          "#5B8CFF"
  hover:         adjustLightness(base, isLight ? -0.08 : -0.10)
  pressed:       adjustLightness(base, isLight ? -0.15 : -0.20)
  disabled:      setAlpha(base, 0.35)
  label:         isLight ? "#141414" : "#FFFFFF"
  labelDisabled: isLight ? "rgba(20,20,20,0.5)" : "rgba(255,255,255,0.5)"
}

WHERE:
  isLight = perceivedLightness(base) > 0.6
  perceivedLightness = (0.299*R + 0.587*G + 0.114*B) / 255
  adjustLightness = hex → HSL → shift L → clamp → hex
  setAlpha = hex → rgba(r,g,b,alpha)
```

The lightness threshold (0.6) determines whether the color is perceived as "light" by the human eye. Light base colors get **dark labels** and **smaller** lightness shifts. Dark base colors get **white labels** and **larger** shifts.

---

## Normalization Step

Before merging with the preset, normalize user input:

```
normalizeColorInput(input):
  if input is string   → resolveColorRole(input)
  if input is object   → resolveColorRole(input.base, input)
                          where input fields override derived defaults
```

This runs inside the provider/theme resolution layer, before CSS variable injection.

---

## Secondary Outline Variant — Derived From Primary

The secondary (outline) button is fully derived from the primary base color:

```
--mw-secondary-base:            transparent
--mw-secondary-hover:           setAlpha(primary.base, 0.08)
--mw-secondary-pressed:         setAlpha(primary.base, 0.15)
--mw-secondary-border:          primary.base
--mw-secondary-border-disabled: primary.disabled
--mw-secondary-label:           primary.base
--mw-secondary-label-disabled:  setAlpha(primary.base, 0.5)
```

One primary hex → both filled AND outline buttons are styled.

---

## CSS Variable Bridge

The resolved theme is injected as CSS custom properties on the provider root element. Components consume ONLY these variables — never theme objects directly.

Pattern for auto-generating variables from the resolved theme:

```
themeToCSSVars(themeObject, prefix = "--mw"):
  for each [key, value] in object:
    if value is object → recurse with prefix + "-" + kebab(key)
    if value is number → set as "{value}px"
    else               → set as string
```

This means adding a new token to the theme type automatically creates a CSS variable. No manual sync needed.

---

## Files To Create / Modify

```
packages/core/src/theme/
├── color-utils.ts        NEW  — parseHex, rgbToHSL, hslToRGB, adjustLightness,
│                                setAlpha, perceivedLightness
├── color-resolve.ts      NEW  — resolveColorRole(), normalizeColorInput()
├── theme-types.ts        MOD  — add ColorInput, ColorRole, ThemeInput types
├── theme-merge.ts        MOD  — integrate normalizeColorInput before deep merge
└── theme-css.ts          NEW  — themeToCSSVars(), applyTheme()

packages/react/src/
└── MarwesProvider.tsx     MOD  — call resolveThemeInput → applyTheme on mount/update

packages/presets/src/
└── *.ts                   MOD  — presets can now use resolveColorRole internally too
```

---

## Acceptance Criteria

1. `primary: "#5B8CFF"` as a string produces a fully styled button with correct hover, pressed, disabled, and label colors — no additional config.
2. `primary: { base: "#5B8CFF", hover: "#4A7AE0" }` uses the explicit hover but still auto-derives pressed, disabled, label.
3. Swapping a preset re-derives all colors. Components are untouched.
4. A very light color (e.g. `"#FFE066"`) produces dark labels. A very dark color (e.g. `"#1A1A2E"`) produces white labels.
5. All color math is pure functions with no side effects — fully unit-testable.
6. No hardcoded hex values exist in any component CSS. Only `var(--mw-*)`.

---

## Reference Implementation

A complete working HTML demo with the color engine, live color picker, derived swatches, and styled buttons is attached alongside this brief (marwes-button-demo.html). Use it as the reference for the derivation math and CSS variable naming.
