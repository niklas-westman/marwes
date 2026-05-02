# Icon Family Accessibility Audit

## Goal
Audit the Icon family through the Marwes tree with focus on the AXE watch item already
called out by the registry:
- keep decorative icons hidden from assistive technology
- keep icon-only parent controls labelled at the parent surface
- stay honest about the current adapter-vs-recipe implementation split

Icon is low-risk in implementation but high-frequency in product usage. The shipped family was
already strong, so this pass mainly tightened one misuse boundary, expanded the shared contract,
and made Storybook guidance more explicit.

## Scope

### Atom
- `Icon`

## Tree anchors

### Core
- `packages/core/src/components/atoms/icon/icon-types.ts`
- `packages/core/src/components/atoms/icon/icon-a11y.ts`
- `packages/core/src/components/atoms/icon/icon-recipe.ts`
- `packages/core/src/components/atoms/icon/icon-scales.ts`
- `packages/core/src/components/atoms/icon/icon-registry.ts`
- `packages/core/test/recipes/icon.test.ts`

### React
- `packages/react/src/components/icon/icon.tsx`
- `packages/react/src/components/icon/__tests__/icon.test.tsx`

### Vue
- `packages/vue/src/components/icon/icon.ts`
- `packages/vue/src/components/icon/__tests__/icon.test.ts`

### Contracts
- `tests/contracts/icon.contract.ts`

### Stories and docs
- `apps/storybook-react/src/stories/icon/*`
- `apps/storybook-vue/src/stories/icon/*`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm Icon stays low-level and decorative by default
- [x] confirm parent controls usually own accessible naming for icon-only actions
- [x] confirm the main accessibility boundary is decorative-versus-labelled policy, not widget behavior

### 1. Core audit
- [x] review `icon-types.ts`
- [x] review `icon-recipe.ts`
- [x] review `icon-scales.ts`
- [x] add a shared `icon-a11y.ts` helper so the decorative-versus-labelled rule is source-owned in one place
- [x] confirm the family intentionally emits no `data-component` metadata
- [x] keep the generated icon inventory as the runtime source of truth

### 2. React adapter audit
- [x] review `icon.tsx`
- [x] confirm React still renders inline SVG from `iconRegistry`
- [x] centralize a11y resolution through the new core helper
- [x] add a warning test for `decorative={false}` without an accessible label

### 3. Vue adapter audit
- [x] review `icon.ts`
- [x] confirm Vue still renders inline SVG from `iconRegistry`
- [x] centralize a11y resolution through the same core helper
- [x] add a warning test for `decorative={false}` without an accessible label

### 4. Shared contract and docs pass
- [x] review `tests/contracts/icon.contract.ts`
- [x] expand the shared contract to prove the absence of family-local metadata
- [x] expand the shared contract to prove `decorative={false}` without a label still falls back to decorative behavior
- [x] add dedicated Accessibility notes to both Storybook intros
- [x] make docs explicit about decorative defaults, standalone labelled icons, and icon-only parent controls

## Current findings — first pass (2026-04-20)

### What already looked good before this pass

#### 1. The shipped decorative-versus-labelled behavior was already fundamentally correct
Confirmed in:
- `packages/core/src/components/atoms/icon/icon-recipe.ts`
- `packages/react/src/components/icon/icon.tsx`
- `packages/vue/src/components/icon/icon.ts`
- `tests/contracts/icon.contract.ts`

Good signals:
- unlabeled icons were already hidden from assistive technology
- labelled icons were already exposed with `role="img"` and `aria-label`
- size and stroke-width token behavior was already shared across React and Vue

#### 2. Storybook already taught the inventory and scale surface well
Confirmed in:
- `apps/storybook-react/src/stories/icon/Introduction.mdx`
- `apps/storybook-vue/src/stories/icon/Introduction.mdx`
- gallery stories in both apps

Good signals:
- the docs already taught icon discovery through the gallery
- size and stroke-width controls were already visible and aligned with the shipped runtime API

### Gaps found in this pass

#### 1. `decorative={false}` without a label silently fell back to decorative behavior
In both adapters, passing `decorative={false}` without an accessible label still resulted in:
- `aria-hidden="true"`
- no `role="img"`

That fallback is acceptable because an unlabeled icon should not be announced, but the component
provided no development-time feedback even when the caller explicitly asked for a non-decorative
icon.

This is the same family of problem already addressed for Spinner and Avatar: the runtime fallback
is safe, but silent misuse makes it easy for teams to assume the icon is exposed when it is not.

#### 2. The shared contract did not prove the absence of family-local metadata
The registry correctly teaches that Icon emits no `data-component` or family-local `data-*`
metadata. That was true in code, but the shared contract did not protect it.

#### 3. Storybook docs taught usage, but not the main accessibility boundary explicitly enough
The docs already covered `name`, `size`, and `strokeWidth`, but they did not state clearly enough:
- icons are decorative by default
- standalone icons need an accessible label
- icon-only controls should usually be labelled on the parent control
- `decorative={false}` alone is not enough to expose an icon to assistive technology

### What changed in this pass

#### 1. Added `packages/core/src/components/atoms/icon/icon-a11y.ts`
This new helper centralizes the icon accessibility rule for both the recipe and the shipped adapters.

It now:
- returns decorative `ariaHidden: true` output for unlabeled icons
- returns `role="img"` plus `ariaLabel` for labelled icons
- warns in development when `decorative={false}` is passed without `ariaLabel`

Warning added:

```text
[marwes] Icon: decorative={false} was passed without ariaLabel. The icon stays hidden from assistive technology unless ariaLabel is also provided.
```

#### 2. React and Vue now use the same core a11y helper
Implemented in:
- `packages/react/src/components/icon/icon.tsx`
- `packages/vue/src/components/icon/icon.ts`

This does not change the larger implementation split — both adapters still render directly from
`iconRegistry` rather than consuming the full recipe path — but it removes one meaningful a11y
parity risk by making the decorative-versus-labelled rule source-owned in core.

#### 3. Expanded `tests/contracts/icon.contract.ts`
The shared contract now proves in both React and Vue:
- unlabeled icons are decorative by default
- the icon surface emits no `data-component` metadata
- `decorative={false}` without a label still stays decorative
- labelled icons expose `role="img"` and the expected token-based size and stroke-width values

#### 4. Added warning coverage in adapter tests
Implemented in:
- `packages/react/src/components/icon/__tests__/icon.test.tsx`
- `packages/vue/src/components/icon/__tests__/icon.test.ts`

#### 5. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/icon/Introduction.mdx`
- `apps/storybook-vue/src/stories/icon/Introduction.mdx`

The docs now explicitly state:
- icons are decorative by default
- standalone icons need an accessible label
- icon-only controls should usually be labelled on the parent control
- `decorative={false}` is not enough on its own

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether icon-only parent controls get their accessible name from the parent surface or an intentional icon label
- whether the large shipped runtime inventory should stay broader than the current showcased Figma baseline
- whether the current direct-adapter rendering path should eventually converge with `createIconRecipe` and `icon.css`

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/icon.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/icon/__tests__/icon.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/icon/__tests__/icon.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/icon/__tests__/icon-introduction-docs.test.ts src/stories/icon/__tests__/icon-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/icon/__tests__/icon-introduction-docs.test.ts src/stories/icon/__tests__/icon-taxonomy.test.ts`
- [x] `pnpm docs:links`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- new shared icon a11y helper used by the recipe and both adapters
- dev warning for `decorative={false}` without `ariaLabel`
- expanded shared Icon contract coverage for no family-local metadata and explicit decorative fallback
- Storybook docs with explicit guidance on decorative defaults and parent-labelled icon-only controls
- dedicated `docs/audits/icon-family-accessibility.md`
- roadmap, audit queue, and registry status updates that reflect the completed first pass
