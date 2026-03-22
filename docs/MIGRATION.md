# V1 → V3 Migration Plan

This document maps every V1 component to its V3 counterpart, integrates the theme system rework brief (`rework-theme-data/THEME-REWORK.md`), and lays out the work in clearly agreed phases — one phase at a time, built together.

**V1 reference:** `.figma/archive/v1/nodes.json` (Styleguide page, 2026-02-10)
**V3 reference:** `.figma/nodes.json` (V3 Components page, 2026-03-15)
**Theme rework brief:** `rework-theme-data/THEME-REWORK.md`

---

## Guiding Principles

- **One phase at a time.** We agree the scope of each phase before starting. Nothing moves to the next phase until the current one is reviewed and signed off.
- **Theme first, components second.** The new color engine must be in place before any V3 component work begins — otherwise components will need to be reworked again.
- **No hardcoded hex values in components.** All components consume only CSS custom properties (`var(--mw-*)`). This is a hard rule from the rework brief and from V3 Figma.
- **Dark mode by CSS variables, not duplication.** Light/dark is a theme-level concern resolved in the color engine, not per-component logic.
- **Layer order is fixed.** Every component follows: `core → presets → react → react stories → vue → vue stories`. Never skip ahead. See `docs/ENGINEERING.md`.
- **TDD workflow.** Every implementation ticket writes the test before the code. Work is planned through Research → Spec → Tickets before implementation begins. See `docs/ENGINEERING.md`.

---

## Component Status Overview

| Component | V1 Node | V3 Node | Status |
|-----------|---------|---------|--------|
| Button | `1:1072` | `1371:11172` | Updated |
| Divider | `1:932` | `1364:5724` | Updated |
| Input / Text Field | `1:969` | `1364:11372` | Updated |
| Dropdown | `1:1009` | merged → `1364:11817` | Merged into InputTypes |
| Select | `4:806` | merged → `1364:11817` | Merged into InputTypes |
| Checkbox | `82:1612` | `1369:4700` | Updated (expanded) |
| Focus State | `120:927` | — | Dissolved into components |
| Step Navigator | `1:1221` | — | Not yet in V3 |
| Typography | `1:248` | `1368:5656` | Updated |
| Grids | `1:216` | — | Not yet in V3 |
| Assets | `1:231` | — | Not yet in V3 |
| Purpose Buttons | — | `1371:8933` | **New** |
| Tab | — | `1364:11703` | **New** |
| Badge | — | `1364:11603` | **New** |
| Card | — | `1364:11556` | **New** |
| Switch | — | `1364:11442` | **New** |
| Accordion | — | `1364:11755` | **New** |
| Radio Button | — | `1368:6734` | **New** |
| Toast | — | `1365:12526` | **New** |

---

## Pre-Phase 0 — Preset CSS Audit *(gate before Phase 0 can begin)*

Before writing any Phase 0 code, the following must be complete and merged to `main`:

1. **CSS variable rename audit.** All preset CSS files (`button.css`, `checkbox.css`, `input.css`, `divider.css`, `typography.css`, `icon.css`, `styles.css`) are audited and the full rename map is confirmed in `docs/SPEC.md` D11.

2. **Visual regression baseline.** Chromatic (or Percy) is wired to CI and a snapshot baseline is captured for all existing Button, Divider, Checkbox, and Input Storybook stories. See `docs/SPEC.md` D10.

3. **`docs/SPEC.md` signed off.** All 11 architectural decisions are reviewed and agreed before implementation starts.

The rename is performed atomically in the Phase 0 PR that introduces `themeToCSSVars()`. Old and new variable names must not coexist in any commit.

---

## Phase 0 — Theme Engine Rework *(must complete before any component work)*

### What it is

The current `Theme` type in `packages/core/src/theme/theme-types.ts` stores flat hex strings per color role (e.g. `primary: string`, `onPrimary: string`). Developers must manually specify hover, pressed, disabled, and label colors — and components hardcode many of these.

The rework replaces this with an **auto-derivation engine**: a developer passes one hex string per role and the library derives all interaction states automatically.

### New Type Contract

```ts
// What the developer writes (in ThemeInput / ThemeOverrides)
type ColorInput = string | {
  base: string
  hover?:         string   // override only if needed
  pressed?:       string
  disabled?:      string
  label?:         string
  labelDisabled?: string
}

// What the engine resolves to internally (and outputs as CSS vars)
type ColorRole = {
  base:          string   // → --mw-{role}-base
  hover:         string   // → --mw-{role}-hover      (base lightness -8%/-10%)
  pressed:       string   // → --mw-{role}-pressed     (base lightness -15%/-20%)
  disabled:      string   // → --mw-{role}-disabled    (base at 35% alpha)
  label:         string   // → --mw-{role}-label       (auto: dark or white by luminance)
  labelDisabled: string   // → --mw-{role}-label-disabled
}
```

### Derivation Logic (`resolveColorRole`)

```
isLight = perceivedLightness(base) > 0.6
  where perceivedLightness = (0.299×R + 0.587×G + 0.114×B) / 255

hover         = adjustLightness(base, isLight ? -0.08 : -0.10)
pressed       = adjustLightness(base, isLight ? -0.15 : -0.20)
disabled      = setAlpha(base, 0.35)
label         = isLight ? "#141414" : "#FFFFFF"
labelDisabled = isLight ? "rgba(20,20,20,0.5)" : "rgba(255,255,255,0.5)"
```

Light colors get dark labels and smaller shifts. Dark colors get white labels and larger shifts.

### Secondary (outline) — Derived From Primary

```
--mw-secondary-base:             transparent
--mw-secondary-hover:            setAlpha(primary.base, 0.08)
--mw-secondary-pressed:          setAlpha(primary.base, 0.15)
--mw-secondary-border:           primary.base
--mw-secondary-border-disabled:  primary.disabled
--mw-secondary-label:            primary.base
--mw-secondary-label-disabled:   setAlpha(primary.base, 0.5)
```

One primary hex → both filled and outline buttons fully styled.

### CSS Variable Bridge

```ts
themeToCSSVars(themeObject, prefix = "--mw"):
  // nested object → recursive kebab path
  // { color: { primary: { base: "#5B8CFF" } } }
  // → "--mw-color-primary-base: #5B8CFF"
```

Every token in the resolved theme becomes a CSS custom property automatically. No manual sync.

### Mapping: V3 Figma Tokens → New CSS Variables

The V3 Figma design uses component-scoped tokens (e.g. `--primary/surface`). These map to the new `--mw-*` variables as follows:

| V3 Figma Token | New CSS Variable | Notes |
|----------------|-----------------|-------|
| `--primary/surface` | `--mw-color-primary-base` | Button fill |
| `--primary/label` | `--mw-color-primary-label` | Button text on filled |
| `--secondary/label` | `--mw-color-secondary-label` | Outline button text |
| `--secondary/outline` | `--mw-color-secondary-border` | Outline button border |
| `--action/primary/default` | `--mw-color-primary-base` | Purpose button fill |
| `--action/primary/label` | `--mw-color-primary-label` | Purpose button text |
| `--action/destructive/default` | `--mw-color-danger-base` | Delete/destructive |
| `--action/destructive/label` | `--mw-color-danger-label` | |
| `--action/success/default` | `--mw-color-success-base` | Confirm/verify |
| `--action/success/label` | `--mw-color-success-label` | |
| `--tab/indicator` | `--mw-color-primary-base` | Active tab underline |
| `--checkbox/surface-checked` | `--mw-color-primary-base` | Checked fill |
| `--badge/border` (brand) | `--mw-color-primary-base` | Brand badge |
| `--toast/outline/border` (info) | `--mw-color-primary-base` | Info toast border |

Semantic roles (success, warning, danger, info) map to:
`--mw-color-{success|warning|danger|info}-{base|hover|pressed|disabled|label|label-disabled}`

### Current `theme-types.ts` — What Changes

| Current field | New equivalent | Change |
|---------------|---------------|--------|
| `color.primary: string` | `color.primary: ColorInput` | Now accepts hex or object |
| `color.onPrimary: string` | auto-derived as `ColorRole.label` | Remove from input API |
| `color.secondary: string` | auto-derived from `primary.base` | Remove from input API |
| `color.onSecondary: string` | auto-derived | Remove from input API |
| `color.danger: string` | `color.danger: ColorInput` | Accepts hex or object |
| `color.onDanger: string` | auto-derived | Remove from input API |
| `color.success`, `warning` | `ColorInput` | Same pattern |
| `color.onSuccess`, `onWarning` | auto-derived | Remove |
| `color.focus: string` | stays as simple string | No derivation needed |

### Files for Phase 0

```
packages/core/src/theme/
├── color-utils.ts       NEW  parseHex, rgbToHSL, hslToRGB, adjustLightness,
│                             setAlpha, perceivedLightness
├── color-resolve.ts     NEW  resolveColorRole(), normalizeColorInput()
├── theme-css.ts         NEW  themeToCSSVars(), applyTheme()
├── theme-types.ts       MOD  add ColorInput, ColorRole; update Theme/ThemeOverrides
└── theme-merge.ts       MOD  call normalizeColorInput before deep merge

packages/react/src/
└── MarwesProvider.tsx   MOD  call resolveThemeInput → applyTheme on mount/update

packages/vue/src/
└── MarwesProvider.vue   MOD  same as React provider
```

### Architectural Decisions for Phase 0

All resolved in `docs/SPEC.md`:

- **Color math:** OKLCH color space for `adjustLightness` (D1) — perceptually uniform, not HSL
- **Label selection:** WCAG relative luminance (D2) — mathematically correct, not a flat threshold
- **`info` role:** alias for `primary`, not a configurable input (D3)
- **`secondary` role:** derived from `primary.base`, not a `ColorInput` in Phase 0 (D4)
- **Dark mode:** `.mw-theme--dark` CSS class stays for Phases 0–4 (D5)
- **CSS var scope:** `[data-marwes-theme]` attribute selector, not `:root` (D6)

### Acceptance Criteria for Phase 0

1. `primary: "#5B8CFF"` → fully styled button with correct hover, pressed, disabled, label — no extra config.
2. `primary: { base: "#5B8CFF", hover: "#4A7AE0" }` → uses explicit hover, derives the rest.
3. A light color (`"#FFE066"`) → dark labels. A dark color (`"#1A1A2E"`) → white labels.
4. `#FF8C00` (saturated orange) → correct label selection via WCAG contrast ratio.
5. All color math is pure functions — unit-testable with no side effects.
6. No hardcoded hex values in any component. Only `var(--mw-*)`.
7. Existing presets still work after the variable rename (visual regression: zero unintentional diff vs. Chromatic baseline).
8. Two `<MarwesProvider>` elements on the same page with different `primary` colors render visually distinct components in each subtree.

---

## Phase 1 — Foundation Components (updated from V1)

*Starts only after Phase 0 is reviewed and signed off.*

These already exist in the codebase. The work here is aligning them to V3 design and the new token system.

### 1a — Button

**V1:** `1:1072` → **V3:** `1371:11172`

Changes:
- Add **Focus** as a first-class variant (currently missing)
- Replace all hardcoded colors with `var(--mw-color-primary-*)` from the new engine
- Secondary outline now derived automatically — no separate secondary color in component CSS
- Verify all 3 variants × 5 states render correctly from CSS vars alone

Files: `packages/react/src/components/button/`, `packages/vue/src/components/button/`, storybook stories

### 1b — Divider

**V1:** `1:932` → **V3:** `1364:5724`

Changes:
- Update node reference only — structure is identical
- Confirm dark mode renders via CSS variables (not hardcoded)

Files: `packages/react/src/components/divider/`, `packages/vue/src/components/divider/`

### 1c — Input Fields

**V1:** `1:969` + `1:1009` + `4:806` → **V3:** `1364:11372` + `1364:11817`

Changes:
- Add **Active** state (cursor in field, distinct from Focus)
- Unify TextField, Dropdown, Select under a shared Input component system
- 7 input type variants: Text, Textarea, Search, Password, Date of Birth, Phone Number, Zip Code
- All states consume `var(--mw-*)` only

Files: `packages/react/src/components/`, `packages/vue/src/components/`, storybook

### 1d — Checkbox

**V1:** `82:1612` → **V3:** `1369:4700`

Changes:
- Add **Indeterminate** selection state
- Add **Error** interaction state
- Add **Pressed** interaction state
- Build **CheckboxGroup** (`1369:4673`) as a composed component
- Update CSS tokens to `--mw-*` pattern

Files: `packages/react/src/components/`, `packages/vue/src/components/`

### 1e — Typography

**V1:** `1:248` → **V3:** `1368:5656`

Changes:
- Add Creato Display as a second display typeface alongside Instrument Sans
- Font family tokens: `--font/family/title`, `--font/family/body`, `--font/family/caption` → map to `--mw-font-family-*`

Files: `packages/core/src/theme/theme-types.ts`, global font setup

---

## Phase 2 — New Simple Components

*Starts only after Phase 1 is reviewed and signed off.*

These are net-new. Each needs: recipe in `packages/core/`, React component, Vue component, Storybook stories.

### 2a — Badge `1364:11603`

6 semantic variants. Stateless display component.

Tokens: `--badge/surface` → `--mw-color-{neutral|brand|info|success|warning|danger}-base` (mapped per variant)

### 2b — Tab `1364:11703`

5 interaction states. Indicator = 2px bottom border.

Tokens: `--tab/indicator` → `--mw-color-primary-base`

New files: `packages/react/src/components/tab/`, `packages/vue/src/components/tab/`

### 2c — Card `1364:11556`

5 interaction states. 8px radius, 24px padding.

Tokens: `--card/surface`, `--card/border`, `--card/title`, `--card/body` → map to neutral/surface tokens from new theme

---

## Phase 3 — New Interactive Components

*Starts only after Phase 2 is reviewed and signed off.*

### 3a — Switch `1364:11442`

5 states × On/Off × 3 sizes. ARIA role: `switch`.

Sizes: Compact (24×16), Wide (30×16), Rich (30×20).

### 3b — Accordion `1364:11755`

5 states × Expanded/Collapsed. Keyboard: Enter/Space.

Sub-components: Header (title + chevron arrow), Content.

### 3c — Radio Button `1368:6734`

6 states × Selected/Unselected. LTR + RTL label positions. RadioGroup wrapper.

---

## Phase 4 — New Complex Components

*Starts only after Phase 3 is reviewed and signed off.*

### 4a — Toast `1365:12526`

3 display variants × 4 semantic types = 12 combinations.

Needs: component + toast manager (positioning, auto-dismiss, queue).

Tokens: `--toast/{subtle|outline|rich}/{surface|border|text|action}` → semantic color tokens from new engine

### 4b — Purpose Buttons `1371:8933`

25 semantic intents → button variant + icon. Thin config layer on top of the V3 Button.

New tokens: `--action/{primary|secondary|destructive|success}/{default|label}` → map to `--mw-color-*`

New file: `packages/core/src/recipes/purpose-button.ts` (intent → props mapping)

---

## Phase 5 — Storybook, Contracts & Cleanup

*Starts only after Phase 4 is reviewed and signed off.*

- Update all storybook stories to V3 states and variants
- Add missing integration tests in `tests/contracts/`
- Deprecate standalone Dropdown / Select components (merged into InputTypes)
- Remove `onPrimary`, `onSecondary`, `onDanger`, `onSuccess`, `onWarning` from `Theme` type (they're now auto-derived)
- Archive V1 node reference or mark as deprecated in `NODE_REFERENCE.md`

---

## Token Name Summary

All V3 CSS variables resolve to this `--mw-*` pattern from the new engine:

```
Color roles (auto-derived states):
  --mw-color-primary-base / -hover / -pressed / -disabled / -label / -label-disabled
  --mw-color-secondary-base / -hover / -pressed / -border / -label / (all derived from primary)
  --mw-color-danger-base / -hover / -pressed / -disabled / -label / -label-disabled
  --mw-color-success-base / ...
  --mw-color-warning-base / ...
  --mw-color-info-base / ...

Surface & text (not derived, configured directly):
  --mw-color-background
  --mw-color-surface
  --mw-color-surface-inverted
  --mw-color-text
  --mw-color-text-muted
  --mw-color-text-inverted
  --mw-color-border
  --mw-color-border-subtle
  --mw-color-focus

UI:
  --mw-ui-radius
  --mw-ui-focus-ring-width
  --mw-ui-border-width

Typography:
  --mw-font-family-title
  --mw-font-family-body
  --mw-font-family-caption
  --mw-font-family-mono
```

---

## Not Yet In V3

Keep V1 implementations as-is until V3 designs appear:

| Component | V1 Node | Note |
|-----------|---------|------|
| Step Navigator | `1:1221` | Not on V3 page |
| Grids | `1:216` | Not on V3 page |
| Assets | `1:231` | Not on V3 page |
