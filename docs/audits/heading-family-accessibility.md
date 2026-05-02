# Heading Family Accessibility Audit

## Goal
Audit the Heading family through the Marwes tree with focus on the AXE watch item already
called out by the registry:
- keep document-outline decisions honest
- treat `size` as a visual escape hatch rather than a semantic shortcut
- avoid using heading styling for decorative emphasis when no real section heading exists

Heading is low-risk in implementation but high-value in meaning. The shipped code is already
strong, so this pass is mainly about tightening one native-semantics contract gap, making the
docs more explicit, and recording the real manual-review boundary.

## Scope

### Atoms
- `H1`
- `H2`
- `H3`

## Tree anchors

### Core
- `packages/core/src/components/atoms/heading/heading-types.ts`
- `packages/core/src/components/atoms/heading/heading-a11y.ts`
- `packages/core/src/components/atoms/heading/heading-recipe.ts`
- `packages/core/test/recipes/heading.test.ts`

### React
- `packages/react/src/components/heading/h1.tsx`
- `packages/react/src/components/heading/h2.tsx`
- `packages/react/src/components/heading/h3.tsx`
- `packages/react/src/components/heading/__tests__/heading.test.tsx`

### Vue
- `packages/vue/src/components/heading/create-heading.ts`
- `packages/vue/src/components/heading/heading-variants.ts`
- `packages/vue/src/components/heading/__tests__/heading.test.ts`

### Contracts
- `tests/contracts/heading.contract.ts`

### Stories and docs
- `apps/storybook-react/src/stories/heading/*`
- `apps/storybook-vue/src/stories/heading/*`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm Heading stays native-first and does not add family-local `data-*` metadata
- [x] confirm `size` remains visual only and does not alter the semantic tag
- [x] confirm the main accessibility boundary is product-level outline quality, not widget behavior

### 1. Core audit
- [x] review `heading-types.ts`
- [x] review `heading-a11y.ts`
- [x] review `heading-recipe.ts`
- [x] confirm native tag selection comes from `level`
- [x] confirm default visual size matches the semantic level
- [x] confirm `ariaLabel` and `id` are the only explicit a11y hooks
- [x] confirm the family intentionally emits no `data-component` metadata

### 2. React adapter audit
- [x] review `h1.tsx`, `h2.tsx`, `h3.tsx`
- [x] confirm each adapter renders the correct native heading tag
- [x] confirm `aria-label`, `id`, className, and styles are passed through from the render kit
- [x] confirm the `size` prop only changes the visual class and CSS vars

### 3. Vue adapter audit
- [x] review `create-heading.ts` and `heading-variants.ts`
- [x] confirm Vue heading variants preserve the same native tags as React
- [x] confirm `aria-label`, `id`, class merging, and style merging align with React behavior
- [x] confirm there is no extra metadata or wrapper element added in Vue

### 4. Shared contract and docs pass
- [x] review `tests/contracts/heading.contract.ts`
- [x] expand the shared contract to prove `H1` and the absence of family-local metadata
- [x] add dedicated Accessibility notes to both Storybook intros
- [x] make docs explicit about outline-first level choice, `size` not changing semantics, and decorative-heading misuse

## Current findings — first pass (2026-04-20)

### What already looked good before this pass

#### 1. Native heading semantics are the real contract and the code matches that model
Confirmed in:
- `packages/core/src/components/atoms/heading/heading-recipe.ts`
- `packages/react/src/components/heading/h1.tsx`
- `packages/react/src/components/heading/h2.tsx`
- `packages/react/src/components/heading/h3.tsx`
- `packages/vue/src/components/heading/create-heading.ts`

Good signals:
- the family renders real `h1`, `h2`, and `h3` elements
- the semantic level is source-owned and not inferred from styling
- `size` only affects visual styling through CSS vars and classes
- the family intentionally has no Marwes metadata layer because native semantics already express the meaning honestly

#### 2. Shared contract maturity was already strong
Confirmed in:
- `tests/contracts/heading.contract.ts`

Good signals:
- both adapters were already covered by the same heading contract
- the contract already proved native role/level queries, visual size override, and `id` / `aria-label` passthrough

#### 3. Core recipe tests already protected the size model
Confirmed in:
- `packages/core/test/recipes/heading.test.ts`

Good signals:
- default size mapping and explicit override behavior were already locked in
- theme-derived typography variables were already tested directly

### Gaps found in this pass

#### 1. The shared contract did not explicitly prove `H1`
Before this pass, the shared contract covered:
- one default `H2`
- one `H3` with `size="h1"`, `id`, and `ariaLabel`

That left one small but real gap: the registry said the family relied on native `h1` / `h2` /
`h3` semantics, but the cross-adapter contract never directly asserted `H1` itself.

#### 2. The shared contract did not prove the absence of family-local metadata
The registry correctly teaches that Heading emits no `data-component` or family-local `data-*`
metadata. That was true in code, but the shared contract did not protect it. The contract now
asserts that native semantics are present without a parallel Marwes metadata layer.

#### 3. Storybook docs taught usage, but not the accessibility boundary explicitly enough
The docs already mentioned outline-first usage and `size`, but they did not state clearly enough:
- heading level should be chosen by outline, not visual preference
- `size` does not change semantic level
- decorative larger text should not become a real heading
- `ariaLabel` is unusual for headings and should stay rare

### What changed in this pass

#### 1. Expanded `tests/contracts/heading.contract.ts`
The shared contract now proves in both React and Vue:
- `H1` renders as a native `h1`
- default `H2` still renders as a native `h2`
- visual size overrides do not change semantic level
- `id` and `aria-label` still pass through
- the family does not emit `data-component` metadata on the native heading surface

#### 2. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/heading/Introduction.mdx`
- `apps/storybook-vue/src/stories/heading/Introduction.mdx`

The docs now explicitly state:
- choose heading level by document outline first
- `size` changes visual scale, not semantic level
- do not use headings for decorative emphasis only
- `ariaLabel` is rare and should not replace visible heading naming without a real reason

#### 3. Storybook docs tests now protect the new guidance
Implemented in:
- `apps/storybook-react/src/stories/heading/__tests__/heading-introduction-docs.test.ts`
- `apps/storybook-vue/src/stories/heading/__tests__/heading-introduction-docs.test.ts`

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether product screens choose heading levels that produce an honest document outline
- whether `size` overrides are used sparingly instead of flattening heading hierarchy
- whether anchor-link and `id` patterns remain useful and consistent in real doc or product flows

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/heading.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/heading/__tests__/heading.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/heading/__tests__/heading.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/heading/__tests__/heading-introduction-docs.test.ts src/stories/heading/__tests__/heading-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/heading/__tests__/heading-introduction-docs.test.ts src/stories/heading/__tests__/heading-taxonomy.test.ts`
- [x] `pnpm docs:links`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- expanded shared Heading contract coverage for `H1` and for the absence of family-local metadata
- Storybook docs with explicit accessibility guidance on outline discipline, `size` semantics, and decorative-heading misuse
- dedicated `docs/audits/heading-family-accessibility.md`
- roadmap, audit queue, and registry status updates that reflect the completed first pass
