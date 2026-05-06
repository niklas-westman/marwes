# Radio Family Accessibility Audit

## Goal
Audit the Radio family through the Marwes tree with focus on the remaining AXE gap called out by the registry:
- `RadioGroupField` still relied on local adapter tests instead of a dedicated shared cross-adapter contract

The Radio family is native-first, but it still matters because it owns:
- grouped single-selection semantics
- shared label, description, and error wiring
- thin purpose wrappers that should not drift from the grouped field contract

The main goal of this pass is to prove one intentional radio contract across:
- core native radio behavior
- React and Vue grouped field wiring
- shared contract coverage for atom and grouped-field surfaces
- Storybook and registry posture

## Scope
This audit covers:

### Atom
- `Radio`

### Molecule
- `RadioGroupField`

### Purpose variants
- `YesNoRadioGroup`
- `RatingRadioGroup`
- `OptionRadioGroup`

## Tree anchors

### Core
- `packages/core/src/components/atoms/radio/radio-types.ts`
- `packages/core/src/components/atoms/radio/radio-a11y.ts`
- `packages/core/src/components/atoms/radio/radio-recipe.ts`
- `packages/core/src/shared/field-helpers.ts`
- `packages/core/test/recipes/radio.test.ts`

### Presets
- `packages/presets/src/firstEdition/radio.css`
- `packages/presets/src/firstEdition/molecules/radio-group-field.css`

### React
- `packages/react/src/components/radio/radio.tsx`
- `packages/react/src/components/radio/radio-group-field.tsx`
- `packages/react/src/components/radio/variants.tsx`
- `packages/react/src/components/radio/__tests__/`

### Vue
- `packages/vue/src/components/radio/radio.ts`
- `packages/vue/src/components/radio/radio-group-field.ts`
- `packages/vue/src/components/radio/variants.ts`
- `packages/vue/src/components/radio/__tests__/`

### Stories and docs
- `apps/storybook-react/src/stories/radio/*`
- `apps/storybook-vue/src/stories/radio/*`

### Contracts
- `tests/contracts/radio.contract.ts`
- `tests/contracts/radio-group-field.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] record the Radio family contract explicitly in `docs/reference/spec.md`
- [x] keep native radio and radiogroup semantics as the source of truth
- [x] keep purpose wrappers thin and layered on top of `RadioGroupField`

### 1. Core audit
- [x] review `radio-types.ts`
- [x] review `radio-a11y.ts`
- [x] review `radio-recipe.ts`
- [x] review `field-helpers.ts` wiring for radio group ids
- [x] confirm native radio semantics remain the real contract

### 2. Preset CSS audit
- [x] confirm radio visuals do not depend on a fake custom-widget role model
- [x] keep focus/error/disabled treatment in the family-level manual-review boundary

### 3. React adapter audit
- [x] review `radio.tsx`
- [x] review `radio-group-field.tsx`
- [x] review `variants.tsx`
- [x] confirm the adapter applies core native radio semantics directly
- [x] confirm `RadioGroupField` merges description/error/external described-by ids through shared helpers

### 4. Vue adapter audit
- [x] review `radio.ts`
- [x] review `radio-group-field.ts`
- [x] review `variants.ts`
- [x] confirm Vue stays aligned with React on group wiring and invalid state

### 5. Shared contracts and gaps
- [x] keep the shared raw-radio contract
- [x] add a dedicated shared `radio-group-field` contract
- [x] wire the new group contract into both React and Vue tests
- [x] keep purpose-wrapper checks local while the main grouped semantics move under the shared contract
- [x] close the registry's main contract-maturity gap for the family

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. The family was already native-first and structurally honest
Confirmed in:
- `packages/core/src/components/atoms/radio/*`
- `packages/react/src/components/radio/radio.tsx`
- `packages/vue/src/components/radio/radio.ts`

Good signals:
- the atom is a real native `input[type="radio"]`
- grouped selection still relies on ordinary browser radio behavior through a shared `name`
- purpose wrappers stay thin and compose `RadioGroupField` instead of inventing a second implementation

#### 2. Shared contract coverage already existed for the raw atom
Confirmed in:
- `tests/contracts/radio.contract.ts`

Good signals:
- checked state, disabled state, and callback flow were already covered for the raw atom
- core recipe tests already covered checked vs defaultChecked output and invalid class policy

### The main remaining gap before this pass
Confirmed in:
- `docs/registry/families/radio/README.md`
- `docs/registry/families/radio/registry.meta.json`
- local adapter tests under `packages/react/src/components/radio/__tests__/radio-group-field.test.tsx` and `packages/vue/src/components/radio/__tests__/radio-group-field.test.ts`

Current state before the fix:
- `RadioGroupField` behavior was only proved through local adapter tests
- there was no shared `tests/contracts/radio-group-field.contract.ts`
- registry posture therefore stayed at `Automated contract | Partial`

### What changed in this pass

#### 1. Radio now has a shared grouped-field contract across React and Vue
Implemented in:
- `tests/contracts/radio-group-field.contract.ts`
- `packages/react/src/components/radio/__tests__/radio-group-field.test.tsx`
- `packages/vue/src/components/radio/__tests__/radio-group-field.test.ts`

New proof covers:
- labeled `radiogroup` semantics
- uncontrolled default selection and switching
- controlled `onChange` emission
- shared group `name` ownership across child radios
- description wiring through `aria-describedby`
- external described-by merging
- error live region and invalid propagation
- empty description/error handling
- disabled-group behavior
- required state
- per-option disabled behavior

#### 2. The spec now records the Radio-family contract explicitly
Implemented in:
- `docs/reference/spec.md`

The spec now states:
- native radio atom expectations
- `RadioGroupField` grouped semantics expectations
- the shared-contract baseline for React and Vue
- the role of purpose wrappers as thin grouped-field compositions

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether raw `Radio` usage outside `RadioGroupField` stays honest about surrounding radiogroup naming and shared `name` ownership
- whether required messaging, helper text, and error text remain clear in real grouped choice flows
- whether heavy radio styling preserves focus visibility and browser consistency in real environments

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/radio.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/radio/__tests__/radio.test.tsx src/components/radio/__tests__/radio-group-field.test.tsx src/components/radio/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/radio/__tests__/radio.test.ts src/components/radio/__tests__/radio-group-field.test.ts src/components/radio/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/radio/__tests__/radio-introduction-docs.test.ts src/stories/radio/__tests__/radio-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/radio/__tests__/radio-introduction-docs.test.ts src/stories/radio/__tests__/radio-taxonomy.test.ts`
- [x] `pnpm check:compass`

Broader follow-up verification when convenient:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Deliverables from this audit
- one explicit Radio-family spec section
- one shared `radio-group-field` contract to complement the existing atom contract
- aligned React/Vue proof for grouped single-selection wiring
- registry and roadmap posture that no longer treat Radio as only partially hardened
