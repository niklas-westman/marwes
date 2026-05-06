# Spacing Family Accessibility Audit

## Goal
Audit the Spacing family through the Marwes tree with focus on the AXE watch item already
called out by the registry:
- keep Spacing decorative
- use it only when a spacer is the honest layout tool
- do not let large gaps imply hidden semantic structure

Spacing is intentionally tiny and non-semantic, but this pass still mattered because the family had
light focused automation and a real React/Vue parity bug around the `scale` prop.

## Scope

### Atom
- `Spacing`

## Tree anchors

### Core
- `packages/core/src/components/atoms/spacing/spacing.types.ts`
- `packages/core/src/components/atoms/spacing/spacing.recipe.ts`
- `packages/core/test/recipes/spacing.test.ts`

### React
- `packages/react/src/components/spacing/spacing.tsx`
- `packages/react/src/components/spacing/__tests__/spacing.test.tsx`

### Vue
- `packages/vue/src/components/spacing/spacing.ts`
- `packages/vue/src/components/spacing/__tests__/spacing.test.ts`

### Contracts
- `tests/contracts/spacing.contract.ts`

### Stories and docs
- `apps/storybook-react/src/stories/spacing/*`
- `apps/storybook-vue/src/stories/spacing/*`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm Spacing stays decorative and `aria-hidden`
- [x] confirm the family continues to emit only family-local `data-component` and `data-size`
- [x] confirm the main accessibility boundary is layout honesty, not widget behavior

### 1. Core audit
- [x] review `spacing.types.ts`
- [x] review `spacing.recipe.ts`
- [x] confirm default size remains `md`
- [x] confirm `scale=1` uses a plain token var and scaled values use `calc(...)`
- [x] add dedicated core recipe tests for spacing output

### 2. React adapter audit
- [x] review `spacing.tsx`
- [x] confirm React renders decorative spacing with local metadata and style vars from core
- [x] add dedicated adapter coverage through a shared contract harness

### 3. Vue adapter audit
- [x] review `spacing.ts`
- [x] fix the missing `scale` prop declaration in Vue
- [x] confirm Vue now matches React on scaled spacing output and no raw `scale` attr leakage
- [x] add dedicated adapter coverage through a shared contract harness

### 4. Shared contract and docs pass
- [x] create `tests/contracts/spacing.contract.ts`
- [x] prove default decorative output and local metadata across both adapters
- [x] prove size + scale behavior and no raw `scale` prop leakage across both adapters
- [x] add dedicated Accessibility notes to both Storybook intros
- [x] make docs explicit about decorative-only usage, parent-owned layout, and large-gap misuse

## Current findings — first pass (2026-04-20)

### What already looked good before this pass

#### 1. Core spacing semantics were already honest and minimal
Confirmed in:
- `packages/core/src/components/atoms/spacing/spacing.recipe.ts`
- `packages/core/src/components/atoms/spacing/spacing.types.ts`

Good signals:
- Spacing is explicitly `aria-hidden`
- the family emits only small local metadata: `data-component="spacing"` and `data-size`
- the token vocabulary is explicit and shared through `Spacings`
- `scale` is clearly positioned as an escape hatch in code

#### 2. Storybook already taught the token scale well
Confirmed in:
- `apps/storybook-react/src/stories/spacing/Introduction.mdx`
- `apps/storybook-vue/src/stories/spacing/Introduction.mdx`

Good signals:
- the full 17-size scale was already documented
- the docs already taught token usage through `Spacings`
- the family was already honest about being `aria-hidden`

### Gaps found in this pass

#### 1. Real parity bug: Vue did not declare the `scale` prop
In `packages/vue/src/components/spacing/spacing.ts`, the Vue prop list only included:
- `size`
- `className`

It omitted `scale`, even though core and React both support it.

Practical effect before this fix:
- Vue callers could pass `scale`, but it would not reach `createSpacingRecipe`
- the spacer would stay at the unscaled default token value
- the raw `scale` attribute would leak onto the DOM element instead

This was a real shipped cross-adapter contradiction, not just a documentation gap.

#### 2. The family had no dedicated core, adapter, or shared-contract runtime tests
The registry called Spacing automation `Light`, and that was accurate.
Before this pass, the strongest focused automation was only:
- Storybook intro docs tests
- Storybook taxonomy tests

That left the actual runtime contract for `aria-hidden`, local metadata, and `scale` behavior
largely unprotected.

#### 3. Storybook docs did not teach the main misuse boundary explicitly enough
The docs already said Spacing is `aria-hidden`, but they did not clearly say:
- prefer parent-owned layout when it tells the story more honestly
- large gaps should not imply hidden structure
- `scale` is an escape hatch, not the default design language

### What changed in this pass

#### 1. Fixed the Vue `scale` prop parity bug
Implemented in:
- `packages/vue/src/components/spacing/spacing.ts`

`scale` is now a declared Vue prop, so it:
- reaches the core recipe correctly
- produces the same scaled spacing output as React
- no longer leaks as a raw DOM attribute

#### 2. Added dedicated runtime test coverage across core, React, and Vue
Implemented in:
- `packages/core/test/recipes/spacing.test.ts`
- `tests/contracts/spacing.contract.ts`
- `packages/react/src/components/spacing/__tests__/spacing.test.tsx`
- `packages/vue/src/components/spacing/__tests__/spacing.test.ts`

The new contract now proves in both adapters:
- decorative default output with `aria-hidden="true"`
- local metadata: `data-component="spacing"`, `data-size="md"`
- scaled output uses `--mw-spacing-value: calc(var(--mw-spacing-sp-32) * 2)`
- raw `scale` does not leak onto the DOM

#### 3. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/spacing/Introduction.mdx`
- `apps/storybook-vue/src/stories/spacing/Introduction.mdx`

The docs now explicitly state:
- Spacing is decorative only
- parent-owned layout is often the more honest tool
- `scale` is an escape hatch, not the default design language
- large gaps should not imply hidden semantics

#### 4. Storybook docs tests now protect the new guidance
Implemented in:
- `apps/storybook-react/src/stories/spacing/__tests__/spacing-introduction-docs.test.ts`
- `apps/storybook-vue/src/stories/spacing/__tests__/spacing-introduction-docs.test.ts`

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether Spacing is being used where parent-owned `gap`, stack, or section structure would be clearer
- whether large spacing tokens are compensating for missing semantic grouping
- whether the absence of a dedicated local Figma spacing family remains acceptable long term, or should eventually be filled by a design-owned token page

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/spacing.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/spacing/__tests__/spacing.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/spacing/__tests__/spacing.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/spacing/__tests__/spacing-introduction-docs.test.ts src/stories/spacing/__tests__/spacing-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/spacing/__tests__/spacing-introduction-docs.test.ts src/stories/spacing/__tests__/spacing-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- fixed Vue `scale` prop parity bug
- new core spacing recipe tests
- new shared Spacing contract and dedicated React/Vue adapter tests
- Storybook docs with explicit guidance on decorative spacing and layout honesty
- dedicated `docs/audits/spacing-family-accessibility.md`
- roadmap, audit queue, and registry status updates that reflect the completed first pass
