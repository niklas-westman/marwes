# Dialog Family Accessibility Audit

## Goal
Audit the entire Dialog family step by step through the Marwes tree structure.

This audit starts after the Slider pass because Dialog is the next queued
high-risk family in `AXE_ROADMAP.md`:
- a low-level `Dialog` atom
- a higher-level `DialogModal` composition that owns runtime modal behavior
- purpose wrappers for common confirm, destructive, and informational workflows
- a focus lifecycle that must stay aligned across React and Vue

The main goal is to prove that Marwes ships one intentional dialog contract
across:
- core dialog semantics
- preset shell and modal focus styling
- React behavior
- Vue behavior
- Storybook guidance
- shared contracts

## Scope
This audit covers:

### Atom
- `Dialog`

### Molecule
- `DialogModal`

### Purpose variants
- `ConfirmDialog`
- `DestructiveDialog`
- `InfoDialog`

## Tree anchors

### Core
- `packages/core/src/components/atoms/dialog/index.ts`
- `packages/core/src/components/atoms/dialog/dialog-types.ts`
- `packages/core/src/components/atoms/dialog/dialog-a11y.ts`
- `packages/core/src/components/atoms/dialog/dialog-recipe.ts`
- tests:
  - `packages/core/test/recipes/dialog.test.ts`

### Presets
- `packages/presets/src/firstEdition/dialog.css`
- `packages/presets/src/firstEdition/molecules/dialog-modal.css`

### React
- `packages/react/src/components/dialog/dialog.tsx`
- `packages/react/src/components/dialog/dialog-modal.tsx`
- `packages/react/src/components/dialog/variants.tsx`
- tests:
  - `packages/react/src/components/dialog/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/dialog/Introduction.mdx`
- `apps/storybook-react/src/stories/dialog/dialog.stories.tsx`
- `apps/storybook-react/src/stories/dialog/dialog-modal.stories.tsx`
- `apps/storybook-react/src/stories/dialog/confirm-dialog.stories.tsx`
- `apps/storybook-react/src/stories/dialog/destructive-dialog.stories.tsx`
- `apps/storybook-react/src/stories/dialog/info-dialog.stories.tsx`
- storybook tests:
  - `apps/storybook-react/src/stories/dialog/__tests__/`

### Vue
- `packages/vue/src/components/dialog/dialog.ts`
- `packages/vue/src/components/dialog/dialog-modal.ts`
- `packages/vue/src/components/dialog/variants.ts`
- tests:
  - `packages/vue/src/components/dialog/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/dialog/Introduction.mdx`
- `apps/storybook-vue/src/stories/dialog/dialog.stories.ts`
- `apps/storybook-vue/src/stories/dialog/dialog-modal.stories.ts`
- `apps/storybook-vue/src/stories/dialog/confirm-dialog.stories.ts`
- `apps/storybook-vue/src/stories/dialog/destructive-dialog.stories.ts`
- `apps/storybook-vue/src/stories/dialog/info-dialog.stories.ts`
- storybook tests:
  - `apps/storybook-vue/src/stories/dialog/__tests__/`

### Contracts
- existing: `tests/contracts/dialog.contract.ts`
- added in this pass: `tests/contracts/dialog-modal.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm current Dialog-family requirements in `docs/reference/spec.md`
- [x] make the shell-vs-modal boundary explicit
- [x] record the initial-focus policy explicitly
- [x] confirm Storybook docs need updates so public guidance matches the shipped layers

### 1. Core audit
- [x] review `dialog-types.ts`
- [x] review `dialog-a11y.ts`
- [x] review `dialog-recipe.ts`
- [x] separate raw-shell semantics from modal-only semantics
- [x] confirm purpose metadata remains additive rather than replacing base dialog semantics

### 2. Preset CSS audit
- [x] review `dialog.css` for close-button focus and dialog-surface fallback focus
- [x] review `molecules/dialog-modal.css` for scrim and surface layering
- [x] confirm no-focusable fallback now has visible focus treatment on the dialog surface
- [x] confirm locked-dismissal visuals still align with semantic dismissal settings

### 3. React adapter audit
- [x] review `dialog.tsx`
- [x] review `dialog-modal.tsx`
- [x] review `variants.tsx`
- [x] verify `Dialog` no longer overclaims modal semantics by default
- [x] verify `DialogModal` owns `aria-modal`, focus lifecycle, and dismissal behavior
- [x] verify purpose wrappers preserve the modal contract and purpose metadata

### 4. React stories and tests audit
- [x] review `apps/storybook-react/src/stories/dialog/Introduction.mdx`
- [x] review React dialog stories for atom, modal, and purpose coverage
- [x] review `apps/storybook-react/src/stories/dialog/__tests__/`
- [x] review `packages/react/src/components/dialog/__tests__/`
- [x] update stories to render the actual modal and purpose components rather than a raw `Dialog` stand-in

### 5. Vue adapter audit
- [x] review `dialog.ts`
- [x] review `dialog-modal.ts`
- [x] review `variants.ts`
- [x] verify `Dialog` no longer overclaims modal semantics by default
- [x] verify `DialogModal` owns `aria-modal`, focus lifecycle, and dismissal behavior
- [x] verify Vue runtime behavior stays aligned with React

### 6. Vue stories and tests audit
- [x] review `apps/storybook-vue/src/stories/dialog/Introduction.mdx`
- [x] review Vue dialog stories for atom, modal, and purpose coverage
- [x] review `apps/storybook-vue/src/stories/dialog/__tests__/`
- [x] review `packages/vue/src/components/dialog/__tests__/`
- [x] update stories to render the actual modal and purpose components rather than a raw `Dialog` stand-in

### 7. Shared contracts and gaps
- [x] keep `tests/contracts/dialog.contract.ts` for purpose-dialog metadata
- [x] add `tests/contracts/dialog-modal.contract.ts`
- [x] wire the shared modal contract into both React and Vue adapter tests
- [x] verify the contract covers naming, `aria-modal`, initial focus, no-focusable fallback, focus trap, controlled close requests, and focus restoration
- [ ] background isolation via `inert` or sibling management remains future hardening work

### 8. Expected decisions from this audit
This Dialog-family audit should ideally end with clear answers to these questions:

- [x] Which layer is allowed to claim modal semantics?
- [x] What initial-focus policy should React and Vue both guarantee?
- [x] Should the raw shell be allowed to opt into parent-managed modal semantics intentionally?
- [ ] Which Dialog-family stories should later join automated accessibility gates?

### 9. Verification
Run after finishing the family audit and any resulting fixes:

Targeted verification for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/dialog.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/dialog/__tests__/dialog.test.tsx src/components/dialog/__tests__/dialog-modal.test.tsx src/components/dialog/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/dialog/__tests__/dialog.test.ts src/components/dialog/__tests__/dialog-modal.test.ts src/components/dialog/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/dialog/__tests__/dialog-introduction-docs.test.ts src/stories/dialog/__tests__/dialog-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/dialog/__tests__/dialog-introduction-docs.test.ts src/stories/dialog/__tests__/dialog-taxonomy.test.ts`
- [x] `pnpm check:compass`

Broader follow-up verification when the queue allows:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Audit outputs to capture

### Good signals to preserve
- core-owned dialog shell naming and description logic
- shared React/Vue focus-trap and restore-focus behavior in `DialogModal`
- purpose wrappers built on top of the modal layer instead of re-implementing it
- clear Storybook separation between `Dialog`, `DialogModal`, and purpose wrappers

### Risks to resolve or document
- the raw `Dialog` shell previously emitted `aria-modal` even when no modal lifecycle existed
- there was no shared `DialogModal` contract despite cross-framework modal behavior
- Storybook modal and purpose stories previously taught the wrong component layer by rendering raw `Dialog`
- the no-focusable fallback lacked visible focus treatment on the dialog surface
- background isolation is still not handled via `inert` or equivalent sibling management

### Deliverables expected from the Dialog audit
- one clear statement of the shipped shell-vs-modal boundary
- one shared `dialog-modal` contract for React and Vue
- proof for naming, modal semantics, focus lifecycle, dismissal, and restore-focus behavior
- doc updates wherever public guidance was ahead of the actual component layering

## Current findings — first pass (2026-04-18)

This section records the first direct audit pass across core, presets, adapters,
stories, and tests.

### What looks good right now

#### 1. React and Vue already had most of the runtime modal behavior aligned
Confirmed in:
- `packages/react/src/components/dialog/dialog-modal.tsx`
- `packages/vue/src/components/dialog/dialog-modal.ts`
- local tests in both adapters

Good signals:
- both adapters already trap focus with `Tab`
- both adapters already restore focus to the prior trigger on close
- both adapters already support Escape dismissal and scrim dismissal
- both adapters already keep purpose wrappers thin on top of `DialogModal`

#### 2. The family already had a useful semantic-purpose layer
Confirmed in:
- `tests/contracts/dialog.contract.ts`
- `packages/react/src/components/dialog/variants.tsx`
- `packages/vue/src/components/dialog/variants.ts`

Good signals:
- confirm, destructive, and info wrappers already emit stable purpose metadata
- purpose wrappers already centralize default footer actions
- the purpose-level contract was already shared between React and Vue

#### 3. Preset layering for shell vs overlay was already clean
Confirmed in:
- `packages/presets/src/firstEdition/dialog.css`
- `packages/presets/src/firstEdition/molecules/dialog-modal.css`

Good signals:
- shell styling and overlay styling already live in separate preset files
- close-button focus styling already existed
- the modal surface already has a dedicated stacking context above the scrim

### Confirmed risks and gaps

#### Risk 1. The raw `Dialog` shell overclaimed modal semantics
Confirmed in:
- `packages/core/src/components/atoms/dialog/dialog-a11y.ts`
- `packages/react/src/components/dialog/dialog.tsx`
- `packages/vue/src/components/dialog/dialog.ts`

Current state before follow-up fix:
- the raw shell always emitted `aria-modal="true"`
- the raw shell did not own the full modal lifecycle that `aria-modal` implies
- Storybook atom stories rendered the raw shell inline, which made the overclaim visible in docs as well

Status after follow-up fix:
- `Dialog` is now non-modal by default
- `DialogModal` now owns `aria-modal`
- parent-managed overlays may opt the raw shell into modal semantics intentionally via `modal`
- the spec now records that boundary explicitly

#### Risk 2. There was no shared `tests/contracts/dialog-modal.contract.ts`
Confirmed in:
- `tests/contracts/`
- `packages/react/src/components/dialog/__tests__/dialog-modal.test.tsx`
- `packages/vue/src/components/dialog/__tests__/dialog-modal.test.ts`

Current state before follow-up fix:
- modal lifecycle coverage lived only in local adapter tests
- React and Vue parity depended on mirrored local assertions rather than one shared contract

Status after follow-up fix:
- added `tests/contracts/dialog-modal.contract.ts`
- wired it into both React and Vue modal tests
- the shared contract now proves naming, `aria-modal`, initial focus, no-focusable fallback, focus trap, controlled close emission, and focus restoration

#### Risk 3. Storybook guidance taught the wrong component layer
Confirmed in:
- `apps/storybook-react/src/stories/dialog/dialog-modal.stories.tsx`
- `apps/storybook-react/src/stories/dialog/confirm-dialog.stories.tsx`
- `apps/storybook-react/src/stories/dialog/destructive-dialog.stories.tsx`
- `apps/storybook-react/src/stories/dialog/info-dialog.stories.tsx`
- Vue equivalents under `apps/storybook-vue/src/stories/dialog/`

Current state before follow-up fix:
- the modal story rendered raw `Dialog` instead of `DialogModal`
- purpose stories rendered raw `Dialog` with manual data attributes instead of the actual purpose wrappers
- public docs therefore taught the right names but the wrong story implementation layer

Status after follow-up fix:
- React and Vue modal stories now render `DialogModal`
- React and Vue purpose stories now render `ConfirmDialog`, `DestructiveDialog`, and `InfoDialog`
- intro docs now explain that `DialogModal` and purpose wrappers are the canonical accessible modal paths

#### Risk 4. The no-focusable fallback had no visible focus treatment
Confirmed in:
- `packages/react/src/components/dialog/dialog-modal.tsx`
- `packages/vue/src/components/dialog/dialog-modal.ts`
- `packages/presets/src/firstEdition/dialog.css`

Current state before follow-up fix:
- both adapters focused the dialog surface when no focusable child existed
- the shell CSS did not provide a visible focus ring for that fallback state

Status after follow-up fix:
- `dialog.css` now adds a focus-visible outline to the dialog surface
- the shared modal contract now proves the fallback focus target in both adapters

#### Risk 5. Background isolation is still a real manual-review boundary
Confirmed in:
- `packages/react/src/components/dialog/dialog-modal.tsx`
- `packages/vue/src/components/dialog/dialog-modal.ts`
- `AXE_ROADMAP.md`

Current state:
- the family still does not apply `inert` or equivalent sibling management
- this means background isolation remains a future hardening item rather than a solved property of the current first pass
- the audit can move to first-pass complete status without pretending that gap is closed

### Likely decisions coming out of this audit

#### Decision A — Keep modal semantics on `DialogModal`
Reasoning from the first pass:
- `DialogModal` is the layer that actually owns scrim, portal/teleport behavior, Escape handling, focus trapping, and restore focus
- that makes it the honest place to emit `aria-modal`
- the raw shell should stay reusable for parent-managed compositions without overclaiming modal behavior automatically

#### Decision B — Make the initial-focus policy explicit
Reasoning from the first pass:
- both adapters already focused the first focusable child and fell back to the dialog surface
- that policy is deterministic enough to record in the spec and contracts
- making it explicit closes a major parity gap for future changes

#### Decision C — Teach the actual layer boundaries in Storybook
Reasoning from the first pass:
- the names in docs were already right
- the implementations in stories were not
- using the actual `DialogModal` and purpose components in public stories reduces drift between docs and shipped behavior

### Recommended first fixes from the Dialog audit

#### Fix 1 — Record the Dialog-family contract in the spec
Files:
- `docs/reference/spec.md`
- `docs/audits/dialog-family-accessibility.md`

#### Fix 2 — Add the shared modal contract and wire it into both adapters
Files:
- `tests/contracts/dialog-modal.contract.ts`
- `packages/react/src/components/dialog/__tests__/dialog-modal.test.tsx`
- `packages/vue/src/components/dialog/__tests__/dialog-modal.test.ts`

#### Fix 3 — Align the raw shell with the real modal boundary
Files:
- `packages/core/src/components/atoms/dialog/*`
- `packages/react/src/components/dialog/dialog.tsx`
- `packages/vue/src/components/dialog/dialog.ts`

#### Fix 4 — Update public docs and stories to teach the right layers
Files:
- `apps/storybook-react/src/stories/dialog/*`
- `apps/storybook-vue/src/stories/dialog/*`

### Recommended execution order inside the Dialog family

1. record the shell-vs-modal boundary in the spec
2. move raw-shell semantics and modal semantics into the right layers
3. add the shared `dialog-modal` contract
4. update Storybook stories and introductions to teach the actual layer boundary
5. run targeted verification and record the remaining hardening gaps in this doc
