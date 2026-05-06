# Toast Family Accessibility Audit

## Goal
Audit the Toast family through the Marwes tree with focus on the remaining AXE gaps called out by the registry:
- live-region urgency and alert-vs-status defaults
- auto-dismiss timing expectations
- dismissal behavior while the user is interacting with a toast
- provider/container delivery behavior and contract maturity

Toast is not a modal-risk family, but it still matters because it owns:
- transient live-region announcements
- semantic-first purpose toasts for common product intent
- adapter-owned stacking, timing, and imperative queue delivery
- the boundary between visual inline action text and real interactive actions

The main goal of this pass is to prove one intentional Toast contract across:
- core live-region policy
- React and Vue atom, container, provider, and purpose-wrapper behavior
- shared contract coverage for semantics and delivery timing
- Storybook, registry, and roadmap posture

## Scope
This audit covers:

### Atom
- `Toast`

### Molecule
- `ToastContainer`

### Delivery layer
- `ToastProvider`
- `useToast`

### Purpose variants
- `SuccessToast`
- `ErrorToast`
- `WarningToast`
- `InfoToast`

## Tree anchors

### Core
- `packages/core/src/components/atoms/toast/toast-types.ts`
- `packages/core/src/components/atoms/toast/toast-a11y.ts`
- `packages/core/src/components/atoms/toast/toast-recipe.ts`
- `packages/core/src/components/atoms/toast/toast-container-types.ts`
- `packages/core/test/recipes/toast.test.ts`
- `packages/core/src/semantics/family-semantics.ts`
- `packages/core/src/semantics/purpose-semantics.ts`

### Presets
- `packages/presets/src/firstEdition/toast.css`
- `packages/presets/src/firstEdition/molecules/toast-container.css`

### React
- `packages/react/src/components/toast/toast.tsx`
- `packages/react/src/components/toast/toast-container.tsx`
- `packages/react/src/components/toast/toast-provider.tsx`
- `packages/react/src/components/toast/variants.tsx`
- `packages/react/src/components/toast/__tests__/`

### Vue
- `packages/vue/src/components/toast/toast.ts`
- `packages/vue/src/components/toast/toast-container.ts`
- `packages/vue/src/components/toast/toast-provider.ts`
- `packages/vue/src/components/toast/variants.ts`
- `packages/vue/src/components/toast/__tests__/`

### Stories and docs
- `apps/storybook-react/src/stories/toast/*`
- `apps/storybook-vue/src/stories/toast/*`

### Contracts
- `tests/contracts/toast.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] record the Toast family contract explicitly in `docs/reference/spec.md`
- [x] keep polite/status as the raw default and assertive/alert as the intentional urgent path
- [x] keep `ToastContainer` and `ToastProvider` as the adapter-owned delivery layer rather than pretending the raw atom owns queue behavior
- [x] document the timing boundary: short confirmations may auto-dismiss, while critical or actionable flows should opt into `duration: null` or a longer explicit duration

### 1. Core audit
- [x] review `toast-types.ts`
- [x] review `toast-a11y.ts`
- [x] review `toast-recipe.ts`
- [x] review `toast-container-types.ts`
- [x] confirm the core family semantics and purpose semantics stay canonical and centralized

### 2. Preset CSS audit
- [x] confirm the preset styling keeps toast as a non-blocking feedback surface rather than a fake dialog or banner
- [x] keep focus visibility for dismiss affordances in the manual-review boundary
- [x] note that the preset does not by itself make inline action text interactive

### 3. React adapter audit
- [x] review `toast.tsx`
- [x] review `toast-container.tsx`
- [x] review `toast-provider.tsx`
- [x] review `variants.tsx`
- [x] confirm role/status vs alert defaults route through core and purpose wrappers intentionally
- [x] confirm auto-dismiss pauses while the user is hovering or focusing within a toast

### 4. Vue adapter audit
- [x] review `toast.ts`
- [x] review `toast-container.ts`
- [x] review `toast-provider.ts`
- [x] review `variants.ts`
- [x] confirm Vue stays aligned with React on live-region semantics, timing defaults, and pause-on-interaction behavior

### 5. Shared contracts and gaps
- [x] keep the shared purpose-toast contract coverage
- [x] expand the shared contract to cover raw toast semantics and delivery-layer behavior
- [x] prove max-visible trimming, primitive neutral/brand forwarding, dismiss forwarding, provider default timing, and `duration: null` persistence across both adapters
- [x] prove auto-dismiss pause/resume behavior while pointer or focus is inside the toast
- [x] close the family's main contract-maturity gap without pretending manual AT review is solved

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. The family already had strong canonical semantic foundations
Confirmed in:
- `packages/core/src/components/atoms/toast/*`
- `packages/core/src/semantics/family-semantics.ts`
- `packages/core/src/semantics/purpose-semantics.ts`
- `packages/react/src/components/toast/variants.tsx`
- `packages/vue/src/components/toast/variants.ts`

Good signals:
- the raw atom already resolved `aria-live="polite"` to `role="status"`
- `ErrorToast` already resolved to the assertive `role="alert"` path
- canonical `data-component="toast"` and purpose-level `data-purpose` plus `data-intent` metadata were already source-owned in core
- React and Vue purpose wrappers were already aligned on success, error, warning, and info defaults

#### 2. Delivery behavior already existed across both adapters
Confirmed in:
- `packages/react/src/components/toast/toast-container.tsx`
- `packages/react/src/components/toast/toast-provider.tsx`
- `packages/vue/src/components/toast/toast-container.ts`
- `packages/vue/src/components/toast/toast-provider.ts`

Good signals:
- the family already shipped placement, stacking, max-visible trimming, dismiss forwarding, and imperative queue ownership
- provider-managed toasts already defaulted to a 4000ms timeout unless product code passed `duration: null`
- neutral and brand primitive intents already flowed through the raw toast without being mislabeled as canonical purpose toasts

### The main remaining gaps before this pass
Confirmed in:
- `tests/contracts/toast.contract.ts`
- Storybook Introduction docs in both apps
- `docs/registry/families/toast/README.md`
- `AXE_ROADMAP.md`

Current state before the fix:
- the shared contract only proved purpose-toast semantics, not the raw atom or the delivery layer
- auto-dismiss timers kept running even while pointer or focus was inside the toast
- Storybook docs mentioned auto-dismiss but did not explain the timing boundary clearly enough for critical or actionable messages
- docs used `action="Close"` style examples without making the visual-only versus interactive-action boundary explicit enough
- roadmap and audit docs still described Toast as queued despite the stronger shipped baseline

### What changed in this pass

#### 1. Toast now has one shared cross-adapter contract for semantics and delivery behavior
Implemented in:
- `tests/contracts/toast.contract.ts`
- `packages/react/src/components/toast/__tests__/variants.test.tsx`
- `packages/vue/src/components/toast/__tests__/variants.test.ts`

New proof covers:
- raw `Toast` default `status`/`polite`/`aria-atomic` semantics
- assertive raw-toast mapping to `role="alert"`
- dismiss button accessible naming on the raw atom
- canonical purpose-toast metadata and urgency defaults
- max-visible trimming in `ToastContainer`
- primitive neutral and brand forwarding without fake purpose promotion
- dismiss forwarding with toast ids
- provider default 4000ms timing and `duration: null` persistence
- pause/resume behavior while pointer or focus is inside a toast

#### 2. React and Vue delivery behavior now pause auto-dismiss during interaction
Implemented in:
- `packages/react/src/components/toast/toast-container.tsx`
- `packages/vue/src/components/toast/toast-container.ts`

New behavior:
- hover pauses the running auto-dismiss timer
- focus inside the toast pauses the running auto-dismiss timer
- the timer resumes with the remaining time after pointer and focus both leave the toast
- product teams get a safer baseline for dismiss buttons and real inline actions without the toast disappearing mid-interaction

#### 3. Storybook docs now teach the timing and action boundary more honestly
Implemented in:
- `apps/storybook-react/src/stories/toast/Introduction.mdx`
- `apps/storybook-vue/src/stories/toast/Introduction.mdx`

The docs now state:
- ToastProvider defaults to 4000ms for short confirmations
- teams should use `duration: null` or a longer explicit duration for critical or actionable toasts
- pause-on-hover and pause-on-focus are part of the delivery behavior
- literal inline action text such as `action="Close"` is visual-only unless product code passes a real interactive element

#### 4. Registry, roadmap, and audit status now reflect the real shipped baseline
Implemented in:
- `docs/audits/README.md`
- `docs/registry/families/toast/README.md`
- `docs/registry/families/toast/registry.meta.json`
- `AXE_ROADMAP.md`

The family now reads as:
- first-pass complete, not still queued
- strong contract maturity with an expanded shared contract and adapter-level tests
- still subject to manual-review follow-up for real assistive-technology timing and support-model work

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether repeated assertive announcements feel predictable and non-disruptive in real screen-reader/browser combinations
- whether the default 4000ms duration is sufficient for real message length, localization length, and action complexity
- whether product teams choose honest toast content and inline action wording instead of turning toast into a mini-dialog or notification center
- whether preset contrast, animation, and focus visibility remain acceptable in real environments and reduced-motion-sensitive contexts

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/toast.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/toast/__tests__/toast-container.test.tsx src/components/toast/__tests__/variants.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/toast/__tests__/toast-container.test.ts src/components/toast/__tests__/variants.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/toast/__tests__/toast-introduction-docs.test.ts src/stories/toast/__tests__/toast-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/toast/__tests__/toast-introduction-docs.test.ts src/stories/toast/__tests__/toast-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

Broader follow-up verification when convenient:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Deliverables from this audit
- one explicit Toast-family spec section covering live-region defaults, delivery timing, and action guidance
- one expanded shared toast contract covering atom, purpose, and delivery behavior across React and Vue
- pause-on-hover and pause-on-focus auto-dismiss behavior in both adapters
- Storybook docs, registry posture, and roadmap status that no longer understate the shipped Toast baseline
