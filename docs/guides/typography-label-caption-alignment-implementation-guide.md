# Implementation Guide: Typography Label/Caption Alignment

Created: 2026-05-26
Status: draft
Branch: TBD

---

## Living Document

This guide must be updated during implementation:

- [ ] Check off tasks as they are completed.
- [ ] Add notes when reality diverges from plan.
- [ ] Reorder or split phases when blockers are discovered.
- [ ] Add new tasks discovered during implementation.
- [ ] Mark tasks as `skipped - <reason>` when they become irrelevant.
- [ ] Record timestamps on phase completions for velocity tracking.
- [ ] Update the test coverage map as tests are written.

Last updated: 2026-05-27
Current phase: 5

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | `pnpm` via `pnpm-lock.yaml` |
| Monorepo | Yes - `packages/`, `apps/`, `tests/`, `docs/`, `scripts/` |
| Test runner | Vitest |
| Test command | `pnpm test:packages` or targeted `pnpm --filter <package> test -- <pattern>` |
| Typecheck | `pnpm test:typecheck:packages` and package-level `pnpm --filter <package> test:typecheck` |
| Lint/format | `pnpm exec biome check <files>` |
| Build | `pnpm build:packages` or package-level `pnpm --filter <package> build` |
| Domain checks | `pnpm check:repo-map`, `pnpm registry:check`, `pnpm parity:summary:check`, `pnpm storybook:consistency`, `pnpm colors:check`, `pnpm figma:validate` |
| CI | `.github/workflows/ci.yml`, `.github/workflows/_ci.yml` |
| Feature paths | `packages/react/src/components`, `packages/vue/src/components`, `packages/svelte/src/lib/components`, `packages/presets/src/firstEdition`, `tests/contracts`, `.figma/marwes` |
| Existing tests | `packages/*/**/__tests__/*.test.*`, `packages/svelte/src/tests/*.test.ts`, `tests/contracts/*.contract.ts` |

### Validation Stack

| Purpose | Command | Scope |
|---|---|---|
| React unit tests | `pnpm --filter @marwes-ui/react test -- <component-pattern>` | Component phase |
| Vue unit tests | `pnpm --filter @marwes-ui/vue test -- <component-pattern>` | Component phase |
| Svelte unit tests | `pnpm --filter @marwes-ui/svelte test -- <component-pattern> shared-contracts field-compounds` | Component phase |
| Preset tests | `pnpm --filter @marwes-ui/presets test -- <css-contract-pattern>` | CSS contract phase |
| Typecheck | `pnpm test:typecheck:contracts && pnpm --filter @marwes-ui/react test:typecheck && pnpm --filter @marwes-ui/vue test:typecheck && pnpm --filter @marwes-ui/svelte test:typecheck` | After adapter parity |
| Lint/format | `pnpm exec biome check <changed-files>` | Every phase |
| Build | `pnpm --filter @marwes-ui/react build && pnpm --filter @marwes-ui/vue build && pnpm --filter @marwes-ui/svelte build && pnpm --filter @marwes-ui/presets build` | After adapter parity |
| Repo contract | `pnpm check:repo-map` | Final full pass |

---

## 1. Architecture Contract

### Problem Statement

Marwes introduced a dedicated `Text` component with `label`, `label-small`, and `caption` variants, but several field-like and grouped React components still render labels and helper/error text through `Paragraph`. That creates a typography mismatch against Figma and against the updated radio/checkbox contract. The repair must be systematic across React, Vue, Svelte, presets, and shared contracts.

### Chosen Approach

Use React as the first implementation adapter for each component family, then mirror the same contract into Vue and Svelte before considering that component complete. Preset CSS must target `.mw-text` for label/caption surfaces and stop depending on `.mw-p` for field labels, helper text, and errors. Shared contracts must assert the typography classes so future adapters cannot drift.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| Core | Typography variant types, text recipe, a11y ID builders | Framework DOM rendering |
| Presets | CSS selectors, colors, spacing, disabled/error state styling | Component logic or adapter-specific rendering |
| React | First adapter implementation and initial behavior proof | Vue/Svelte-only shortcuts |
| Vue | Parity implementation using the same shared contracts | Divergent class or variant choices |
| Svelte | Parity implementation and provider-safe fixtures where `Text` needs theme context | Adding unrelated stateful APIs unless required |
| Shared contracts | Cross-adapter assertions for label/caption semantics | Visual pixel testing |
| Figma references | Source of typography intent and component-specific variant decisions | Runtime implementation details |

### Non-Negotiables

- [ ] Field/group labels use `Text variant="label"` unless Figma proves a different label variant is needed.
- [ ] Helper, description, and error text use `Text variant="caption"` unless Figma proves `label-small`.
- [ ] Option-level secondary text uses the Figma-backed variant for that component family: radio currently uses `label-small`; checkbox currently uses `caption`.
- [ ] Preset CSS must not target `.mw-p` for updated label/caption field surfaces.
- [ ] React, Vue, and Svelte must expose the same user-facing behavior for every completed component.
- [ ] Existing `Paragraph` remains valid for body copy, panel content, prose, and explicit paragraph atoms.
- [ ] Each component is completed one by one: React first, then Vue, then Svelte, then presets/contracts/tests.
- [ ] If Figma evidence is ambiguous, stop and document the decision needed before editing.

---

## 2. Phase 0: Deep Dive Audit

Goal: Find every possible label/caption alignment issue before editing more components.
Depends on: None
Status: Complete - 2026-05-26

### Inputs

- Existing React audit candidate list.
- Figma typography page:
  - `.figma/marwes/pages/-typography/typography_1368-5656.json`
  - `.figma/marwes/pages/-typography/typography_1368-5677.json`
- Current aligned references:
  - `packages/react/src/components/radio/radio-group-field.tsx`
  - `packages/react/src/components/checkbox/checkbox-field.tsx`
  - `packages/react/src/components/checkbox/checkbox-group-field.tsx`
  - `packages/presets/src/firstEdition/molecules/radio-group-field.css`
  - `packages/presets/src/firstEdition/molecules/checkbox-field.css`
  - `packages/presets/src/firstEdition/molecules/checkbox-group-field.css`

### Tasks

- [x] Run a full React label/helper/error scan:
  - Command: `rg -n "import \\{ Paragraph \\}|<Paragraph|mw-p|__label|__description|__helper|__error|<p className=\\\"mw-" packages/react/src/components`
- [x] Run a cross-adapter/preset stale paragraph selector scan:
  - Command: `rg -n "mw-p|Paragraph|__label|__description|__helper|__error" packages/react/src/components packages/vue/src/components packages/svelte/src/lib/components packages/presets/src/firstEdition tests/contracts`
- [x] Search Figma for component typography evidence:
  - Command: `rg -n "Label/Default|Label/Small|Caption|Group label|helper|description|Min label|Max label" .figma/marwes/components .figma/marwes/pages/-typography --glob "*.json"`
- [x] For each candidate component, record:
  - Current React typography implementation.
  - Current Vue/Svelte parity state.
  - Preset selectors that mention `.mw-p`, raw `p`, or component label/helper/error slots.
  - Shared contract coverage.
  - Figma file and observed typography intent.
- [x] Decide whether dialog/drawer descriptions are in scope or separate follow-up.
- [x] Decide whether progress-bar/stat-tile labels are in scope or remain recipe-owned.
- [x] Update this guide's Units table with any newly discovered component.

### Outputs

- Completed Unit Status table with one row per component family.
- Clear decision on optional review items.
- No code changes in Phase 0 unless tests/contracts are missing and explicitly created for audit support.

### Phase 0 Exit Criteria

- [x] Every candidate has a Figma reference or documented "no Figma evidence found" note.
- [x] Every candidate has React/Vue/Svelte/preset/test paths listed.
- [x] Optional review items have an explicit in-scope or out-of-scope decision.
- [x] Guide updated before implementation starts.

### Phase 0 Findings

#### Typography Token Evidence

Figma text style evidence from `.figma/marwes/pages/-typography/typography_1368-5656.json`:

| Figma style | Marwes variant | Values |
|---|---|---|
| `Label/Default` | `Text variant="label"` | `14px`, weight `500`, line height `16px`, letter spacing `-0.42px` |
| `Label/Small` | `Text variant="label-small"` | `12px`, weight `500`, line height `12px`, letter spacing `-0.36px` |
| `Caption` | `Text variant="caption"` | `12px`, weight `500`, line height `16px`, letter spacing `0` |

Component-specific Figma extraction:

| Component file | Text nodes found | Decision |
|---|---|---|
| `text-field.json`, `password-field.json`, `search-field.json`, `currency-field.json`, `zip-code-field.json`, `date-of-birth-field.json`, `date-picker-field.json` | `Label` is `14/500/16 -0.42`; `Hint` is `12/500/16 0` | Field label -> `label`; helper/error -> `caption` |
| `dropdown.json` / `select.json` | Field `Label` and option/value text are `14/500/16 -0.42`; `Hint` is `12/500/16 0` | Field label -> `label`; helper/error -> `caption`; option/value text remains recipe/preset-owned unless a separate select option pass is requested |
| `input-otp.json` / `otp-cell.json` | Label and digits are `14/500/16 -0.42`; hint is `12/500/16 0` | OTP label -> `label`; helper/error -> `caption`; cell digit remains atom styling |
| `radio-group.json` / `radio-button-field.json` | Group/option labels are `14/500/16 -0.42`; group helper is `12/500/16 0`; option description is `12/500/12 -0.36` | Already aligned: labels -> `label`; group helper/error -> `caption`; option description -> `label-small` |
| `checkbox-field.json` / `checkbox-group.json` | Labels are `14/500/16 -0.42`; helper/description text is `12/500/16 0` | Already aligned: labels -> `label`; helper/description/error -> `caption` |
| `slider-field.json` | Min/max labels are `12/500/16 0`; current value label is `12/400/16 0` | Slider field label -> `label`; description/error -> `caption`; edge min/max values -> `caption`; current value label is not currently adapter-rendered and needs no change in this pass |
| `badge.json` | Badge label is `12/500/16 0` | Badge chip remains CSS-owned; BadgeGroup legend should use `caption`, not `label-small` |
| `tab-group.json` | Tab label text is `14/500/16 -0.42` | TabGroup optional header label -> `label`; keep panel body `Paragraph` |
| `dialog.json` / `drawer.json` | Description/body text is `16/400/24 -0.48`; action labels are `14/500/16 -0.42` | Dialog/drawer descriptions are body/prose, not caption; keep out of label/caption migration |
| `progress-bar.json` | Label and percentage are `14/500/16 -0.42` | ProgressBar is preset/recipe-owned; no adapter `Text` migration, but preset letter spacing should be reviewed in a separate visual fidelity pass |
| `stat-tile.json` | Label is `12/500/12 -0.36`; subtitle/trend are `12/500/16 0`; value is `24/500/30 -0.72` | StatTile is preset/recipe-owned; no adapter `Text` migration in this pass |

#### Source Scan Findings

React field/group components still using `Paragraph` for label/caption surfaces:

- `packages/react/src/components/input/input-field.tsx`
- `packages/react/src/components/input/select-field.tsx`
- `packages/react/src/components/input/textarea-field.tsx`
- `packages/react/src/components/input/rich-text-field.tsx`
- `packages/react/src/components/input/input-otp.tsx`
- `packages/react/src/components/accordion/accordion-field.tsx`
- `packages/react/src/components/switch/switch-field.tsx`
- `packages/react/src/components/slider/slider-field.tsx`
- `packages/react/src/components/badge/badge-group.tsx`
- `packages/react/src/components/tab/tab-group.tsx` for the optional group label only; panel body strings should remain `Paragraph`.

Vue mirrors the same stale `Paragraph` usage in matching components:

- `packages/vue/src/components/input/input-field.ts`
- `packages/vue/src/components/input/select-field.ts`
- `packages/vue/src/components/input/textarea-field.ts`
- `packages/vue/src/components/input/rich-text-field.ts`
- `packages/vue/src/components/input/input-otp.ts`
- `packages/vue/src/components/accordion/accordion-field.ts`
- `packages/vue/src/components/switch/switch-field.ts`
- `packages/vue/src/components/slider/slider-field.ts`
- `packages/vue/src/components/badge/badge-group.ts`
- `packages/vue/src/components/tab/tab-group.ts` for the optional group label only.

Svelte mirrors the stale raw paragraph classes in matching components:

- `packages/svelte/src/lib/components/input/InputField.svelte`
- `packages/svelte/src/lib/components/input/SelectField.svelte`
- `packages/svelte/src/lib/components/input/TextareaField.svelte`
- `packages/svelte/src/lib/components/input/RichTextField.svelte`
- `packages/svelte/src/lib/components/input/InputOtp.svelte`
- `packages/svelte/src/lib/components/accordion/AccordionField.svelte`
- `packages/svelte/src/lib/components/switch/SwitchField.svelte`
- `packages/svelte/src/lib/components/slider/SliderField.svelte`
- `packages/svelte/src/lib/components/badge/BadgeGroup.svelte`
- `packages/svelte/src/lib/components/tab/TabGroup.svelte` for the optional group label only; panel body strings should remain paragraph body text.

Preset stale selectors that must be updated as each component is migrated:

- `packages/presets/src/firstEdition/molecules/input-field.css`
  - nested `.mw-input-field__label p`
  - `.mw-input-field--invalid .mw-input-field__label .mw-p`
  - `.mw-input-field--invalid .mw-input-field__error .mw-p`
- `packages/presets/src/firstEdition/select.css`
  - date-select special selectors targeting `.mw-input-field__label p`, helper `p`, and error `p`
- `packages/presets/src/firstEdition/input-otp.css`
  - `.mw-input-otp__label .mw-p`
  - `.mw-input-otp__helper .mw-p`
  - `.mw-input-otp__error .mw-p`
- `packages/presets/src/firstEdition/molecules/accordion-field.css`
  - invalid state `.mw-p` selectors
- `packages/presets/src/firstEdition/molecules/switch-field.css`
  - invalid state `.mw-p` selectors
- `packages/presets/src/firstEdition/molecules/slider-field.css`
  - invalid state `.mw-p` selectors

No stale `.mw-p` preset selectors were found for `BadgeGroup` or `TabGroup`; their adapter rendering still needs migration and contract coverage.

#### Optional Review Decisions

| Unit | Decision | Evidence |
|---|---|---|
| Dialog description | Out of scope for this pass | Figma description is `16/400/24 -0.48`, body/prose style, not caption. Keep raw/prose description unless a dialog typography pass is requested. |
| Drawer description | Out of scope for this pass | Figma description is `16/400/24 -0.48`, body/prose style, not caption. Keep raw/prose description unless a drawer typography pass is requested. |
| ProgressBar label/percentage | Out of adapter migration; note for visual fidelity follow-up | Figma label/percentage are `14/500/16 -0.42`; current preset is recipe-owned and uses `14/500/16` with `letter-spacing: 0`. This is a CSS fidelity issue, not a `Text` migration. |
| StatTile label/subtitle/trend | Out of adapter migration | Current preset-owned typography already maps closely: label `12/500/12 -0.03em`, subtitle/trend `12/500/16 0`, value `24/500/30 -0.72`. |

---

## 3. Repeatable Component Unit Contract

Use this unit template for every component below.

### Unit Template: Label/Caption Component Family

| Step | Description | Action | Verify |
|---|---|---|---|
| 1 | Read Figma evidence for this component | Read `.figma/marwes/components/<component>.json` and typography page | Record chosen variants in this guide |
| 2 | Update shared contract first | Add assertions for `.mw-text--label`, `.mw-text--caption`, and any component-specific `label-small` | Targeted contract tests fail before adapter changes or are clearly missing |
| 3 | Update React | Replace field/group `Paragraph` with `Text`; preserve body `Paragraph` | React targeted tests pass |
| 4 | Update presets | Replace stale `.mw-p` selectors for this component with `.mw-text`; preserve colors, spacing, disabled/error states | Preset CSS contract passes |
| 5 | Update Vue | Mirror React behavior and public props | Vue targeted tests pass |
| 6 | Update Svelte | Mirror React behavior; use provider-wrapped test fixtures when `Text` needs provider context | Svelte targeted tests pass |
| 7 | Build and typecheck | Run package builds/typechecks for touched packages | All commands pass |
| 8 | Update guide | Mark component unit complete with timestamp and notes | Completion tracker updated |

Unit done when:

- [ ] React, Vue, and Svelte render the same typography variants.
- [ ] Presets target `.mw-text` where the component owns label/caption text.
- [ ] Shared contracts cover the behavior.
- [ ] Targeted package tests pass.
- [ ] Package builds pass.
- [ ] This guide is updated.

---

## 4. Component Units

### Known Definite Units

| Unit | Status | Figma Reference | React Path | Vue Path | Svelte Path | Preset Path | Contract/Test Notes |
|---|---|---|---|---|---|---|---|
| InputField | Not started | `text-field.json`, `password-field.json`, `search-field.json`, `currency-field.json`, `zip-code-field.json`, `date-of-birth-field.json`: label `14/500/16 -0.42`, hint `12/500/16 0` | `packages/react/src/components/input/input-field.tsx` | `packages/vue/src/components/input/input-field.ts` | `packages/svelte/src/lib/components/input/InputField.svelte` | `packages/presets/src/firstEdition/molecules/input-field.css` | `tests/contracts/input-field.contract.ts`; derived zip/currency/date/search/password fields inherit this; label -> `label`, helper/error -> `caption` |
| SelectField / DropdownField | Not started | `dropdown.json`: label/value/options `14/500/16 -0.42`, hint `12/500/16 0`; `select.json`: value `14/500/16 -0.42` | `packages/react/src/components/input/select-field.tsx` | `packages/vue/src/components/input/select-field.ts` | `packages/svelte/src/lib/components/input/SelectField.svelte` | `packages/presets/src/firstEdition/molecules/input-field.css`, `packages/presets/src/firstEdition/select.css` | `tests/contracts/select-field.contract.ts`, `tests/contracts/dropdown-field.contract.ts`; field label -> `label`, helper/error -> `caption`; option/value text remains recipe-owned |
| TextareaField | Not started | Text-field pattern applies: label `14/500/16 -0.42`, hint `12/500/16 0`; no dedicated textarea Figma file found in Phase 0 | `packages/react/src/components/input/textarea-field.tsx` | `packages/vue/src/components/input/textarea-field.ts` | `packages/svelte/src/lib/components/input/TextareaField.svelte` | `packages/presets/src/firstEdition/molecules/input-field.css` | `tests/contracts/textarea-field.contract.ts`; label -> `label`, helper/error -> `caption` |
| RichTextField | Not started | Text-field pattern applies: label `14/500/16 -0.42`, hint `12/500/16 0`; no dedicated rich-text field Figma file found in Phase 0 | `packages/react/src/components/input/rich-text-field.tsx` | `packages/vue/src/components/input/rich-text-field.ts` | `packages/svelte/src/lib/components/input/RichTextField.svelte` | `packages/presets/src/firstEdition/molecules/input-field.css`, `packages/presets/src/firstEdition/rich-text.css` | `tests/contracts/rich-text-field.contract.ts`; label -> `label`, helper/error -> `caption` |
| InputOtp | Not started | `input-otp.json`, `otp-cell.json`: label/digits `14/500/16 -0.42`, hint `12/500/16 0` | `packages/react/src/components/input/input-otp.tsx` | `packages/vue/src/components/input/input-otp.ts` | `packages/svelte/src/lib/components/input/InputOtp.svelte` | `packages/presets/src/firstEdition/input-otp.css` | `tests/contracts/input-otp.contract.ts`; label -> `label`, helper/error -> `caption`; digit cells remain atom CSS |
| AccordionField | Complete | `accordion.json`: accordion title `14/500/16 -0.42`, body `14/400/24 -0.42`; no separate field wrapper label found | `packages/react/src/components/accordion/accordion-field.tsx` | `packages/vue/src/components/accordion/accordion-field.ts` | `packages/svelte/src/lib/components/accordion/AccordionField.svelte` | `packages/presets/src/firstEdition/molecules/accordion-field.css` | `tests/contracts/accordion.contract.ts`; wrapper label follows field convention -> `label`, description/error -> `caption`; accordion item body remains content-owned |
| SwitchField | Complete | `switch-field.json`: label `14/500/16 -0.42` | `packages/react/src/components/switch/switch-field.tsx` | `packages/vue/src/components/switch/switch-field.ts` | `packages/svelte/src/lib/components/switch/SwitchField.svelte` | `packages/presets/src/firstEdition/molecules/switch-field.css` | `tests/contracts/switch.contract.ts`; label -> `label`, description/error -> `caption` by field convention |
| SliderField | Not started | `slider-field.json`: edge min/max labels `12/500/16 0`; current value label `12/400/16 0` | `packages/react/src/components/slider/slider-field.tsx` | `packages/vue/src/components/slider/slider-field.ts` | `packages/svelte/src/lib/components/slider/SliderField.svelte` | `packages/presets/src/firstEdition/molecules/slider-field.css` | `tests/contracts/slider.contract.ts`; label -> `label`, description/error -> `caption`, edge min/max values -> `caption` |
| BadgeGroup | Not started | `badge.json`: badge label `12/500/16 0` | `packages/react/src/components/badge/badge-group.tsx` | `packages/vue/src/components/badge/badge-group.ts` | `packages/svelte/src/lib/components/badge/BadgeGroup.svelte` | `packages/presets/src/firstEdition/badge.css` | `tests/contracts/badge-group.contract.ts`; BadgeGroup legend -> `caption`; badge chip remains CSS-owned |
| TabGroup label | Not started | `tab-group.json`: tab label `14/500/16 -0.42` | `packages/react/src/components/tab/tab-group.tsx` | `packages/vue/src/components/tab/tab-group.ts` | `packages/svelte/src/lib/components/tab/TabGroup.svelte` | `packages/presets/src/firstEdition/molecules/tab-group.css`, `packages/presets/src/firstEdition/tab.css` | `tests/contracts/tab.contract.ts`; optional group label -> `label`; keep string panel body as `Paragraph` |

### Already Aligned Reference Units

| Unit | Status | Notes |
|---|---|---|
| RadioGroupField | Complete before this guide | Uses `Text label`, `Text caption`, option description `Text label-small`; use as reference pattern. |
| CheckboxField | Complete before this guide | Uses `Text label` and `Text caption`; use as reference pattern. |
| CheckboxGroupField | Complete before this guide | Uses `Text label` and `Text caption`; option descriptions use `caption`; use as reference pattern. |
| Text | Complete before this guide | Provides `display`, `label`, `label-small`, `caption`, `overline`, `micro`. |

### Phase 0 Optional Review Units

| Unit | Default Decision | Why |
|---|---|---|
| Dialog description | Skipped - out of scope for this pass | Figma description is `16/400/24 -0.48`, body/prose style, not caption. |
| Drawer description | Skipped - out of scope for this pass | Figma description is `16/400/24 -0.48`, body/prose style, not caption. |
| ProgressBar label/percentage | Skipped for adapter migration; record visual follow-up | Figma label/percentage are `14/500/16 -0.42`; current preset is recipe-owned and uses `letter-spacing: 0`, so this is a CSS fidelity follow-up, not a `Text` migration. |
| StatTile label/subtitle/trend | Skipped - out of scope for this pass | Preset-owned typography already maps closely to Figma; no adapter `Paragraph` or field label/caption surface. |
| Toast/Banner/ContextMenu/SegmentedControl/Button | Out of scope unless Figma proves otherwise | Text is component-specific message/action/navigation text, not field label/helper/error. |

---

## 5. Implementation Phases

### Phase 1: Input Field Family

Goal: Align `InputField`, `SelectField`, `TextareaField`, `RichTextField`, and their derived field variants.
Depends on: Phase 0
Status: Complete

Tasks:

- [x] Add shared contract assertions for label `mw-text--label` and helper/error `mw-text--caption`.
- [x] Update React `input-field.tsx`, `select-field.tsx`, `textarea-field.tsx`, `rich-text-field.tsx`.
- [x] Confirm derived React field variants (`CurrencyField`, `DateOfBirthField`, `DropdownField`, `ZipCodeField`) inherit the updated rendering.
- [x] Update preset selectors in `molecules/input-field.css` and any select/date-specific `p` selectors in `select.css`.
- [x] Mirror Vue files.
- [x] Mirror Svelte files and provider-wrapped fixtures if needed.
- [x] Update all affected tests.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- input-field select-field textarea-field rich-text-field dropdown-field date-of-birth-field currency-field zip-code-field
pnpm --filter @marwes-ui/vue test -- input-field select-field textarea-field rich-text-field dropdown-field date-of-birth-field currency-field zip-code-field
pnpm --filter @marwes-ui/svelte test -- input-field select-textarea rich-text dropdown-field shared-contracts
pnpm --filter @marwes-ui/presets test -- input-field select
pnpm exec biome check <changed-files>
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/svelte build
pnpm --filter @marwes-ui/presets build
pnpm --filter @marwes-ui/react test:typecheck
pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/presets test:typecheck
pnpm test:typecheck:contracts
```

Exit criteria:

- [x] No updated input field contract expects `.mw-p` for labels/helper/errors.
- [x] Date/select special selectors target `.mw-text`, not raw `p`.
- [x] React/Vue/Svelte targeted tests pass.

### Phase 2: InputOtp

Goal: Align OTP label/helper/error typography and preset selectors.
Depends on: Phase 1 only for shared input conventions.
Status: Complete

Tasks:

- [x] Confirm Figma OTP label/helper intent.
- [x] Update shared OTP contract for label/caption classes.
- [x] Update React, Vue, Svelte OTP components.
- [x] Update `input-otp.css` selectors from `.mw-p` to `.mw-text`.
- [x] Update tests.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- input-otp
pnpm --filter @marwes-ui/vue test -- input-otp
pnpm --filter @marwes-ui/svelte test -- input-extras input shared-contracts
pnpm --filter @marwes-ui/presets test -- input-otp
pnpm exec biome check <changed-files>
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/svelte build
pnpm --filter @marwes-ui/presets build
pnpm --filter @marwes-ui/react test:typecheck
pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/presets test:typecheck
```

Exit criteria:

- [x] OTP label contract expects `.mw-text--label`.
- [x] OTP helper/error contract expects `.mw-text--caption`.
- [x] OTP preset selectors target `.mw-text`, not `.mw-p`.
- [x] React/Vue/Svelte targeted tests pass.

### Phase 3: AccordionField

Goal: Align accordion group label, description, and error typography.
Depends on: Phase 0
Status: Complete

Tasks:

- [x] Confirm accordion field Figma typography.
- [x] Update shared accordion field contract.
- [x] Update React, Vue, Svelte implementations.
- [x] Update `molecules/accordion-field.css` invalid/error selectors from `.mw-p` to `.mw-text`.
- [x] Update tests.

Notes:

- Figma evidence covers accordion atom title/body states, but does not show a separate AccordionField wrapper label node. The implementation follows the established field-wrapper convention: group label -> `Text label`, description/error -> `Text caption`.
- Accordion item title/content typography remains recipe/preset-owned and was not changed.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- accordion-field accordion
pnpm --filter @marwes-ui/vue test -- accordion-field accordion
pnpm --filter @marwes-ui/svelte test -- accordion shared-contracts field-compounds
pnpm --filter @marwes-ui/presets test -- accordion
pnpm exec biome check <changed-files>
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/svelte build
pnpm --filter @marwes-ui/presets build
pnpm --filter @marwes-ui/react test:typecheck
pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/presets test:typecheck
```

Exit criteria:

- [x] AccordionField label contract expects `.mw-text--label`.
- [x] AccordionField description/error contract expects `.mw-text--caption`.
- [x] AccordionField preset selectors target `.mw-text`, not `.mw-p`.
- [x] React/Vue/Svelte targeted tests pass.
- [x] Builds and typechecks pass.

### Phase 4: SwitchField

Goal: Align switch label, description, and error typography.
Depends on: Phase 0
Status: Complete

Tasks:

- [x] Confirm switch field Figma typography.
- [x] Update switch shared contract.
- [x] Update React, Vue, Svelte implementations.
- [x] Update `molecules/switch-field.css` selectors from `.mw-p` to `.mw-text`.
- [x] Update tests.

Notes:

- Figma `switch-field.json` shows the switch field label as `14/500/16 -0.42`, matching `Text label`.
- The Figma switch field export does not include helper or error text, so description/error follow the established field convention: `Text caption`.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- switch
pnpm --filter @marwes-ui/vue test -- switch
pnpm --filter @marwes-ui/svelte test -- switch shared-contracts field-compounds
pnpm --filter @marwes-ui/presets test -- switch
pnpm exec biome check <changed-files>
pnpm --filter @marwes-ui/react build
pnpm --filter @marwes-ui/vue build
pnpm --filter @marwes-ui/svelte build
pnpm --filter @marwes-ui/presets build
pnpm --filter @marwes-ui/react test:typecheck
pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/presets test:typecheck
pnpm test:typecheck:contracts
```

Exit criteria:

- [x] SwitchField label contract expects `.mw-text--label`.
- [x] SwitchField description/error contract expects `.mw-text--caption`.
- [x] SwitchField preset selectors target `.mw-text`, not `.mw-p`.
- [x] React/Vue/Svelte targeted tests pass.
- [x] Builds and typechecks pass.

### Phase 5: SliderField

Goal: Align slider label, description, error, and edge value typography.
Depends on: Phase 0
Status: Not started

Tasks:

- [ ] Read `.figma/marwes/components/slider-field.json`.
- [ ] Decide edge value typography:
  - Phase 0 decision: edge min/max values use `Text caption` because Figma shows `12/500/16 0`.
  - Current value label in Figma is `12/400/16 0`, but the adapter does not currently render that element; do not invent it in this pass.
- [ ] Update shared slider field contract.
- [ ] Update React, Vue, Svelte implementations.
- [ ] Update `molecules/slider-field.css` `.mw-p` selectors.
- [ ] Update tests.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- slider
pnpm --filter @marwes-ui/vue test -- slider
pnpm --filter @marwes-ui/svelte test -- slider shared-contracts
pnpm --filter @marwes-ui/presets test -- slider
pnpm exec biome check <changed-files>
```

### Phase 6: BadgeGroup

Goal: Align badge group legend typography without changing badge chip typography.
Depends on: Phase 0
Status: Not started

Tasks:

- [ ] Confirm Figma badge group legend typography.
- [ ] Use `Text variant="caption"` for the group legend unless a dedicated BadgeGroup Figma file is found later; Phase 0 only found `badge.json` label at `12/500/16 0`.
- [ ] Update shared badge group contract.
- [ ] Update React, Vue, Svelte implementations.
- [ ] Update `badge.css` only if it has stale `.mw-p` assumptions for group label.
- [ ] Keep `Badge` and badge variants unchanged unless Figma proves otherwise.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- badge-group badge
pnpm --filter @marwes-ui/vue test -- badge-group badge
pnpm --filter @marwes-ui/svelte test -- badge shared-contracts
pnpm --filter @marwes-ui/presets test -- badge
pnpm exec biome check <changed-files>
```

### Phase 7: TabGroup Label

Goal: Align tab group header label while preserving paragraph body content inside panels.
Depends on: Phase 0
Status: Not started

Tasks:

- [ ] Confirm Figma tab group label typography.
- [ ] Update shared tab contract for group header label only.
- [ ] Update React, Vue, Svelte `TabGroup` label rendering.
- [ ] Do not change string panel content wrapping in `Paragraph`; it is body text.
- [ ] Update preset selectors only if `tab-group.css` targets `.mw-p` for the group label.
- [ ] Update tests.

Verification:

```bash
pnpm --filter @marwes-ui/react test -- tab-group tab
pnpm --filter @marwes-ui/vue test -- tab-group tab
pnpm --filter @marwes-ui/svelte test -- tab shared-contracts
pnpm --filter @marwes-ui/presets test -- tab
pnpm exec biome check <changed-files>
```

### Phase 8: Optional Review Decisions

Goal: Decide whether non-field component descriptions should join this pass.
Depends on: Phase 0, and preferably after core field families are stable.
Status: Not started

Tasks:

- [x] Review dialog Figma and decide whether `mw-dialog__description` should render `Text caption`.
- [x] Review drawer Figma and decide whether `mw-drawer__description` should render `Text caption`.
- [x] Review progress-bar Figma and decide whether adapter-level `Text` is appropriate or preset recipe CSS should remain owner.
- [x] Review stat-tile Figma and decide whether adapter-level `Text` is appropriate or preset recipe CSS should remain owner.
- [x] Document in this guide either `in scope` with a new phase or `skipped - reason`.

Phase 0 decision:

- Dialog and drawer descriptions are skipped in this label/caption pass because Figma uses body/prose typography, not caption.
- ProgressBar remains recipe/preset-owned. Record a follow-up CSS fidelity note because Figma uses `letter-spacing: -0.42px` for label/percentage while current CSS uses `0`.
- StatTile remains recipe/preset-owned and out of this adapter migration.

Verification:

```bash
rg -n "<p className=\"mw-(dialog|drawer)__description|mw-progress-bar__label|mw-stat-tile__label" packages/react/src/components packages/vue/src/components packages/svelte/src/lib/components packages/presets/src/firstEdition
```

### Phase 9: Final Parity and Repo Validation

Goal: Prove no adapter or preset drift remains.
Depends on: All in-scope component phases.
Status: Not started

Tasks:

- [ ] Run stale selector scans.
- [ ] Run full typecheck for contracts and adapters.
- [ ] Run package tests.
- [ ] Run package builds.
- [ ] Run repo map checks.
- [ ] Update parity summary/registry if generated files changed.
- [ ] Do targeted Storybook/browser visual verification for representative components.

Verification:

```bash
rg -n "mw-(input-field|input-otp|accordion-field|switch-field|slider-field|badge-group|tab-group).*\\.mw-p|\\.mw-p" packages/presets/src/firstEdition/molecules packages/presets/src/firstEdition/input-otp.css packages/presets/src/firstEdition/select.css
pnpm test:typecheck:packages
pnpm test:packages
pnpm build:packages
pnpm check:repo-map
pnpm exec biome check .
```

Visual verification:

- [ ] Storybook React representative field examples.
- [ ] Storybook Vue representative field examples.
- [ ] Storybook Svelte representative field examples.
- [ ] Dashboard teaser rows that contain input/select/slider/switch/accordion examples.

---

## 6. Test Strategy

### Principles

- Tests are phase exit criteria, not cleanup.
- Shared contracts define the behavior before adapters are considered complete.
- Contract tests should assert semantic class names and accessibility wiring.
- Adapter-specific tests should cover adapter-only rendering details, not duplicate all shared assertions.
- Preset CSS contracts should reject stale `.mw-p` selectors for updated field surfaces.

### Coverage Map

| Phase | What's Tested | Test Type | Exists? | Path |
|---|---|---|---|---|
| Phase 0 | Candidate discovery scans | Manual/command | No | This guide |
| Phase 1 | Input field labels/helper/error | Shared + adapter + preset | Existing, extend | `tests/contracts/*field.contract.ts`, adapter tests |
| Phase 2 | OTP label/helper/error | Shared + adapter + preset | Existing, extend | `tests/contracts/input-otp.contract.ts` |
| Phase 3 | Accordion field label/description/error | Shared + adapter + preset | Existing, extend | `tests/contracts/accordion.contract.ts` |
| Phase 4 | Switch field label/description/error | Shared + adapter + preset | Existing, extend | `tests/contracts/switch.contract.ts` |
| Phase 5 | Slider field label/description/error/edge values | Shared + adapter + preset | Existing, extend | `tests/contracts/slider.contract.ts` |
| Phase 6 | Badge group legend | Shared + adapter + preset | Existing, extend | `tests/contracts/badge-group.contract.ts` |
| Phase 7 | Tab group label only | Shared + adapter + preset | Existing, extend | `tests/contracts/tab.contract.ts` |
| Phase 8 | Optional non-field descriptions | Decision + tests if in scope | TBD | TBD |
| Phase 9 | Cross-package parity | Full validation | Existing | root scripts |

---

## 7. Failure and Rollback Protocol

| Failure Type | Detection | Action |
|---|---|---|
| Test failure | Targeted Vitest exits non-zero | Fix current component before moving on |
| Type error | Typecheck exits non-zero | Check shared contract types and adapter public props |
| Preset selector miss | CSS contract fails or stale scan finds `.mw-p` | Update preset selectors and add contract assertion |
| Figma ambiguity | Typography token cannot be proven | Stop and ask Niklas with the evidence |
| Svelte provider failure | Text component throws because provider context is missing | Add or update provider-wrapped fixture |
| Adapter drift | React passes but Vue/Svelte differ | Do not mark unit complete; mirror adapter behavior |
| Repeated failure | Same check fails three times | Pause and propose a narrower approach |

---

## 8. Completion Tracker

| Phase | Title | Status | Tests | Validation | Completed |
|---|---|---|---|---|---|
| 0 | Deep Dive Audit | Complete | Manual scans complete | Guide updated | 2026-05-26 |
| 1 | Input Field Family | Complete | Targeted React/Vue/Svelte/presets tests pass | Build/typecheck pass; Svelte has existing warnings only | 2026-05-26 |
| 2 | InputOtp | Complete | Targeted React/Vue/Svelte/presets tests pass | Build/typecheck pass; Svelte has existing warnings only | 2026-05-26 |
| 3 | AccordionField | Complete | Targeted React/Vue/Svelte/presets tests pass | Build/typecheck pass; Svelte has existing warnings only | 2026-05-26 |
| 4 | SwitchField | Complete | Targeted React/Vue/Svelte/presets tests pass | Build/typecheck pass; Svelte has existing warnings only | 2026-05-27 |
| 5 | SliderField | Not started | Not run | Not run | - |
| 6 | BadgeGroup | Not started | Not run | Not run | - |
| 7 | TabGroup Label | Not started | Not run | Not run | - |
| 8 | Optional Review Decisions | Not started | Not run | Not run | - |
| 9 | Final Parity and Repo Validation | Not started | Not run | Not run | - |

---

## 9. Post-Completion Checklist

- [ ] All in-scope phases marked complete.
- [ ] No stale `.mw-p` selectors remain for updated label/caption surfaces.
- [ ] React, Vue, and Svelte behavior is covered by shared contracts.
- [ ] Preset CSS contracts reject stale paragraph selectors.
- [ ] Full package tests pass.
- [ ] Full package builds pass.
- [ ] Typechecks pass.
- [ ] Repo map checks pass or documented unrelated failures exist.
- [ ] Visual verification has been performed for representative components.
- [ ] Follow-up items are documented for any out-of-scope component.
