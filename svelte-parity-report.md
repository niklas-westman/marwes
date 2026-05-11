# Svelte Adapter — Deep Parity Investigation Report

**Date**: 2026-05-08
**Compared against**: React (`@marwes-ui/react`) and Vue (`@marwes-ui/vue`)

---

## Executive Summary

The Svelte adapter is **functionally complete** — all 24 component families are implemented and exported. The remaining gaps are minor: missing type exports, a few missing stories, 3 missing core enum re-exports, and a significant test coverage delta. The folder structure diverges intentionally in two places (typography, select/textarea) but is otherwise aligned.

---

## 1. Component Exports — Missing Items

### 1.1 Missing Core Enum Re-exports

These enums are re-exported from `@marwes-ui/core` in React and Vue but not in Svelte:

| Enum | Used by | Status |
|------|---------|--------|
| `AvatarSize` | Avatar sizing API | ✗ Missing |
| `AvatarType` | Avatar type variants | ✗ Missing |
| `SwitchSize` | Switch sizing API | ✗ Missing |

**Fix**: Add 3 lines to `packages/svelte/src/lib/index.ts` core re-export block.

### 1.2 Missing Standalone Components

| Component | In React | In Vue | In Svelte | Notes |
|-----------|----------|--------|-----------|-------|
| `Tab` (atom) | ✓ | ✓ | ✗ | Standalone tab button. Svelte only exposes `TabGroup` which manages tabs internally. |
| `TabPanel` | ✓ | ✓ | ✗ | Standalone panel wrapper. Svelte's `TabGroup` renders panels internally. |

**Impact**: Low. `TabGroup` handles the common use case. `Tab` + `TabPanel` are escape hatches for custom layouts. Whether to add them is a design decision.

---

## 2. Type Exports — Missing from Public API

These types are defined in Svelte `.svelte` files (inline `interface`) but **not exported** from `types.ts` or the public barrel:

| Type | Defined in | Exported? |
|------|-----------|-----------|
| `AccordionFieldProps` | `AccordionField.svelte` | ✗ |
| `AccordionFieldItem` | (not defined) | ✗ |
| `CheckboxFieldProps` | `CheckboxField.svelte` | ✗ |
| `CheckboxGroupFieldProps` | `CheckboxGroupField.svelte` | ✗ |
| `RadioGroupFieldProps` | `RadioGroupField.svelte` | ✗ |
| `SliderFieldProps` | `SliderField.svelte` | ✗ |
| `SwitchFieldProps` | `SwitchField.svelte` | ✗ |
| `InputOtpProps` | `InputOtp.svelte` | ✗ |
| `RichTextProps` | `RichText.svelte` | ✗ |
| `RichTextFieldProps` | `RichTextField.svelte` | ✗ |
| `SelectFieldProps` | `SelectField.svelte` | ✗ |
| `TextareaFieldProps` | `TextareaField.svelte` | ✗ |
| `DatePickerProps` | `DatePicker.svelte` | ✗ |
| `DialogFooterControls` | (not defined) | ✗ |
| `TabProps` | (no standalone Tab atom) | ✗ |
| `TabPanelProps` | (no standalone TabPanel) | ✗ |

**Fix**: Move inline interfaces from `.svelte` files into the family `types.ts`, then add them to the barrel `index.ts` and `src/lib/index.ts`.

**Also missing from `types.ts` itself**: `date-picker/types.ts` does not exist — DatePicker props are defined inline.

---

## 3. Folder Structure Differences

### 3.1 Intentional Divergences

| Area | React/Vue | Svelte | Reason |
|------|-----------|--------|--------|
| Heading + Paragraph | `components/heading/` + `components/paragraph/` | `components/typography/` (merged) | Svelte chose to co-locate H1/H2/H3/Paragraph |
| Select + Textarea | Inside `components/input/` | Separate `components/select/` + `components/textarea/` | Svelte split them into their own family dirs |

**Impact**: The exports are identical (`Select`, `SelectField`, `Textarea`, `TextareaField`, `H1`, `H2`, `H3`, `Paragraph`). Only the internal file organization differs. This is fine as long as it stays consistent.

### 3.2 Missing Internal Files

| File | React/Vue | Svelte | Notes |
|------|-----------|--------|-------|
| `date-picker/types.ts` | N/A (React uses inline) | ✗ Missing | Props defined inline in `DatePicker.svelte` |
| `toast/toast-manager-types.ts` | ✓ | ✗ | Toast types live in `toast/types.ts` instead — equivalent |
| `input/select-arrow-icon` | ✓ | ✗ | Inline in Select.svelte — acceptable |

### 3.3 Missing README files

4 component directories are missing `README.md` (all other 20 have them):

- `date-picker/`
- `dialog/`
- `toast/`
- `tooltip/`

---

## 4. Storybook Stories — Missing

**React**: 134 stories | **Vue**: 127 stories | **Svelte**: 129 stories

### 4.1 Stories in React+Vue but NOT in Svelte (4 files)

| Story | React | Vue | Svelte | Priority |
|-------|-------|-----|--------|----------|
| `color/color.stories` | ✓ | ✓ | ✗ | Low — design system showcase, not component-specific |
| `skeleton/skeleton-molecules.stories` | ✓ | ✓ | ✗ | Medium — demonstrates skeleton compositions in Card/Toast/StatTile |
| `tab/tab.stories` | ✓ | ✓ | ✗ | Low — requires standalone `Tab` atom (not yet implemented) |
| `toast/toast-matrix.stories` | ✓ | ✓ | ✗ | Low — variant matrix visual test |

### 4.2 Stories in Svelte but NOT in Vue (7 button stories)

Svelte has **more** button purpose stories than Vue (copy, download, dropdown, filter, search, sort, upload). These are at full React parity.

### 4.3 Missing Color Story Infrastructure

Both React and Vue have `color/ColorSwatch` helper components and `color/Introduction.mdx`. Svelte has neither.

---

## 5. Test Coverage — Significant Gap

| Adapter | Test Files | Test Count |
|---------|-----------|------------|
| React | 70 | ~350+ |
| Vue | 70 | ~350+ |
| **Svelte** | **10** | **74** |

### 5.1 Test families covered in React/Vue but NOT in Svelte

| Family | React Tests | Vue Tests | Svelte Tests |
|--------|------------|-----------|--------------|
| accordion | 3 files (atom, field, variants) | 3 files | ✗ |
| avatar | 5 files (atom, badge, group, exports, variants) | 5 files | ✗ |
| badge | 4 files (atom, group, exports, variants) | 4 files | partial (passive-primitives) |
| card | 1 file | 1 file | partial (passive-primitives) |
| date-picker | 2 files (atom, exports) | 2 files | ✗ |
| dialog | 3 files (atom, modal, variants) | 3 files | 1 file (atom only) |
| divider | 1 file | 1 file | partial (passive-primitives) |
| heading | 1 file | 1 file | ✗ |
| icon | 1 file | 1 file | ✗ |
| input | 12 files | 14 files | 2 files (atom, field) |
| paragraph | 1 file | 1 file | ✗ |
| radio | 3 files | 3 files | ✗ |
| skeleton | 2 files | 2 files | partial (passive-primitives) |
| slider | 3 files | 3 files | ✗ |
| spacing | 1 file | 1 file | partial (passive-primitives) |
| spinner | 3 files | 3 files | ✗ |
| stat-tile | 2 files | 2 files | ✗ |
| switch | 2 files | 2 files | 1 file |
| tab | 3 files | 3 files | ✗ |
| toast | 2 files | 2 files | 1 file |
| tooltip | 3 files | 3 files | ✗ |
| provider | 4 files (provider, SSR, theme-vars, adapter-integrity) | 4 files | 1 file |
| button | 3 files (atom, exports, purpose-locking) | 3 files | 1 file |

### 5.2 Test categories missing entirely

- **Index export tests** — React/Vue have `index-exports.test.ts` for many families
- **Variant/purpose tests** — React/Vue have `variants.test.ts` for badge, button, dialog, radio, slider, spinner, switch, tab, toast
- **SSR tests** — React/Vue have `ssr.test.ts` and `adapter-theme-integrity.test.ts`
- **DialogModal interactive tests** — focus trapping, escape key, scrim click

---

## 6. Documentation

| Doc | Exists? |
|-----|---------|
| `docs/guides/svelte-adapter.md` | ✓ |
| Per-component README in 20/24 dirs | ✓ (missing: date-picker, dialog, toast, tooltip) |
| Storybook Introduction.mdx for all families | ✓ |

---

## 7. SSR / Build

| Item | React | Vue | Svelte | Notes |
|------|-------|-----|--------|-------|
| `ssr.ts` export | ✓ | ✓ | ✓ | `createMarwesThemeScript`, `createMarwesThemeStyle` |
| SSR component exports (`MarwesThemeScript`, `MarwesThemeStyle`) | ✓ (JSX components) | ✗ (functions only) | ✓ (Svelte components) | Svelte matches React in having component wrappers |
| Build tool | tsup | tsup | svelte-package | Intentional — Svelte uses `@sveltejs/package` |
| Package exports map | ✓ | ✓ | ✓ | Includes `svelte` condition |

---

## 8. Priority Action Items

### P0 — Should fix before publish

| # | Item | Effort |
|---|------|--------|
| 1 | Add `AvatarSize`, `AvatarType`, `SwitchSize` core re-exports | 5 min |
| 2 | Extract inline prop interfaces from `.svelte` to `types.ts` and export (13 types) | 1–2 hours |
| 3 | Create `date-picker/types.ts` | 15 min |

### P1 — Should fix soon after publish

| # | Item | Effort |
|---|------|--------|
| 4 | Add 4 missing component README files (date-picker, dialog, toast, tooltip) | 30 min |
| 5 | Add `skeleton-molecules.stories.ts` | 30 min |
| 6 | Add `color/` story directory with `ColorSwatch.svelte` + `color.stories.ts` + `Introduction.mdx` | 1 hour |
| 7 | Add `toast-matrix.stories.ts` | 30 min |

### P2 — Test coverage ramp

| # | Item | Effort |
|---|------|--------|
| 8 | Add index export tests for all families | 2 hours |
| 9 | Add variant/purpose tests for families that have them in React | 3–4 hours |
| 10 | Add interactive tests: DialogModal (focus trap, escape, scrim), TooltipGroup (hover, escape) | 2 hours |
| 11 | Add remaining atom tests: accordion, avatar, heading, icon, paragraph, radio, slider, spinner, tab | 3 hours |
| 12 | Add field compound tests: accordion-field, checkbox-field, input-otp, rich-text, select, textarea, slider-field | 3 hours |
| 13 | Add SSR + provider adapter integrity tests | 1 hour |

### P3 — Design decisions (optional)

| # | Item | Notes |
|---|------|-------|
| 14 | Standalone `Tab` atom + `TabPanel` components | React/Vue expose them. Svelte could add them for composition flexibility. |
| 15 | Align select/textarea folder structure | Currently split out from input/. Functional parity is already there. |
| 16 | Align typography → heading + paragraph folder names | Purely organizational. Exports already match. |

---

## 9. Summary Scorecard

| Dimension | React | Vue | Svelte | Gap |
|-----------|-------|-----|--------|-----|
| Component families | 23 dirs | 23 dirs | 24 dirs | ✓ (Svelte has more dirs, same exports) |
| Component exports | ~112 | ~90 | 112 | ✓ Full parity with React |
| Core enum re-exports | 7 | 7 | 4 | **3 missing** |
| Type exports | ~120 | ~100 | ~30 | **~13 prop types not exported** |
| Storybook stories | 134 | 127 | 129 | **4 stories missing vs React** |
| Test files | 70 | 70 | 10 | **60 test files behind** |
| Tests count | ~350+ | ~350+ | 74 | **~280 tests behind** |
| README per component dir | N/A | N/A | 20/24 | **4 missing** |
| SSR support | ✓ | ✓ | ✓ | ✓ |
| Build/publish ready | ✓ | ✓ | ✓ (changeset created) | ✓ |
