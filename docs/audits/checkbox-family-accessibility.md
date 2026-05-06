# Checkbox Family Accessibility Audit

## Goal
Audit the Checkbox family through the Marwes tree with focus on the remaining AXE gap called out by the registry:
- `CheckboxField` still relied on local adapter tests instead of a dedicated shared cross-adapter contract

The Checkbox family is native-first, but it still matters because it owns:
- single-checkbox field wiring
- grouped checkbox `fieldset` semantics
- indeterminate/select-all affordances that must stay truthful

The main goal of this pass is to prove one intentional checkbox contract across:
- core native checkbox behavior
- React and Vue field wiring
- shared contract coverage for atom, single-field, and grouped-field surfaces
- Storybook and registry posture

## Scope
This audit covers:

### Atom
- `Checkbox`

### Molecules
- `CheckboxField`
- `CheckboxGroupField`

## Tree anchors

### Core
- `packages/core/src/components/atoms/checkbox/checkbox-types.ts`
- `packages/core/src/components/atoms/checkbox/checkbox-a11y.ts`
- `packages/core/src/components/atoms/checkbox/checkbox-recipe.ts`
- `packages/core/src/shared/field-helpers.ts`
- `packages/core/test/recipes/checkbox.test.ts`

### Presets
- `packages/presets/src/firstEdition/checkbox.css`
- `packages/presets/src/firstEdition/molecules/checkbox-field.css`
- `packages/presets/src/firstEdition/molecules/checkbox-group-field.css`

### React
- `packages/react/src/components/checkbox/checkbox.tsx`
- `packages/react/src/components/checkbox/checkbox-field.tsx`
- `packages/react/src/components/checkbox/checkbox-group-field.tsx`
- `packages/react/src/components/checkbox/__tests__/`

### Vue
- `packages/vue/src/components/checkbox/checkbox.ts`
- `packages/vue/src/components/checkbox/checkbox-field.ts`
- `packages/vue/src/components/checkbox/checkbox-group-field.ts`
- `packages/vue/src/components/checkbox/__tests__/`

### Stories and docs
- `apps/storybook-react/src/stories/checkbox/*`
- `apps/storybook-vue/src/stories/checkbox/*`

### Contracts
- `tests/contracts/checkbox.contract.ts`
- `tests/contracts/checkbox-field.contract.ts`
- `tests/contracts/checkbox-group-field.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] record the Checkbox family contract explicitly in `docs/reference/spec.md`
- [x] keep native checkbox and fieldset semantics as the source of truth
- [x] keep indeterminate framed as a parent-owned select-all affordance rather than a third durable state

### 1. Core audit
- [x] review `checkbox-types.ts`
- [x] review `checkbox-a11y.ts`
- [x] review `checkbox-recipe.ts`
- [x] review `field-helpers.ts` wiring for checkbox field and group ids
- [x] confirm native checkbox semantics remain the real contract

### 2. Preset CSS audit
- [x] confirm checkbox visuals do not depend on a fake custom-widget role model
- [x] keep focus/error/disabled treatment in the family-level manual-review boundary

### 3. React adapter audit
- [x] review `checkbox.tsx`
- [x] review `checkbox-field.tsx`
- [x] review `checkbox-group-field.tsx`
- [x] confirm the adapter applies core native checkbox semantics directly
- [x] confirm `CheckboxField` merges description/error/external described-by ids through shared helpers

### 4. Vue adapter audit
- [x] review `checkbox.ts`
- [x] review `checkbox-field.ts`
- [x] review `checkbox-group-field.ts`
- [x] confirm Vue stays aligned with React on field wiring and invalid state

### 5. Shared contracts and gaps
- [x] keep the shared raw-checkbox contract
- [x] keep the shared checkbox-group-field contract
- [x] add a dedicated shared `checkbox-field` contract
- [x] wire the new field contract into both React and Vue tests
- [x] close the registry's main contract-maturity gap for the family

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. The family was already native-first and structurally honest
Confirmed in:
- `packages/core/src/components/atoms/checkbox/*`
- `packages/react/src/components/checkbox/checkbox.tsx`
- `packages/vue/src/components/checkbox/checkbox.ts`

Good signals:
- the atom is a real native `input[type="checkbox"]`
- indeterminate is handled as a DOM property rather than a fake HTML attribute
- no Marwes metadata layer pretends to replace native checkbox semantics

#### 2. Shared contract coverage already existed for the raw atom and grouped field path
Confirmed in:
- `tests/contracts/checkbox.contract.ts`
- `tests/contracts/checkbox-group-field.contract.ts`

Good signals:
- checked state, disabled state, and indeterminate support were already covered for the raw atom
- grouped legend, description, error live region, invalid propagation, disabled-group behavior, and indeterminate option support were already covered for `CheckboxGroupField`

### The main remaining gap before this pass
Confirmed in:
- `docs/registry/families/checkbox/README.md`
- `docs/registry/families/checkbox/registry.meta.json`
- local adapter tests under `packages/react/src/components/checkbox/__tests__/checkbox-field.test.tsx` and `packages/vue/src/components/checkbox/__tests__/checkbox-field.test.ts`

Current state before the fix:
- `CheckboxField` behavior was only proved through local adapter tests
- there was no shared `tests/contracts/checkbox-field.contract.ts`
- registry posture therefore stayed at `Automated contract | Partial`

### What changed in this pass

#### 1. Checkbox now has a full shared contract set across the family
Implemented in:
- `tests/contracts/checkbox-field.contract.ts`
- `packages/react/src/components/checkbox/__tests__/checkbox-field.test.tsx`
- `packages/vue/src/components/checkbox/__tests__/checkbox-field.test.ts`

New proof covers:
- visible label as the checkbox accessible name
- description wiring through `aria-describedby`
- error wiring through `aria-describedby`
- polite error live region
- invalid checkbox state when error text is present
- external described-by id merging
- empty description/error strings treated as absent
- disabled state forwarding
- disabled state forwarding through the field wrapper

#### 2. The spec now records the Checkbox-family contract explicitly
Implemented in:
- `docs/reference/spec.md`

The spec now states:
- native checkbox atom expectations
- `CheckboxField` single-field wiring expectations
- `CheckboxGroupField` grouped semantics expectations
- the shared-contract baseline for React and Vue

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether select-all and indeterminate behavior remain truthful in complex product flows
- whether heavy checkbox styling preserves focus visibility and browser consistency in real environments
- whether long helper text, long error text, and dense grouped layouts remain readable

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/checkbox.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/checkbox/__tests__/checkbox.test.tsx src/components/checkbox/__tests__/checkbox-field.test.tsx src/components/checkbox/__tests__/checkbox-group-field.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/checkbox/__tests__/checkbox.test.ts src/components/checkbox/__tests__/checkbox-field.test.ts src/components/checkbox/__tests__/checkbox-group-field.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/checkbox/__tests__/checkbox-introduction-docs.test.ts src/stories/checkbox/__tests__/checkbox-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/checkbox/__tests__/checkbox-introduction-docs.test.ts src/stories/checkbox/__tests__/checkbox-taxonomy.test.ts`
- [x] `pnpm check:compass`

Broader follow-up verification when convenient:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Deliverables from this audit
- one explicit Checkbox-family spec section
- one shared `checkbox-field` contract to complement the existing atom and group contracts
- aligned React/Vue proof for single-checkbox field wiring
- registry and roadmap posture that no longer treat Checkbox as only partially hardened
