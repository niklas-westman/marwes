# Spinner Family Accessibility Audit

## Goal
Audit the Spinner family through the Marwes tree with focus on the AXE watch items called out
by the registry:
- decorative-vs-status usage and its fallback behavior
- button-loading announcement quality
- reduced-motion expectations for indeterminate loading surfaces

Spinner is not a modal or interactive widget, but it still matters because it owns:
- how loading states are announced to assistive technology
- when loading animation should be suppressed or slowed
- the relationship between the spinner and the surrounding context that describes loading

The main goal of this pass is to confirm one intentional Spinner contract across:
- core decorative-vs-status policy and the `decorative={false}` fallback behavior
- React and Vue adapter correctness for the inner SVG accessibility pattern
- preset CSS reduced-motion policy
- shared contract coverage that now proves the most important a11y invariants
- Storybook, registry, and roadmap posture

## Scope
This audit covers:

### Atom
- `Spinner`

### Context wrappers
- `ButtonSpinner`
- `EmptyStateSpinner`

### Integration surface
- Button `loading` prop (both adapters)

## Tree anchors

### Core
- `packages/core/src/components/atoms/spinner/spinner-types.ts`
- `packages/core/src/components/atoms/spinner/spinner-a11y.ts`
- `packages/core/src/components/atoms/spinner/spinner-recipe.ts`
- `packages/core/src/components/atoms/spinner/spinner-svg.ts`
- `packages/core/test/recipes/spinner.test.ts`

### Presets
- `packages/presets/src/firstEdition/spinner.css`
- `packages/presets/test/spinner-css-contract.test.ts`

### React
- `packages/react/src/components/spinner/spinner.tsx`
- `packages/react/src/components/spinner/variants.tsx`
- `packages/react/src/components/spinner/__tests__/`
- `packages/react/src/components/button/button.tsx`

### Vue
- `packages/vue/src/components/spinner/spinner.ts`
- `packages/vue/src/components/spinner/variants.ts`
- `packages/vue/src/components/spinner/__tests__/`
- `packages/vue/src/components/button/button.ts`

### Stories and docs
- `apps/storybook-react/src/stories/spinner/*`
- `apps/storybook-vue/src/stories/spinner/*`

### Contracts
- `tests/contracts/spinner.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] REQ-SPINNER-001 and REQ-SPINNER-002 already exist in `docs/reference/spec.md`
- [x] confirm decorative-first policy stays the canonical guidance
- [x] confirm reduced-motion slows rather than stops as the intentional shipped decision
- [x] record the `decorative={false}` fallback behavior and add a dev warning for it

### 1. Core audit
- [x] review `spinner-types.ts`
- [x] review `spinner-a11y.ts`
- [x] review `spinner-recipe.ts`
- [x] confirm decorative default (aria-hidden=true) resolves before status mode
- [x] confirm ariaLabel triggers role=status plus aria-live=polite
- [x] confirm `decorative={false}` without ariaLabel still hides — add dev warning

### 2. Preset CSS audit
- [x] review `spinner.css`
- [x] confirm the rotation animation and slow-not-stop reduced-motion policy
- [x] add a contract test for the 1600ms reduced-motion slowdown

### 3. React adapter audit
- [x] review `spinner.tsx`
- [x] confirm outer span applies a11y props from core
- [x] confirm inner SVG is always `aria-hidden="true"` and `focusable="false"`
- [x] review `variants.tsx`
- [x] confirm ButtonSpinner defaults to decorative=true
- [x] confirm EmptyStateSpinner defaults to decorative=true

### 4. Vue adapter audit
- [x] review `spinner.ts`
- [x] confirm Vue aligns with React on outer span a11y and inner SVG accessibility
- [x] review `variants.ts`
- [x] confirm Vue wrappers stay aligned with React defaults

### 5. Shared contracts and gaps
- [x] keep the existing shared contract base cases
- [x] add inner SVG aria-hidden/focusable=false proof to the shared contract
- [x] add token size data-size attribute proof (xs and lg spot-check)
- [x] add explicit decorative=true coverage
- [x] close the gap between "strong" contract claim and minimal test count
- [x] document the reduced-motion slowdown decision in both the preset CSS contract and the audit doc

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. The core a11y policy was already correct and intentional
Confirmed in:
- `packages/core/src/components/atoms/spinner/spinner-a11y.ts`

Good signals:
- decorative default (no ariaLabel, no explicit decorative=true) correctly produces `aria-hidden="true"`
- ariaLabel path correctly produces `role="status"`, `aria-live="polite"`, no aria-hidden
- explicit `decorative={true}` also correctly produces `aria-hidden="true"`

#### 2. Both adapters correctly isolate the SVG from assistive technology
Confirmed in:
- `packages/react/src/components/spinner/spinner.tsx`
- `packages/vue/src/components/spinner/spinner.ts`

Good signals:
- inner `<svg>` has `aria-hidden="true"` and `focusable="false"` in both adapters
- this means even with `role="status"` on the outer span, AT doesn't stumble over SVG geometry
- this is the correct implementation for accessible inline SVG spinners

#### 3. Reduced-motion is handled with slow-not-stop
Confirmed in:
- `packages/presets/src/firstEdition/spinner.css`

The animation slows from 800ms to 1600ms under `prefers-reduced-motion: reduce`.
This is an intentional design choice. Keeping visible motion feedback present is a deliberate
tradeoff. The shipped guarantee is slower animation, not zero animation.

#### 4. Context wrapper defaults are honest
Confirmed in:
- `packages/react/src/components/spinner/variants.tsx`
- `packages/vue/src/components/spinner/variants.ts`

Both `ButtonSpinner` and `EmptyStateSpinner` default to `decorative=true`.
This is correct because:
- Button loading uses the button's own accessible name plus `aria-busy` to communicate loading
- Empty-state loading should be paired with nearby visible loading text
Neither context should announce independently unless product code explicitly opts in

### The main remaining gaps before this pass
Confirmed in:
- `tests/contracts/spinner.contract.ts`
- `packages/core/src/components/atoms/spinner/spinner-a11y.ts`
- `apps/storybook-react/src/stories/spinner/Introduction.mdx`
- `apps/storybook-vue/src/stories/spinner/Introduction.mdx`

Current state before the fix:
- the shared contract only had 2 tests, not covering inner SVG isolation, token sizes, or explicit decorative=true
- `decorative={false}` without ariaLabel silently fell through to hidden with no developer feedback
- Storybook intro docs did not mention reduced-motion behavior or the decorative fallback boundary
- roadmap and audit docs still described Spinner as queued

### What changed in this pass

#### 1. Dev warning added for `decorative={false}` without `ariaLabel`
Implemented in:
- `packages/core/src/components/atoms/spinner/spinner-a11y.ts`

When a developer passes `decorative={false}` without also providing `ariaLabel`, the spinner
still falls through to the hidden default. This is now flagged with a development-mode console
warning so teams catch the misuse early. The behavior itself is unchanged and intentional.

#### 2. Shared contract now proves inner SVG isolation, token sizes, and explicit decorative
Implemented in:
- `tests/contracts/spinner.contract.ts`

New proof covers:
- inner SVG is `aria-hidden="true"` and `focusable="false"` in status mode
- `xs` token size produces `data-size="xs"`
- `lg` token size produces `data-size="lg"`
- explicit `decorative={true}` keeps the spinner hidden with no role attribute

#### 3. Preset CSS contract now verifies the reduced-motion slowdown policy
Implemented in:
- `packages/presets/test/spinner-css-contract.test.ts`

The test explicitly documents and verifies the slow-not-stop decision:
animation slows to 1600ms under `prefers-reduced-motion: reduce`.

#### 4. Storybook docs now teach the accessibility boundary more explicitly
Implemented in:
- `apps/storybook-react/src/stories/spinner/Introduction.mdx`
- `apps/storybook-vue/src/stories/spinner/Introduction.mdx`

The docs now state:
- `decorative={false}` without `ariaLabel` still hides — always pair them
- reduced-motion slows not stops — pair with visible loading text in longer waits
- button loading is announced through the button context, not the spinner

#### 5. Registry, roadmap, and audit status now reflect the real shipped baseline
Implemented in:
- `docs/audits/README.md`
- `docs/registry/families/spinner/README.md`
- `docs/registry/families/spinner/registry.meta.json`
- `AXE_ROADMAP.md`

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether product teams consistently pair decorative spinners with sufficient nearby loading text
- whether `ariaLabel` wording stays truthful during longer async waits, not just in short demos
- whether the 1600ms reduced-motion slowdown is enough for users who need reduced or zero motion
  in real product flows — some users need full motion off
- whether button loading announcements feel predictable across different AT/browser combinations
  when the button label changes alongside the busy state

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/spinner.test.ts`
- [x] `pnpm --filter @marwes-ui/presets exec vitest run test/spinner-css-contract.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/spinner/__tests__/spinner.test.tsx src/components/spinner/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/spinner/__tests__/spinner.test.ts src/components/spinner/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/spinner/__tests__/spinner-introduction-docs.test.ts src/stories/spinner/__tests__/spinner-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/spinner/__tests__/spinner-introduction-docs.test.ts src/stories/spinner/__tests__/spinner-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

Broader follow-up verification when convenient:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Deliverables from this audit
- dev warning in `spinner-a11y.ts` for `decorative={false}` without `ariaLabel`
- expanded shared spinner contract covering inner SVG isolation, token sizes, and explicit decorative
- preset CSS contract test verifying the slow-not-stop reduced-motion policy
- Storybook docs that teach reduced-motion expectations and decorative fallback behavior explicitly
- registry, roadmap, and audit status that no longer understates the Spinner baseline
