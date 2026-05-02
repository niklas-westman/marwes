# Button Family Accessibility Audit

## Goal
Audit the Button family through the Marwes tree with special focus on the one open AXE follow-up that was still unresolved:
- anchor-backed button semantics vs native link semantics

The Button family is lower risk than coordinated custom widgets, but it is still important because it teaches one of the repo's most common product-level distinctions:
- action buttons
- navigation links styled with button affordances

The main goal of this pass is to prove that Marwes now ships one intentional policy across:
- core button semantics
- React and Vue adapters
- shared contract coverage
- Storybook guidance
- registry and roadmap posture

## Scope
This audit covers:

### Atom
- `Button`

### Visual wrappers
- `PrimaryButton`
- `SecondaryButton`
- `TextButton`
- `SuccessButton`

### Purpose variants
- `SubmitButton`
- `SaveButton`
- `CancelButton`
- `ConfirmButton`
- `VerifyButton`
- `CreateButton`
- `EditButton`
- `UploadButton`
- `DownloadButton`
- `CopyButton`
- `SearchButton`
- `FilterButton`
- `SortButton`
- `DropdownButton`
- `DestructiveButton`
- `LinkButton`
- `CloseButton`
- `RefreshButton`

## Tree anchors

### Core
- `packages/core/src/components/atoms/button/button-types.ts`
- `packages/core/src/components/atoms/button/button-a11y.ts`
- `packages/core/src/components/atoms/button/button-loading.ts`
- `packages/core/src/components/atoms/button/button-recipe.ts`

### Presets
- `packages/presets/src/firstEdition/button.css`

### React
- `packages/react/src/components/button/button.tsx`
- `packages/react/src/components/button/variants.tsx`
- `packages/react/src/components/button/__tests__/`

### React stories and docs
- `apps/storybook-react/src/stories/button/Introduction.mdx`
- `apps/storybook-react/src/stories/button/link-button.stories.tsx`
- `apps/storybook-react/src/stories/button/__tests__/button-introduction-docs.test.ts`

### Vue
- `packages/vue/src/components/button/button.ts`
- `packages/vue/src/components/button/variants.ts`
- `packages/vue/src/components/button/__tests__/`

### Vue stories and docs
- `apps/storybook-vue/src/stories/button/Introduction.mdx`
- `apps/storybook-vue/src/stories/button/link-button.stories.ts`
- `apps/storybook-vue/src/stories/button/__tests__/button-introduction-docs.test.ts`

### Contracts
- `tests/contracts/button.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] record the final navigation-semantics rule in `docs/reference/spec.md`
- [x] decide whether anchor-backed paths keep native link semantics
- [x] define the disabled/loading anchor fallback policy explicitly

### 1. Core audit
- [x] review `button-types.ts`
- [x] review `button-a11y.ts`
- [x] review `button-recipe.ts`
- [x] confirm native button paths still use native button semantics
- [x] confirm anchor-backed navigation now keeps native link semantics when `href` is present
- [x] confirm disabled/loading anchor-backed paths remove `href`, set `aria-disabled`, and suppress focus

### 2. Preset CSS audit
- [x] confirm button CSS does not depend on `role="button"` for visual treatment
- [x] confirm link-style visual treatment remains a visual choice rather than a semantics override

### 3. React adapter audit
- [x] review `button.tsx`
- [x] review `variants.tsx`
- [x] confirm the adapter applies the core a11y contract directly
- [x] confirm `LinkButton` uses native link semantics when enabled
- [x] confirm loading/disabled anchor paths stay blocked and unfocusable

### 4. React stories and tests audit
- [x] review the React button contract harness and local tests
- [x] update loading-anchor assertions to match link semantics
- [x] update docs so `LinkButton` is clearly taught as navigation rather than a fake button

### 5. Vue adapter audit
- [x] review `button.ts`
- [x] review `variants.ts`
- [x] confirm the adapter applies the core a11y contract directly
- [x] confirm `LinkButton` uses native link semantics when enabled
- [x] confirm loading/disabled anchor paths stay blocked and unfocusable

### 6. Vue stories and tests audit
- [x] review the Vue button contract harness and local tests
- [x] update loading-anchor assertions to match link semantics
- [x] update docs so Vue teaches the same navigation policy as React

### 7. Shared contracts and gaps
- [x] update `tests/contracts/button.contract.ts` to assert link semantics instead of button semantics for `LinkButton`
- [x] keep icon-only warning and loading behavior coverage intact
- [x] close the main open AXE policy gap for the family

### 8. Expected decisions from this audit
- [x] Anchor-backed navigation keeps link semantics when active
- [x] Disabled/loading anchor-backed paths remove `href`, set `aria-disabled`, and are not keyboard-focusable
- [x] Button docs should teach the action-vs-navigation distinction more directly

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. The family already had strong basic coverage
Confirmed in:
- `tests/contracts/button.contract.ts`
- `packages/react/src/components/button/__tests__/button.test.tsx`
- `packages/vue/src/components/button/__tests__/button.test.ts`

Good signals:
- native button behavior was already covered
- loading behavior was already covered
- React and Vue already shared one family contract
- icon-only naming already had a dev-time warning in core

#### 2. The open gap was narrow and policy-focused
Confirmed in:
- `packages/core/src/components/atoms/button/button-a11y.ts`
- `docs/registry/families/button/README.md`
- `AXE_ROADMAP.md`

Current state before the fix:
- anchor-backed paths rendered as `<a>`
- but core forced `role="button"`
- the shared contract also expected `LinkButton` to be discovered as a button rather than a link
- docs called this out as the main remaining AXE watch item for the family

### What changed in this pass

#### 1. Core now preserves link semantics for navigational anchors
Implemented in:
- `packages/core/src/components/atoms/button/button-a11y.ts`
- `packages/core/src/components/atoms/button/button-types.ts`

Final policy:
- active anchor-backed navigation keeps native link semantics when `href` exists
- Marwes no longer forces `role="button"` onto navigational anchors
- disabled or loading anchor-backed paths remove `href`, set `aria-disabled`, and suppress focus with `tabIndex=-1`
- when the anchor path has no active `href`, Marwes keeps the intent readable with `role="link"`

#### 2. Shared contract coverage now proves the new policy
Implemented in:
- `tests/contracts/button.contract.ts`
- `packages/react/src/components/button/__tests__/button.test.tsx`
- `packages/vue/src/components/button/__tests__/button.test.ts`

New proof:
- enabled `LinkButton` is discovered as a link, not a button
- enabled `LinkButton` keeps its `href`
- disabled `LinkButton` is still readable as link intent, has `aria-disabled`, drops `href`, and is unfocusable
- loading anchor-backed button behavior now matches the same policy in both adapters

#### 3. Storybook and spec guidance now match the shipped policy
Implemented in:
- `docs/reference/spec.md`
- `apps/storybook-react/src/stories/button/Introduction.mdx`
- `apps/storybook-vue/src/stories/button/Introduction.mdx`

Docs now teach:
- navigation stays navigation
- `LinkButton` is a purpose-level navigation link with the text-button visual treatment
- disabled/loading anchor-backed paths are intentionally non-navigable and unfocusable

### Remaining manual-review boundary
The semantics cleanup is now resolved, but product judgment still matters for:
- choosing whether a UI element is truly navigation or a local action
- deciding when a plain text link is more honest than a button-family surface
- checking the visual treatment in real product flows so link-looking buttons are not overused where ordinary text links would be clearer

## Verification

Targeted verification run for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/button/__tests__/button.test.tsx src/components/button/__tests__/purpose-button-locking.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/button/__tests__/button.test.ts src/components/button/__tests__/purpose-button-locking.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/button/__tests__/button-introduction-docs.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/button/__tests__/button-introduction-docs.test.ts`
- [x] `pnpm docs:links`

Broader follow-up verification when convenient:
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Deliverables from this audit
- one explicit semantics rule for anchor-backed navigation
- shared React/Vue contract proof for that rule
- aligned Storybook wording in both apps
- roadmap and registry posture that no longer treat link semantics as an unresolved Button-family blocker
