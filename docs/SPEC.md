# Marwes — Architecture Decisions & Acceptance Criteria

Per `docs/ENGINEERING.md`: all non-trivial work maps to explicit decisions and acceptance criteria here before implementation begins. Every decision below was resolved during the V1 → V3 migration architectural review (2026-03-15).

---

## Pre-Phase 0 — Preset CSS Audit

### D11 — CSS Variable Rename Map

**Decision:** Before any Phase 0 code is written, all preset CSS files are audited and renamed atomically in the same PR that introduces `themeToCSSVars()`. Old and new variable names must never coexist.

**Rename map:**

| Current variable | New variable |
|-----------------|--------------|
| `--mw-primary` | `--mw-color-primary-base` |
| `--mw-on-primary` | `--mw-color-primary-label` |
| `--mw-secondary` | `--mw-color-secondary-base` |
| `--mw-on-secondary` | `--mw-color-secondary-label` |
| `--mw-danger` | `--mw-color-danger-base` |
| `--mw-on-danger` | `--mw-color-danger-label` |
| `--mw-focus` | `--mw-color-focus` |
| `--mw-radius` | `--mw-ui-radius` |
| `--mw-border-width` | `--mw-ui-border-width` |

**Affected files:**
- `packages/presets/src/firstEdition/button.css`
- `packages/presets/src/firstEdition/checkbox.css`
- `packages/presets/src/firstEdition/input.css`
- `packages/presets/src/firstEdition/divider.css`
- `packages/presets/src/firstEdition/typography.css`
- `packages/presets/src/firstEdition/icon.css`
- `packages/presets/src/firstEdition/styles.css`

**Rule:** Document as a breaking change in `CHANGELOG.md`. No backwards-compatibility shims.

---

## Phase 0 — Theme Engine Rework

### D1 — Color Space: OKLCH (not HSL)

**Decision:** `adjustLightness()` operates in OKLCH color space.

**Rejected:** HSL

**Why OKLCH:** HSL shifts at equal percentages produce visually unequal results across hues — a 10% shift on a blue feels different than the same shift on a yellow. OKLCH is perceptually uniform: equal `L` steps produce equal perceived changes regardless of hue or chroma. This is essential for a design system where hover/pressed states must feel consistent across any brand color.

**Implementation path:** `hex → linear-sRGB → XYZ-D65 → Oklab → OKLCH → shift L → clamp(0, 1) → Oklab → XYZ-D65 → linear-sRGB → hex`. The full pipeline is ~30 lines of math with no runtime dependency.

**Acceptance criteria:**
- Shifting `#FF0000` (red) and `#0000FF` (blue) by the same `ΔL` produces visually equal perceived steps
- `adjustLightness` is a pure function with no side effects

---

### D2 — Label Contrast: WCAG Relative Luminance (not threshold)

**Decision:** `pickContrastColor(base)` uses WCAG relative luminance to select between `#141414` and `#FFFFFF`.

**Rejected:** `perceivedLightness(base) > 0.6` flat threshold

**Why WCAG:** The flat threshold fails for saturated mid-range colors (e.g. `#FF8C00` reads as "light" but produces insufficient contrast with a dark label). WCAG relative luminance with proper gamma correction is the W3C standard for accessibility and is mathematically correct for human vision.

**Formula:**
```
relativeLuminance(hex):
  [r, g, b] = parseHex(hex).map(channel => {
    const sRGB = channel / 255
    return sRGB <= 0.04045
      ? sRGB / 12.92
      : ((sRGB + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b

contrastRatio(L1, L2):
  const lighter = Math.max(L1, L2)
  const darker  = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)

pickContrastColor(base):
  const lum      = relativeLuminance(base)
  const darkLabel  = relativeLuminance("#141414")  // ≈ 0.0059
  const lightLabel = relativeLuminance("#FFFFFF")  // 1.0
  return contrastRatio(lum, darkLabel) >= contrastRatio(lum, lightLabel)
    ? "#141414"
    : "#FFFFFF"
```

**AA exemption:** `labelDisabled` at 50% alpha is exempt from WCAG AA (disabled controls are not required to meet contrast ratios per WCAG 1.4.3). Use the same hue as `label` at `opacity: 0.5`.

**Acceptance criteria:**
- `#FFE066` (light yellow) → dark label (`#141414`) with contrast ≥ 4.5:1
- `#1A1A2E` (dark navy) → white label (`#FFFFFF`) with contrast ≥ 4.5:1
- `#FF8C00` (saturated orange) → correct label (test manually — threshold approach gets this wrong)

---

### D3 — `info` Color Role: Alias for Primary

**Decision:** `info` is not a configurable `ColorInput`. Its CSS variables (`--mw-color-info-*`) are emitted but mirror the resolved `primary` role.

**Why:** V3 Figma maps `--toast/outline/border (info)` → `--mw-color-primary-base`. A separately-configurable info color creates a brand fork risk.

**Escape hatch:** Consumers who need a distinct info color can override `--mw-color-info-*` directly in their own CSS after the provider scope.

**API:** `ThemeInput.color` does not expose an `info` property. `resolveThemeInput()` copies the resolved primary role into the info slot after derivation.

---

### D4 — `secondary` Color Role: Derived-Only by Default

**Decision:** `secondary` is fully derived from `primary.base`. It is NOT exposed as a `ColorInput` in the Phase 0 API.

**Derivation:**
```
--mw-color-secondary-base:             transparent
--mw-color-secondary-hover:            setAlpha(primary.base, 0.08)
--mw-color-secondary-pressed:          setAlpha(primary.base, 0.15)
--mw-color-secondary-border:           primary.base
--mw-color-secondary-border-disabled:  primary.disabled
--mw-color-secondary-label:            primary.base
--mw-color-secondary-label-disabled:   setAlpha(primary.base, 0.5)
```

**Why:** V3 Figma secondary = outline treatment of primary. One primary hex → both filled and outline buttons styled. Independent secondary configuration is deferred to a future minor release if brand demand justifies it.

**Future path:** If needed, add `secondary?: ColorInput` to `ThemeInput`. The resolver checks: if provided, treat as an independent `ColorRole`; if absent, derive from primary as above.

---

### D5 — Dark Mode Architecture: `.mw-theme--dark` Class

**Decision:** Dark mode uses the `.mw-theme--dark` CSS class on the provider root element. This is the existing approach in all preset CSS files and stays for Phases 0–4.

**Provider responsibility:** `MarwesProvider` sets/removes `.mw-theme--dark` based on its `colorScheme` prop.

**Example preset pattern** (already in `button.css`):
```css
.mw-button--primary { background: var(--mw-color-primary-base); }
.mw-theme--dark .mw-button--primary { /* dark vars override */ }
```

**Why not `prefers-color-scheme`:** Refactoring all preset CSS to `@media (prefers-color-scheme: dark)` is a large scope change with no user-visible benefit at this stage. The class approach gives consumer apps explicit control.

**Path to adaptive tokens (post-Phase 4):**
```css
[data-marwes-theme] { --mw-color-primary-base: #5B8CFF; }
[data-marwes-theme].mw-theme--dark { --mw-color-primary-base: #4A7AE0; }
@media (prefers-color-scheme: dark) {
  [data-marwes-theme]:not(.mw-theme--light) { --mw-color-primary-base: #4A7AE0; }
}
```

---

### D6 — CSS Variable Scope: `[data-marwes-theme]` Attribute

**Decision:** CSS variables are injected on the element that has `data-marwes-theme="true"`, not on `:root` or a class.

**Why:** Attribute selectors support nested providers (two subtrees with different themes on the same page). Class selectors collide. `:root` prevents per-subtree theming.

**Implementation:**
```ts
// applyTheme(element, resolvedTheme)
element.setAttribute('data-marwes-theme', 'true')
const vars = themeToCSSVars(resolvedTheme)
for (const [property, value] of Object.entries(vars)) {
  element.style.setProperty(property, value)
}
```

**Preset CSS** must scope component styles within `[data-marwes-theme]` or its descendants. The `.mw-theme--dark` class lives on the same element.

**Acceptance criteria:**
- Two `<MarwesProvider>` elements on the same page with different `primary` colors must produce visually distinct components within each subtree
- No CSS variable leaks between provider subtrees

---

### D10 — Visual Regression Gate Before Phase 1

**Decision:** A visual regression baseline must be committed to `main` before Phase 1 begins.

**Baseline scope:** All existing Storybook stories for Button, Divider, Checkbox, Input.

**Tooling:** Chromatic integration in `.github/workflows/_ci.yml`. Regressions block merge.

**Why:** Phase 1 renames CSS variables (`--mw-primary` → `--mw-color-primary-base`). This is a silent visual change — unit tests will not catch missing variable names in CSS. Snapshots are the safety net.

**Gate:** Phase 1 PR description must include a link to the Chromatic baseline and confirm zero unintentional regressions.

---

## Shared Types

### D7 — `InteractionState` Shared Union Type

**Decision:** Define a canonical `InteractionState` type in `packages/core/src/types/index.ts`:

```ts
export type InteractionState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'disabled'
  | 'focus'
  | 'error'
```

All component `*.types.ts` files use this type. Components that don't support `error` use `Exclude<InteractionState, 'error'>`.

**Why:** V3 Figma applies identical 5–6 state rows across all components. A shared type enforces the contract and prevents per-component drift. It also enables cross-component state propagation (e.g., a form field propagating error state to a child checkbox).

---

## Engineering Conventions

### D9 — RTL: CSS Logical Properties from Phase 0 Onwards

**Decision:** All component CSS written or modified from Phase 0 onwards uses CSS logical properties.

**Mapping:**
| Physical property | Logical equivalent |
|-------------------|-------------------|
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |
| `left` / `right` (positioned) | `inset-inline-start` / `inset-inline-end` |
| `text-align: left` | `text-align: start` |

**Why:** V3 Figma Radio Button explicitly shows RTL layout (`1368:6854`). Logical properties handle direction automatically via `dir="rtl"` on the document or subtree — no JS direction management needed.

**Scope:** Existing V1 preset CSS is exempt until it is touched during a migration phase.

---

## Phase 4 Decisions — Purpose Buttons

### D8 — Purpose Button Intent Registry: Typed + Extensible

**Decision:** The intent registry is a typed record with a named extension API.

**Core type** (in `packages/core/src/recipes/purpose-button.ts`):
```ts
export type BuiltInPurposeIntent =
  | 'submit' | 'save' | 'cancel' | 'confirm' | 'delete' | 'verify'
  | 'create' | 'edit' | 'upload' | 'download' | 'copy' | 'search'
  | 'filter' | 'sort' | 'dropdown' | 'back' | 'next' | 'link'
  | 'message' | 'share' | 'login' | 'logout' | 'help' | 'settings'
  | 'close' | 'refresh'

export interface PurposeButtonConfig {
  variant: 'primary' | 'secondary' | 'danger' | 'success'
  icon: string    // icon name from the Marwes icon system
  label: string   // default accessible label
}
```

**Extension API:**
```ts
// Called once in consumer app entry point
registerPurposeButtonIntent('approve', {
  variant: 'success',
  icon: 'check-circle',
  label: 'Approve',
})
```

The recipe accepts `intent: BuiltInPurposeIntent | string`. Unknown intents look up the consumer registry and throw a descriptive `UnknownIntentError` if not found.

**Why:** 25 built-in intents need a central source of truth. Consumer apps need custom semantic buttons without forking the library.

---

## Open Decisions

*(None — all items from the architectural review of 2026-03-15 are resolved above.)*
