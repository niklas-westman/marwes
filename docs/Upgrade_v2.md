# Upgrade_v2.md — Net-New Component Backlog

## Overview

`UPGRADE.md` covered the Atom → Molecule → Purpose migration and the Storybook/docs/test structure refresh.

This file is different: it tracks **components and component-level gaps that still are not built yet** when compared against [`.figma/NODE_REFERENCE.md`](./.figma/NODE_REFERENCE.md).

Important clarification:

- All top-level V3 families from the Figma quick reference already exist in the repo: Button, Badge, Tab, Card, Switch, Accordion, Checkbox, Radio, Toast, Input, Divider, and Typography.
- The remaining work is now concentrated in one area inside those families: the final purpose-button wave.
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
| Purpose Buttons | `1371:8933` | `BackButton`, `NextButton`, `MessageButton`, `ShareButton`, `LoginButton`, `LogoutButton`, `HelpButton`, `SettingsButton` | Wave 1 and Wave 2 now ship; remaining work is Wave 3 |
| Input Family | `1364:11372`, `1364:11817` | None | `Textarea`, `TextareaField`, `SelectField`, `DropdownField`, `DateOfBirthField`, and `ZipCodeField` now ship |
| Switch Sizes | `1371:12357`, `1371:12370`, `1371:12383` | None | `Compact`, `Wide`, and `Rich` now ship via the shared `size` API |

## Recommended Build Order

Wave 1 and Wave 2 are complete, and the switch size API now ships. One backlog item remains.

| # | Backlog Item | Effort | Why |
|---|--------------|--------|-----|
| 1 | Purpose Buttons — Wave 3 | Low | `Back`, `Next`, `Message`, `Share`, `Login`, `Logout`, `Help`, `Settings` can land as a final wrapper batch |

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

### 3. Purpose Buttons Expansion

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

### 4. Switch Size API

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
