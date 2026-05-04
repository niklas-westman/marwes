# Divider Family Accessibility Audit

## Goal
Audit the Divider family through the Marwes tree with focus on the AXE watch item already
called out by the registry:
- use Divider only when a real semantic separator helps
- do not use Divider as a substitute for spacing, headings, or richer labeled structure
- keep the vertical escape hatch honest about its layout dependency

Divider is low-risk and already well-covered, so this pass is mainly about validating the
shipped semantics, strengthening the shared contract around local metadata, and making the
usage guidance more explicit.

## Scope

### Atom
- `Divider`

## Tree anchors

### Core
- `packages/core/src/components/atoms/divider/divider-types.ts`
- `packages/core/src/components/atoms/divider/divider-recipe.ts`
- `packages/core/test/recipes/divider.test.ts`

### React
- `packages/react/src/components/divider/divider.tsx`
- `packages/react/src/components/divider/__tests__/divider.test.tsx`

### Vue
- `packages/vue/src/components/divider/divider.ts`
- `packages/vue/src/components/divider/__tests__/divider.test.ts`

### Contracts
- `tests/contracts/divider.contract.ts`

### Stories and docs
- `apps/storybook-react/src/stories/divider/*`
- `apps/storybook-vue/src/stories/divider/*`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] confirm Divider stays a real semantic `<hr>` with separator semantics
- [x] confirm the family remains a single atom with no labeled or text-embedded divider surface
- [x] confirm the main accessibility boundary is usage quality, not widget behavior

### 1. Core audit
- [x] review `divider-types.ts`
- [x] review `divider-recipe.ts`
- [x] confirm horizontal orientation remains the default
- [x] confirm vertical orientation emits `aria-orientation="vertical"`
- [x] confirm local family metadata is stable: `data-component`, `data-size`, `data-orientation`
- [x] confirm size mapping still matches the Figma spacing set

### 2. React adapter audit
- [x] review `divider.tsx`
- [x] confirm React renders semantic `<hr>` and spreads a11y + local metadata from the core recipe
- [x] confirm custom className and style merge on top of the recipe output
- [x] fix stale Figma reference comment to the current synced node id

### 3. Vue adapter audit
- [x] review `divider.ts`
- [x] confirm Vue renders semantic `<hr>` and spreads a11y + local metadata from the core recipe
- [x] confirm attrs/class/style merge stays aligned with the React adapter

### 4. Shared contract and docs pass
- [x] review `tests/contracts/divider.contract.ts`
- [x] expand the shared contract to verify local metadata in addition to separator semantics
- [x] add dedicated Accessibility notes to both Storybook intros
- [x] make the docs explicit about spacing-vs-structure discipline, vertical layout dependency, and the unlabeled nature of Divider

## Current findings — first pass (2026-04-20)

### What already looked good before this pass

#### 1. The shipped Divider semantics are correct and intentionally simple
Confirmed in:
- `packages/core/src/components/atoms/divider/divider-recipe.ts`
- `packages/react/src/components/divider/divider.tsx`
- `packages/vue/src/components/divider/divider.ts`

Good signals:
- the atom renders a real `<hr>` rather than a decorative `<div>`
- `role="separator"` and `aria-orientation` are source-owned in core
- horizontal remains the default while vertical stays an explicit escape hatch
- the family surface is small and honest: one atom, no hidden behaviors

#### 2. Shared contract maturity was already strong
Confirmed in:
- `tests/contracts/divider.contract.ts`

Good signals:
- both adapters were already covered by the same separator contract
- default horizontal semantics and vertical orientation behavior were already tested cross-adapter

#### 3. Core recipe coverage already protected the size scale
Confirmed in:
- `packages/core/test/recipes/divider.test.ts`

Good signals:
- the full `xxs` → `xxl` spacing map was already tested
- local metadata and recipe output stayed anchored in one place

### Gaps found in this pass

#### 1. The shared contract proved separator semantics, but not local metadata
Before this pass, the shared contract checked:
- `<hr>` rendering
- default horizontal orientation
- vertical orientation + size + id

But it did not prove the family-local metadata that the registry teaches as part of the current
Divider contract:
- `data-component="divider"`
- `data-orientation`
- `data-size`

This was a worthwhile gap to close because Divider is explicitly documented as a family-local
metadata family rather than a wave-1 centrally governed semantic family.

#### 2. Storybook docs taught usage, but not the accessibility boundary explicitly enough
The docs already described size and orientation, but they did not clearly say:
- Divider should not be used as a spacing helper
- vertical dividers depend on container height and alignment
- Divider is unlabeled and should not stand in for headings or text-embedded separators

### Contradictions found

#### 1. React adapter comment pointed at an outdated Figma node id
- `packages/react/src/components/divider/divider.tsx` referenced `node-id=1-932`
- the current synced Divider sources use the `1574:*` node set, with component `1574:21053`

This was a small but real documentation contradiction inside the component file, and it was fixed.

### What changed in this pass

#### 1. Expanded `tests/contracts/divider.contract.ts`
The shared contract now proves in both React and Vue:
- semantic `<hr>` rendering
- default `aria-orientation="horizontal"`
- default local metadata: `data-component="divider"`, `data-orientation="horizontal"`, `data-size="md"`
- vertical local metadata: `data-orientation="vertical"`, `data-size="xl"`
- optional id wiring

#### 2. Storybook intro docs now have a dedicated Accessibility notes section
Implemented in:
- `apps/storybook-react/src/stories/divider/Introduction.mdx`
- `apps/storybook-vue/src/stories/divider/Introduction.mdx`

The docs now explicitly state:
- Divider is a real semantic separator, not just a visual line
- Divider should not be used as a spacing helper
- vertical dividers depend on container layout to be visually meaningful
- Divider is unlabeled and should not replace headings or text content such as `"Or"`

#### 3. Storybook docs tests now protect the new guidance
Implemented in:
- `apps/storybook-react/src/stories/divider/__tests__/divider-introduction-docs.test.ts`
- `apps/storybook-vue/src/stories/divider/__tests__/divider-introduction-docs.test.ts`

#### 4. Status surfaces now reflect reality
Updated in:
- `docs/audits/README.md`
- `docs/registry/families/divider/registry.meta.json`
- `AXE_ROADMAP.md`

## Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether a divider adds real structure or only decorative separation
- whether vertical dividers have enough height and surrounding alignment in actual product layouts
- whether future labeled divider patterns should remain outside this family instead of expanding the current atom contract

## Verification

Targeted verification run for this pass:
- [x] `pnpm --filter @marwes-ui/core exec vitest run test/recipes/divider.test.ts`
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/divider/__tests__/divider.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/divider/__tests__/divider.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/divider/__tests__/divider-introduction-docs.test.ts src/stories/divider/__tests__/divider-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/divider/__tests__/divider-introduction-docs.test.ts src/stories/divider/__tests__/divider-taxonomy.test.ts`
- [x] `pnpm check:compass`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- expanded shared Divider contract coverage for family-local metadata
- Storybook docs with explicit accessibility guidance on spacing misuse, vertical layout dependency, and unlabeled separators
- fixed stale React Figma reference comment
- dedicated `docs/audits/divider-family-accessibility.md`
- roadmap, audit queue, and registry status updates that reflect the completed first pass
