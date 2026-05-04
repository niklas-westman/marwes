# Badge Family Accessibility Audit

## Goal
Audit the Badge family through the Marwes tree with focus on the AXE watch items called out
by the registry:
- wording quality for numeric-only notification badges
- grouped badge context and label quality
- keeping the passive badge surface honest

Badge is low-risk and non-interactive, but it still matters because numeric badges and grouped
badge collections are common candidates for missing context.

## Scope

### Atom
- `Badge`

### Molecule
- `BadgeGroup`

### Purpose variants
- `StatusBadge`
- `PriorityBadge`
- `NotificationBadge`

## Tree anchors

### Core
- `packages/core/src/components/atoms/badge/badge-types.ts`
- `packages/core/src/components/atoms/badge/badge-a11y.ts`
- `packages/core/src/components/atoms/badge/badge-recipe.ts`

### React
- `packages/react/src/components/badge/badge.tsx`
- `packages/react/src/components/badge/badge-group.tsx`
- `packages/react/src/components/badge/variants.tsx`
- `packages/react/src/components/badge/__tests__/`

### Vue
- `packages/vue/src/components/badge/badge.ts`
- `packages/vue/src/components/badge/badge-group.ts`
- `packages/vue/src/components/badge/variants.ts`
- `packages/vue/src/components/badge/__tests__/`

### Stories and docs
- `apps/storybook-react/src/stories/badge/*`
- `apps/storybook-vue/src/stories/badge/*`

### Contracts
- `tests/contracts/badge.contract.ts`
- `tests/contracts/badge-group.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] REQ-AVATAR-001 and purpose-badge requirements already exist in `docs/reference/spec.md` as part of the canonical semantic registry
- [x] confirm Badge stays a passive span with no interactive semantics
- [x] confirm numeric badges need `ariaLabel` — document this more prominently

### 1. Core audit
- [x] review `badge-types.ts`
- [x] review `badge-a11y.ts`
- [x] review `badge-recipe.ts`
- [x] confirm `ariaLabel` passthrough is the only a11y hook needed for a passive badge
- [x] confirm no implicit role or hidden-text pattern is needed for labeled badge content

### 2. React adapter audit
- [x] review `badge.tsx`
- [x] confirm `aria-label` is set from `kit.a11y.ariaLabel` on the span
- [x] review `badge-group.tsx`
- [x] confirm `<fieldset>` with `<legend>` and `aria-labelledby` wiring
- [x] note `label` prop accepts `ReactNode` in React
- [x] review `variants.tsx`
- [x] confirm purpose badges are thin wrappers that add `data-purpose` only

### 3. Vue adapter audit
- [x] review `badge.ts`
- [x] confirm Vue badge aligns with React on `aria-label` passthrough
- [x] review `badge-group.ts`
- [x] confirm Vue `BadgeGroup` uses same `<fieldset>` + `<legend>` + `aria-labelledby` pattern
- [x] note `label` prop in Vue is typed as `string` only, while React accepts `ReactNode` — parity gap documented

### 4. Shared contracts and gaps
- [x] keep the existing shared purpose-badge contract
- [x] add `ariaLabel` DOM verification to the badge contract
- [x] add a new `badge-group.contract.ts` proving the group role and `aria-labelledby` wiring

## Current findings — first pass (2026-04-19)

### What looked good before this pass

#### 1. Badge atom is intentionally passive and correctly implemented
Confirmed in:
- `packages/core/src/components/atoms/badge/badge-recipe.ts`
- `packages/react/src/components/badge/badge.tsx`
- `packages/vue/src/components/badge/badge.ts`

Good signals:
- the atom is a `<span>` with no role — correct for a non-interactive status label
- `ariaLabel` flows to `aria-label` in both adapters
- the recipe cleanly separates variant styling from the a11y label passthrough

#### 2. `BadgeGroup` uses a robust semantic group pattern in both adapters
Confirmed in:
- `packages/react/src/components/badge/badge-group.tsx`
- `packages/vue/src/components/badge/badge-group.ts`

Good signals:
- `<fieldset>` exposes `role="group"` natively — strong for a collection of passive labels
- `<legend>` wired via `aria-labelledby` gives the group an accessible name from visible text
- both React and Vue use the same structural pattern

#### 3. Local tests were already thorough for both adapters
Confirmed in:
- `packages/react/src/components/badge/__tests__/badge-group.test.tsx`
- `packages/vue/src/components/badge/__tests__/badge-group.test.ts`

Good signals:
- `aria-labelledby` wiring, group role, className merging, and `dataAttributes` spreading were all already tested locally

### Gaps found in this pass

#### 1. No shared cross-adapter contract for `BadgeGroup`
The group's labeled-role pattern existed in local tests only, not in a shared contract file.

#### 2. The shared badge contract tested purpose semantics but not `ariaLabel` DOM delivery
`badge.contract.ts` verified `data-purpose` metadata but did not prove that `ariaLabel` reaches `aria-label` in the rendered DOM across both adapters.

#### 3. Intro docs lacked an explicit Accessibility notes section
Guidance about numeric badge labeling and group label quality was scattered through the docs rather than having a dedicated section.

#### 4. Parity gap: `BadgeGroup` `label` prop is typed differently across adapters
- React: `label: React.ReactNode` — accepts rich content
- Vue: `label: string` — accepts string only

This is a real parity difference. Both implementations work correctly for plain text, but a product team using React may pass JSX as the group label while the Vue API cannot accept the same content. This is a follow-up item rather than a blocker for the audit pass.

### What changed in this pass

#### 1. New `tests/contracts/badge-group.contract.ts`
Implemented in:
- `tests/contracts/badge-group.contract.ts`
- `packages/react/src/components/badge/__tests__/badge-group.test.tsx`
- `packages/vue/src/components/badge/__tests__/badge-group.test.ts`

Proves across both adapters:
- `BadgeGroup` exposes `role="group"` from the `<fieldset>` element
- `aria-labelledby` wires from the fieldset to the legend text

#### 2. Badge contract now verifies `ariaLabel` flows to the DOM
Implemented in:
- `tests/contracts/badge.contract.ts`

New test proves that `ariaLabel` on a `NotificationBadge` renders as `aria-label` in the DOM.

#### 3. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/badge/Introduction.mdx`
- `apps/storybook-vue/src/stories/badge/Introduction.mdx`

The docs now explicitly state:
- numeric-only badges always need `ariaLabel`
- `BadgeGroup` label quality affects the accessible name of the whole group
- `Badge` is a passive span — interactive surfaces must use a different component

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether `ariaLabel` wording on notification badges is truthful and descriptive in real product flows
- whether `BadgeGroup` labels are context-rich enough to describe the grouped intent
- the `label` prop parity gap between React (ReactNode) and Vue (string) — decide whether to widen the Vue type or document the constraint explicitly

## Verification

Targeted verification run for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/badge/__tests__/badge.test.tsx src/components/badge/__tests__/badge-group.test.tsx src/components/badge/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/badge/__tests__/badge.test.ts src/components/badge/__tests__/badge-group.test.ts src/components/badge/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/badge/__tests__/badge-introduction-docs.test.ts src/stories/badge/__tests__/badge-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/badge/__tests__/badge-introduction-docs.test.ts src/stories/badge/__tests__/badge-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- new `tests/contracts/badge-group.contract.ts` proving group role and labelledby wiring across React and Vue
- expanded `badge.contract.ts` proving `ariaLabel` reaches the DOM
- Storybook docs with a dedicated Accessibility notes section
- documented parity gap: `BadgeGroup` label prop type differs between React and Vue
- registry, roadmap, and audit status that reflect the real first-pass Badge baseline
