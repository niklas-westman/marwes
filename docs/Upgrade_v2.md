# Upgrade_v2.md — Net-New Component Backlog

## Overview

`UPGRADE.md` covered the Atom → Molecule → Purpose migration and the Storybook/docs/test structure refresh.

This file is different: it tracks **components and component-level gaps that still are not built yet** when compared against [`.figma/NODE_REFERENCE.md`](./.figma/NODE_REFERENCE.md).

Important clarification:

- All top-level V3 families from the Figma quick reference already exist in the repo: Button, Badge, Tab, Card, Switch, Accordion, Checkbox, Radio, Toast, Input, Divider, and Typography.
- The remaining work is concentrated in component-level gaps inside those families: a new rich-text input track and the final purpose-button wave.
- Already shipped from this backlog: `CheckboxGroupField`, `Textarea`, `TextareaField`, `SelectField`, `DropdownField`, `DateOfBirthField`, `ZipCodeField`, Purpose Buttons Wave 1 (`SaveButton`, `ConfirmButton`, `VerifyButton`, `EditButton`, `CloseButton`, `RefreshButton`), Purpose Buttons Wave 2 (`UploadButton`, `DownloadButton`, `CopyButton`, `SearchButton`, `FilterButton`, `SortButton`, `DropdownButton`), and the switch size API (`Compact`, `Wide`, `Rich`).

## What Is Already Covered

These are already represented in code and do **not** belong in this backlog:

- Button atom
- Badge
- Tab
- Card
- Switch
- Accordion
- Checkbox atom + CheckboxField
- Radio atom + RadioGroupField
- Toast
- Input atom + InputField + current field variants
- Divider
- Heading / Paragraph / Icon

Existing purpose-button coverage already maps these Figma intents:

- `Submit` → `SubmitButton`
- `Save` → `SaveButton`
- `Cancel` → `CancelButton`
- `Confirm` → `ConfirmButton`
- `Verify` → `VerifyButton`
- `Create` → `CreateButton`
- `Edit` → `EditButton`
- `Upload` → `UploadButton`
- `Download` → `DownloadButton`
- `Copy` → `CopyButton`
- `Search` → `SearchButton`
- `Filter` → `FilterButton`
- `Sort` → `SortButton`
- `Dropdown` → `DropdownButton`
- `Delete` → `DangerButton`
- `Link` → `LinkButton`
- `Close` → `CloseButton`
- `Refresh` → `RefreshButton`

## Missing Component Inventory

| Area | Figma Reference | Missing Components / Gaps | Notes |
| ---- | --------------- | ------------------------- | ----- |
| Input Family | `1364:7662`, `1364:7696` | `RichText`, `RichTextField` | New rich-text editing track. Use `Text field` (`.figma/marwes/components/text-field.json`) and `Text area` (`.figma/marwes/components/text-area.json`) as the current visual baselines until a dedicated rich-text node is added. Do not retrofit `Textarea` / `TextareaField`; keep plain text and rich text as separate public components. |
| Purpose Buttons | `1371:8933` | `BackButton`, `NextButton`, `MessageButton`, `ShareButton`, `LoginButton`, `LogoutButton`, `HelpButton`, `SettingsButton` | Wave 1 and Wave 2 now ship; remaining work is Wave 3 |
| Input Family | `1364:11372`, `1364:11817` | None for plain-text controls | `Textarea`, `TextareaField`, `SelectField`, `DropdownField`, `DateOfBirthField`, and `ZipCodeField` now ship |
| Switch Sizes | `1371:12357`, `1371:12370`, `1371:12383` | None | `Compact`, `Wide`, and `Rich` now ship via the shared `size` API |

## Recommended Build Order

Wave 1 and Wave 2 are complete, and the switch size API now ships. Two backlog items remain.

| # | Backlog Item | Effort | Why |
|---|--------------|--------|-----|
| 1 | Input Family — `RichText` + `RichTextField` | High | Adds a new atom + molecule pair for inline formatting while preserving `Textarea` as the plain-text control. This requires full core/presets/React/Vue/Storybook/test/export work. |
| 2 | Purpose Buttons — Wave 3 | Low | `Back`, `Next`, `Message`, `Share`, `Login`, `Logout`, `Help`, `Settings` can land as a final wrapper batch |

## Per-Item Plans

### 1. CheckboxGroupField

**Status:** Complete.

**Goal:** Add the missing checkbox-list molecule shown in Figma node `1369:4673`.

`CheckboxGroupField` now ships in React and Vue with stories, tests, and package exports.

### 2. Input Family Expansion

**Status:** Complete.

These were handled as separate backlog items under one shared input-family track.

#### 2a. Textarea + TextareaField

**Status:** Complete.

- `Textarea` and `TextareaField` now ship in React and Vue with stories, docs, tests, and exports

#### 2b. SelectField

**Status:** Complete.

- `SelectField` now ships in React and Vue with native and Marwes-custom select support, plus stories, docs, tests, and exports

#### 2c. DropdownField

**Status:** Complete.

- `DropdownField` now ships as a semantic wrapper around `SelectField`
- The API boundary is explicit: `SelectField` remains the generic field-wrapped select, while `DropdownField` defaults `select.native` to `false` for the Marwes/Figma dropdown treatment and allows `select.native={true}` as an opt-out
- Reuse the existing `SelectField` infrastructure, including the custom Marwes trigger/listbox path for non-native mode, instead of introducing a separate public stack

#### 2d. DateOfBirthField

**Status:** Complete.

- `DateOfBirthField` ships as a low-regret native date field with `autoComplete="bday"` and shared input-field semantics across React and Vue

#### 2e. ZipCodeField

**Status:** Complete.

- `ZipCodeField` ships as a low-regret purpose field built on `InputField`
- Current contract keeps `type="text"` to preserve leading zeros, uses `inputMode="numeric"` for mobile keyboards, and sets `autoComplete="postal-code"`

### 3. Input Family — RichText + RichTextField

**Status:** Proposed.

**Goal:** Add a textarea-like rich text editor with an inline toolbar for `bold`, `italic`, and `underline`, while keeping `Textarea` and `TextareaField` as plain-text controls.

**Architecture rule:** This must follow the same Marwes layer flow as `UPGRADE.md` and `CLAUDE.md`:

```text
core recipe → preset CSS → React adapter → React stories/docs/tests → Vue adapter → Vue stories/docs/tests → exports
```

**Public API boundary**

- Add a new atom: `RichText`
- Add a new molecule: `RichTextField`
- Do **not** change `Textarea` / `TextareaField` into rich text editors
- Keep Storybook taxonomy aligned with the Input family:
  - `Input/Atom/RichText`
  - `Input/Molecule/RichTextField`

**Recommended value model**

- MVP value format: HTML string
- Allowed formatting actions: `bold`, `italic`, `underline`
- Keep the emitted HTML subset intentionally small and well-defined for the first release

**Placement plan**

| Layer | Files / Work |
| ----- | ------------ |
| Core | `packages/core/src/components/atoms/input/rich-text-types.ts`, `rich-text-a11y.ts`, `rich-text-styles.ts`, `rich-text-recipe.ts`, and exports from `packages/core/src/components/atoms/input/index.ts`, `packages/core/src/components/atoms/index.ts`, `packages/core/src/index.ts` |
| Core shared helpers | Add `buildRichTextFieldA11yIds()` to `packages/core/src/shared/field-helpers.ts` so non-native editor labelling can use `aria-labelledby` + merged `aria-describedby` instead of textarea-style `htmlFor` only |
| Presets | `packages/presets/src/firstEdition/rich-text.css`, optional `packages/presets/src/firstEdition/molecules/rich-text-field.css`, and import updates in `packages/presets/src/firstEdition/styles.css` |
| React atom | `packages/react/src/components/input/rich-text.tsx` |
| React molecule | `packages/react/src/components/input/rich-text-field.tsx` |
| React tests | `packages/react/src/components/input/__tests__/rich-text.test.tsx`, `rich-text-field.test.tsx` |
| React stories | `apps/storybook-react/src/stories/input/rich-text.stories.tsx`, `rich-text-field.stories.tsx`, plus `Introduction.mdx` and taxonomy/docs tests |
| Vue atom | `packages/vue/src/components/input/rich-text.ts` |
| Vue molecule | `packages/vue/src/components/input/rich-text-field.ts` |
| Vue tests | `packages/vue/src/components/input/__tests__/rich-text.test.ts`, `rich-text-field.test.ts` |
| Vue stories | `apps/storybook-vue/src/stories/input/rich-text.stories.ts`, `rich-text-field.stories.ts`, plus `Introduction.mdx` and taxonomy/docs tests |
| Shared contracts | `tests/contracts/rich-text.contract.ts`, `tests/contracts/rich-text-field.contract.ts` |
| Core docs-copy | Extend `packages/core/src/storybook/docs-copy.ts` with `RichText` / `RichTextField` guidance so Input introductions can stay data-driven |
| Package deps | Add the editor runtime only in adapters (`packages/react/package.json`, `packages/vue/package.json`), not in `@marwes-ui/core` |
| Root exports | Update `packages/react/src/index.ts`, `packages/vue/src/index.ts` |

**Execution checklist**

### 3a. Research + Spec
- [x] Use `Text field` (`1364:7662`) and `Text area` (`1364:7696`) as the current visual baselines from `.figma/marwes/components/text-field.json` and `.figma/marwes/components/text-area.json`
- [ ] Add a dedicated rich-text Figma node/reference later if design diverges beyond the shared input/textarea shell
- [ ] Add a formal requirement to `docs/SPEC.md`
- [ ] Record the API boundary explicitly: `Textarea` remains plain text, `RichText` is a separate component pair
- [ ] Confirm the stored value format for MVP (`HTML string`) and the allowed tag subset

### 3b. Core
- [ ] Add `rich-text-types.ts`
- [ ] Add `rich-text-a11y.ts`
- [ ] Add `rich-text-styles.ts`
- [ ] Add `rich-text-recipe.ts`
- [ ] Export rich text types/recipe from the core barrels
- [ ] Add `buildRichTextFieldA11yIds()` to `field-helpers.ts`
- [ ] Add any shared formatting metadata needed by Storybook/docs (`bold`, `italic`, `underline` labels/icons)

### 3c. Presets
- [ ] Add `packages/presets/src/firstEdition/rich-text.css`
- [ ] Add `packages/presets/src/firstEdition/molecules/rich-text-field.css` only if the shared field wrapper CSS is not sufficient
- [ ] Import new CSS from `packages/presets/src/firstEdition/styles.css`
- [ ] Cover default, hover, focus, invalid, disabled, and read-only states
- [ ] Style toolbar buttons, active formatting state, and the editor content surface

### 3d. React adapter
- [ ] Add `packages/react/src/components/input/rich-text.tsx`
- [ ] Add `packages/react/src/components/input/rich-text-field.tsx`
- [ ] Export both from `packages/react/src/components/input/index.ts`
- [ ] Export both from `packages/react/src/index.ts`
- [ ] Keep the adapter thin: editor wiring belongs in the adapter, but state metadata and a11y contracts come from core

### 3e. React Storybook + tests
- [ ] Add `apps/storybook-react/src/stories/input/rich-text.stories.tsx`
- [ ] Add `apps/storybook-react/src/stories/input/rich-text-field.stories.tsx`
- [ ] Update `apps/storybook-react/src/stories/input/Introduction.mdx`
- [ ] Update `apps/storybook-react/src/stories/input/__tests__/input-taxonomy.test.ts`
- [ ] Update `apps/storybook-react/src/stories/input/__tests__/input-introduction-docs.test.ts`
- [ ] Add React adapter tests for toolbar actions, controlled value flow, disabled/read-only handling, and field-level a11y wiring

### 3f. Vue adapter
- [ ] Add `packages/vue/src/components/input/rich-text.ts`
- [ ] Add `packages/vue/src/components/input/rich-text-field.ts`
- [ ] Export both from `packages/vue/src/components/input/index.ts`
- [ ] Export both from `packages/vue/src/index.ts`
- [ ] Keep the Vue public API aligned with React while preserving Vue event ergonomics

### 3g. Vue Storybook + tests
- [ ] Add `apps/storybook-vue/src/stories/input/rich-text.stories.ts`
- [ ] Add `apps/storybook-vue/src/stories/input/rich-text-field.stories.ts`
- [ ] Update `apps/storybook-vue/src/stories/input/Introduction.mdx`
- [ ] Update `apps/storybook-vue/src/stories/input/__tests__/input-taxonomy.test.ts`
- [ ] Update `apps/storybook-vue/src/stories/input/__tests__/input-introduction-docs.test.ts`
- [ ] Add Vue adapter tests for toolbar actions, controlled value flow, disabled/read-only handling, and field-level a11y wiring

### 3h. Finish + verify
- [ ] Add a changeset
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test`
- [ ] Run `pnpm lint`
- [ ] Do a Storybook manual pass in both frameworks before marking the backlog item complete

**Definition of done for this item**

Do not mark `RichText` / `RichTextField` complete until:
- core contract exists
- preset CSS ships
- React atom + molecule ship
- Vue atom + molecule ship
- both Storybooks include atom + molecule stories
- Input Introduction docs mention the new pair and when to use them vs `Textarea`
- shared contracts exist
- root exports are updated
- a changeset exists

### 4. Purpose Buttons Expansion

**Status:** Partially built. Waves 1 and 2 are complete.

**Already covered:** `SubmitButton`, `SaveButton`, `CancelButton`, `ConfirmButton`, `VerifyButton`, `CreateButton`, `EditButton`, `DangerButton`, `LinkButton`, `CloseButton`, `RefreshButton`, `SuccessButton`, plus the visual wrappers.

**Completed in Wave 1:**

- `SaveButton`
- `ConfirmButton`
- `VerifyButton`
- `EditButton`
- `CloseButton`
- `RefreshButton`

These now ship in React and Vue with stories, docs, tests, and root exports.

**Completed in Wave 2:**

**Status:** Complete.

- `UploadButton`
- `DownloadButton`
- `CopyButton`
- `SearchButton`
- `FilterButton`
- `SortButton`
- `DropdownButton`

These now ship in React and Vue with stories, docs, tests, and root exports.

**Still missing from Figma purpose set:**

- `BackButton`
- `NextButton`
- `MessageButton`
- `ShareButton`
- `LoginButton`
- `LogoutButton`
- `HelpButton`
- `SettingsButton`

**Shared implementation pattern**

| Layer | Files / Work |
| ----- | ------------ |
| Core | Extend `ButtonAction` only where a real new semantic action is needed |
| React | Add wrapper components in `packages/react/src/components/button/variants.tsx` |
| Vue | Mirror wrappers in `packages/vue/src/components/button/variants.ts` |
| Stories | Add one story file per new wrapper only if it adds real value; otherwise use grouped stories by wave |
| Core docs | Expand Storybook docs-copy and button Introduction docs so the new purpose set is visible |
| Tests | Adapter export tests, targeted behavior tests for any wrapper with custom icon/action defaults |
| Exports | Update package barrel exports |

**Rule:** keep wrappers thin. No wrapper should introduce new button behavior unless Figma or semantics require it.

### 5. Switch Size API

**Status:** Complete.

**Goal:** Match the three Figma sizes:

- `Compact` — `1371:12357`
- `Wide` — `1371:12370`
- `Rich` — `1371:12383`

The size API now ships in React and Vue with preset CSS, stories, tests, and root exports.

**Delivered**

| Layer | Files / Work |
| ----- | ------------ |
| Core | `size` now exists in switch options/types and maps to stable modifier classes |
| Presets | Size-specific track/thumb dimensions and translation distances now ship |
| React | `size` passes through and is documented in stories |
| Vue | Mirrors the React API |
| Stories | Size comparison story now exists in both frameworks |
| Tests | Recipe + adapter coverage now verifies size classnames / DOM output |

## Cross-Cutting Rules

- React and Vue stay in parity
- If a new molecule is added, preset CSS must ship with it
- Storybook titles must stay consistent with the existing migration pattern
- Any new purpose component must appear in docs, tests, and package exports
- Prefer shared primitives over one-off wrappers
- Avoid adding a large abstraction layer unless two or more backlog items clearly need it

## Definition Of Done

Do not mark a backlog item complete until all of this is true:

- Core contract exists or is intentionally unchanged
- Preset CSS exists where needed
- React implementation ships
- Vue implementation ships
- Storybook stories and `Introduction.mdx` are updated where needed
- Tests cover the new public API
- Root package exports are updated

## Verification

After each backlog item:

```bash
pnpm typecheck
pnpm test
pnpm lint
```
