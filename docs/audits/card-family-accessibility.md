# Card Family Accessibility Audit

## Goal
Audit the Card family through the Marwes tree with focus on the AXE gaps called out by the registry:
- passive-surface guidance is clear but shared contract maturity is weaker (`Partial`)
- whether the card surface teaches the interactive-card anti-pattern explicitly

Card is low-risk, but two things matter:
1. The registry flagged it as the only low-risk family without a shared contract — closing that gap is the primary goal.
2. Product teams commonly make cards interactive incorrectly — the intro docs should guide them clearly.

## Scope

### Atom
- `Card`

### Purpose variants
- `ProductCard`
- `ProfileCard`
- `StatCard`

## Tree anchors

### Core
- `packages/core/src/components/atoms/card/card-types.ts`
- `packages/core/src/components/atoms/card/card-recipe.ts`

### React
- `packages/react/src/components/card/card.tsx`
- `packages/react/src/components/card/variants.tsx`
- `packages/react/src/components/card/__tests__/card.test.tsx`

### Vue
- `packages/vue/src/components/card/card.ts`
- `packages/vue/src/components/card/variants.ts`
- `packages/vue/src/components/card/__tests__/card.test.ts`

### Stories and docs
- `apps/storybook-react/src/stories/card/*`
- `apps/storybook-vue/src/stories/card/*`

### Contracts
- `tests/contracts/card.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] Card is intentionally a passive surface container — no interactive semantics by default
- [x] Card title is a `<span>`, not a heading — honest about not participating in document outline
- [x] Interactive card guidance should be explicit in the docs

### 1. Core audit
- [x] review `card-types.ts`
- [x] review `card-recipe.ts`
- [x] confirm `data-component="card"` is always emitted
- [x] confirm no a11y-specific core module is needed for a passive container
- [x] note there is no `card-a11y.ts` — intentional since the card provides no accessibility affordances itself

### 2. React adapter audit
- [x] review `card.tsx`
- [x] confirm card renders a `<div>` with `mw-card` class and `data-component`
- [x] confirm title renders as `<span class="mw-card__title">` inside a `<div class="mw-card__header">`
- [x] confirm title is absent when not provided — no empty header element
- [x] confirm native div props (`aria-*`, `id`, `className`, `tabIndex`) pass through correctly
- [x] review `variants.tsx`
- [x] confirm purpose variants are thin wrappers that add only `data-purpose`

### 3. Vue adapter audit
- [x] review `card.ts`
- [x] confirm Vue aligns with React on `data-component`, title slot, and body slot rendering
- [x] confirm native attrs pass through via `useAttrs` and `omitAttrs` pattern
- [x] note API parity gap: React uses `title` prop, Vue uses `title` slot

### 4. Shared contract
- [x] create `tests/contracts/card.contract.ts` — the primary gap the registry flagged
- [x] prove `data-component="card"` in both adapters
- [x] prove title renders in `mw-card__header` and body in `mw-card__body`
- [x] prove no header element when no title is provided
- [x] prove purpose variants (`ProductCard`, `ProfileCard`, `StatCard`) each emit the correct `data-purpose`

## Current findings — first pass (2026-04-19)

### What looked good before this pass

#### 1. The card is intentionally passive and correctly implemented
Confirmed in:
- `packages/core/src/components/atoms/card/card-recipe.ts`
- `packages/react/src/components/card/card.tsx`
- `packages/vue/src/components/card/card.ts`

Good signals:
- the shell is a plain `<div>` — no implicit role, no hidden interactive behavior
- `data-component="card"` is source-owned in core
- native div props including `aria-*` attributes pass through correctly
- no empty header element is emitted when `title` is absent

#### 2. Purpose variants are correctly thin
Confirmed in:
- `packages/react/src/components/card/variants.tsx`
- `packages/vue/src/components/card/variants.ts`

Good signals:
- each variant adds exactly one `data-purpose` attribute and nothing else
- no second recipe or divergent behavior is introduced in the variants

#### 3. Local tests already covered the main rendering behavior
Confirmed in:
- `packages/react/src/components/card/__tests__/card.test.tsx`
- `packages/vue/src/components/card/__tests__/card.test.ts`

Good signals:
- title/body rendering, className/id passthrough, and `dataAttributes` merging were all already tested

### The main gap before this pass

#### No shared `tests/contracts/card.contract.ts`
This was the one concrete gap the registry flagged as `Partial` contract maturity. No shared
cross-adapter contract existed for the card family, even though the family's shipped behavior
was tested locally in both adapters.

### What changed in this pass

#### 1. Created `tests/contracts/card.contract.ts`
The family now has a shared contract proving in both React and Vue:
- `data-component="card"` on the shell
- title renders in `mw-card__header`, body in `mw-card__body`
- no header element when no title is provided
- `ProductCard` → `data-purpose="product-card"`
- `ProfileCard` → `data-purpose="profile-card"`
- `StatCard` → `data-purpose="stat-card"`

#### 2. Storybook docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/card/Introduction.mdx`
- `apps/storybook-vue/src/stories/card/Introduction.mdx`

The docs now explicitly state:
- Card is a passive `<div>` — no implicit role or heading
- Card title renders as `<span>`, not a semantic heading
- The interactive card anti-pattern (click on `<div>`) and the correct alternative (`<a>` or `<button>` wrapping)
- `aria-*` and native props pass through for compositions that need richer semantics

### API parity gap documented
React accepts `title` as a prop (`React.ReactNode`).
Vue uses a `#title` slot instead.

Both approaches render the same HTML structure and both work correctly for string titles.
The parity gap matters if product code tries to pass a string title interchangeably between
frameworks, or if a component generator assumes identical prop APIs. This is a follow-up item
rather than a blocker for this audit pass.

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether product teams keep cards passive or mistakenly treat them as interactive controls
- whether the document structure around cards (nearby headings, landmarks) provides enough
  navigational context for screen reader users who cannot see visual card groupings
- whether any future expansion toward notification-card or richer shell patterns needs a new
  accessibility contract from the ground up

## Verification

Targeted verification run for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/card/__tests__/card.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/card/__tests__/card.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/card/__tests__/card-introduction-docs.test.ts src/stories/card/__tests__/card-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/card/__tests__/card-introduction-docs.test.ts src/stories/card/__tests__/card-taxonomy.test.ts`
- [x] `pnpm docs:links`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- `tests/contracts/card.contract.ts` — closes the Partial contract maturity gap the registry flagged
- Storybook docs with a dedicated Accessibility notes section covering the passive surface, title-as-span, and interactive card guidance
- Documented API parity gap: `title` prop (React) vs `title` slot (Vue)
- Registry, roadmap, and audit status that reflect the real first-pass Card baseline
