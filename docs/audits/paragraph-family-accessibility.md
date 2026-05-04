# Paragraph Family Accessibility Audit

## Goal
Audit the Paragraph family through the Marwes tree with focus on the AXE watch item already
called out by the registry:
- keep Paragraph for real body copy
- preserve readable long-form layouts
- do not use `size` as a substitute for richer semantic structure

Paragraph is low-risk in implementation but high-frequency in product usage. The shipped code is
already solid, so this pass is mainly about tightening one native-semantics contract gap,
making the docs more explicit, and recording the real manual-review boundary.

## Scope

### Atom
- `Paragraph`

## Tree anchors

### Core
- `packages/core/src/components/atoms/paragraph/paragraph-types.ts`
- `packages/core/src/components/atoms/paragraph/paragraph-recipe.ts`
- `packages/core/test/recipes/paragraph.test.ts`

### React
- `packages/react/src/components/paragraph/paragraph.tsx`
- `packages/react/src/components/paragraph/__tests__/paragraph.test.tsx`

### Vue
- `packages/vue/src/components/paragraph/paragraph.ts`
- `packages/vue/src/components/paragraph/__tests__/paragraph.test.ts`

### Contracts
- `tests/contracts/paragraph.contract.ts`

### Stories and docs
- `apps/storybook-react/src/stories/paragraph/*`
- `apps/storybook-vue/src/stories/paragraph/*`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm Paragraph stays native-first and does not add family-local `data-*` metadata
- [x] confirm `size` remains visual only and does not alter paragraph semantics
- [x] confirm the main accessibility boundary is content-structure quality and readability, not widget behavior

### 1. Core audit
- [x] review `paragraph-types.ts`
- [x] review `paragraph-recipe.ts`
- [x] confirm native tag is always `<p>`
- [x] confirm default size remains `md`
- [x] confirm `id` is the only explicit a11y hook in core today
- [x] confirm the family intentionally emits no `data-component` metadata

### 2. React adapter audit
- [x] review `paragraph.tsx`
- [x] confirm React renders a native paragraph element with recipe-owned classes and CSS vars
- [x] confirm `size` only changes visual styling
- [x] confirm `id`, className, and style are passed through from the render kit and props

### 3. Vue adapter audit
- [x] review `paragraph.ts`
- [x] confirm Vue preserves the same native paragraph semantics and class/style output as React
- [x] confirm there is no wrapper element or extra metadata added in Vue
- [x] confirm native attrs continue to merge through the existing Vue render-utils pattern

### 4. Shared contract and docs pass
- [x] review `tests/contracts/paragraph.contract.ts`
- [x] expand the shared contract to prove the absence of family-local metadata
- [x] add dedicated Accessibility notes to both Storybook intros
- [x] make docs explicit about body-copy semantics, `size` not changing semantics, and misuse as a heading/label/list substitute

## Current findings — first pass (2026-04-20)

### What already looked good before this pass

#### 1. Native paragraph semantics are the real contract and the code matches that model
Confirmed in:
- `packages/core/src/components/atoms/paragraph/paragraph-recipe.ts`
- `packages/react/src/components/paragraph/paragraph.tsx`
- `packages/vue/src/components/paragraph/paragraph.ts`

Good signals:
- the family renders a real `<p>` element
- the semantic role is not inferred from styling or metadata
- `size` only affects visual styling through CSS vars and classes
- the family intentionally has no Marwes metadata layer because native paragraph semantics already express the meaning honestly

#### 2. Shared contract maturity was already strong
Confirmed in:
- `tests/contracts/paragraph.contract.ts`

Good signals:
- both adapters were already covered by the same paragraph contract
- the contract already proved native paragraph rendering, default `md` styling, and explicit `size` + `id` behavior

#### 3. Core recipe tests already protected the size model
Confirmed in:
- `packages/core/test/recipes/paragraph.test.ts`

Good signals:
- the default `md` size was already tested
- explicit size and id behavior were already locked in at recipe level

### Gaps found in this pass

#### 1. The shared contract did not prove the absence of family-local metadata
The registry correctly teaches that Paragraph emits no `data-component` or family-local `data-*`
metadata. That was true in code, but the shared contract did not protect it. The contract now
asserts that native paragraph semantics are present without a parallel Marwes metadata layer.

#### 2. Storybook docs taught usage, but not the accessibility boundary explicitly enough
The docs already mentioned default size and external spacing, but they did not state clearly enough:
- Paragraph should be used for real body copy rather than generic styled text
- `size` does not change semantics
- Paragraph should not replace headings, labels, captions, or list structure
- readability still depends on surrounding layout width, rhythm, and spacing decisions

### What changed in this pass

#### 1. Expanded `tests/contracts/paragraph.contract.ts`
The shared contract now proves in both React and Vue:
- native paragraph rendering as `<p>`
- default `md` styling
- explicit size variant and `id` behavior
- absence of `data-component` metadata on the paragraph surface

#### 2. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/paragraph/Introduction.mdx`
- `apps/storybook-vue/src/stories/paragraph/Introduction.mdx`

The docs now explicitly state:
- Paragraph is real body-copy markup
- `size` changes visual emphasis, not semantics
- Paragraph should not be used as a substitute for headings or other richer structure
- readable layout still depends on external spacing and width decisions

#### 3. Storybook docs tests now protect the new guidance
Implemented in:
- `apps/storybook-react/src/stories/paragraph/__tests__/paragraph-introduction-docs.test.ts`
- `apps/storybook-vue/src/stories/paragraph/__tests__/paragraph-introduction-docs.test.ts`

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether product screens use Paragraph for real body copy instead of as a visually convenient stand-in for headings, labels, or other semantics
- whether long-form layouts remain readable at real page widths and spacing systems
- whether teams use `sm` / `md` / `lg` for reading emphasis instead of flattening document structure

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/paragraph.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/paragraph/__tests__/paragraph.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/paragraph/__tests__/paragraph.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/paragraph/__tests__/paragraph-introduction-docs.test.ts src/stories/paragraph/__tests__/paragraph-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/paragraph/__tests__/paragraph-introduction-docs.test.ts src/stories/paragraph/__tests__/paragraph-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- expanded shared Paragraph contract coverage for the absence of family-local metadata
- Storybook docs with explicit accessibility guidance on body-copy semantics, `size` semantics, and paragraph misuse
- dedicated `docs/audits/paragraph-family-accessibility.md`
- roadmap, audit queue, and registry status updates that reflect the completed first pass
