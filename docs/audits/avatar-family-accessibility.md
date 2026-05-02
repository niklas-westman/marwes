# Avatar Family Accessibility Audit

## Goal
Audit the Avatar family through the Marwes tree with focus on the AXE watch items called out by the registry:
- image-avatar naming quality
- decorative-vs-informative intent
- grouped overflow labeling

Avatar is a low-risk, non-interactive family, but naming quality still matters because
avatars almost always represent real people whose identity should be accessible.

The main goal of this pass is to confirm one intentional Avatar contract across:
- core a11y policy for all three content types (image, initials, icon)
- the image-without-alt silent failure and dev warning
- `AvatarBadge` composite label behavior
- `AvatarGroup` default label and overflow labeling
- shared contract coverage that now proves the key invariants
- Storybook, registry, and roadmap posture

## Scope
This audit covers:

### Atom
- `Avatar`

### Molecules
- `AvatarBadge`
- `AvatarGroup`

### Purpose variants
- `ProfileAvatar`
- `PresenceAvatar`
- `TeamAvatarGroup`

## Tree anchors

### Core
- `packages/core/src/components/atoms/avatar/avatar-types.ts`
- `packages/core/src/components/atoms/avatar/avatar-a11y.ts`
- `packages/core/src/components/atoms/avatar/avatar-recipe.ts`

### React
- `packages/react/src/components/avatar/avatar.tsx`
- `packages/react/src/components/avatar/avatar-badge.tsx`
- `packages/react/src/components/avatar/avatar-group.tsx`
- `packages/react/src/components/avatar/variants.tsx`
- `packages/react/src/components/avatar/__tests__/`

### Vue
- `packages/vue/src/components/avatar/avatar.ts`
- `packages/vue/src/components/avatar/avatar-badge.ts`
- `packages/vue/src/components/avatar/avatar-group.ts`
- `packages/vue/src/components/avatar/variants.ts`
- `packages/vue/src/components/avatar/__tests__/`

### Stories and docs
- `apps/storybook-react/src/stories/avatar/*`
- `apps/storybook-vue/src/stories/avatar/*`

### Contracts
- `tests/contracts/avatar.contract.ts`
- `tests/contracts/avatar-badge.contract.ts`
- `tests/contracts/avatar-group.contract.ts`

## Step-by-step audit checklist

### 0. Spec and decision pass
- [x] REQ-AVATAR-001, REQ-AVATAR-002, and REQ-AVATAR-003 already exist in `docs/reference/spec.md`
- [x] confirm decorative-vs-informative policy per content type
- [x] confirm image-avatar silent failure and add dev warning
- [x] confirm group default label and overflow labeling

### 1. Core audit
- [x] review `avatar-types.ts`
- [x] review `avatar-a11y.ts`
- [x] review `avatar-recipe.ts`
- [x] confirm three a11y paths: decorative → ariaHidden, image → empty (relies on img alt), non-image → role=img + label
- [x] confirm non-image fallback chain: ariaLabel → normalized initials → "Avatar"
- [x] add dev warning for image avatar without alt and without ariaLabel

### 2. React adapter audit
- [x] review `avatar.tsx`
- [x] confirm image renders `<img>` with alt from content, empty string when none
- [x] confirm initials inner span is aria-hidden when outer shell has role=img
- [x] confirm icon inner element is always decorative
- [x] review `avatar-badge.tsx`
- [x] confirm composite label merges avatar name and statusLabel
- [x] confirm indicator dot is aria-hidden in both adapters
- [x] review `avatar-group.tsx`
- [x] confirm fieldset with aria-label for the group
- [x] confirm overflow counter uses role=img with its own label

### 3. Vue adapter audit
- [x] review `avatar.ts`
- [x] confirm Vue aligns with React on all three content types and a11y paths
- [x] review `avatar-badge.ts`
- [x] confirm indicator dot is aria-hidden
- [x] review `avatar-group.ts`
- [x] confirm fieldset and overflow counter stay aligned with React

### 4. Shared contracts
- [x] keep the existing shared contract base cases
- [x] add explicit ariaLabel test to the avatar atom contract
- [x] add default group label fallback test to the group contract

## Current findings — first pass (2026-04-19)

### What looked good before the follow-up fix

#### 1. Non-image avatar a11y policy is already correct
Confirmed in:
- `packages/core/src/components/atoms/avatar/avatar-a11y.ts`

Good signals:
- `decorative={true}` correctly produces `aria-hidden: true`
- icon fallback correctly gets `role: "img"` with a label
- initials correctly get `role: "img"` with normalized initials as the label
- final fallback to `"Avatar"` ensures no unlabeled non-decorative surface

#### 2. Content type inner accessibility is correct in both adapters
Confirmed in:
- `packages/react/src/components/avatar/avatar.tsx`
- `packages/vue/src/components/avatar/avatar.ts`

Good signals:
- image content: `<img>` with `alt` from content or empty string — correct HTML pattern
- initials content: inner span is `aria-hidden="true"` when outer shell has `role="img"` — correct
- icon content: inner icon is always decorative — correct

#### 3. AvatarBadge composite labeling is correct
Confirmed in:
- `packages/react/src/components/avatar/avatar-badge.tsx`
- `packages/vue/src/components/avatar/avatar-badge.ts`

Good signals:
- the badge resolves the avatar name (initials or alt text), then appends the status label
- the indicator dot is `aria-hidden="true"` in both adapters so it is not double-announced

#### 4. AvatarGroup uses fieldset semantics correctly
Confirmed in:
- `packages/react/src/components/avatar/avatar-group.tsx`
- `packages/vue/src/components/avatar/avatar-group.ts`

Good signals:
- group renders as `<fieldset>` with `aria-label` — correct landmark pattern for a
  grouped collection of images
- overflow counter uses `role="img"` with its own label rather than relying on visible
  text only
- inner avatars are not decorative inside the group, so each member still has an
  accessible name

### The main remaining gap before this pass

#### Image avatar without alt silently gets `<img alt="">`
Confirmed in both adapters:
```
<img alt={isDecorative ? "" : (content.alt ?? "")}>
```

When `type="image"` with `src` but no `alt` and no `ariaLabel` (and not `decorative`):
- the outer shell has no `role` and no `aria-hidden` — invisible to AT
- the inner `<img>` gets `alt=""` — treated as decorative by AT
- the person's identity is silently inaccessible with no warning

This is the most likely misuse path for image avatars in product code.

### What changed in this pass

#### 1. Dev warning for image avatar without accessible name
Implemented in:
- `packages/core/src/components/atoms/avatar/avatar-a11y.ts`

The warning fires in development when `resolvedType === "image"` and neither `alt`
nor `ariaLabel` is provided and the avatar is not explicitly decorative. This follows
the same `isDev()` + `__DEV__` pattern used in `button-a11y.ts` and `spinner-a11y.ts`.

#### 2. Shared contract now tests explicit ariaLabel and group default label
Implemented in:
- `tests/contracts/avatar.contract.ts`
- `tests/contracts/avatar-group.contract.ts`

New proof covers:
- explicit `ariaLabel` on a non-image avatar overrides the default "Avatar" fallback
- `AvatarGroup` without `ariaLabel` defaults to `"Avatar group"` as the group label

#### 3. Storybook docs now teach image naming and group labeling explicitly
Implemented in:
- `apps/storybook-react/src/stories/avatar/Introduction.mdx`
- `apps/storybook-vue/src/stories/avatar/Introduction.mdx`

The docs now state:
- image avatars without `alt` and without `ariaLabel` silently hide the person from AT
- `ariaLabel` also works as an alt-text fallback for image avatars
- `AvatarGroup` defaults to `"Avatar group"` — enough for a fallback but not for real contexts
- overflow counter can be relabeled with `overflowLabel` when the default wording does not fit
- `decorative` should only be used when nearby text already identifies the person

### Remaining manual-review boundary
The family first pass is now complete, but manual review still matters for:
- whether `alt` text for image avatars uses honest, useful descriptions in real product flows
- whether `AvatarGroup` labels are context-rich enough for the actual roster they represent
- whether overflow counter wording accurately represents the missing members in localised flows

## Verification

Targeted verification run for this pass:
- [x] `pnpm test:typecheck:contracts`
- [x] `pnpm --filter @marwes-ui/react exec vitest run src/components/avatar/__tests__/avatar.test.tsx src/components/avatar/__tests__/avatar-badge.test.tsx src/components/avatar/__tests__/avatar-group.test.tsx`
- [x] `pnpm --filter @marwes-ui/vue exec vitest run src/components/avatar/__tests__/avatar.test.ts src/components/avatar/__tests__/avatar-badge.test.ts src/components/avatar/__tests__/avatar-group.test.ts`
- [x] `pnpm --filter ./apps/storybook-react exec vitest run src/stories/avatar/__tests__/avatar-introduction-docs.test.ts src/stories/avatar/__tests__/avatar-taxonomy.test.ts`
- [x] `pnpm --filter ./apps/storybook-vue exec vitest run src/stories/avatar/__tests__/avatar-introduction-docs.test.ts src/stories/avatar/__tests__/avatar-taxonomy.test.ts`
- [x] `pnpm docs:links`
- [x] `pnpm registry:generate && pnpm registry:check`

## Deliverables from this audit
- dev warning in `avatar-a11y.ts` for image avatar without accessible name
- expanded shared contracts: ariaLabel test on atom, default-group-label test on group
- Storybook docs teaching image naming, group label expectations, and decorative intent boundary
- registry, roadmap, and audit status that reflect the real first-pass Avatar baseline
