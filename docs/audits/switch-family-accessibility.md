# Switch Family Accessibility Audit

## Goal
Audit the entire Switch family step by step through the Marwes tree structure.

This audit starts after the Tab pass because Switch combines a low-level custom
widget with field-level wiring and purpose wrappers:
- a raw `Switch` atom rendered as a button-backed `role="switch"`
- `SwitchField` as the standard labeled field composition
- purpose wrappers for common product toggle intents
- React and Vue event-parity expectations for checked-state changes

The main goal is to prove that Marwes ships one intentional switch contract across:
- core checked and naming logic
- field helper wiring
- preset focus, checked, and disabled states
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Switch`

### Molecule
- `SwitchField`

### Purpose variants
- `FeatureToggle`
- `PreferenceSwitch`
- `PermissionSwitch`

## Tree anchors

### Core
- `packages/core/src/components/atoms/switch/index.ts`
- `packages/core/src/components/atoms/switch/switch-types.ts`
- `packages/core/src/components/atoms/switch/switch-a11y.ts`
- `packages/core/src/components/atoms/switch/switch-recipe.ts`
- shared helpers:
  - `packages/core/src/shared/field-helpers.ts`

### Presets
- `packages/presets/src/firstEdition/switch.css`
- `packages/presets/src/firstEdition/molecules/switch-field.css`

### React
- `packages/react/src/components/switch/switch.tsx`
- `packages/react/src/components/switch/switch-field.tsx`
- `packages/react/src/components/switch/variants.tsx`
- tests:
  - `packages/react/src/components/switch/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/switch/Introduction.mdx`
- `apps/storybook-react/src/stories/switch/switch.stories.tsx`
- `apps/storybook-react/src/stories/switch/switch-field.stories.tsx`
- `apps/storybook-react/src/stories/switch/feature-toggle.stories.tsx`
- `apps/storybook-react/src/stories/switch/preference-switch.stories.tsx`
- `apps/storybook-react/src/stories/switch/permission-switch.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/switch/__tests__/`

### Vue
- `packages/vue/src/components/switch/switch.ts`
- `packages/vue/src/components/switch/switch-field.ts`
- `packages/vue/src/components/switch/variants.ts`
- tests:
  - `packages/vue/src/components/switch/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/switch/Introduction.mdx`
- `apps/storybook-vue/src/stories/switch/switch.stories.ts`
- `apps/storybook-vue/src/stories/switch/switch-field.stories.ts`
- `apps/storybook-vue/src/stories/switch/feature-toggle.stories.ts`
- `apps/storybook-vue/src/stories/switch/preference-switch.stories.ts`
- `apps/storybook-vue/src/stories/switch/permission-switch.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/switch/__tests__/`

### Contracts
- add `tests/contracts/switch.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Switch-family requirements in `docs/reference/spec.md`
- [x] confirm the button-backed `role="switch"` model remains intentional in this pass
- [x] confirm the expected disabled-switch policy
- [x] confirm whether public docs need stronger guidance about direct `Switch` naming paths

### 1. Core audit

#### 1A. Switch atom
- [x] review `switch-types.ts`
- [x] review `switch-a11y.ts`
- [x] review `switch-recipe.ts`
- [x] verify `role="switch"`, `aria-checked`, and disabled behavior are intentional
- [x] verify accessible-name inputs are explicit for direct switch usage

#### 1B. Shared field helpers
- [x] review `buildSwitchFieldA11yIds()` in `field-helpers.ts`
- [x] verify label, description, and error ids merge correctly into `aria-describedby`
- [x] verify the helper matches the shipped field contract in both adapters

### 2. Preset CSS audit
- [x] review `switch.css` for focus-visible, checked, unchecked, hover, and disabled states
- [x] review `molecules/switch-field.css` for label, description, error, and disabled styling
- [x] confirm checked-state visuals align with semantic checked state
- [x] confirm disabled-state visuals align with actual disabled behavior
- [x] confirm focus remains obvious on the switch track in both themes

### 3. React adapter audit

#### 3A. Atom and field
- [x] review `switch.tsx`
- [x] review `switch-field.tsx`
- [x] verify core a11y output is applied directly and completely
- [x] verify checked-state callbacks and disabled behavior
- [x] verify `SwitchField` forces the visible-label path instead of relying on ad hoc `ariaLabel`

#### 3B. Purpose variants
- [x] review `variants.tsx`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm purpose metadata does not weaken naming or description wiring

### 4. React stories and tests audit
- [x] review `apps/storybook-react/src/stories/switch/Introduction.mdx`
- [x] review React switch stories for checked, disabled, description, and error coverage
- [x] review `apps/storybook-react/src/stories/switch/__tests__/`
- [x] review `packages/react/src/components/switch/__tests__/`
- [x] confirm docs teach the right boundary between `SwitchField` and raw `Switch`

### 5. Vue adapter audit

#### 5A. Atom and field
- [x] review `switch.ts`
- [x] review `switch-field.ts`
- [x] verify core a11y output is applied directly and completely
- [x] verify checked-state callbacks, `update:modelValue`, and disabled behavior
- [x] verify `SwitchField` preserves the same naming and description contract as React

#### 5B. Purpose variants
- [x] review `variants.ts`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm Vue event ergonomics do not change the accessibility contract

### 6. Vue stories and tests audit
- [x] review `apps/storybook-vue/src/stories/switch/Introduction.mdx`
- [x] review Vue switch stories for checked, disabled, description, and error coverage
- [x] review `apps/storybook-vue/src/stories/switch/__tests__/`
- [x] review `packages/vue/src/components/switch/__tests__/`
- [x] confirm Vue docs teach the same contract and boundaries as React docs

### 7. Shared contracts and gaps
- [x] add `tests/contracts/switch.contract.ts`
- [x] wire the shared switch contract into both React and Vue adapter tests
- [x] verify the contract covers checked state, disabled behavior, and field wiring
- [x] add local React/Vue variant tests for purpose metadata

### 8. Expected decisions from this audit
This Switch-family audit should ideally end with clear answers to these questions:

- [x] Is the button-backed `role="switch"` model still the intended Marwes baseline?
- [x] What exact checked-change contract should React and Vue both guarantee?
- [x] Should switch error text remain described-by-only without `aria-invalid`?
- [ ] Which Switch-family stories should later be part of automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned switch a11y shape
- shared field-helper wiring for `SwitchField`
- strong React/Vue parity across the family
- Storybook separation between purpose wrappers, `SwitchField`, and raw `Switch`

### Risks to resolve or document
- missing explicit Switch-family requirement in `docs/reference/spec.md`
- missing shared switch contract for React/Vue parity
- field wiring being implied by implementation rather than proved by shared tests
- shallow local adapter coverage for purpose wrappers
- any drift between Storybook claims and what contracts actually prove

### Deliverables expected from the Switch audit
- one clear statement of the shipped switch contract
- one shared `switch` contract for React and Vue
- proof for checked, disabled, label, description, and error wiring behavior
- doc updates wherever public guidance is ahead of proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and tests.

### What looks good right now

#### 1. Core keeps the atom contract intentionally small
Confirmed in:
- `packages/core/src/components/atoms/switch/switch-types.ts`
- `packages/core/src/components/atoms/switch/switch-a11y.ts`
- `packages/core/src/components/atoms/switch/switch-recipe.ts`

Good signals:
- the switch role and checked state live in core
- the accessible-name inputs are explicit (`ariaLabel`, `ariaLabelledby`, `ariaDescribedBy`)
- the render kit stays small and adapter-friendly
- size, checked, and disabled styling hooks are centralized in one recipe

#### 2. Shared field wiring is already in the right place
Confirmed in:
- `packages/core/src/shared/field-helpers.ts`
- `packages/react/src/components/switch/switch-field.tsx`
- `packages/vue/src/components/switch/switch-field.ts`

Good signals:
- `buildSwitchFieldA11yIds()` owns the field-level id generation
- both adapters force the visible label path by assigning `ariaLabelledby`
- description and error text merge into `aria-describedby`
- the field wrapper prevents ad hoc direct naming from bypassing the intended contract

#### 3. React and Vue parity is strong across the main switch path
Confirmed in:
- `packages/react/src/components/switch/*`
- `packages/vue/src/components/switch/*`
- mirrored Storybook trees in both apps

Good signals:
- both adapters use the same core switch recipe
- both adapters expose purpose wrappers and field wrappers
- both Storybooks teach the same family layering and size API
- Vue keeps idiomatic `v-model` support without changing the base semantics

#### 4. Preset coverage is split in a healthy way
Confirmed in:
- `packages/presets/src/firstEdition/switch.css`
- `packages/presets/src/firstEdition/molecules/switch-field.css`

Good signals:
- atom states and field layout are not conflated
- focus-visible styling lives on the interactive track itself
- checked, unchecked, and disabled visuals are explicit
- field-level description and error treatment has dedicated styling hooks

### Confirmed risks and gaps

#### Risk 1. The Switch-family contract was not explicit in `docs/reference/spec.md`
Confirmed in:
- `docs/reference/spec.md`
- current switch implementation and Storybook docs

Current state before follow-up fix:
- I did not find a switch-specific spec requirement in `docs/reference/spec.md`
- the family contract was mostly taught through implementation and Storybook docs

Status after follow-up fix:
- added `REQ-SWITCH-001` to `docs/reference/spec.md`
- the spec now records the button-backed switch model, disabled behavior, field wiring, and shared-contract expectation explicitly

#### Risk 2. There was no shared `tests/contracts/switch.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/switch/__tests__/`
- `packages/vue/src/components/switch/__tests__/`

Current state before follow-up fix:
- local tests covered size classes and disabled behavior only
- there was no shared React/Vue proof for the switch family’s semantics

Status after follow-up fix:
- added `tests/contracts/switch.contract.ts`
- wired the contract into both React and Vue switch tests
- the shared contract now proves checked state, callback behavior, disabled behavior, label wiring, description wiring, and error wiring

#### Risk 3. Field-level accessibility wiring was real but under-proven
Confirmed in:
- `packages/react/src/components/switch/switch-field.tsx`
- `packages/vue/src/components/switch/switch-field.ts`
- prior local adapter tests

Current state before follow-up fix:
- the implementation already used `ariaLabelledby` and merged `aria-describedby`
- but there was no shared contract proving that path directly

Status after follow-up fix:
- the shared contract now asserts visible-label naming for `SwitchField`
- the shared contract now asserts description and error ids appear in `aria-describedby`
- the contract also records that switch error text does not imply `aria-invalid`

#### Risk 4. Purpose wrappers had no package-level test coverage
Confirmed in:
- `packages/react/src/components/switch/variants.tsx`
- `packages/vue/src/components/switch/variants.ts`
- package test trees before follow-up fix

Current state before follow-up fix:
- purpose wrappers existed and Storybook taught them
- I did not find package-level tests proving their `data-purpose` metadata

Status after follow-up fix:
- added local React and Vue variant tests
- package tests now prove `FeatureToggle`, `PreferenceSwitch`, and `PermissionSwitch` preserve accessible naming while attaching stable purpose metadata

#### Risk 5. Direct raw-switch naming paths are still only partially exercised
Confirmed in:
- `packages/react/src/components/switch/switch.tsx`
- `packages/vue/src/components/switch/switch.ts`
- current local and shared tests

Current state before follow-up fix:
- shared coverage proved the `ariaLabel` path for raw `Switch`
- `SwitchField` proved the `ariaLabelledby` path through visible labels
- raw `Switch` naming from inline visible child content was only implied by browser semantics and Storybook examples

Status after follow-up fix:
- added local React and Vue tests proving direct raw `Switch` usage is named by visible child content
- Vue introduction docs now match React in spelling out direct raw-switch naming and described-by responsibilities
- direct raw `aria-labelledby` usage is still documented but not separately asserted in package tests

#### Risk 6. Vue parity callback proof is narrower than the full dual-support intent
Confirmed in:
- `packages/vue/src/components/switch/switch.ts`
- `packages/vue/src/components/switch/switch-field.ts`
- `packages/vue/src/components/switch/__tests__/switch.test.ts`

Current state:
- the shared contract proves Vue's `update:modelValue` path for checked-state updates
- I observed overlap between parity-style `onCheckedChange` naming and Vue event-listener conventions when trying to use a direct parity callback in the shared harness
- this does not currently block the accessibility contract, but it does mean the exact Vue dual-support callback semantics deserve a separate follow-up pass

### Likely decisions coming out of this audit

#### Decision A — Keep the button-backed switch model explicit
Reasoning from the first pass:
- both adapters already ship a button-backed `role="switch"` model
- the family is already built around `aria-checked`, not input `checked`
- the important thing is to document and test that model clearly rather than let it remain implicit

#### Decision B — Keep `SwitchField` as the canonical labeling path
Reasoning from the first pass:
- `SwitchField` already forces the visible-label path intentionally
- this is stronger than relying on consumers to compose `ariaLabelledby` correctly each time
- the field wrapper is the right place to guarantee label, description, and error wiring

#### Decision C — Keep switch error text as described-by support, not invalid semantics
Reasoning from the first pass:
- the current family links error text into `aria-describedby`
- it does not apply `aria-invalid`, which is consistent with the button-backed switch model
- this should remain a deliberate policy unless the component model changes later

### Recommended first fixes from the Switch audit

#### Fix 1 — Add the shared contract and wire it in both adapters
Files:
- `tests/contracts/switch.contract.ts`
- `packages/react/src/components/switch/__tests__/switch.test.tsx`
- `packages/vue/src/components/switch/__tests__/switch.test.ts`

#### Fix 2 — Record the Switch-family contract in the spec
Files:
- `docs/reference/spec.md`
- `docs/audits/switch-family-accessibility.md`

#### Fix 3 — Add package-level purpose-wrapper proof
Files:
- `packages/react/src/components/switch/__tests__/variants.test.tsx`
- `packages/vue/src/components/switch/__tests__/variants.test.ts`

### Recommended execution order inside the Switch family

1. record the intended switch contract in the spec
2. add the shared `switch` contract
3. wire the contract into React and Vue adapter tests
4. add local purpose-wrapper tests
5. run targeted verification and record the next findings in this doc
