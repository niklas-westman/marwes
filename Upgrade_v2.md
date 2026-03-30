# Upgrade_v2.md — Net-New Component Backlog

## Overview

`UPGRADE.md` covered the Atom → Molecule → Purpose migration and the Storybook/docs/test structure refresh.

This file is different: it tracks **components and component-level gaps that still are not built yet** when compared against [`.figma/NODE_REFERENCE.md`](./.figma/NODE_REFERENCE.md).

Important clarification:

- All top-level V3 families from the Figma quick reference already exist in the repo: Button, Badge, Tab, Card, Switch, Accordion, Checkbox, Radio, Toast, Input, Divider, and Typography.
- The remaining work is inside those families: missing purpose wrappers, missing field types, one missing group component, and one missing size system.

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
- `Cancel` → `CancelButton`
- `Create` → `CreateButton`
- `Delete` → `DangerButton`
- `Link` → `LinkButton`

## Missing Component Inventory

| Area | Figma Reference | Missing Components / Gaps | Notes |
| ---- | --------------- | ------------------------- | ----- |
| Purpose Buttons | `1371:8933` | `SaveButton`, `ConfirmButton`, `VerifyButton`, `EditButton`, `UploadButton`, `DownloadButton`, `CopyButton`, `SearchButton`, `FilterButton`, `SortButton`, `DropdownButton`, `BackButton`, `NextButton`, `MessageButton`, `ShareButton`, `LoginButton`, `LogoutButton`, `HelpButton`, `SettingsButton`, `CloseButton`, `RefreshButton` | Current repo only ships a small subset of Figma's 25 purpose buttons |
| Input Family | `1364:11372`, `1364:11817` | `Textarea`, `TextareaField`, `DateOfBirthField`, `ZipCodeField`, `DropdownField`, `SelectField` | `SearchField`, `PasswordField`, `PhoneField`, and base text input already exist |
| Checkbox Group | `1369:4673` | `CheckboxGroupField` | Figma includes a labeled group with helper/error text and vertical checkbox list |
| Switch Sizes | `1371:12357`, `1371:12370`, `1371:12383` | Size API for `Compact`, `Wide`, `Rich` | Current implementation only covers the 24×16 / 12px switch |

## Recommended Build Order

Build one backlog item at a time. Fully complete it before moving on.

| # | Backlog Item | Effort | Why |
|---|--------------|--------|-----|
| 1 | `CheckboxGroupField` | Medium | Entirely missing molecule with clear Figma reference and no API overlap risk |
| 2 | `Textarea` + `TextareaField` | Medium | Biggest missing input type and likely foundation for other multiline cases |
| 3 | `SelectField` | Medium / High | New control family with its own interaction model |
| 4 | `DropdownField` | Medium / High | Likely shares work with select, so build after select primitives settle |
| 5 | `DateOfBirthField` | Medium | Missing Figma field variant; can reuse input-field structure |
| 6 | `ZipCodeField` | Low / Medium | Small purpose field once input-family additions are in place |
| 7 | Purpose Buttons — Wave 1 | Low | `Save`, `Confirm`, `Verify`, `Edit`, `Close`, `Refresh` are small wrappers with high everyday value |
| 8 | Purpose Buttons — Wave 2 | Low | `Upload`, `Download`, `Copy`, `Search`, `Filter`, `Sort`, `Dropdown` share the same wrapper pattern |
| 9 | Purpose Buttons — Wave 3 | Low | `Back`, `Next`, `Message`, `Share`, `Login`, `Logout`, `Help`, `Settings` can land as a final wrapper batch |
| 10 | Switch size API | Medium | Real Figma gap, but lower leverage than the missing components above |

## Per-Item Plans

### 1. CheckboxGroupField

**Status:** Not started.

**Goal:** Add the missing checkbox-list molecule shown in Figma node `1369:4673`.

| Layer | Files / Work |
| ----- | ------------ |
| Core | Add a11y helpers for group label / description / error wiring if current checkbox helpers are too narrow |
| React | Add `checkbox-group-field.tsx` with controlled/uncontrolled checked-value handling |
| Vue | Mirror React API and behavior |
| Presets | Add molecule CSS or extend existing checkbox-field CSS intentionally |
| Stories | Atom remains as-is; add molecule stories for default, helper, error, disabled, indeterminate parent checkbox if relevant |
| Tests | Add adapter tests plus Storybook taxonomy/docs tests |
| Exports | Add to `packages/react/src/index.ts` and `packages/vue/src/index.ts` |

### 2. Input Family Expansion

**Status:** Not started.

These should be handled as separate backlog items, but under one shared input-family track.

#### 2a. Textarea + TextareaField

- Add a textarea-capable core recipe or a dedicated textarea recipe
- Mirror the current `Input` / `InputField` architecture
- Add React + Vue adapters, stories, docs, tests, exports

#### 2b. SelectField

- Decide whether this is native `<select>` first or a custom trigger/listbox abstraction
- Match the Figma `Select` presentation from `1364:11817`
- Ship React + Vue parity, docs, tests, exports

#### 2c. DropdownField

- Confirm whether this is a field-wrapped trigger variant distinct from `SelectField`
- Reuse select/listbox infrastructure if possible
- Ship only after the API boundary between `DropdownField` and `SelectField` is explicit

#### 2d. DateOfBirthField

- Decide whether this should be native date input, masked text input, or segmented input
- Keep the first implementation low-regret and Figma-aligned
- Ship as a purpose field built on the settled input-family primitives

#### 2e. ZipCodeField

- Add country/format assumptions explicitly
- Default to a simple text/numeric field unless a stricter format requirement is confirmed in Figma or product usage

### 3. Purpose Buttons Expansion

**Status:** Partially built.

**Already covered:** `SubmitButton`, `CancelButton`, `CreateButton`, `DangerButton`, `LinkButton`, `SuccessButton`, plus the visual wrappers.

**Still missing from Figma purpose set:**

- `SaveButton`
- `ConfirmButton`
- `VerifyButton`
- `EditButton`
- `UploadButton`
- `DownloadButton`
- `CopyButton`
- `SearchButton`
- `FilterButton`
- `SortButton`
- `DropdownButton`
- `BackButton`
- `NextButton`
- `MessageButton`
- `ShareButton`
- `LoginButton`
- `LogoutButton`
- `HelpButton`
- `SettingsButton`
- `CloseButton`
- `RefreshButton`

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

**Status:** Not started.

**Goal:** Match the three Figma sizes:

- `Compact` — `1371:12357`
- `Wide` — `1371:12370`
- `Rich` — `1371:12383`

**Plan**

| Layer | Files / Work |
| ----- | ------------ |
| Core | Add `size` to switch options/types |
| Presets | Add size-specific track/thumb dimensions and translation distances |
| React | Pass `size` through and expose it in stories |
| Vue | Mirror React API |
| Stories | Add size comparison story in both frameworks |
| Tests | Recipe + adapter coverage for size classnames / DOM output |

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
