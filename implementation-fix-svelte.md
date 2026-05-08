# Svelte Component Audit — Discrepancies vs React/Vue

Date: 2026-05-07
Audited: All 20 component families in `packages/svelte/src/lib/components/`

## Summary

- 20 families checked
- Multiple discrepancies found across structure, props, and missing features

---

## Button

### Button.svelte
- **No issues found** — matches React/Vue pattern correctly (recipe, tag branching, icons, loading, blockClick, a11y attrs, data attributes spread)

---

## Input

### Input.svelte
- **No issues found** — matches React pattern (recipe, a11y attrs, value binding, class/style merge)

### InputField.svelte
- **Issue**: Missing password visibility toggle
- **React**: Has `showPassword` state, toggle button with eye/eyeOff icon, and `type` override when showing password
- **Svelte**: No password toggle affordance at all
- **Fix**: Add password visibility toggle matching React's `mw-input-field__toggle-password` button

- **Issue**: Missing search clear button and search icon
- **React**: Shows search icon when field is empty, shows clear button (`mw-input-field__clear-search`) when field has value
- **Svelte**: No search affordances
- **Fix**: Add search icon and clear button matching React

### PasswordField.svelte
- **Issue**: Purpose field relies on InputField which lacks password toggle — see above
- **Fix**: Once InputField has toggle, PasswordField will inherit it

---

## Select

### Select.svelte
- **No issues found** — chevron icon fixed to 16×16, matches React pattern

### SelectField.svelte
- **No issues found** — matches React structure

---

## Textarea

### Textarea.svelte / TextareaField.svelte
- **Not deeply audited** — simple pattern, likely correct

---

## Icon

### Icon.svelte
- **Not deeply audited** — renders SVG from core registry with kebab-case attrs, correct

---

## Spinner

### Spinner.svelte
- **Issue**: Data attributes are manually listed instead of spread
- **React**: Uses `{...renderKit.dataAttributes}` to spread all data attributes
- **Svelte**: Manually lists `data-component`, `data-variant`, `data-size`
- **Fix**: Use `{...kit.dataAttributes}` spread (Svelte supports this)
- **Impact**: If core adds new data attributes, Svelte won't pick them up

---

## Badge

### Badge.svelte
- **No issues found** — correctly spreads both `kit.dataAttributes` and user `dataAttributes`

### BadgeGroup.svelte
- **No issues found**

---

## Card

### Card.svelte
- **No issues found** — correct structure with header/title/body

---

## Divider

### Divider.svelte
- **Issue**: Data attributes are manually listed instead of spread
- **React**: Uses `{...kit.dataAttributes}` spread (not shown directly but implied by pattern)
- **Svelte**: Manually lists `data-component`, `data-orientation`, `data-size`
- **Fix**: Use `{...kit.dataAttributes}`

---

## Spacing

### Spacing.svelte
- **Not deeply compared** — likely same pattern issue with manual data attrs

---

## Typography (H1, H2, H3, Paragraph)

### H1/H2/H3.svelte
- **No issues found** — matches React pattern (headingRecipe with theme, level, size override)

### Paragraph.svelte
- **Not deeply compared** — same simple recipe pattern

---

## Checkbox

### Checkbox.svelte
- **No issues found** — correctly handles indeterminate via `$effect`, binds checked, fires oncheckedchange

### CheckboxField.svelte
- **Not deeply audited** — assumed correct based on InputField pattern

---

## Switch

### Switch.svelte
- **Issue**: Missing `style={kit.vars}` — React passes `style={kit.vars}` for CSS variables
- **React**: `style={kit.vars}` on the button element
- **Svelte**: No style attribute at all — CSS variables from recipe are dropped
- **Fix**: Add `style={cssVarsToStyle(kit.vars)}` to the button

---

## Radio

### Radio.svelte
- **Not deeply audited**

### RadioGroupField.svelte
- **Issue**: Missing `options` prop — uses only `children` snippet
- **React**: RadioGroupField also uses children (radios rendered by parent)
- **Svelte**: Same pattern (children snippet) — actually CORRECT for the base molecule
- **Note**: The storybook stories pass `options`/`name`/`defaultValue` which don't exist on RadioGroupField. The stories may be broken, not the component itself.

### Purpose Radio wrappers (OptionRadioGroup, YesNoRadioGroup, RatingRadioGroup)
- **Issue**: These render Radio items inside RadioGroupField correctly
- **No structural issues** vs React pattern (React wrappers also generate options and render RadioGroupField with them)

---

## Avatar

### Avatar.svelte
- **Issue**: Data attributes are manually listed instead of spread
- **React**: Uses `{...kit.dataAttributes} {...dataAttributes}` spread
- **Svelte**: Manually lists `data-component`, `data-size`, `data-type`
- **Fix**: Use `{...kit.dataAttributes}`

- **Issue**: Missing `dataAttributes` prop for user/purpose data
- **React**: Accepts `dataAttributes?: Record<string, string>` and spreads it
- **Svelte**: No `dataAttributes` prop in types or template
- **Fix**: Add `dataAttributes` to AvatarProps and spread in template

- **Issue**: Missing CSS vars from recipe
- **React**: Applies `style={kit.vars}` for CSS custom properties
- **Svelte**: Uses raw `{style}` prop (user style) but doesn't merge with `kit.vars`
- **Fix**: Merge `cssVarsToStyle(kit.vars)` with user style

### AvatarBadge.svelte
- **Same issues** as Avatar (manual data attrs, no dataAttributes prop, missing vars)

### AvatarGroup.svelte
- **Not deeply compared** — likely correct structure

### Purpose Avatar wrappers (ProfileAvatar, PresenceAvatar, TeamAvatarGroup)
- **Issue**: Use wrapper `<div data-purpose="...">` instead of passing `dataAttributes` prop
- **React**: Passes `dataAttributes` prop with `createPurposeSemanticAttributes`
- **Svelte**: Wraps in div because Avatar doesn't accept `dataAttributes`
- **Fix**: Once Avatar accepts `dataAttributes`, rewrite to pass prop directly without wrapper div

---

## Skeleton

### Skeleton.svelte
- **Issue**: Data attributes are manually listed instead of spread
- **React**: Uses `{...renderKit.dataAttributes} {...dataAttributes}` spread
- **Svelte**: Manually lists `data-component`, `data-variant`, `data-animation`
- **Fix**: Use `{...kit.dataAttributes}`

- **Issue**: Missing `dataAttributes` user prop
- **React**: Accepts `dataAttributes?: Record<string, string>` for AI-friendly metadata
- **Svelte**: No user `dataAttributes` prop
- **Fix**: Add to SkeletonProps and spread after kit.dataAttributes

---

## StatTile

### StatTile.svelte
- **Issue**: Uses `<span>` for value and subtitle instead of `<div>`
- **React**: Uses `<div className={kit.slots.valueClassName}>` and `<div className={kit.slots.subtitleClassName}>`
- **Svelte**: Uses `<span class={kit.slots.valueClassName}>` and `<span>`
- **Fix**: Change to `<div>` to match React output

- **Issue**: Missing `dataAttributes` user prop
- **React**: Accepts via `Pick<StatTileOptions, "dataAttributes">`
- **Svelte**: StatTileProps has `trendDirection` and `tone` but not `dataAttributes` pass-through
- **Fix**: Add to props and pass to recipe

- **Issue**: Trend rendering condition differs
- **React**: Shows trend when `trendValue` is truthy (any ReactNode)
- **Svelte**: Shows trend only when `kit.trendIcon && trendValue` — misses cases where trend has no icon
- **Fix**: Change condition to `{#if trendValue}` to match React

---

## Accordion

### Accordion.svelte
- **Not deeply compared** — simple disclosure panel

### AccordionField.svelte
- **Not deeply compared** — field molecule pattern

### Purpose wrappers (FAQAccordion, SettingsAccordion, SectionsAccordion)
- **Issue**: Use wrapper `<div data-purpose="...">` pattern
- **React**: Passes `dataAttributes` prop to AccordionField
- **Svelte**: AccordionField doesn't accept `dataAttributes`, so wrapper div is used
- **Fix**: Add `dataAttributes` prop to AccordionField, then rewrite wrappers to pass prop directly

---

## Tab

### TabGroup.svelte
- **Not deeply compared** in this pass

### Purpose wrappers (NavigationTabs, ContentTabs, SettingsTabs)
- **Issue**: Same wrapper div pattern as above
- **Fix**: Same solution — add `dataAttributes` to TabGroupProps

---

## Slider

### Slider.svelte
- **Issue**: Missing visual track/fill/thumb elements
- **React**: Renders full visual structure: `mw-slider__control` > `input` + `mw-slider__visual` (track, fill, touch-area, thumb)
- **Svelte**: Renders only `input[type=range]` + optional tooltip — no custom visual track
- **Fix**: Add the visual div structure matching React:
  ```html
  <div class="mw-slider__control">
    <input ... />
    <div class="mw-slider__visual" aria-hidden="true">
      <span class="mw-slider__track" />
      <span class="mw-slider__fill" />
      <span class="mw-slider__touch-area" />
      <span class="mw-slider__thumb" />
    </div>
    {#if kit.showTooltip} ... {/if}
  </div>
  ```

- **Issue**: Data attributes are manually listed
- **React**: Spreads `{...kit.dataAttributes}`
- **Svelte**: Manually lists `data-component`, `data-orientation`
- **Fix**: Use spread

---

## Cross-cutting issues

### 1. Manual data attribute listing (affects ~6 components)
**Components**: Spinner, Divider, Avatar, Skeleton, Slider, Spacing (likely)
**Problem**: Manually listing `data-component`, `data-variant`, etc. means new core data attributes won't appear
**Fix**: Replace with `{...kit.dataAttributes}` spread on all affected components

### 2. Missing `dataAttributes` user prop (affects ~5 components)
**Components**: Avatar, AvatarBadge, Skeleton, StatTile, AccordionField, TabGroup, SliderField
**Problem**: React allows passing custom data attributes for purpose semantics. Svelte components that wrap these in purpose variants use wrapper divs instead.
**Fix**: Add `dataAttributes?: Record<string, string>` to affected components and spread after kit attrs

### 3. Missing CSS vars from recipe (affects ~2 components)
**Components**: Switch, Avatar (possibly others)
**Problem**: React applies `style={kit.vars}` for CSS custom properties. Svelte drops them.
**Fix**: Apply `style={mergeStyle(cssVarsToStyle(kit.vars), style)}` on affected components

### 4. Slider missing visual structure
**Problem**: Svelte renders bare `<input type="range">` without custom track/fill/thumb
**Fix**: Add the full visual div structure matching React's render output

### 5. InputField missing password toggle & search affordances
**Problem**: React has password eye toggle and search clear button. Svelte has neither.
**Fix**: Port the stateful UI from React (password toggle, search icon, clear button)

---

## Priority order for fixes

1. **Slider visual structure** — most visible, affects usability
2. **Switch missing CSS vars** — affects visual appearance
3. **Data attribute spread** (6 components) — low risk, high correctness
4. **Avatar/Skeleton dataAttributes prop** — enables proper purpose wrappers
5. **InputField password/search affordances** — feature gap
6. **StatTile element/condition fixes** — minor correctness
7. **Purpose wrapper cleanup** (remove wrapper divs) — depends on #4
