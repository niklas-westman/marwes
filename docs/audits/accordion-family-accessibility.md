# Accordion Family Accessibility Audit

## Goal
Audit the entire Accordion family step by step through the Marwes tree structure.

This audit starts after the Switch pass because Accordion combines a low-level
custom disclosure primitive with a grouped field wrapper and purpose variants:
- a raw `Accordion` atom with trigger + panel wiring
- `AccordionField` as the standard labeled accordion-group composition
- single-open and multi-open coordination
- purpose wrappers for FAQ, settings, and generic sections

The main goal is to prove that Marwes ships one intentional accordion contract across:
- core trigger/panel wiring
- field helper wiring
- preset focus, open, and disabled states
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Accordion`

### Molecule
- `AccordionField`

### Purpose variants
- `FAQAccordion`
- `SettingsAccordion`
- `SectionsAccordion`

## Tree anchors

### Core
- `packages/core/src/components/atoms/accordion/index.ts`
- `packages/core/src/components/atoms/accordion/accordion-types.ts`
- `packages/core/src/components/atoms/accordion/accordion-a11y.ts`
- `packages/core/src/components/atoms/accordion/accordion-recipe.ts`
- shared helpers:
  - `packages/core/src/shared/field-helpers.ts`

### Presets
- `packages/presets/src/firstEdition/accordion.css`
- `packages/presets/src/firstEdition/molecules/accordion-field.css`

### React
- `packages/react/src/components/accordion/accordion.tsx`
- `packages/react/src/components/accordion/accordion-field.tsx`
- `packages/react/src/components/accordion/variants.tsx`
- tests:
  - `packages/react/src/components/accordion/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/accordion/Introduction.mdx`
- `apps/storybook-react/src/stories/accordion/accordion.stories.tsx`
- `apps/storybook-react/src/stories/accordion/accordion-field.stories.tsx`
- `apps/storybook-react/src/stories/accordion/faq-accordion.stories.tsx`
- `apps/storybook-react/src/stories/accordion/settings-accordion.stories.tsx`
- `apps/storybook-react/src/stories/accordion/sections-accordion.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/accordion/__tests__/`

### Vue
- `packages/vue/src/components/accordion/accordion.ts`
- `packages/vue/src/components/accordion/accordion-field.ts`
- `packages/vue/src/components/accordion/variants.ts`
- tests:
  - `packages/vue/src/components/accordion/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/accordion/Introduction.mdx`
- `apps/storybook-vue/src/stories/accordion/accordion.stories.ts`
- `apps/storybook-vue/src/stories/accordion/accordion-field.stories.ts`
- `apps/storybook-vue/src/stories/accordion/faq-accordion.stories.ts`
- `apps/storybook-vue/src/stories/accordion/settings-accordion.stories.ts`
- `apps/storybook-vue/src/stories/accordion/sections-accordion.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/accordion/__tests__/`

### Contracts
- add `tests/contracts/accordion.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Accordion-family requirements in `docs/reference/spec.md`
- [x] confirm the trigger-button + controlled-region model remains intentional in this pass
- [x] confirm the expected disabled-accordion policy
- [x] confirm whether public docs need updates to match the actual React and Vue item APIs

### 1. Core audit

#### 1A. Accordion atom
- [x] review `accordion-types.ts`
- [x] review `accordion-a11y.ts`
- [x] review `accordion-recipe.ts`
- [x] verify trigger/panel id wiring is intentional
- [x] verify open and disabled behavior are explicit in core

#### 1B. Shared field helpers
- [x] review `buildAccordionFieldA11yIds()` in `field-helpers.ts`
- [x] verify label, description, and error ids merge correctly into `aria-describedby`
- [x] verify the helper matches the shipped field contract in both adapters

### 2. Preset CSS audit
- [x] review `accordion.css` for focus-visible, open, hover, pressed, and disabled states
- [x] review `molecules/accordion-field.css` for label, description, error, and disabled styling
- [x] confirm open-state visuals align with semantic expanded state
- [x] confirm disabled-state visuals align with actual disabled behavior
- [x] confirm focus remains obvious on the interactive trigger wrapper in both themes

### 3. React adapter audit

#### 3A. Atom and field
- [x] review `accordion.tsx`
- [x] review `accordion-field.tsx`
- [x] verify core a11y output is applied directly and completely
- [x] verify open-state callbacks and disabled behavior
- [x] verify `AccordionField` owns the intended group semantics and a11y wiring

#### 3B. Purpose variants
- [x] review `variants.tsx`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm purpose metadata does not weaken labeling or described-by wiring

### 4. React stories and tests audit
- [x] review `apps/storybook-react/src/stories/accordion/Introduction.mdx`
- [x] review React accordion stories for open, disabled, description, and error coverage
- [x] review `apps/storybook-react/src/stories/accordion/__tests__/`
- [x] review `packages/react/src/components/accordion/__tests__/`
- [x] confirm docs teach the right boundary between `AccordionField` and raw `Accordion`

### 5. Vue adapter audit

#### 5A. Atom and field
- [x] review `accordion.ts`
- [x] review `accordion-field.ts`
- [x] verify core a11y output is applied directly and completely
- [x] verify open-state callbacks, `update:modelValue`, and disabled behavior
- [x] verify `AccordionField` preserves the same group semantics as React

#### 5B. Purpose variants
- [x] review `variants.ts`
- [x] verify purpose wrappers preserve the base field accessibility contract
- [x] confirm Vue event ergonomics do not change the accessibility contract

### 6. Vue stories and tests audit
- [x] review `apps/storybook-vue/src/stories/accordion/Introduction.mdx`
- [x] review Vue accordion stories for open, disabled, description, and error coverage
- [x] review `apps/storybook-vue/src/stories/accordion/__tests__/`
- [x] review `packages/vue/src/components/accordion/__tests__/`
- [x] confirm Vue docs teach the same contract and boundaries as React docs

### 7. Shared contracts and gaps
- [x] add `tests/contracts/accordion.contract.ts`
- [x] wire the shared accordion contract into both React and Vue adapter tests
- [x] verify the contract covers trigger/panel wiring, disabled behavior, and field wiring
- [ ] decide whether purpose-metadata behavior should also move into a shared contract later

### 8. Expected decisions from this audit
This Accordion-family audit should ideally end with clear answers to these questions:

- [x] Is the trigger-button + controlled-region model still the intended Marwes baseline?
- [x] What exact open-state contract should React and Vue both guarantee?
- [x] Should `AccordionField` continue using `aria-invalid` when error text is present?
- [x] Should React and Vue item-shape APIs be brought into closer parity in a later pass?
- [ ] Which Accordion-family stories should later be part of automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned trigger/panel id wiring
- shared field-helper wiring for `AccordionField`
- strong React/Vue parity at the behavior level
- Storybook separation between purpose wrappers, `AccordionField`, and raw `Accordion`

### Risks to resolve or document
- missing explicit Accordion-family requirement in `docs/reference/spec.md`
- missing shared accordion contract for React/Vue parity
- docs examples drifting from the actual shipped React and Vue item APIs
- React/Vue API-shape divergence for accordion item content
- any drift between Storybook claims and what contracts actually prove

### Deliverables expected from the Accordion audit
- one clear statement of the shipped accordion contract
- one shared `accordion` contract for React and Vue
- proof for trigger/panel wiring, disabled behavior, and field-level label/description/error behavior
- doc updates wherever public guidance is ahead of proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and tests.

### What looks good right now

#### 1. Core owns the most important trigger/panel semantics
Confirmed in:
- `packages/core/src/components/atoms/accordion/accordion-types.ts`
- `packages/core/src/components/atoms/accordion/accordion-a11y.ts`
- `packages/core/src/components/atoms/accordion/accordion-recipe.ts`

Good signals:
- trigger and panel ids are derived in core rather than ad hoc in adapters
- expanded state and disabled state are explicit in the core a11y shape
- the recipe keeps atom state and style hooks centralized
- adapters can stay thin because the core contract is already clear

#### 2. `AccordionField` uses shared field-helper wiring correctly
Confirmed in:
- `packages/core/src/shared/field-helpers.ts`
- `packages/react/src/components/accordion/accordion-field.tsx`
- `packages/vue/src/components/accordion/accordion-field.ts`

Good signals:
- `buildAccordionFieldA11yIds()` owns field-level id generation
- both adapters use the helper to wire label, description, and error ids
- both adapters merge external `ariaDescribedBy` into the group contract
- the field wrapper, not the atom, owns grouped label and error semantics intentionally

#### 3. React and Vue behavior is closer than the public API shapes suggest
Confirmed in:
- `packages/react/src/components/accordion/*`
- `packages/vue/src/components/accordion/*`
- local tests in both adapters

Good signals:
- both adapters ship the same interaction model for open, disabled, and grouped state behavior
- both adapters support controlled and uncontrolled field-level state
- both adapters expose purpose wrappers with the same semantic intent
- the Storybook trees in both apps reflect the same atom/molecule/purpose layering

#### 4. Preset coverage is healthy across atom and field layers
Confirmed in:
- `packages/presets/src/firstEdition/accordion.css`
- `packages/presets/src/firstEdition/molecules/accordion-field.css`

Good signals:
- atom interaction states and field-wrapper layout are separated cleanly
- focus-visible and expanded visual treatment are explicit
- disabled styling exists at both atom and field layers
- error styling is visible at the grouped field level

### Confirmed risks and gaps

#### Risk 1. The Accordion-family contract was not explicit in `docs/reference/spec.md`
Confirmed in:
- `docs/reference/spec.md`
- current accordion implementation and Storybook docs

Current state before follow-up fix:
- I did not find an accordion-specific spec requirement in `docs/reference/spec.md`
- the family contract was mostly taught through implementation and Storybook docs

Status after follow-up fix:
- added `REQ-ACCORDION-001` to `docs/reference/spec.md`
- the spec now records trigger/panel wiring, grouped-field semantics, invalid-state behavior, and shared-contract expectations explicitly

#### Risk 2. There was no shared `tests/contracts/accordion.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/accordion/__tests__/`
- `packages/vue/src/components/accordion/__tests__/`

Current state before follow-up fix:
- local tests covered atom and field behavior separately
- there was no shared React/Vue proof for the family’s accessibility contract

Status after follow-up fix:
- added `tests/contracts/accordion.contract.ts`
- wired the contract into both React and Vue accordion atom tests
- the shared contract now proves trigger/panel wiring, disabled behavior, labeled-group semantics, description/error wiring, single-open and multi-open behavior, controlled open-state callbacks, and disabled group behavior

#### Risk 3. Public docs are ahead of the actual API surface in a few examples
Confirmed in:
- `apps/storybook-react/src/stories/accordion/Introduction.mdx`
- `apps/storybook-vue/src/stories/accordion/Introduction.mdx`

Current state before follow-up fix:
- some introduction examples still showed outdated or non-shipped prop shapes such as `name` and item `id`
- React and Vue also expose different item-content APIs today (`children` in React, `content` in Vue)
- this did not break the accessibility behavior, but it weakened the docs-as-contract story

Status after follow-up fix:
- corrected the React and Vue introduction examples to use the shipped item keys and current component props
- both introduction docs now explicitly teach `content` as the canonical item-body prop
- the remaining issue is now limited to compatibility/governance follow-through rather than stale introduction examples

#### Risk 4. React and Vue item API shapes are not fully parallel
Confirmed in:
- `packages/react/src/components/accordion/accordion-field.tsx`
- `packages/vue/src/components/accordion/accordion-field.ts`
- Storybook stories in both apps

Current state before follow-up fix:
- React item shape used `children: React.ReactNode`
- Vue item shape used `content: string`
- the shared contract could still prove behavior because the harness adapted, but the public APIs were not aligned conceptually

Status after follow-up fix:
- `content` is now the canonical item-body prop in both adapters
- React keeps `children` as a compatibility alias while docs and tests teach `content`
- Vue `content` now accepts renderable node content rather than only strings

This parity note is now materially resolved.

#### Risk 5. Purpose-wrapper metadata is still only covered locally
Confirmed in:
- `packages/react/src/components/accordion/__tests__/variants.test.tsx`
- `packages/vue/src/components/accordion/__tests__/variants.test.ts`

Current state:
- local package tests prove purpose metadata and default open-mode behavior
- shared contract coverage currently focuses on the atom and field contract, not purpose metadata

This is acceptable for now, but it may be worth lifting into shared coverage later if purpose semantics become more contract-critical.

### Likely decisions coming out of this audit

#### Decision A — Keep the trigger-button + named-region model explicit
Reasoning from the first pass:
- both adapters already ship a trigger button controlling one named region
- the important thing is to document and test that model clearly rather than let it remain implicit

#### Decision B — Keep `AccordionField` as the canonical grouped accessibility path
Reasoning from the first pass:
- `AccordionField` already owns field-level label, description, error, and invalid semantics intentionally
- this is stronger than expecting consumers to compose those semantics by hand
- the grouped wrapper is the right place to guarantee the field contract

#### Decision C — Keep `aria-invalid` on `AccordionField` while resolving the item API drift in favor of `content`
Reasoning from the first pass:
- current grouped error behavior is consistent across React and Vue
- `content` is the clearer framework-agnostic item-body prop for a data-driven accordion item shape
- React can preserve `children` as compatibility while the canonical API shifts to `content`

### Recommended first fixes from the Accordion audit

#### Fix 1 — Add the shared contract and wire it in both adapters
Files:
- `tests/contracts/accordion.contract.ts`
- `packages/react/src/components/accordion/__tests__/accordion.test.tsx`
- `packages/vue/src/components/accordion/__tests__/accordion.test.ts`

#### Fix 2 — Record the Accordion-family contract in the spec
Files:
- `docs/reference/spec.md`
- `docs/audits/accordion-family-accessibility.md`

#### Fix 3 — Align the public item API around `content`
Files:
- `packages/react/src/components/accordion/accordion-field.tsx`
- `packages/vue/src/components/accordion/accordion-field.ts`
- `apps/storybook-react/src/stories/accordion/Introduction.mdx`
- `apps/storybook-vue/src/stories/accordion/Introduction.mdx`
- React accordion stories/tests using item objects

### Recommended execution order inside the Accordion family

1. record the intended accordion contract in the spec
2. add the shared `accordion` contract
3. wire the contract into React and Vue adapter tests
4. align the public item API around canonical `content`
5. run targeted verification and record the next findings in this doc
