# Slider Family Accessibility Audit

## Goal
Audit the entire Slider family step by step through the Marwes tree structure.

This audit starts after the Tooltip pass because Slider is the next queued
high-risk family in `AXE_ROADMAP.md`:
- a low-level `Slider` atom built on a native range input
- a higher-level `SliderField` composition for visible labels, description, and errors
- purpose wrappers for common slider meanings
- tooltip and touch-area visuals that must stay aligned with native slider semantics

The main goal is to prove that Marwes ships one intentional slider contract across:
- core slider metadata and field-helper wiring
- preset focus, disabled, tooltip, and touch-area styling
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Slider`

### Molecule
- `SliderField`

### Purpose variants
- `VolumeSlider`
- `BrightnessSlider`
- `RadiusSlider`

## Tree anchors

### Core
- `packages/core/src/components/atoms/slider/index.ts`
- `packages/core/src/components/atoms/slider/slider-types.ts`
- `packages/core/src/components/atoms/slider/slider-a11y.ts`
- `packages/core/src/components/atoms/slider/slider-recipe.ts`
- shared helpers:
  - `packages/core/src/shared/field-helpers.ts`

### Presets
- `packages/presets/src/firstEdition/slider.css`
- `packages/presets/src/firstEdition/molecules/slider-field.css`

### React
- `packages/react/src/components/slider/slider.tsx`
- `packages/react/src/components/slider/slider-field.tsx`
- `packages/react/src/components/slider/variants.tsx`
- tests:
  - `packages/react/src/components/slider/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/slider/Introduction.mdx`
- `apps/storybook-react/src/stories/slider/slider.stories.tsx`
- `apps/storybook-react/src/stories/slider/slider-field.stories.tsx`
- `apps/storybook-react/src/stories/slider/volume-slider.stories.tsx`
- `apps/storybook-react/src/stories/slider/brightness-slider.stories.tsx`
- `apps/storybook-react/src/stories/slider/radius-slider.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/slider/__tests__/`

### Vue
- `packages/vue/src/components/slider/slider.ts`
- `packages/vue/src/components/slider/slider-field.ts`
- `packages/vue/src/components/slider/variants.ts`
- tests:
  - `packages/vue/src/components/slider/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/slider/Introduction.mdx`
- `apps/storybook-vue/src/stories/slider/slider.stories.ts`
- `apps/storybook-vue/src/stories/slider/slider-field.stories.ts`
- `apps/storybook-vue/src/stories/slider/volume-slider.stories.ts`
- `apps/storybook-vue/src/stories/slider/brightness-slider.stories.ts`
- `apps/storybook-vue/src/stories/slider/radius-slider.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/slider/__tests__/`

### Contracts
- add `tests/contracts/slider.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Slider-family requirements in `docs/reference/spec.md`
- [x] make `SliderField` the explicit canonical labeled slider path
- [x] confirm tooltip and touch-area affordances stay visual and do not replace native slider semantics
- [x] confirm public docs need a clearer note that `showTooltip` is visual-only

### 1. Core audit

#### 1A. Slider atom
- [x] review `slider-types.ts`
- [x] review `slider-a11y.ts`
- [x] review `slider-recipe.ts`
- [x] verify native range semantics remain intentional
- [x] verify range normalization and value clamping are explicit in core

#### 1B. Shared field helpers
- [x] review `buildSliderFieldA11yIds()` in `field-helpers.ts`
- [x] verify label, description, and error ids merge correctly into `aria-describedby`
- [x] verify the helper matches the shipped field contract in both adapters

### 2. Preset CSS audit
- [x] review `slider.css` for focus-visible, hover, pressed, disabled, tooltip, and touch-area states
- [x] review `molecules/slider-field.css` for label, description, error, and disabled styling
- [x] confirm focus remains obvious on the native slider thumb treatment
- [x] confirm tooltip and touch-area visuals align with state hooks rather than replacing semantics
- [x] confirm disabled visuals align with native disabled behavior

### 3. React adapter audit

#### 3A. Atom and field
- [x] review `slider.tsx`
- [x] review `slider-field.tsx`
- [x] verify the atom keeps a native `input[type="range"]`
- [x] verify visible-label, description, error, and invalid wiring in `SliderField`
- [x] verify controlled and uncontrolled value-change behavior

#### 3B. Purpose variants
- [x] review `variants.tsx`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm purpose metadata does not weaken slider naming or described-by wiring

### 4. React stories and tests audit
- [x] review `apps/storybook-react/src/stories/slider/Introduction.mdx`
- [x] review React slider stories for atom, field, purpose, disabled, tooltip, and full-width coverage
- [x] review `apps/storybook-react/src/stories/slider/__tests__/`
- [x] review `packages/react/src/components/slider/__tests__/`
- [x] confirm docs teach the right boundary between `SliderField` and raw `Slider`

### 5. Vue adapter audit

#### 5A. Atom and field
- [x] review `slider.ts`
- [x] review `slider-field.ts`
- [x] verify the atom keeps a native `input[type="range"]`
- [x] verify visible-label, description, error, and invalid wiring in `SliderField`
- [x] verify controlled and uncontrolled value-change behavior

#### 5B. Purpose variants
- [x] review `variants.ts`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm Vue event ergonomics do not change the slider accessibility contract

### 6. Vue stories and tests audit
- [x] review `apps/storybook-vue/src/stories/slider/Introduction.mdx`
- [x] review Vue slider stories for atom, field, purpose, disabled, tooltip, and full-width coverage
- [x] review `apps/storybook-vue/src/stories/slider/__tests__/`
- [x] review `packages/vue/src/components/slider/__tests__/`
- [x] confirm Vue docs teach the same boundary between `SliderField` and raw `Slider`

### 7. Shared contracts and gaps
- [x] add `tests/contracts/slider.contract.ts`
- [x] wire the shared slider contract into both React and Vue adapter tests
- [x] verify the contract covers native range semantics, label/described-by wiring, tooltip display, disabled state, and value-change behavior
- [ ] decide whether future slider keyboard-matrix proof needs to move beyond native smoke coverage

### 8. Expected decisions from this audit
This Slider-family audit should ideally end with clear answers to these questions:

- [x] Is the native `input[type="range"]` path still the intended Marwes baseline?
- [x] Is `SliderField` the canonical labeled slider composition?
- [x] Should `showTooltip` remain a visual-only affordance rather than an accessibility naming path?
- [ ] Which Slider-family stories should later be part of automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

Targeted verification for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/slider/__tests__/slider.test.tsx src/components/slider/__tests__/slider-field.test.tsx src/components/slider/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/slider/__tests__/slider.test.ts src/components/slider/__tests__/slider-field.test.ts src/components/slider/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/slider/__tests__/slider-introduction-docs.test.ts src/stories/slider/__tests__/slider-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/slider/__tests__/slider-introduction-docs.test.ts src/stories/slider/__tests__/slider-taxonomy.test.ts`
- [x] `pnpm check:compass`

Broader follow-up verification when the queue allows:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned native slider metadata and range normalization
- shared field-helper wiring for `SliderField`
- strong React/Vue parity for value flow and labeling
- Storybook separation between purpose wrappers, `SliderField`, and raw `Slider`

### Risks to resolve or document
- missing explicit Slider-family accessibility requirement in `docs/reference/spec.md`
- missing shared `slider` contract for React/Vue parity
- field wiring being implied by implementation rather than proved by shared tests
- tooltip being mistaken for an accessibility label path instead of a visual affordance
- any drift between Storybook claims and what contracts actually prove

### Deliverables expected from the Slider audit
- one clear statement of the shipped slider contract
- one shared `slider` contract for React and Vue
- proof for value-change behavior, visible-label wiring, description/error wiring, and disabled state
- doc updates wherever public guidance is ahead of proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and tests.

### What looks good right now

#### 1. Core already keeps the atom semantics honest
Confirmed in:
- `packages/core/src/components/atoms/slider/slider-types.ts`
- `packages/core/src/components/atoms/slider/slider-a11y.ts`
- `packages/core/src/components/atoms/slider/slider-recipe.ts`

Good signals:
- the atom stays explicitly native through `type="range"`
- min, max, and step normalization live in core rather than adapters
- current value clamping and fill-percentage calculation are centralized
- tooltip and touch-area state hooks are visual flags, not alternate semantic paths

#### 2. Shared field wiring is already in the right place
Confirmed in:
- `packages/core/src/shared/field-helpers.ts`
- `packages/react/src/components/slider/slider-field.tsx`
- `packages/vue/src/components/slider/slider-field.ts`

Good signals:
- `buildSliderFieldA11yIds()` owns the label, description, and error id generation
- both adapters wire the visible label through `aria-labelledby`
- both adapters merge external `ariaDescribedBy` with description and error ids
- both adapters apply `aria-invalid` only when error text is present

#### 3. React and Vue parity is strong across atom, field, and purpose wrappers
Confirmed in:
- `packages/react/src/components/slider/*`
- `packages/vue/src/components/slider/*`
- local tests in both adapters

Good signals:
- both adapters keep controlled and uncontrolled value flow aligned
- both adapters preserve native range semantics rather than recreating slider behavior on custom elements
- both adapters expose the same purpose-wrapper meanings and defaults
- both adapters keep tooltip and touch-area visuals layered on top of the native control

#### 4. Preset coverage is healthy for the current scope
Confirmed in:
- `packages/presets/src/firstEdition/slider.css`
- `packages/presets/src/firstEdition/molecules/slider-field.css`

Good signals:
- focus, hover, pressed, disabled, tooltip, and touch-area visuals are explicit
- disabled visuals align with the native disabled input path
- field-level label, description, error, and inline/top layout states are clearly separated
- dark-theme focus and tooltip tokens are present

### Confirmed risks and gaps

#### Risk 1. The Slider-family accessibility contract was not explicit in the spec
Confirmed in:
- `docs/reference/spec.md`
- current slider implementation and Storybook docs

Current state before follow-up fix:
- the repo already shipped `Slider`, `SliderField`, and purpose wrappers
- but the accessibility contract for native range semantics, field wiring, and value behavior was not written down explicitly in the canonical spec

Status after follow-up fix:
- added `REQ-SLIDER-001` to `docs/reference/spec.md`
- the spec now records the native slider baseline, `SliderField` labeling contract, tooltip scope, and shared-contract expectation explicitly

#### Risk 2. There was no shared `tests/contracts/slider.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/slider/__tests__/`
- `packages/vue/src/components/slider/__tests__/`

Current state before follow-up fix:
- local adapter tests covered several atom, field, and purpose basics
- there was no shared React/Vue proof for the slider family’s accessibility contract

Status after follow-up fix:
- added `tests/contracts/slider.contract.ts`
- wired the contract into both React and Vue slider tests
- the shared contract now proves native range metadata, uncontrolled value changes, controlled value source-of-truth behavior, disabled semantics, tooltip display, field label wiring, description/error described-by wiring, and empty helper/error handling

#### Risk 3. Tooltip guidance was implicit rather than explicit
Confirmed in:
- `apps/storybook-react/src/stories/slider/Introduction.mdx`
- `apps/storybook-vue/src/stories/slider/Introduction.mdx`

Current state before follow-up fix:
- the intro docs already documented `showTooltip`
- they did not explicitly say that the tooltip is visual-only and does not replace accessible naming or `ariaValueText`

Status after follow-up fix:
- both intro docs now explicitly say `showTooltip` is visual-only
- both intro docs now direct consumers toward `SliderField`, `ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy`, and `ariaValueText` for the real accessibility paths

#### Risk 4. Purpose-wrapper metadata is still only covered locally
Confirmed in:
- `packages/react/src/components/slider/__tests__/variants.test.tsx`
- `packages/vue/src/components/slider/__tests__/variants.test.ts`

Current state:
- local tests already prove purpose metadata and bounds defaults
- shared contract coverage focuses on the atom and field contract instead of purpose metadata

This is acceptable for now because purpose metadata is already covered locally and the more important parity risk was the atom/field behavior.

### Likely decisions coming out of this audit

#### Decision A — Keep native range input as the baseline
Reasoning from the first pass:
- both adapters already ship a native `input[type="range"]`
- the family gets native keyboard and disabled behavior for free from that baseline
- the hardening work should stay focused on wiring, docs, and parity rather than replacing the control model

#### Decision B — Keep `SliderField` as the canonical labeled slider path
Reasoning from the first pass:
- `SliderField` already owns visible label, helper text, error text, and edge-value presentation intentionally
- this is stronger than expecting consumers to manually compose slider labeling each time
- the field wrapper is the right place to guarantee the labeled-slider contract

#### Decision C — Keep `showTooltip` as a visual-only affordance
Reasoning from the first pass:
- the tooltip reflects the current numeric value visually
- it is intentionally `aria-hidden`
- assistive value wording should continue to come from the native slider plus optional `ariaValueText`

### Recommended first fixes from the Slider audit

#### Fix 1 — Add the shared contract and wire it in both adapters
Files:
- `tests/contracts/slider.contract.ts`
- `packages/react/src/components/slider/__tests__/slider.test.tsx`
- `packages/vue/src/components/slider/__tests__/slider.test.ts`

#### Fix 2 — Record the Slider-family accessibility contract in the spec
Files:
- `docs/reference/spec.md`
- `docs/audits/slider-family-accessibility.md`

#### Fix 3 — Clarify tooltip scope in Storybook docs
Files:
- `apps/storybook-react/src/stories/slider/Introduction.mdx`
- `apps/storybook-vue/src/stories/slider/Introduction.mdx`

### Recommended execution order inside the Slider family

1. record the intended slider contract in the spec
2. add the shared `slider` contract
3. wire the contract into React and Vue adapter tests
4. clarify tooltip scope in Storybook docs
5. run targeted verification and record the next findings in this doc
