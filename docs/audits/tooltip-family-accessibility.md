# Tooltip Family Accessibility Audit

## Goal
Audit the entire Tooltip family step by step through the Marwes tree structure.

This audit starts after the Accordion pass because Tooltip is the next queued
high-risk family in `AXE_ROADMAP.md`:
- a low-level `Tooltip` atom with `role="tooltip"`
- a higher-level `TooltipGroup` icon-trigger composition
- hover and focus reveal behavior
- keyboard dismissal behavior
- a scope boundary that must stay non-interactive

The main goal is to prove that Marwes ships one intentional tooltip contract across:
- core tooltip semantics
- preset focus, motion, and open/closed styling hooks
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Tooltip`

### Molecule
- `TooltipGroup`

### Purpose variants
- None in the current public family

## Tree anchors

### Core
- `packages/core/src/components/atoms/tooltip/index.ts`
- `packages/core/src/components/atoms/tooltip/tooltip-types.ts`
- `packages/core/src/components/atoms/tooltip/tooltip-a11y.ts`
- `packages/core/src/components/atoms/tooltip/tooltip-recipe.ts`

### Presets
- `packages/presets/src/firstEdition/tooltip.css`

### React
- `packages/react/src/components/tooltip/tooltip.tsx`
- `packages/react/src/components/tooltip/tooltip-group.tsx`
- tests:
  - `packages/react/src/components/tooltip/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/tooltip/Introduction.mdx`
- `apps/storybook-react/src/stories/tooltip/tooltip.stories.tsx`
- `apps/storybook-react/src/stories/tooltip/tooltip-group.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/tooltip/__tests__/`

### Vue
- `packages/vue/src/components/tooltip/tooltip.ts`
- `packages/vue/src/components/tooltip/tooltip-group.ts`
- tests:
  - `packages/vue/src/components/tooltip/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/tooltip/Introduction.mdx`
- `apps/storybook-vue/src/stories/tooltip/tooltip.stories.ts`
- `apps/storybook-vue/src/stories/tooltip/tooltip-group.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/tooltip/__tests__/`

### Contracts
- add `tests/contracts/tooltip.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Tooltip-family requirements in `docs/reference/spec.md`
- [x] make the non-interactive tooltip scope explicit
- [x] confirm the intended dismissal model for hover, focus, and `Escape`
- [x] confirm public docs need updates to teach tooltip vs popover/dialog boundaries

### 1. Core audit
- [x] review `tooltip-types.ts`
- [x] review `tooltip-a11y.ts`
- [x] review `tooltip-recipe.ts`
- [x] verify the tooltip atom stays intentionally small and source-owned in core
- [x] verify adapter-managed group behavior does not fork the core semantic contract

### 2. Preset CSS audit
- [x] review `tooltip.css` for focus-visible treatment on the trigger
- [x] review open and closed animation hooks
- [x] review reduced-motion behavior
- [x] confirm visual open state aligns with semantic open state
- [x] confirm trigger focus remains obvious in both themes

### 3. React adapter audit
- [x] review `tooltip.tsx`
- [x] review `tooltip-group.tsx`
- [x] verify the atom applies the core render kit directly
- [x] verify trigger naming, open-state wiring, and dismissal behavior
- [x] confirm the group keeps tooltip content non-interactive

### 4. React stories and tests audit
- [x] review `apps/storybook-react/src/stories/tooltip/Introduction.mdx`
- [x] review React tooltip stories for atom, molecule, and dark-mode coverage
- [x] review `apps/storybook-react/src/stories/tooltip/__tests__/`
- [x] review `packages/react/src/components/tooltip/__tests__/`
- [x] confirm docs teach the right boundary between tooltip and richer overlays

### 5. Vue adapter audit
- [x] review `tooltip.ts`
- [x] review `tooltip-group.ts`
- [x] verify the atom applies the core render kit directly
- [x] verify trigger naming, open-state wiring, and dismissal behavior
- [x] confirm Vue event ergonomics do not change the tooltip contract

### 6. Vue stories and tests audit
- [x] review `apps/storybook-vue/src/stories/tooltip/Introduction.mdx`
- [x] review Vue tooltip stories for atom, molecule, and dark-mode coverage
- [x] review `apps/storybook-vue/src/stories/tooltip/__tests__/`
- [x] review `packages/vue/src/components/tooltip/__tests__/`
- [x] confirm Vue docs teach the same tooltip boundary as React docs

### 7. Shared contracts and gaps
- [x] add `tests/contracts/tooltip.contract.ts`
- [x] wire the shared tooltip contract into both React and Vue adapter tests
- [x] verify the contract covers trigger naming, hover/focus reveal, dismissal, and `aria-describedby` wiring
- [ ] decide whether future tooltip misuse warnings are worth adding at dev time

### 8. Expected decisions from this audit
This Tooltip-family audit should ideally end with clear answers to these questions:

- [x] Is `TooltipGroup` intentionally limited to non-interactive contextual help?
- [x] What exact open/close paths should React and Vue both guarantee?
- [x] What naming path is mandatory for the icon-only trigger?
- [ ] Which Tooltip-family stories should later be part of automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

Targeted verification for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/tooltip/__tests__/tooltip.test.tsx src/components/tooltip/__tests__/tooltip-group.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/tooltip/__tests__/tooltip.test.ts src/components/tooltip/__tests__/tooltip-group.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/tooltip/__tests__/tooltip-introduction-docs.test.ts src/stories/tooltip/__tests__/tooltip-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/tooltip/__tests__/tooltip-introduction-docs.test.ts src/stories/tooltip/__tests__/tooltip-taxonomy.test.ts`
- [x] `pnpm check:compass`

Broader follow-up verification when the queue allows:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned tooltip atom semantics
- strong React/Vue parity for `TooltipGroup` reveal and dismissal behavior
- preset focus-visible and reduced-motion coverage
- clear Storybook separation between `Tooltip` and `TooltipGroup`

### Risks to resolve or document
- missing explicit Tooltip-family accessibility requirement in `docs/reference/spec.md`
- missing shared `tooltip` contract for React/Vue parity
- docs teaching the family without defining the non-interactive boundary clearly
- tooltip-group interaction behavior living mostly in adapters rather than core-owned helpers
- any drift between Storybook claims and what contracts actually prove

### Deliverables expected from the Tooltip audit
- one clear statement of the shipped tooltip contract
- one shared `tooltip` contract for React and Vue
- proof for trigger naming, open/close behavior, and `aria-describedby` wiring
- doc updates wherever public guidance is ahead of proven behavior

## Current findings — first pass (2026-04-17)

This section records the first direct audit pass across core, presets, adapters, stories, and tests.

### What looks good right now

#### 1. Core keeps the tooltip atom intentionally small
Confirmed in:
- `packages/core/src/components/atoms/tooltip/tooltip-types.ts`
- `packages/core/src/components/atoms/tooltip/tooltip-a11y.ts`
- `packages/core/src/components/atoms/tooltip/tooltip-recipe.ts`

Good signals:
- the tooltip atom owns `role="tooltip"` and optional id wiring in core
- the render kit stays adapter-friendly and predictable
- the atom exposes stable `data-component="tooltip"` metadata
- adapters do not need to reinterpret the atom semantics

#### 2. React and Vue already ship the same interaction model for `TooltipGroup`
Confirmed in:
- `packages/react/src/components/tooltip/tooltip-group.tsx`
- `packages/vue/src/components/tooltip/tooltip-group.ts`
- local tests in both adapters

Good signals:
- both adapters open on hover and focus
- both adapters dismiss on pointer leave, focus leaving the group, and `Escape`
- both adapters keep controlled and uncontrolled open-state flows aligned
- both adapters derive a stable tooltip id when one is not provided explicitly

#### 3. Preset coverage is solid for the current tooltip scope
Confirmed in:
- `packages/presets/src/firstEdition/tooltip.css`

Good signals:
- the icon trigger has explicit `:focus-visible` styling
- reduced-motion handling disables tooltip and trigger animation
- open and closed states have distinct animation hooks
- dark-theme trigger styling exists alongside the shared tooltip bubble styling

#### 4. Storybook taxonomy was already in good shape
Confirmed in:
- `apps/storybook-react/src/stories/tooltip/*`
- `apps/storybook-vue/src/stories/tooltip/*`

Good signals:
- both Storybooks already separate the atom and molecule clearly
- both Storybooks document the help and info icon trigger paths
- both Storybooks include dark-mode examples
- intro docs already framed `TooltipGroup` as the default Figma-matched composition

### Confirmed risks and gaps

#### Risk 1. The Tooltip-family accessibility contract was not explicit in the spec
Confirmed in:
- `docs/reference/spec.md`
- current tooltip implementation and Storybook docs

Current state before follow-up fix:
- `REQ-TOOLTIP-001` recorded the family launch, but not the tooltip-specific accessibility contract
- naming, `aria-describedby`, and dismissal behavior were still taught mostly through implementation and examples
- the non-interactive boundary was not stated explicitly in one canonical place

Status after follow-up fix:
- added `REQ-TOOLTIP-002` to `docs/reference/spec.md`
- added `DEC-009` to keep tooltip content non-interactive and to record the intended dismissal model

#### Risk 2. There was no shared `tests/contracts/tooltip.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/tooltip/__tests__/`
- `packages/vue/src/components/tooltip/__tests__/`

Current state before follow-up fix:
- local tests covered hover reveal, `Escape`, and some atom basics
- there was no shared React/Vue proof for trigger naming, focus reveal, and controlled open-state behavior

Status after follow-up fix:
- added `tests/contracts/tooltip.contract.ts`
- wired the contract into both React and Vue tooltip-group tests
- the shared contract now proves atom id retention, trigger naming, default trigger labeling, hover reveal, focus reveal, blur dismissal, `Escape` dismissal, `aria-describedby` wiring, and controlled open-state behavior

#### Risk 3. Public docs did not teach the tooltip misuse boundary clearly enough
Confirmed in:
- `apps/storybook-react/src/stories/tooltip/Introduction.mdx`
- `apps/storybook-vue/src/stories/tooltip/Introduction.mdx`

Current state before follow-up fix:
- intro docs described how to use `Tooltip` and `TooltipGroup`
- they did not state clearly that tooltip content must stay non-interactive
- they did not direct consumers toward popover or dialog patterns for richer overlays

Status after follow-up fix:
- both intro docs now describe the family as non-interactive contextual help only
- both intro docs now call out `triggerLabel` as the naming path for the icon trigger
- both intro docs now direct interactive overlays toward popover or dialog patterns instead

#### Risk 4. Tooltip-group behavior is adapter-owned rather than core-owned
Confirmed in:
- `packages/react/src/components/tooltip/tooltip-group.tsx`
- `packages/vue/src/components/tooltip/tooltip-group.ts`

Current state:
- the tooltip atom semantics live in core
- the reveal and dismissal behavior lives in each adapter
- the current behavior is aligned, but future changes could drift if contracts are not treated as release-sensitive

This is acceptable for now because the interaction logic is runtime and DOM-specific, but the shared contract is now important enough to treat as the parity guardrail.

#### Risk 5. Controlled close requests are not perfectly event-count-parity between adapters
Confirmed in:
- `packages/react/src/components/tooltip/tooltip-group.tsx`
- `packages/vue/src/components/tooltip/tooltip-group.ts`
- new shared contract harness behavior during controlled close flows

Current state:
- both adapters keep controlled `open` as the source of truth
- both adapters emit the next close intent when dismissal happens
- Vue can emit duplicate `false` close requests in some controlled dismissal sequences where more than one close path fires during the same interaction

This does not currently block the accessibility contract because the controlled state remains stable and the next value is still emitted, but exact callback-count parity may be worth tightening in a later follow-up.

### Likely decisions coming out of this audit

#### Decision A — Keep tooltip content non-interactive
Reasoning from the first pass:
- the current family is a tooltip, not a popover system
- the trigger is an icon-only help affordance that works best for short contextual text
- allowing interactive content would blur the boundary between tooltip and richer overlay patterns

#### Decision B — Keep `triggerLabel` as the canonical naming path for `TooltipGroup`
Reasoning from the first pass:
- the trigger is icon-only and therefore needs an explicit accessible name
- both adapters already rely on `triggerLabel` for that path
- documenting this keeps Storybook examples aligned with the actual accessibility contract

#### Decision C — Make dismissal paths part of the contract, not an implementation detail
Reasoning from the first pass:
- both adapters already support hover/focus reveal and `Escape` dismissal
- this behavior is central to whether the tooltip is usable with keyboard navigation
- shared coverage now makes that behavior explicit and easier to keep in parity

### Recommended first fixes from the Tooltip audit

#### Fix 1 — Add the shared contract and wire it in both adapters
Files:
- `tests/contracts/tooltip.contract.ts`
- `packages/react/src/components/tooltip/__tests__/tooltip-group.test.tsx`
- `packages/vue/src/components/tooltip/__tests__/tooltip-group.test.ts`

#### Fix 2 — Record the Tooltip-family accessibility contract in the spec
Files:
- `docs/reference/spec.md`
- `docs/audits/tooltip-family-accessibility.md`

#### Fix 3 — Teach the non-interactive tooltip boundary in Storybook docs
Files:
- `apps/storybook-react/src/stories/tooltip/Introduction.mdx`
- `apps/storybook-vue/src/stories/tooltip/Introduction.mdx`

### Recommended execution order inside the Tooltip family

1. record the intended tooltip contract in the spec
2. add the shared `tooltip` contract
3. wire the contract into React and Vue adapter tests
4. update Storybook docs to teach the non-interactive boundary
5. run targeted verification and record the next findings in this doc
