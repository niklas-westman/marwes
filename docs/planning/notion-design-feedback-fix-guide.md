# Implementation Guide: Notion Design Feedback Fixes

Created: 2026-05-13
Status: validation complete - handoff blockers recorded
Branch: `add/svelte`
Source: [Playground Environment Notion page](https://www.notion.so/westman/Playground-Environment-32a635991d808058955ff5218deb8b8a?source=copy_link)

Scope: feedback under `Design notes - Svelte @Niklas Westman` and `Design notes - Vue @Niklas Westman`.

Purpose: use this as the working queue for fixing the latest design feedback one item at a time. Each item should be reproduced, classified, fixed, and verified before moving to the next.

## Living Document

This guide is a working contract, not a static plan.

- [ ] Check off tasks as they are completed.
- [ ] Add notes when implementation reality diverges from this guide.
- [ ] Reorder or split phases when blockers are discovered.
- [ ] Add new tasks discovered during implementation.
- [ ] Mark tasks as `skipped - <reason>` when they become irrelevant.
- [ ] Record timestamps on phase completions for velocity tracking.
- [ ] Update the test coverage map as tests are added or changed.

Last updated: 2026-05-14
Current phase: Phase 4 - Final Validation and Handoff

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | `pnpm` via `pnpm-lock.yaml` and `packageManager: pnpm@9.0.0` |
| Monorepo | Yes - `packages/`, `apps/`, root `pnpm-workspace.yaml` |
| Test runner | Vitest for packages and Storybook app tests; Svelte Check for Svelte typecheck; `tsc` for Vue/React/package contracts |
| Test command | `pnpm test`, with focused commands like `pnpm test:svelte`, `pnpm test:vue`, `pnpm --filter ./apps/storybook-vue test` |
| Typecheck | `pnpm typecheck`, `pnpm test:typecheck:svelte`, `pnpm test:typecheck:vue` |
| Lint | `pnpm lint`; repo-wide check also uses `pnpm exec biome check .` |
| Build | `pnpm build`, `pnpm build:packages`, `pnpm build:apps`, focused package/app builds |
| Domain checks | `pnpm validate:family <family>`, `pnpm check:changed`, `pnpm check:repo-map`, `pnpm storybook:consistency`, `pnpm parity:summary:check` |
| CI | `.github/workflows/ci.yml`, `.github/workflows/_ci.yml`, `.github/workflows/release.yml` |
| Feature paths | `packages/svelte/src/lib/components`, `packages/vue/src/components`, `packages/core/src/components/atoms`, `packages/presets/src/firstEdition`, `apps/storybook-svelte/src/stories`, `apps/storybook-vue/src/stories` |
| Existing tests | `packages/svelte/src/tests/*.test.ts`, `packages/vue/src/components/**/__tests__/*.test.ts`, `packages/core/test/**/*.test.ts`, `packages/presets/test/*.test.ts`, `apps/storybook-vue/src/stories/**/__tests__/*.test.ts` |

### Validation Stack

These commands are the exit criteria pool. Use the narrowest command for the item, then broaden when shared behavior changes.

| Purpose | Command | Scope |
|---|---|---|
| Svelte adapter tests | `pnpm --filter @marwes-ui/svelte test` | Svelte package |
| Svelte shared adapter contracts | `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts` | Svelte parity against shared React/Vue contracts |
| Svelte typecheck | `pnpm --filter @marwes-ui/svelte test:typecheck` | Svelte package |
| Svelte build | `pnpm --filter @marwes-ui/svelte build` | Svelte package |
| Svelte Storybook typecheck | `pnpm --filter ./apps/storybook-svelte typecheck` | Svelte Storybook |
| Svelte Storybook build | `pnpm --filter ./apps/storybook-svelte build` | Svelte Storybook |
| Vue adapter tests | `pnpm --filter @marwes-ui/vue test` | Vue package |
| Vue typecheck | `pnpm --filter @marwes-ui/vue test:typecheck` | Vue package |
| Vue build | `pnpm --filter @marwes-ui/vue build` | Vue package |
| Vue Storybook tests | `pnpm --filter ./apps/storybook-vue test` | Vue Storybook taxonomy/docs tests |
| Vue Storybook build | `pnpm --filter ./apps/storybook-vue build` | Vue Storybook |
| Preset/core tests | `pnpm test:core`, `pnpm test:presets` | Shared recipes and CSS contracts |
| Family validation | `pnpm validate:family <family>` | Family-specific package/docs/artifact checks, including Svelte shared contracts for enrolled families |
| Changed-file validation | `pnpm check:changed` | Final local handoff |

## Working Rules

- Work one unchecked item at a time.
- Start every item by opening the Notion screenshots and the linked Storybook story when present.
- Compare against React, Vue, Svelte, and Figma where the feedback mentions parity.
- Classify the fix before editing: package component, preset CSS, Storybook story/docs, or shared core contract.
- Prefer story-only fixes when the component is correct and the problem is only the demo.
- If a shared visual token is wrong, inspect `packages/core` and `packages/presets` before patching one adapter.
- After each fix, add or adjust the smallest meaningful package/story test.
- Mark the item complete only after local validation is recorded in this file.

## Common Validation

Use the narrowest checks for the item, then run the family/repo checks when the change touches shared behavior.

```bash
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/svelte test
pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts
pnpm --filter @marwes-ui/svelte build
pnpm --filter ./apps/storybook-svelte typecheck
pnpm --filter ./apps/storybook-svelte build

pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/vue test
pnpm --filter @marwes-ui/vue build
pnpm --filter ./apps/storybook-vue test
pnpm --filter ./apps/storybook-vue build

pnpm validate:family <family>
pnpm check:changed
```

## 1. Architecture Contract

### Problem Statement

The latest Notion feedback identifies visual, Storybook, and documentation drift in the Svelte and Vue Marwes adapters after the update. The implementation work needs to preserve package contracts while bringing the demos and visuals back into framework parity.

### Chosen Approach

Treat each Notion item as an executable unit. Reproduce the issue, classify the owning layer, patch the smallest correct surface, add or update tests where the behavior is durable, and record validation before moving to the next item.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| `packages/core` | Shared recipes, semantic data, Storybook helper metadata, a11y mappings | Framework-specific rendering or Storybook wrappers |
| `packages/presets` | Shared first-edition CSS, tone/outline/variant visual language | Adapter state handling or story composition |
| `packages/svelte` | Svelte components, public exports, Svelte behavior tests | Vue-specific docs/tests or React baseline behavior |
| `packages/vue` | Vue components, public exports, Vue behavior tests | Svelte story wrappers or React-only implementation details |
| `apps/storybook-svelte` | Svelte story taxonomy, demos, MDX docs, Svelte visual parity stories | Package behavior unless the package is actually wrong |
| `apps/storybook-vue` | Vue story taxonomy, demos, MDX docs, Vue visual parity stories | Shared design tokens unless adapter-specific evidence proves it |
| Notion feedback | User-facing bug report and visual evidence | Source of permanent architecture truth |

### Non-Negotiables

- [ ] Do not patch one adapter when the defect belongs to shared core or preset CSS.
- [ ] Do not remove valid component states just to make stories appear smaller.
- [ ] Do not mark an item done without a validation record.
- [ ] Do not advance past ambiguous design intent; stop and ask.
- [ ] Keep React/Vue/Svelte parity explicit unless a difference is intentionally documented.

## 2. Implementation Phases

### Phase 0: Reproduction and Classification

**Goal:** For each Notion item, capture the current behavior, baseline framework comparison, and owning layer.
**Depends on:** None
**Status:** Complete

#### Inputs

- Notion screenshots and linked Storybook URLs.
- Current repo source and Storybook stories.
- React/Vue/Svelte baselines where relevant.

#### Outputs

- Each queue item has `Owner`, `Baseline`, and `Fix type` notes added before implementation starts.
- Ambiguous items are marked blocked with a direct question.

#### Relevant Paths

| What | Path | Action |
|---|---|---|
| Guide | `docs/planning/notion-design-feedback-fix-guide.md` | Edit |
| Svelte stories | `apps/storybook-svelte/src/stories` | Read |
| Vue stories | `apps/storybook-vue/src/stories` | Read |
| React baseline stories | `apps/storybook-react/src/stories` | Read |
| Svelte package | `packages/svelte/src/lib/components` | Read |
| Vue package | `packages/vue/src/components` | Read |
| Shared CSS | `packages/presets/src/firstEdition` | Read |
| Shared recipes | `packages/core/src/components/atoms` | Read |

#### Tasks

- [ ] Open each Notion screenshot and linked Storybook URL.
  - **Tool:** browser / Notion / Storybook
  - **Verify:** Evidence note added to item.
- [ ] Compare against the matching React/Vue/Svelte baseline.
  - **Tool:** read / browser
  - **Verify:** Baseline note added to item.
- [ ] Classify each item as `component`, `preset`, `core`, `story`, `docs`, or `blocked`.
  - **Tool:** edit
  - **Verify:** Queue row or item notes updated.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Documentation | Guide paths and item inventory | Yes | `git diff --check` |
| Type safety | None, discovery only | Not applicable | Not applicable |
| Domain | Path references still exist | Manual | Open linked paths in this guide |

#### Phase Exit Criteria

- [ ] All items have owner/baseline notes.
- [ ] Ambiguities are called out before code edits.
- [ ] `git diff --check` passes.

#### Failure Protocol

| If | Then |
|---|---|
| Screenshot intent is unclear | Stop and ask Niklas before editing |
| A path is missing | Search the repo, update the guide, then continue |
| Baselines disagree | Prefer code/generated artifacts, then reference docs, then registry, then audits |

### Phase 1: Svelte Story Parity Fixes

**Goal:** Fix Svelte issues that are likely Storybook/demo parity problems before touching shared visuals.
**Depends on:** Phase 0
**Status:** Complete

#### Inputs

- Classified items: `S02`, `S03`, `S04`, `S05`, `S06`, `S07`, `S09`, `S10`.

#### Outputs

- Updated Svelte stories and wrappers where required.
- Svelte Storybook typecheck/build validation records.

#### Tasks

- [x] Execute `S02 - Svelte Checkbox`.
  - **Tool:** read / edit / bash
  - **Verify:** S02 validation record.
- [x] Execute `S03 - Svelte Dialog`.
  - **Tool:** read / edit / bash
  - **Verify:** S03 validation record.
- [x] Execute `S04 - Svelte Input Dropdown`.
  - **Tool:** read / edit / bash
  - **Verify:** S04 validation record.
- [x] Execute `S05 - Svelte Radio`.
  - **Tool:** read / edit / bash
  - **Verify:** S05 validation record.
- [x] Execute `S06 - Svelte Slider`.
  - **Tool:** read / edit / bash
  - **Verify:** S06 validation record.
- [x] Execute `S07 - Svelte Spinner`.
  - **Tool:** read / edit / bash
  - **Verify:** S07 validation record.
- [x] Execute `S09 - Svelte Switch`.
  - **Tool:** read / edit / bash
  - **Verify:** S09 validation record.
- [x] Execute `S10 - Svelte Tab`.
  - **Tool:** read / edit / bash
  - **Verify:** S10 validation record.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Story type safety | Svelte story and wrapper validity | Yes | `pnpm --filter ./apps/storybook-svelte typecheck` |
| Story build | Renderable Storybook output | Yes | `pnpm --filter ./apps/storybook-svelte build` |
| Package behavior | Only if component code changes | Yes | `pnpm --filter @marwes-ui/svelte test` |
| Shared adapter contracts | Svelte parity with React/Vue contracts | Yes | `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts` |
| Type safety | Only if package code changes | Yes | `pnpm --filter @marwes-ui/svelte test:typecheck` |

#### Phase Exit Criteria

- [ ] All Phase 1 item validation records are filled.
- [ ] Svelte Storybook typecheck passes.
- [ ] Svelte Storybook build passes, or failure is documented as unrelated/pre-existing.
- [ ] Package tests/typecheck pass if package code changed.
- [ ] Svelte shared contracts pass after any adapter behavior change.
- [ ] Guide updated with completion timestamps.

### Phase 2: Svelte Shared Visual Fixes

**Goal:** Fix Svelte visual feedback that may require shared preset/core updates.
**Depends on:** Phase 0
**Status:** Complete

#### Inputs

- Classified items: `S01`, `S08`, `S11`.
- Updated Notion visual references.

#### Outputs

- Avatar, StatTile, Toast, Badge visual language aligned.
- Preset/core/package tests updated where durable behavior changes.

#### Tasks

- [x] Execute `S01 - Svelte Avatar`.
  - **Tool:** read / edit / bash
  - **Verify:** S01 validation record.
- [x] Execute `S08 - Svelte Stat Tile`.
  - **Tool:** read / edit / bash
  - **Verify:** S08 validation record.
- [x] Execute `S11 - Svelte Toast`.
  - **Tool:** read / edit / bash
  - **Verify:** S11 validation record.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Preset contracts | CSS selectors/tokens for affected families | Yes | `pnpm test:presets` or targeted preset test |
| Core recipes | Tone/variant mapping if changed | Yes | `pnpm test:core` or targeted recipe test |
| Svelte package | Component behavior if changed | Yes | `pnpm --filter @marwes-ui/svelte test` |
| Svelte shared contracts | Shared adapter behavior if changed | Yes | `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts` |
| Svelte Storybook | Visual demos still build | Yes | `pnpm --filter ./apps/storybook-svelte build` |
| Family validation | Family artifacts/docs consistency | Yes | `pnpm validate:family avatar`, `pnpm validate:family stat-tile`, `pnpm validate:family toast` |

#### Phase Exit Criteria

- [x] All Phase 2 item validation records are filled.
- [x] Shared preset/core checks pass if touched.
- [x] Relevant family validation passes or documented blocker exists.
- [x] Guide updated with completion timestamps.

### Phase 3: Vue Feedback Fixes

**Goal:** Fix Vue Button, Dialog docs, and Spinner feedback.
**Depends on:** Phase 0
**Status:** Complete

#### Inputs

- Classified items: `V01`, `V02`, `V03`.

#### Outputs

- Vue loading button sizing aligned.
- Vue Dialog docs bug fixed.
- Vue Spinner light mode and dots-square visuals corrected.

#### Tasks

- [x] Execute `V01 - Vue Button Loading Size`.
  - **Tool:** read / edit / bash
  - **Verify:** V01 validation record.
- [x] Execute `V02 - Vue Dialog Docs Bug`.
  - **Tool:** read / edit / bash
  - **Verify:** V02 validation record.
- [x] Execute `V03 - Vue Spinner`.
  - **Tool:** read / edit / bash
  - **Verify:** V03 validation record.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Vue package | Button/Spinner behavior and variants | Yes | `pnpm --filter @marwes-ui/vue test` |
| Vue type safety | Adapter contracts | Yes | `pnpm --filter @marwes-ui/vue test:typecheck` |
| Vue Storybook docs | Dialog docs/taxonomy | Yes | `pnpm --filter ./apps/storybook-vue test` |
| Vue Storybook build | Renderable docs/stories | Yes | `pnpm --filter ./apps/storybook-vue build` |
| Shared preset/core | If spinner/button visual tokens are shared | Yes | `pnpm test:core`, `pnpm test:presets` |

#### Phase Exit Criteria

- [x] All Phase 3 item validation records are filled.
- [x] Vue package and Storybook checks pass as applicable.
- [x] Shared checks pass if shared files changed.
- [x] Guide updated with completion timestamps.

### Phase 4: Final Validation and Handoff

**Goal:** Confirm the complete Notion feedback queue is handled and the repo is ready for review.
**Depends on:** Phases 1-3
**Status:** Complete with blockers recorded

#### Outputs

- All item checkboxes complete or explicitly skipped with reason.
- Full changed-file validation result recorded.

#### Tasks

- [x] Run the broadest affordable validation for changed areas.
  - **Tool:** bash
  - **Verify:** command output recorded in this guide.
- [x] Run `pnpm test:typecheck:contracts`.
  - **Tool:** bash
  - **Verify:** shared contract TypeScript surface still typechecks.
- [x] Run `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts`.
  - **Tool:** bash
  - **Verify:** Svelte remains enrolled in the shared React/Vue adapter contracts.
- [x] Run `pnpm check:changed`.
  - **Tool:** bash
  - **Verify:** result recorded in closeout checklist.
- [x] Update completion tracker.
  - **Tool:** edit
  - **Verify:** all completed phases have timestamps.

#### Tests for This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Changed files | Repo-defined changed-file gate | Yes | `pnpm check:changed` |
| Contract typecheck | Shared contract TS surface | Yes | `pnpm test:typecheck:contracts` |
| Svelte shared contracts | Svelte adapter parity with shared contracts | Yes | `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts` |
| Storybook consistency | Story taxonomy/artifact consistency | Yes | `pnpm storybook:consistency` or `pnpm check:repo-map` |
| Full package validation | Affected packages | Yes | `pnpm validate:packages` if feasible |

#### Phase Exit Criteria

- [x] `pnpm check:changed` result recorded.
- [x] Any skipped broad checks include a reason.
- [x] All durable changes have tests or documented rationale.
- [x] Guide reflects final state.

## 3. Repeatable Unit Contract

### Unit Template: Notion Feedback Item

| Step | Description | Path | Action | Verify | Test |
|---|---|---|---|---|---|
| 1 | Open Notion screenshot and linked Storybook story | Notion + story URL | Read | Evidence understood | Manual |
| 2 | Compare matching framework baselines | React/Vue/Svelte story paths | Read | Baseline note added | Manual |
| 3 | Classify owning layer | Item path list | Edit guide | Owner/fix type noted | `git diff --check` |
| 4 | Patch smallest correct surface | Component/story/preset/core paths | Edit | Local visual/behavior check | Focused test |
| 5 | Add or update tests | Existing family test paths | Edit/Create | Test fails before or covers new behavior | Focused test command |
| 6 | Record validation | This guide | Edit | Commands/result filled | Narrow + phase exit commands |

Unit done when:

- [ ] Notion feedback is directly addressed.
- [ ] Correct owning layer was used.
- [ ] Tests pass or a test gap is explicitly justified.
- [ ] Storybook/package checks pass for changed area.
- [ ] Validation record is filled.

### Units Queue

| Status | ID | Framework | Family | Feedback | Likely scope |
|---|---:|---|---|---|---|
| [x] | S01 | Svelte | Avatar | AvatarBadge indicator misaligned; sizes/dark sizes look the same; AvatarGroup needs update | story + preset |
| [x] | S02 | Svelte | Checkbox | More states than React and Vue | story parity / API review |
| [x] | S03 | Svelte | Dialog | Svelte has a button opening a dialog; others show Dialog only | Storybook story parity |
| [x] | S04 | Svelte | Input | Dropdown uses native dropdown; confirm intended behavior | component contract / story docs |
| [x] | S05 | Svelte | Radio | Radio has a square around the component only in Svelte | Svelte component structure |
| [x] | S06 | Svelte | Slider | Brightness slider lacks top value labels compared with other frameworks | component contract + story/docs parity |
| [x] | S07 | Svelte | Spinner | ButtonSpinner is only spinner, no button | Storybook story parity |
| [x] | S08 | Svelte | Stat tile | Looks good, but outline should sync with Toast and Badge | preset/shared visual token |
| [x] | S09 | Svelte | Switch | All States only shows disabled state | Storybook story parity |
| [x] | S10 | Svelte | Tab | All States only shows one state | Storybook story parity |
| [x] | S11 | Svelte | Toast | Colors should sync with updated variants, Badge, and Stat tile | preset/shared visual token |
| [x] | V01 | Vue | Button | Loading and Loading with label differ by 1-2px | Storybook story parity |
| [x] | V02 | Vue | Dialog | Docs bug | Storybook docs |
| [x] | V03 | Vue | Spinner | EmptyStateSpinner light mode uses dark background; dots-square is too mushed | story + shared core SVG |

## 4. Test Strategy

### Principles

- Tests are phase exit criteria, not optional follow-up.
- If a relevant test does not exist, creating or extending it is the first implementation task for that item.
- Prefer tests that validate user-visible behavior, Storybook taxonomy, public API, or shared visual contract.
- Story-only fixes may rely on Storybook typecheck/build plus existing taxonomy/docs tests.
- Shared core/preset fixes require shared tests, not only adapter tests.

### Coverage Map

| Area | What is Tested | Test Type | Exists? | Path / Command |
|---|---|---|---|---|
| Svelte components | Behavior, exports, adapter integrity | Unit/type | Yes | `packages/svelte/src/tests/*.test.ts`, `pnpm --filter @marwes-ui/svelte test` |
| Vue components | Behavior, variants, exports | Unit/type | Yes | `packages/vue/src/components/**/__tests__/*.test.ts`, `pnpm --filter @marwes-ui/vue test` |
| Core recipes | Shared semantics and generated classes/data | Unit | Yes | `packages/core/test/recipes/*.test.ts`, `pnpm test:core` |
| Preset CSS | CSS contract for first-edition families | Unit | Yes | `packages/presets/test/*-css-contract.test.ts`, `pnpm test:presets` |
| Vue Storybook docs | Docs/taxonomy coverage | Unit | Yes | `apps/storybook-vue/src/stories/**/__tests__/*.test.ts` |
| Svelte Storybook docs | Typecheck/build plus family docs/taxonomy guards where present | Type/build/unit | Partial | `pnpm --filter ./apps/storybook-svelte test`, `pnpm --filter ./apps/storybook-svelte typecheck`, `pnpm --filter ./apps/storybook-svelte build` |

### Full Validation Run

```bash
pnpm --filter @marwes-ui/svelte test:typecheck
pnpm --filter @marwes-ui/svelte test
pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts
pnpm --filter @marwes-ui/vue test:typecheck
pnpm --filter @marwes-ui/vue test
pnpm test:core
pnpm test:presets
pnpm test:typecheck:contracts
pnpm --filter ./apps/storybook-svelte typecheck
pnpm --filter ./apps/storybook-vue test
pnpm check:changed
```

## 5. Failure and Rollback Protocol

| Failure Type | Detection | Action |
|---|---|---|
| Test failure | Test command exits non-zero | Fix in the current item before proceeding |
| Type error | Typecheck exits non-zero | Check contracts between core, preset, adapter, and story layers |
| Build failure | Storybook/package build exits non-zero | Check exports, story wrappers, package imports, and CSS imports |
| Visual mismatch | Screenshot still differs from Notion/Figma/baseline | Reclassify owner; do not paper over with story-only styling |
| Missing input | Screenshot or design intent unavailable | Mark blocked and ask Niklas |
| Ambiguous requirement | Expected behavior cannot be inferred | Stop and ask before editing |
| Repeated failure | Same check fails three times | Document blocker and propose alternate approach |

## 6. Completion Tracker

| Phase | Title | Status | Tests | Validation | Completed |
|---|---|---|---|---|---|
| 0 | Reproduction and Classification | Not started | Pending | Pending | - |
| 1 | Svelte Story Parity Fixes | Complete | S02-S10 pass | S02-S10 pass; `check:compass` has known pre-existing broken link | 2026-05-14 |
| 2 | Svelte Shared Visual Fixes | Complete | S01/S08/S11 pass | S01/S08/S11 pass; `check:compass` has known pre-existing broken link | 2026-05-14 |
| 3 | Vue Feedback Fixes | Complete | V01/V02/V03 focused checks pass | V01 Storybook taxonomy/typecheck pass; V02 docs/build pass; V03 spinner family passes until known `check:compass` broken link | 2026-05-14 |
| 4 | Final Validation and Handoff | Complete | `pnpm validate:packages` passes; contracts pass; Storybook consistency passes | `pnpm check:changed` passes | 2026-05-14 |

### Release Readiness Remaining Order

1. Manually inspect the final Storybook visuals against the original Notion screenshots before release signoff.
2. Re-enable Datepicker stories/docs when the component is ready for review, then remove the temporary `date-picker` exclusion from `.pi/storybook-companion.config.ts`.

## S01 - Svelte Avatar

Feedback:

- AvatarBadge indicator is misaligned.
- `All Sizes` and `Dark Sizes` look the same.
- AvatarGroup needs to be updated.
- Notion includes an updated variant reference.

Primary paths:

- [AvatarBadge.svelte](../../packages/svelte/src/lib/components/avatar/AvatarBadge.svelte)
- [AvatarGroup.svelte](../../packages/svelte/src/lib/components/avatar/AvatarGroup.svelte)
- [Avatar.svelte](../../packages/svelte/src/lib/components/avatar/Avatar.svelte)
- [avatar.css](../../packages/presets/src/firstEdition/avatar.css)
- [avatar-badge.stories.ts](../../apps/storybook-svelte/src/stories/avatar/avatar-badge.stories.ts)
- [AvatarBadgeGallery.svelte](../../apps/storybook-svelte/src/stories/avatar/AvatarBadgeGallery.svelte)
- [avatar-group.stories.ts](../../apps/storybook-svelte/src/stories/avatar/avatar-group.stories.ts)
- [AvatarGroupDark.svelte](../../apps/storybook-svelte/src/stories/avatar/AvatarGroupDark.svelte)
- [Svelte avatar tests](../../packages/svelte/src/tests/avatar.test.ts)
- [React avatar stories baseline](../../apps/storybook-react/src/stories/avatar)
- [Vue avatar stories baseline](../../apps/storybook-vue/src/stories/avatar)

Investigation:

- [x] Open the Notion updated variant feedback and compare against local Figma avatar refs.
- [x] Confirm whether `AvatarBadgeGallery.svelte` should split `AllSizes` and `DarkSizes`; both stories rendered the same gallery before this fix.
- [x] Check whether `AvatarGroup.svelte` hardcodes `size="medium"` and whether that conflicts with the updated variant. React and Vue hardcode the same medium group pattern, matching the Figma avatar-group component.
- [x] Inspect preset selectors for `mw-avatar-badge__indicator`, size modifiers, group overlap, and dark-mode tokens.

Owner classification:

- `AllSizes` / `DarkSizes`: Svelte Storybook story composition.
- AvatarBadge indicator placement: shared preset CSS already matched the Figma exported `right: -1px`, `bottom: -1px`, and 8/10/12px indicator sizes, so no placement change was made.
- AvatarGroup update: shared preset CSS metrics were adjusted to the Figma export for outside stroke width and counter text line-height.

Changes:

- Split Svelte `AvatarBadgeGallery.svelte` into `mode="light"` and `mode="dark"` render paths.
- Updated `avatar-badge.stories.ts` so `AllSizes` renders light only and `DarkSizes` renders dark only.
- Updated `avatar.css` AvatarGroup stroke width from `2.5px` to Figma-aligned `2px`.
- Updated `avatar.css` AvatarGroup counter line-height from `16px` to Figma-aligned `12px`.
- Updated `.mw-avatar--icon` to be borderless and use the shared surface token in light and dark modes.
- Updated AvatarGroup counter fill/stroke separation so the light counter keeps an inverted fill with a white ring and dark AvatarGroup shadows resolve black.
- Fixed React/Vue adapter theme-integrity validators so they scan package `src` only instead of package-level `node_modules`.
- Added `packages/presets/test/avatar-css-contract.test.ts` to lock the AvatarBadge and AvatarGroup Figma metrics.

Acceptance:

- AvatarBadge indicator aligns to the updated variant across small, medium, and large.
- `AllSizes` and `DarkSizes` demonstrate distinct light and dark contexts.
- AvatarGroup matches the updated variant and remains accessible.
- Svelte visuals remain aligned with React/Vue where the design has not intentionally changed.
- AvatarGroup has been checked off against the shared family validator and Svelte-specific checks.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/presets test -- avatar-css-contract.test.ts`
  - `pnpm validate:family avatar`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- avatar.test.ts`
  - `pnpm exec biome check packages/presets/test/avatar-css-contract.test.ts apps/storybook-svelte/src/stories/avatar/AvatarBadgeGallery.svelte apps/storybook-svelte/src/stories/avatar/avatar-badge.stories.ts packages/presets/src/firstEdition/avatar.css`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `git diff --check`
- Result: Passed. `pnpm validate:family avatar` required an escalated rerun because the sandbox blocked `tsx` IPC pipe creation for `registry:check`. Storybook build completed with only the existing large chunk size warning from Vite.

## S02 - Svelte Checkbox

Feedback:

- Svelte Checkbox shows more states than React and Vue.

Primary paths:

- [Checkbox.svelte](../../packages/svelte/src/lib/components/checkbox/Checkbox.svelte)
- [CheckboxShowcase.svelte](../../apps/storybook-svelte/src/stories/checkbox/CheckboxShowcase.svelte)
- [checkbox.stories.ts](../../apps/storybook-svelte/src/stories/checkbox/checkbox.stories.ts)
- [checkbox.css](../../packages/presets/src/firstEdition/checkbox.css)
- [Svelte checkbox tests](../../packages/svelte/src/tests/checkbox.test.ts)
- [React checkbox story baseline](../../apps/storybook-react/src/stories/checkbox/checkbox.stories.tsx)
- [Vue checkbox story baseline](../../apps/storybook-vue/src/stories/checkbox/checkbox.stories.ts)

Investigation:

- [x] Decide whether the Svelte story is overcomplete or React/Vue are behind the intended design.
- [x] Compare `AllStates`, `Sizes`, `Controlled`, `Indeterminate`, and `Playground` against React/Vue.
- [x] If Svelte has extra visual states due to invalid/indeterminate combos, check whether the component supports them intentionally.

Owner classification:

- Extra `Default` and `Checked` top-level stories were Svelte Storybook drift; React/Vue use `Playground` for default and cover checked state inside `AllStates`.
- Missing `lg` size and less complete grouped states were Svelte Storybook parity drift.
- `defaultChecked` not working in Svelte was adapter drift against the shared core checkbox contract.

Changes:

- Removed Svelte-only top-level `Default` and `Checked` stories.
- Aligned Svelte checkbox story exports with React/Vue: `Playground`, `UncontrolledDefaultChecked`, `Controlled`, `Indeterminate`, `Disabled`, `Invalid`, `Sizes`, and `AllStates`.
- Updated `CheckboxShowcase.svelte` so `AllStates`, `Sizes`, `Disabled`, `Invalid`, and `Indeterminate` mirror React/Vue coverage.
- Fixed `Checkbox.svelte` to pass `defaultChecked` through the core recipe when `checked` is not controlled.
- Added a Svelte checkbox test for uncontrolled `defaultChecked`.

Acceptance:

- Story coverage is consistent across frameworks, or the extra Svelte states are documented as intentional.
- The public Checkbox API remains compatible with core semantics.
- No component behavior is removed only to hide story coverage.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/svelte test -- checkbox.test.ts`
  - `pnpm --filter @marwes-ui/svelte test:typecheck`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `node ./scripts/storybook-consistency.mjs --family checkbox`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `pnpm exec biome check packages/svelte/src/tests/checkbox.test.ts apps/storybook-svelte/src/stories/checkbox/checkbox.stories.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `git diff --check`
- Result: Passed. Svelte package typecheck still reports the existing repo warnings in unrelated provider/input/radio/dialog/accordion/tab files, but no errors remain.

## S03 - Svelte Dialog

Feedback:

- Svelte has a button opening a dialog, while the others show Dialog only.

Primary paths:

- [Dialog.svelte](../../packages/svelte/src/lib/components/dialog/Dialog.svelte)
- [DialogModal.svelte](../../packages/svelte/src/lib/components/dialog/DialogModal.svelte)
- [dialog.stories.ts](../../apps/storybook-svelte/src/stories/dialog/dialog.stories.ts)
- [dialog-modal.stories.ts](../../apps/storybook-svelte/src/stories/dialog/dialog-modal.stories.ts)
- [DialogStory.svelte](../../apps/storybook-svelte/src/stories/dialog/DialogStory.svelte)
- [React dialog story baseline](../../apps/storybook-react/src/stories/dialog/dialog.stories.tsx)
- [Vue dialog story baseline](../../apps/storybook-vue/src/stories/dialog/dialog.stories.ts)

Investigation:

- [x] Confirm which Svelte story the screenshot refers to: atom `Dialog`, molecule `DialogModal`, or purpose dialog stories.
- [x] Keep `Dialog/Atom` as the no-trigger visual baseline if React/Vue do that.
- [x] Keep trigger-button wrappers only for modal/purpose stories that need interaction.

Owner classification:

- `Dialog/Atom` was already a no-trigger story but lacked the same rendered body/footer surface as React/Vue.
- `Dialog/Molecule` used a Svelte-only trigger helper while React/Vue render `DialogModal` open by default for visual parity.
- Purpose dialog stories still use trigger buttons because they are interaction-focused wrappers.

Changes:

- Added `DialogAtomStory.svelte` to render raw `Dialog` body/footer content in Svelte Storybook.
- Updated `dialog.stories.ts` to use the atom helper for `Default` and `ContentOnly`.
- Updated `DialogStory.svelte` so molecule stories render `DialogModal` open by default instead of first showing an `Open dialog` button.
- Aligned the locked-dismissal molecule story copy/footer shape with React/Vue.
- Removed autodocs from `dialog-modal.stories.ts` because the story uses a local helper wrapper rather than the public `DialogModal` component, and generated docs for that page were broken.
- Updated `ConfirmDialogStory.svelte`, `InfoDialogStory.svelte`, and `DestructiveDialogStory.svelte` so purpose dialog stories render open by default without trigger buttons.
- Aligned Svelte purpose dialog story descriptions with React.

Acceptance:

- `Dialog/Atom` shows the dialog content directly.
- `Dialog/Molecule` and purpose wrappers only use buttons where open/close state is required.
- `Dialog/Molecule` does not publish broken autodocs from a story-only wrapper.
- Purpose dialog stories show the dialog directly and do not render `Open ... dialog` trigger buttons.
- Story taxonomy remains consistent with React and Vue.

Validation record:

- Commands:
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `node ./scripts/storybook-consistency.mjs --family dialog`
  - `pnpm --filter @marwes-ui/svelte test -- dialog.test.ts`
  - `pnpm --filter @marwes-ui/svelte test:typecheck`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `pnpm exec biome check apps/storybook-svelte/src/stories/dialog/dialog.stories.ts apps/storybook-svelte/src/stories/dialog/DialogStory.svelte apps/storybook-svelte/src/stories/dialog/DialogAtomStory.svelte`
  - `pnpm exec biome check apps/storybook-svelte/src/stories/dialog/dialog-modal.stories.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `rg --line-number "Open .*dialog|onclick=\\{\\(\\) => \\(open = true\\)\\}|let open = \\$state\\(false\\)" apps/storybook-svelte/src/stories/dialog -g '*.{svelte,ts}'`
  - `git diff --check`
- Result: Passed. The trigger scan returned no matches. Dialog unit tests report the existing Svelte accessibility warning for `Dialog.svelte` tabindex, and Svelte package typecheck reports existing unrelated warnings, but no errors.

## S04 - Svelte Input Dropdown

Feedback:

- DropdownField uses native dropdown. Confirm whether it should behave like that.
- Storybook link from Notion: `https://storybook-svelte.marwes.io/1.3.0-alpha2/?path=/story/input-purpose-dropdownfield--with-helper-text`

Primary paths:

- [DropdownField.svelte](../../packages/svelte/src/lib/components/input/DropdownField.svelte)
- [Select.svelte](../../packages/svelte/src/lib/components/input/Select.svelte)
- [SelectField.svelte](../../packages/svelte/src/lib/components/input/SelectField.svelte)
- [dropdown-field.stories.ts](../../apps/storybook-svelte/src/stories/input/dropdown-field.stories.ts)
- [select-field.stories.ts](../../apps/storybook-svelte/src/stories/input/select-field.stories.ts)
- [input.css](../../packages/presets/src/firstEdition/input.css)
- [select-recipe.ts](../../packages/core/src/components/atoms/input/select-recipe.ts)
- [React input baseline](../../apps/storybook-react/src/stories/input)
- [Vue input baseline](../../apps/storybook-vue/src/stories/input)

Investigation:

- [x] Determine whether the Marwes contract expects native `<select>` or custom dropdown UI.
- [x] Compare React/Vue DropdownField and SelectField implementation and screenshots.
- [x] If native select is intended, update docs/story naming or helper copy to avoid confusion.
- [x] If custom menu is intended, define the accessible behavior before implementing.

Owner classification:

- `DropdownField` is a Svelte adapter/component contract issue. React and Vue already default `DropdownField` to the Marwes custom dropdown and use `native={true}` only as an opt-in browser select fallback.
- Svelte `SelectField` was missing the Marwes button/listbox control path for `native: false`; Storybook exposed that as a native-looking dropdown in the purpose story.

Changes:

- Updated Svelte `DropdownField.svelte` so it defaults `select.native` to `false`, matching React/Vue.
- Updated Svelte `SelectField.svelte` so Marwes mode renders a combobox trigger button, listbox options, selected check icon, hidden form proxy input, disabled/invalid/helper/error a11y wiring, keyboard navigation, and outside-click close behavior.
- Kept native mode as the existing `<Select>` path when `select.native === true`.
- Added `onvaluechange` support to Svelte `Select`/`SelectProps` so custom and native select paths can notify value changes consistently.
- Added `packages/svelte/src/tests/dropdown-field.test.ts` using the shared cross-framework DropdownField contract.

Acceptance:

- DropdownField behavior is intentionally aligned across frameworks.
- Visual styling matches the current design spec for native or custom dropdown.
- The story makes the chosen behavior clear without relying on hidden context.
- Default `DropdownField` renders the Marwes combobox trigger; `Native` still renders browser `<select>` chrome.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/svelte test -- dropdown-field.test.ts select-textarea.test.ts`
  - `pnpm --filter @marwes-ui/svelte test:typecheck`
  - `pnpm --filter @marwes-ui/svelte build`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `pnpm exec biome check packages/svelte/src/lib/components/input/SelectField.svelte packages/svelte/src/lib/components/input/Select.svelte packages/svelte/src/lib/components/input/DropdownField.svelte packages/svelte/src/lib/components/input/types.ts packages/svelte/src/tests/dropdown-field.test.ts apps/storybook-svelte/src/stories/input/dropdown-field.stories.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `git diff --check`
- Result: Passed. Svelte package typecheck still reports existing unrelated warnings in provider/input/radio/dialog/accordion/tab files, but no errors and no new SelectField warnings. Storybook build completed with only the existing large chunk size warning from Vite.

## S05 - Svelte Radio

Feedback:

- Radio has a square around the component only in Svelte.
- Storybook link from Notion: `https://storybook-svelte.marwes.io/1.3.0-alpha2/?path=/story/radio-purpose-option--default`

Primary paths:

- [Radio.svelte](../../packages/svelte/src/lib/components/radio/Radio.svelte)
- [OptionRadioGroup.svelte](../../packages/svelte/src/lib/components/radio/OptionRadioGroup.svelte)
- [radio.stories.ts](../../apps/storybook-svelte/src/stories/radio/radio.stories.ts)
- [option-radio-group.stories.ts](../../apps/storybook-svelte/src/stories/radio/option-radio-group.stories.ts)
- [RadioGroupFieldStory.svelte](../../apps/storybook-svelte/src/stories/radio/RadioGroupFieldStory.svelte)
- [radio.css](../../packages/presets/src/firstEdition/radio.css)
- [radio-group-field.css](../../packages/presets/src/firstEdition/molecules/radio-group-field.css)
- [Svelte radio tests](../../packages/svelte/src/tests/radio.test.ts)
- [React radio baseline](../../apps/storybook-react/src/stories/radio)
- [Vue radio baseline](../../apps/storybook-vue/src/stories/radio)

Investigation:

- [x] Check whether the square is from the component, a Storybook wrapper, focus outline, fieldset border, or molecule CSS.
  - Result: Svelte `RadioGroupField` used a native `fieldset`, which brought the browser default square border because the shared preset did not reset fieldset styling.
- [x] Compare `OptionRadioGroup` with React/Vue purpose stories.
  - Result: React/Vue render a plain `.mw-radio-group-field` wrapper and a nested `role="radiogroup"` options container. Svelte now matches that structure and keeps `data-purpose="selection"` on the radio group field wrapper.
- [x] Confirm that keyboard focus remains visible after removing any unwanted visual container.
  - Result: Focus remains owned by the `Radio` atom and its existing `.mw-radio` focus styling; only the native fieldset container was removed.
- [x] Compare `RadioGroupField` option label typography across React/Vue/Svelte.
  - Result: The canonical radio option label typography is `mw-p mw-p--sm`. React and Vue already used `Paragraph size="sm"`; Svelte variant option labels had drifted to `mw-p--md`.

Owner:

- Svelte component structure, not shared preset CSS.

Changes:

- Replaced the native `fieldset`/`legend` structure in `RadioGroupField.svelte` with the same wrapper/inner-radiogroup structure used by React/Vue.
- Added `required`, `disabled`, and `dataAttributes` support to Svelte `RadioGroupFieldProps`.
- Updated `OptionRadioGroup.svelte` to pass `data-purpose="selection"` directly to the field wrapper, pass required/disabled state through, and propagate invalid state to child radios.
- Added `packages/svelte/src/tests/radio-group-field.test.ts` using the shared radio-group contract plus a regression check that no native `fieldset` is rendered.
- Follow-up: fixed the Svelte `Radio/Atom` `RadioGroup` story, which was rendering one radio instead of the three-option React baseline story.
- Added Svelte Storybook radio taxonomy/parity coverage and wired Svelte package/story checks into `pnpm validate:family <family>`.
- Extended `tests/contracts/radio-group-field.contract.ts` to require canonical option label typography: `mw-p mw-p--sm`.
- Kept React and Vue `RadioGroupField` option labels at `Paragraph size="sm"` and updated Svelte `OptionRadioGroup`, `YesNoRadioGroup`, and `RatingRadioGroup` option labels to `mw-p--sm`.
- Added Svelte variant assertions so `YesNoRadioGroup` and `RatingRadioGroup` option labels cannot drift back to `mw-p--md`.

Acceptance:

- No unintended square container appears in the Svelte radio purpose story.
- Focus styling remains accessible and design-aligned.
- Svelte radio story layout matches React/Vue parity.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/svelte test -- radio.test.ts radio-group-field.test.ts`
  - `pnpm --filter @marwes-ui/svelte test:typecheck`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/radio/__tests__/radio-taxonomy.test.ts`
  - `pnpm --filter @marwes-ui/react test -- src/components/radio/__tests__/radio-group-field.test.tsx`
  - `pnpm --filter @marwes-ui/vue test -- src/components/radio/__tests__/radio-group-field.test.ts`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/radio-group-field.test.ts`
  - `node ./scripts/storybook-consistency.mjs --family radio`
  - `pnpm registry:check`
  - `pnpm exec biome check tests/contracts/radio-group-field.contract.ts packages/react/src/components/radio/radio-group-field.tsx packages/vue/src/components/radio/radio-group-field.ts`
  - `pnpm exec biome check packages/svelte/src/lib/components/radio/types.ts packages/svelte/src/lib/components/radio/RadioGroupField.svelte packages/svelte/src/lib/components/radio/OptionRadioGroup.svelte packages/svelte/src/tests/radio-group-field.test.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `pnpm validate:family radio`
- Result: Focused React/Vue/Svelte radio group contract tests, focused Svelte tests, Storybook typecheck/build, Storybook consistency, registry check, and Biome checks passed. `pnpm validate:family radio` now runs React/Vue/Svelte package radio tests plus Svelte Storybook radio tests, then fails only at `pnpm check:compass` because `docs/README.md` still links to the deleted `docs/planning/release-1-0-0-hardening-plan.md`.

### Shared Contract Enrollment Follow-up - Svelte

Date: 2026-05-14

- Added `packages/svelte/src/tests/shared-contracts.test.ts` so Svelte runs the existing React/Vue shared contracts instead of relying only on adapter-local assertions.
- Enrolled Svelte in shared contracts for accordion, avatar, avatar-badge, avatar-group, badge, badge-group, button, card, checkbox, checkbox-field, checkbox-group-field, dialog, dialog-modal, divider, heading, icon, input, input-field, input-otp, paragraph, radio, radio-group-field, rich-text, select, select-field, select-combobox, skeleton, slider, spinner, switch, tab, textarea, toast, tooltip, and zip-code-field.
- Updated `scripts/validate-family.mjs` so `pnpm validate:family <family>` includes `src/tests/shared-contracts.test.ts` for Svelte families enrolled in that shared contract file.
- Contract fixes made while enrolling: `AccordionField` default multi-open behavior now matches React/Vue; `DialogModal` close requests now keep controlled `open` as source-of-truth when `onopenchange` is supplied; `TooltipGroup` uses focus-in/out behavior for child trigger focus; `ToastContainer` owns auto-dismiss pause/resume timers and `ToastProvider` delegates dismissal timing to the container.
- Result: `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts` passes with 199 tests. `pnpm validate:family radio` now runs `src/tests/shared-contracts.test.ts` as part of the Svelte family test step and reaches the existing repo checks; `registry:check` passes outside the sandbox after a sandbox IPC failure, and `check:compass` still fails on the pre-existing broken `docs/README.md` link to `./planning/release-1-0-0-hardening-plan.md`. The shared contract run still prints existing Svelte compiler warnings in unrelated or pre-existing areas such as provider state capture, input/rich-text state capture, dialog tabindex, radio `aria-invalid`, accordion group `aria-invalid`, and tablist tabindex.

## S06 - Svelte Slider

Feedback:

- BrightnessSlider only has a slider.
- It is missing the values at the top that exist in other frameworks.

Primary paths:

- [BrightnessSlider.svelte](../../packages/svelte/src/lib/components/slider/BrightnessSlider.svelte)
- [Slider.svelte](../../packages/svelte/src/lib/components/slider/Slider.svelte)
- [SliderField.svelte](../../packages/svelte/src/lib/components/slider/SliderField.svelte)
- [brightness-slider.stories.ts](../../apps/storybook-svelte/src/stories/slider/brightness-slider.stories.ts)
- [slider.css](../../packages/presets/src/firstEdition/slider.css)
- [slider-field.css](../../packages/presets/src/firstEdition/molecules/slider-field.css)
- [Svelte slider tests](../../packages/svelte/src/tests/slider.test.ts)
- [React brightness baseline](../../apps/storybook-react/src/stories/slider/brightness-slider.stories.tsx)
- [Vue brightness baseline](../../apps/storybook-vue/src/stories/slider/brightness-slider.stories.ts)

Investigation:

- [x] Compared Svelte `BrightnessSlider`, `SliderField`, and `Slider` against React/Vue.
- [x] Classified the missing values as component contract parity, not story-only composition. React/Vue render edge values from `SliderField`; Svelte `SliderField` lacked that structure.
- [x] Confirmed current value display comes from the low-level `Slider` tooltip and min/max edge labels belong in `SliderField`.
- [x] Added Svelte Storybook slider docs/taxonomy guards so `pnpm validate:family slider` now includes Svelte slider story coverage.

Changes:

- Added Svelte `SliderField` support for `description`, `labelPosition`, `showEdgeValues`, `minValueLabel`, `maxValueLabel`, `dataAttributes`, invalid state, and React/Vue-style field structure.
- Updated Svelte `BrightnessSlider`, `VolumeSlider`, and `RadiusSlider` purpose wrappers to render through `SliderField` with default edge labels, tooltips, purpose data attributes, and direct orientation support.
- Added shared slider contract coverage for edge value labels from slider bounds.
- Added Svelte slider unit coverage for edge labels, inline labels, purpose wrappers, vertical orientation, and radius bounds.
- Updated Svelte slider stories/docs to use `description`, `labelPosition`, `showTouchArea`, and the React/Vue-aligned brightness default.

Acceptance:

- [x] BrightnessSlider story displays the same top values as React/Vue.
- [x] The component API remains framework-parity compatible while preserving `helperText` as a Svelte backcompat alias.
- [x] Slider accessibility attributes remain correct: `SliderField` labels the range input with `aria-labelledby`, combines description/error IDs in `aria-describedby`, and marks invalid sliders with `aria-invalid`.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/slider.test.ts src/tests/shared-contracts.test.ts`
  - `pnpm --filter @marwes-ui/react test -- src/components/slider/__tests__`
  - `pnpm --filter @marwes-ui/vue test -- src/components/slider/__tests__`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test:typecheck`
  - `pnpm exec biome check packages/svelte/src/lib/components/slider packages/svelte/src/tests/slider.test.ts packages/svelte/src/tests/shared-contracts.test.ts apps/storybook-svelte/src/stories/slider/brightness-slider.stories.ts apps/storybook-svelte/src/stories/slider/slider.stories.ts apps/storybook-svelte/src/stories/slider/slider-field.stories.ts apps/storybook-svelte/src/stories/slider/Introduction.mdx apps/storybook-svelte/src/stories/slider/__tests__ tests/contracts/slider.contract.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/slider/__tests__/slider-taxonomy.test.ts src/stories/slider/__tests__/slider-introduction-docs.test.ts`
  - `pnpm validate:family slider`
  - `pnpm validate:family slider` outside the sandbox after sandbox `tsx` IPC failure
  - `pnpm registry:check` after sandbox `tsx` IPC failure in `validate:family`
  - `pnpm check:compass`
  - `pnpm --filter ./apps/storybook-svelte build`
- Result:
  - Svelte slider tests and shared contracts pass: 214 tests.
  - React and Vue slider package tests pass.
  - Svelte Storybook slider docs/taxonomy tests pass.
  - Svelte Storybook typecheck and build pass.
  - `pnpm validate:family slider` passes through package, docs, storybook consistency, and registry checks when run outside the sandbox; the sandboxed run stopped at `registry:check` because `tsx` could not create an IPC pipe.
  - `pnpm validate:family slider` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte test/typecheck warnings remain the existing warnings outside slider: provider state capture, accordion/radio aria-invalid support warnings, dialog/rich-text tabindex warnings, and related Svelte compiler warnings.

## S07 - Svelte Spinner

Feedback:

- ButtonSpinner is only a spinner, no button.
- Storybook link from Notion: `https://storybook-svelte.marwes.io/1.3.0-alpha2/?path=/story/spinner-molecule-buttonspinner--default`

Primary paths:

- [ButtonSpinner.svelte](../../packages/svelte/src/lib/components/spinner/ButtonSpinner.svelte)
- [Spinner.svelte](../../packages/svelte/src/lib/components/spinner/Spinner.svelte)
- [button-spinner.stories.ts](../../apps/storybook-svelte/src/stories/spinner/button-spinner.stories.ts)
- [SpinnerGallery.svelte](../../apps/storybook-svelte/src/stories/spinner/SpinnerGallery.svelte)
- [spinner.css](../../packages/presets/src/firstEdition/spinner.css)
- [button.css](../../packages/presets/src/firstEdition/button.css)
- [Svelte spinner tests](../../packages/svelte/src/tests/spinner.test.ts)
- [React button-spinner baseline](../../apps/storybook-react/src/stories/spinner/button-spinner.stories.tsx)
- [Vue button-spinner baseline](../../apps/storybook-vue/src/stories/spinner/button-spinner.stories.ts)

Investigation:

- [x] Determined `ButtonSpinner` is intentionally spinner-only at the component level. React/Vue use it as the inline spinner inside loading buttons, not as a full button composition.
- [x] Compared React/Vue Storybook stories and found both wrap `ButtonSpinner` in a disabled `Button`; Svelte rendered the spinner alone.
- [x] Classified S07 as Storybook story parity plus docs/test coverage, not a Svelte component behavior change.
- [x] Added Svelte Storybook spinner docs/taxonomy guards so `pnpm validate:family spinner` now checks Svelte spinner story alignment.

Changes:

- Added `ButtonSpinnerStory.svelte` to render `ButtonSpinner` inside a disabled Svelte `Button` with the same stage treatment as React/Vue.
- Updated `button-spinner.stories.ts` to use padded layout and the wrapper for `Default` and `Inverted`; `Inverted` now uses a primary disabled button with `Loading…`.
- Updated Svelte spinner Introduction docs to show `ButtonSpinner` inside `Button`, and added explicit Button loading guidance.
- Added Svelte spinner Storybook docs/taxonomy tests under `apps/storybook-svelte/src/stories/spinner/__tests__`.

Acceptance:

- [x] Svelte ButtonSpinner matches the intended cross-framework behavior: the component remains spinner-only, and the story shows the button-loading composition.
- [x] Story title and docs no longer imply a standalone button shape without demonstrating the button context.
- [x] Loading button visual remains consistent with Button loading states.

Validation record:

- Commands:
  - `pnpm exec biome check apps/storybook-svelte/src/stories/spinner/ButtonSpinnerStory.svelte apps/storybook-svelte/src/stories/spinner/button-spinner.stories.ts apps/storybook-svelte/src/stories/spinner/Introduction.mdx apps/storybook-svelte/src/stories/spinner/__tests__`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/spinner/__tests__/spinner-taxonomy.test.ts src/stories/spinner/__tests__/spinner-introduction-docs.test.ts`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/spinner.test.ts src/tests/shared-contracts.test.ts`
  - `pnpm validate:family spinner` outside the sandbox
  - `pnpm --filter ./apps/storybook-svelte build`
- Result:
  - Focused Svelte spinner Storybook docs/taxonomy tests pass: 3 tests.
  - Svelte Storybook typecheck passes.
  - Svelte spinner package tests and shared contracts pass: 209 tests.
  - `pnpm validate:family spinner` passes Biome, core, presets, React package tests, Vue package tests, Svelte package tests, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family spinner` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte Storybook build passes.
  - Svelte test warnings remain the existing unrelated warnings outside spinner: provider state capture, accordion/radio aria-invalid support warnings, dialog/rich-text tabindex warnings, and related Svelte compiler warnings.

## S08 - Svelte Stat Tile

Feedback:

- Stat tile looks good, but outline should sync with Toast and Badge.

Primary paths:

- [StatTile.svelte](../../packages/svelte/src/lib/components/stat-tile/StatTile.svelte)
- [stat-tile.stories.ts](../../apps/storybook-svelte/src/stories/stat-tile/stat-tile.stories.ts)
- [StatTileToneMatrix.svelte](../../apps/storybook-svelte/src/stories/stat-tile/StatTileToneMatrix.svelte)
- [stat-tile.css](../../packages/presets/src/firstEdition/stat-tile.css)
- [toast.css](../../packages/presets/src/firstEdition/toast.css)
- [badge.css](../../packages/presets/src/firstEdition/badge.css)
- [stat-tile-recipe.ts](../../packages/core/src/components/atoms/stat-tile/stat-tile-recipe.ts)
- [toast-recipe.ts](../../packages/core/src/components/atoms/toast/toast-recipe.ts)
- [React stat tile baseline](../../apps/storybook-react/src/stories/stat-tile)
- [Vue stat tile baseline](../../apps/storybook-vue/src/stories/stat-tile)

Investigation:

- [x] Identified StatTile outline ownership as shared preset CSS, not Svelte adapter markup.
- [x] Compared StatTile against Badge and Toast. Badge uses an inset one-pixel `box-shadow` outline and Badge/Toast share semantic `--mw-color-status-*` tokens.
- [x] Confirmed StatTile semantic tones still used local `--mw-stat-tile-*` values and lacked dark-mode semantic status-token overrides.
- [x] Classified S08 as shared preset visual-token alignment, plus Svelte Storybook docs/test coverage.
- [x] Left Toast implementation for S11; this pass makes StatTile consume the same status-token language Toast already exposes.

Changes:

- Updated `stat-tile.css` so StatTile uses `border: none` with an inset `box-shadow` outline, matching Badge's outline model and avoiding physical border layout drift.
- Changed StatTile semantic tones to resolve through shared status tokens: brand -> info, success -> success, warning -> warning, danger -> error.
- Added dark-mode semantic status-token overrides for StatTile brand, success, warning, and danger.
- Extended `stat-tile-css-contract.test.ts` to lock the inset outline and shared status-token contract.
- Updated Svelte StatTile Introduction docs to match the React/Vue docs structure and coverage.
- Added Svelte StatTile Storybook taxonomy and Introduction docs tests.

Acceptance:

- [x] StatTile outline visually matches the updated Toast and Badge outline language.
- [x] Tone semantics remain consistent across all frameworks through shared preset tokens.
- [x] No adapter-specific CSS fork was introduced.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/presets test -- test/stat-tile-css-contract.test.ts test/badge-css-contract.test.ts test/toast-css-contract.test.ts`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/stat-tile/__tests__/stat-tile-taxonomy.test.ts src/stories/stat-tile/__tests__/stat-tile-introduction-docs.test.ts`
  - `pnpm exec biome check packages/presets/src/firstEdition/stat-tile.css packages/presets/test/stat-tile-css-contract.test.ts apps/storybook-svelte/src/stories/stat-tile/Introduction.mdx apps/storybook-svelte/src/stories/stat-tile/__tests__`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts`
  - `pnpm validate:family stat-tile` outside the sandbox
  - `pnpm --filter ./apps/storybook-svelte build`
  - `git diff --check`
- Result:
  - Focused preset StatTile/Badge/Toast CSS contract tests pass: 12 tests.
  - Focused Svelte StatTile Storybook docs/taxonomy tests pass: 2 tests.
  - Biome check passes for the changed StatTile CSS, preset test, docs, and Svelte Storybook tests.
  - Svelte Storybook typecheck passes.
  - Svelte shared contracts pass: 200 tests.
  - `pnpm validate:family stat-tile` passes Biome, core, presets, React package tests, Vue package tests, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family stat-tile` skips Svelte package tests because this family has no dedicated `packages/svelte/src/tests/stat-tile.test.ts`; Svelte shared contracts were run separately.
  - `pnpm validate:family stat-tile` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte Storybook build passes.

## S09 - Svelte Switch

Feedback:

- `All States` only shows disabled state.
- Storybook link from Notion: `https://storybook-svelte.marwes.io/1.3.0-alpha2/?path=/story/switch-atom--all-states`

Primary paths:

- [Switch.svelte](../../packages/svelte/src/lib/components/switch/Switch.svelte)
- [switch.stories.ts](../../apps/storybook-svelte/src/stories/switch/switch.stories.ts)
- [switch.css](../../packages/presets/src/firstEdition/switch.css)
- [Svelte switch tests](../../packages/svelte/src/tests/switch.test.ts)
- [React switch baseline](../../apps/storybook-react/src/stories/switch/switch.stories.tsx)
- [Vue switch baseline](../../apps/storybook-vue/src/stories/switch/switch.stories.ts)

Investigation:

- [x] Confirmed current Svelte `AllStates` was an args-only single component story.
- [x] Compared React/Vue `AllStates`; both render a five-row composition: starts off, starts on, disabled off, disabled on, and interactive.
- [x] Confirmed `SizeComparison` also drifted: React/Vue render compact, wide, and rich sizes together, while Svelte rendered one switch.
- [x] Classified S09 as Storybook story parity, not component behavior.
- [x] Added Svelte Storybook switch docs/taxonomy guards so `pnpm validate:family switch` checks the Svelte switch story family.

Changes:

- Added `SwitchShowcase.svelte` for Svelte multi-state switch story compositions.
- Updated `switch.stories.ts` so `AllStates` renders the five-state switch composition and `SizeComparison` renders compact, wide, and rich switches.
- Added switch atom argTypes for `checked`, `disabled`, `ariaLabel`, and size options.
- Updated Svelte switch Introduction docs with the size API and current atom story coverage.
- Added Svelte switch Storybook docs/taxonomy tests under `apps/storybook-svelte/src/stories/switch/__tests__`.

Acceptance:

- [x] `Switch/Atom/AllStates` renders all intended states in one view.
- [x] Disabled, checked, unchecked, interactive, and size states are visible as expected.
- [x] Storybook args remain useful for single-state stories.

Validation record:

- Commands:
  - `pnpm exec biome check apps/storybook-svelte/src/stories/switch/SwitchShowcase.svelte apps/storybook-svelte/src/stories/switch/switch.stories.ts apps/storybook-svelte/src/stories/switch/Introduction.mdx apps/storybook-svelte/src/stories/switch/__tests__`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/switch/__tests__/switch-taxonomy.test.ts src/stories/switch/__tests__/switch-introduction-docs.test.ts`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/shared-contracts.test.ts`
  - `pnpm validate:family switch` outside the sandbox
  - `pnpm --filter ./apps/storybook-svelte build`
- Result:
  - Focused Svelte switch Storybook docs/taxonomy tests pass: 3 tests.
  - Svelte Storybook typecheck passes.
  - Svelte shared contracts pass: 200 tests.
  - `pnpm validate:family switch` passes Biome, core, presets, React package tests, Vue package tests, Svelte package tests, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family switch` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte Storybook build passes.
  - Svelte test warnings remain the existing unrelated warnings outside switch: provider state capture, accordion/radio aria-invalid support warnings, dialog/rich-text tabindex warnings, and related Svelte compiler warnings.

## S10 - Svelte Tab

Feedback:

- `All States` only shows one state.
- Storybook link from Notion: `https://storybook-svelte.marwes.io/1.3.0-alpha2/?path=/story/tab-atom--all-states`

Primary paths:

- [Tab.svelte](../../packages/svelte/src/lib/components/tab/Tab.svelte)
- [TabGroup.svelte](../../packages/svelte/src/lib/components/tab/TabGroup.svelte)
- [TabAtomPreview.svelte](../../apps/storybook-svelte/src/stories/tab/TabAtomPreview.svelte)
- [tab.stories.ts](../../apps/storybook-svelte/src/stories/tab/tab.stories.ts)
- [tab.css](../../packages/presets/src/firstEdition/tab.css)
- [Svelte tab tests](../../packages/svelte/src/tests/tab.test.ts)
- [React tab baseline](../../apps/storybook-react/src/stories/tab/tab.stories.tsx)
- [Vue tab baseline](../../apps/storybook-vue/src/stories/tab/tab.stories.ts)

Investigation:

- [x] Confirmed current Svelte `AllStates` was an args-only single `TabAtomPreview`.
- [x] Compared React/Vue atom stories; both render a visible state matrix with inactive, selected, disabled, and tab bar states.
- [x] Classified S10 as Storybook story parity, not component behavior.
- [x] Kept `TabAtomPreview` focused on single-state previews and added a separate Svelte story wrapper for multi-state compositions.
- [x] Adjusted Storybook consistency config for `tab` canonical stems so Svelte's separate `TabPanel.svelte` file does not require a Svelte-only story that React/Vue do not have.

Changes:

- Added `TabShowcase.svelte` for Svelte `AllStates` and interactive `TabBar` atom stories.
- Updated `tab.stories.ts` so `AllStates` renders inactive, selected, disabled, and tab bar states, and `TabBar` renders a real clickable tablist.
- Added `ariaControls` controls to the Svelte tab atom story.
- Updated Svelte Tab Introduction docs to document `Tab` and `TabPanel` atom usage and atom story coverage.
- Added Svelte tab Storybook docs/taxonomy tests under `apps/storybook-svelte/src/stories/tab/__tests__`.
- Updated `.pi/storybook-companion.config.ts` with tab canonical story-bearing stems matching the shared React/Vue/Svelte story surface.

Acceptance:

- [x] `Tab/Atom/AllStates` renders a visible state matrix, not one tab.
- [x] The preview remains representative of actual Svelte `Tab` behavior.
- [x] Accessibility attributes are preserved: tablists, `aria-controls`, matching tabpanels, disabled tabs, and hidden panels remain wired in the story wrapper.

Validation record:

- Commands:
  - `pnpm exec biome check .pi/storybook-companion.config.ts apps/storybook-svelte/src/stories/tab/TabShowcase.svelte apps/storybook-svelte/src/stories/tab/tab.stories.ts apps/storybook-svelte/src/stories/tab/Introduction.mdx apps/storybook-svelte/src/stories/tab/__tests__`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/tab/__tests__/tab-taxonomy.test.ts src/stories/tab/__tests__/tab-introduction-docs.test.ts`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/tab.test.ts src/tests/shared-contracts.test.ts`
  - `pnpm validate:family tab` outside the sandbox
  - `pnpm --filter ./apps/storybook-svelte build`
- Result:
  - Focused Svelte tab Storybook docs/taxonomy tests pass: 5 tests.
  - Svelte Storybook typecheck passes.
  - Svelte tab package tests and shared contracts pass: 206 tests.
  - `pnpm validate:family tab` passes Biome, core, presets, React package tests, Vue package tests, Svelte package tests, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family tab` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte Storybook build passes.
  - Svelte test warnings remain the existing unrelated warnings outside this story fix: `TabGroup` tablist tabindex, provider state capture, accordion/radio aria-invalid support warnings, dialog/rich-text tabindex warnings, and related Svelte compiler warnings.

## S11 - Svelte Toast

Feedback:

- Toast looks good, but colors should sync with updated variants.
- Sync with Badge and Stat tile.

Primary paths:

- [Toast.svelte](../../packages/svelte/src/lib/components/toast/Toast.svelte)
- [ToastContainer.svelte](../../packages/svelte/src/lib/components/toast/ToastContainer.svelte)
- [toast.stories.ts](../../apps/storybook-svelte/src/stories/toast/toast.stories.ts)
- [toast-matrix.stories.ts](../../apps/storybook-svelte/src/stories/toast/toast-matrix.stories.ts)
- [ToastMatrix.svelte](../../apps/storybook-svelte/src/stories/toast/ToastMatrix.svelte)
- [toast.css](../../packages/presets/src/firstEdition/toast.css)
- [badge.css](../../packages/presets/src/firstEdition/badge.css)
- [stat-tile.css](../../packages/presets/src/firstEdition/stat-tile.css)
- [toast-recipe.ts](../../packages/core/src/components/atoms/toast/toast-recipe.ts)
- [Svelte toast tests](../../packages/svelte/src/tests/toast.test.ts)
- [React toast baseline](../../apps/storybook-react/src/stories/toast)
- [Vue toast baseline](../../apps/storybook-vue/src/stories/toast)

Investigation:

- [x] Compared Toast status-token usage against Badge and the updated StatTile S08 contract.
- [x] Confirmed purpose Toast wrappers already emit canonical `data-intent` values through the shared React/Vue/Svelte toast contract.
- [x] Found the missing color parity was the primitive `brand` intent: Toast had no explicit brand-intent status-token rule, while StatTile brand now resolves through the shared info status family.
- [x] Found Svelte Storybook matrix drift: React/Vue Toast matrix covers neutral, semantic, and brand rows with inline actions, while Svelte only showed the four semantic purpose rows.
- [x] Fixed a stale Vue Toast taxonomy guard that expected `#000000` even though the Vue story uses the current `#0F0F0F` dark surface.

Changes:

- Added explicit Toast `data-intent="brand"` color rules in shared preset CSS for subtle, outline, rich, and dark-mode outline/rich.
- Mapped Toast brand intent to the shared info status token family so it aligns with StatTile brand and Badge/Info color language.
- Extended the Toast CSS contract to lock the brand-intent status-token mapping.
- Updated Svelte `ToastMatrix.svelte` to include neutral and brand rows, matching React/Vue matrix coverage.
- Added inline `Close` actions to Svelte Toast matrix rows using `mw-toast__action-button`.
- Increased Toast matrix spacing and made full-width matrix toasts `border-box` across React, Vue, and Svelte so alert surfaces no longer crowd each other.
- Updated Svelte Toast Introduction docs with action escape-hatch and accessible timing guidance.
- Added Svelte Toast Storybook taxonomy and Introduction docs tests.
- Updated the Vue Toast taxonomy guard to match the actual `#0F0F0F` dark story surface.

Acceptance:

- [x] Toast color treatment matches updated brand/status token variants and aligns with Badge and StatTile token language.
- [x] Success, warning, error, and info variants remain distinguishable and accessible.
- [x] React/Vue/Svelte do not diverge unintentionally after shared CSS changes.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/presets test -- test/toast-css-contract.test.ts test/badge-css-contract.test.ts test/stat-tile-css-contract.test.ts`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/toast/__tests__/toast-taxonomy.test.ts src/stories/toast/__tests__/toast-introduction-docs.test.ts`
  - `pnpm exec biome check packages/presets/src/firstEdition/toast.css packages/presets/test/toast-css-contract.test.ts apps/storybook-svelte/src/stories/toast/ToastMatrix.svelte apps/storybook-svelte/src/stories/toast/Introduction.mdx apps/storybook-svelte/src/stories/toast/__tests__`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/toast.test.ts src/tests/shared-contracts.test.ts`
  - `pnpm --filter ./apps/storybook-vue test -- src/stories/toast/__tests__/toast-taxonomy.test.ts`
  - `pnpm validate:family toast` outside the sandbox
  - `pnpm --filter ./apps/storybook-svelte build`
  - `git diff --check`
- Result:
  - Focused preset Toast/Badge/StatTile CSS contract tests pass: 12 tests.
  - Focused Svelte Toast Storybook docs/taxonomy tests pass: 5 tests.
  - Biome check passes for changed Toast CSS, preset test, docs, and Storybook tests.
  - Svelte Storybook typecheck passes.
  - Svelte Toast package tests and shared contracts pass: 210 tests.
  - Vue Toast taxonomy guard passes after updating the stale dark-surface assertion.
  - `pnpm validate:family toast` passes Biome, core, presets, React package tests, Vue package tests, Svelte package tests/shared contracts, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family toast` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte Storybook build passes.
  - Svelte test warnings remain the existing unrelated warnings outside toast: provider state capture, accordion/radio aria-invalid support warnings, dialog/rich-text tabindex warnings, and related Svelte compiler warnings.
  - Follow-up Toast matrix spacing checks pass for React, Vue, and Svelte taxonomy guards; Svelte Storybook build still passes.

### Post-S11 Token and Figma Follow-up

Purpose:

- Apply the latest local border-strong color data and reconcile Toast against the live generated local Figma references without fetching Figma again.

Reference inputs:

- [marwes-border-strong-tokens.json](../marwes-border-strong-tokens.json)
- [toast.json](../../.figma/marwes/components/toast.json)
- [_index.json](../../.figma/marwes/components/_index.json)
- [manifest.json](../../.figma/marwes/manifest.json)
- [nodes.json](../../.figma/nodes.json)
- [NODE_REFERENCE.md](../../.figma/NODE_REFERENCE.md)
- [toast light page export](../../.figma/marwes/pages/-toast/-toast-light_1365-12526.json)
- [toast dark page export](../../.figma/marwes/pages/-toast/-toast-dark_2970-9564.json)

Changes:

- Added `docs/marwes-border-strong-tokens.json` as the local source reference for the latest border-strong token data.
- Added core `status.*.borderStrong` theme surface and generated CSS variables.
- Updated Badge, Toast, and StatTile semantic outlines to consume `--mw-color-status-*-border-strong`.
- Aligned Toast color treatment to the local Figma exports:
  - Light rich Toast action links now use the semantic icon colors.
  - Light subtle semantic Toasts stay neutral, matching the generated Toast refs.
  - Dark info/brand Toast uses the deeper blue border and brighter icon/action treatment from the generated dark refs.
- Extended core and preset tests so the border-strong token surface and Toast CSS contract are locked.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/core test`
  - `pnpm --filter @marwes-ui/presets test`
  - `pnpm --filter @marwes-ui/core test:typecheck`
  - `pnpm --filter @marwes-ui/presets test:typecheck`
  - `pnpm --filter @marwes-ui/core build`
  - `pnpm --filter @marwes-ui/presets build`
  - `pnpm --filter @marwes-ui/presets test -- toast-css-contract.test.ts`
  - `pnpm exec biome check packages/core/src/theme/theme-css.ts packages/core/src/theme/theme-defaults.ts packages/core/src/theme/theme-types.ts packages/core/src/theme/theme-vars.ts packages/core/test/theme/marwes-colors-contract.test.ts packages/core/test/theme/resolve-theme-input.test.ts packages/core/test/theme/theme-css.test.ts packages/presets/src/firstEdition/badge.css packages/presets/src/firstEdition/stat-tile.css packages/presets/src/firstEdition/toast.css packages/presets/test/badge-css-contract.test.ts packages/presets/test/stat-tile-css-contract.test.ts packages/presets/test/toast-css-contract.test.ts`
  - `git diff --check`
- Result: Passed for core and presets. The wider `check:compass` broken-link blocker remains the same known pre-existing issue.

## V01 - Vue Button Loading Size

Feedback:

- `Loading` and `Loading with label` are slightly different in size, around 1-2px.
- Storybook link from Notion: `https://storybook-vue.marwes.io/1.3.0-alpha2/?path=/story/buttons-atom-button--loading-with-label`

Primary paths:

- [button.ts](../../packages/vue/src/components/button/button.ts)
- [variants.ts](../../packages/vue/src/components/button/variants.ts)
- [button.stories.ts](../../apps/storybook-vue/src/stories/button/button.stories.ts)
- [button.css](../../packages/presets/src/firstEdition/button.css)
- [button-loading.ts](../../packages/core/src/components/atoms/button/button-loading.ts)
- [button-recipe.ts](../../packages/core/src/components/atoms/button/button-recipe.ts)
- [Vue button tests](../../packages/vue/src/components/button/__tests__/button.test.ts)
- [React button baseline](../../apps/storybook-react/src/stories/button/button.stories.tsx)

Investigation:

- Measure rendered width/height for `Loading` and `LoadingWithLabel`.
- Check whether `loading: true` and object loading config produce different children, spinner, aria label, or spacing.
- Inspect shared button CSS for spinner gap, line-height, min-height, and label visibility.
- [x] Compared Vue Button stories against React and Svelte.
- [x] Classified the mismatch as Storybook parity drift, not a Vue runtime, package, or preset CSS bug.
- [x] Found the visible label mismatch: boolean loading rendered `Saving...`, while object loading with `loadingLabel` rendered `Saving…`.

Owner classification:

- Storybook story parity across React/Vue/Svelte Button atom stories.

Changes:

- Normalized the Button `Loading` visible text to `Saving…` across React, Vue, and Svelte atom stories.
- Added React and Vue Button taxonomy guards so `Loading` and `LoadingWithLabel` keep the same visible loading text.
- Added a Svelte Button taxonomy guard with the same loading-story parity check.

Acceptance:

- [x] `Loading` and `LoadingWithLabel` have the same intended height and visual rhythm.
- [x] Loading label behavior remains accessible.
- [x] React, Vue, and Svelte loading stories stay aligned unless the design calls for a framework-specific correction.

Validation record:

- Commands:
  - `pnpm --filter ./apps/storybook-vue test -- src/stories/button/__tests__/button-taxonomy.test.ts`
  - `pnpm exec vitest run apps/storybook-react/src/stories/button/__tests__/button-taxonomy.test.ts`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/button/__tests__/button-taxonomy.test.ts`
  - `pnpm exec biome check apps/storybook-react/src/stories/button/button.stories.tsx apps/storybook-react/src/stories/button/__tests__/button-taxonomy.test.ts apps/storybook-vue/src/stories/button/button.stories.ts apps/storybook-vue/src/stories/button/__tests__/button-taxonomy.test.ts apps/storybook-svelte/src/stories/button/button.stories.ts apps/storybook-svelte/src/stories/button/__tests__/button-taxonomy.test.ts`
  - `pnpm --filter ./apps/storybook-vue typecheck`
  - `pnpm --filter ./apps/storybook-react typecheck`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `git diff --check -- apps/storybook-react/src/stories/button/button.stories.tsx apps/storybook-react/src/stories/button/__tests__/button-taxonomy.test.ts apps/storybook-vue/src/stories/button/button.stories.ts apps/storybook-vue/src/stories/button/__tests__/button-taxonomy.test.ts apps/storybook-svelte/src/stories/button/button.stories.ts apps/storybook-svelte/src/stories/button/__tests__/button-taxonomy.test.ts`
- Result: Passed. No Vue package/runtime or shared Button CSS changes were needed for V01.

## V02 - Vue Dialog Docs Bug

Feedback:

- Dialog docs bug.

Primary paths:

- [Introduction.mdx](../../apps/storybook-vue/src/stories/dialog/Introduction.mdx)
- [dialog.stories.ts](../../apps/storybook-vue/src/stories/dialog/dialog.stories.ts)
- [dialog-modal.stories.ts](../../apps/storybook-vue/src/stories/dialog/dialog-modal.stories.ts)
- [dialog-introduction-docs.test.ts](../../apps/storybook-vue/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts)
- [dialog-taxonomy.test.ts](../../apps/storybook-vue/src/stories/dialog/__tests__/dialog-taxonomy.test.ts)
- [dialog.ts](../../packages/vue/src/components/dialog/dialog.ts)
- [dialog-modal.ts](../../packages/vue/src/components/dialog/dialog-modal.ts)
- [React dialog docs baseline](../../apps/storybook-react/src/stories/dialog/Introduction.mdx)
- [Svelte dialog docs baseline](../../apps/storybook-svelte/src/stories/dialog/Introduction.mdx)

Investigation:

- [x] Compared Vue Dialog Introduction docs against React and Svelte baselines.
- [x] Found the Vue low-level `Dialog` example had an unclosed markdown code fence, causing the following explanatory prose to render inside the Vue code snippet.
- [x] Found the React baseline had the same unclosed code-fence issue; Svelte already had the corrected structure.
- [x] Classified the issue as Storybook MDX docs content, not Vue component behavior or story taxonomy.
- [x] Added a docs guard for balanced code fences so this class of docs bug is covered.

Owner classification:

- Vue Storybook docs.

Changes:

- Closed the low-level `Dialog` Vue code fence before the explanatory `modal` guidance.
- Extended the Vue Dialog Introduction docs test to assert balanced markdown code fences and ensure the modal guidance remains outside the final code sample.
- Applied the same code-fence correction and docs guard to React Dialog Introduction so the baseline does not keep the same docs bug.

Acceptance:

- [x] Dialog docs render without the Notion-reported bug.
- [x] Story taxonomy tests still pass.
- [x] Docs content stays consistent with React/Svelte unless Vue has a real adapter difference.

Validation record:

- Commands:
  - `pnpm --filter ./apps/storybook-vue test -- src/stories/dialog/__tests__/dialog-introduction-docs.test.ts src/stories/dialog/__tests__/dialog-taxonomy.test.ts`
  - `pnpm exec biome check apps/storybook-react/src/stories/dialog/Introduction.mdx apps/storybook-react/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts apps/storybook-vue/src/stories/dialog/Introduction.mdx apps/storybook-vue/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts`
  - `pnpm --filter ./apps/storybook-vue typecheck`
  - `pnpm --filter ./apps/storybook-vue build`
  - `pnpm exec vitest run apps/storybook-react/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts apps/storybook-react/src/stories/dialog/__tests__/dialog-taxonomy.test.ts`
  - `pnpm --filter ./apps/storybook-react typecheck`
  - `pnpm --filter ./apps/storybook-react build`
  - `git diff --check -- apps/storybook-vue/src/stories/dialog/Introduction.mdx apps/storybook-vue/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts docs/planning/notion-design-feedback-fix-guide.md`
  - `git diff --check -- apps/storybook-react/src/stories/dialog/Introduction.mdx apps/storybook-react/src/stories/dialog/__tests__/dialog-introduction-docs.test.ts`
- Result: Passed. Vue and React Storybook builds completed with the existing Vite large chunk warning. V02 required Storybook docs/test changes only.

## V03 - Vue Spinner

Feedback:

- EmptyStateSpinner light mode uses dark mode background.
- `dots-square` is too mushed and should be more round like Figma.

Primary paths:

- [spinner.ts](../../packages/vue/src/components/spinner/spinner.ts)
- [variants.ts](../../packages/vue/src/components/spinner/variants.ts)
- [empty-state-spinner.stories.ts](../../apps/storybook-vue/src/stories/spinner/empty-state-spinner.stories.ts)
- [spinner.stories.ts](../../apps/storybook-vue/src/stories/spinner/spinner.stories.ts)
- [spinner.css](../../packages/presets/src/firstEdition/spinner.css)
- [spinner-svg.ts](../../packages/core/src/components/atoms/spinner/spinner-svg.ts)
- [spinner-recipe.ts](../../packages/core/src/components/atoms/spinner/spinner-recipe.ts)
- [Vue spinner tests](../../packages/vue/src/components/spinner/__tests__/spinner.test.ts)
- [Vue spinner variant tests](../../packages/vue/src/components/spinner/__tests__/variants.test.ts)
- [React spinner baseline](../../apps/storybook-react/src/stories/spinner)
- [Svelte spinner baseline](../../apps/storybook-svelte/src/stories/spinner)

Investigation:

- [x] Confirmed the dark background came from the Vue Storybook `EmptyStateSpinner` wrapper, not the Vue package component.
- [x] Compared EmptyStateSpinner stories across React/Svelte/Vue. React had the same dark wrapper; Svelte molecule story did not force a dark surface.
- [x] Inspected the local live Figma component `.figma/marwes/components/spinnerdots-square.json`; all dots-square segments use `cornerRadius: 999`.
- [x] Classified dots-square roundness as shared core SVG geometry because React, Vue, and Svelte all consume `createSpinnerRecipe`.

Owner classification:

- EmptyStateSpinner light surface: Vue and React Storybook story wrappers.
- Dots-square roundness: shared core spinner SVG definition.

Changes:

- Updated Vue EmptyStateSpinner molecule story to use a light panel surface and dark label color.
- Updated React EmptyStateSpinner molecule story the same way so the baseline does not keep the same dark-surface issue.
- Rounded every dots-square SVG rect to `rx="999"` in the shared core spinner definition, matching the local Figma component radius.
- Added a core recipe test that locks the dots-square rect radius.
- Added React/Vue Storybook taxonomy guards that keep EmptyStateSpinner molecule stories on a light surface.
- Formatted the spinner generated registry file after `pnpm validate:family spinner` exposed a Biome formatting failure in that family path.

Acceptance:

- [x] EmptyStateSpinner light mode uses the correct light background.
- [x] `dots-square` matches Figma roundness and remains visually balanced at all supported sizes.
- [x] Spinner variants remain aligned across React, Vue, and Svelte.

Validation record:

- Commands:
  - `pnpm --filter @marwes-ui/core test -- spinner.test.ts`
  - `pnpm --filter ./apps/storybook-vue test -- src/stories/spinner/__tests__/spinner-taxonomy.test.ts src/stories/spinner/__tests__/spinner-introduction-docs.test.ts`
  - `pnpm exec vitest run apps/storybook-react/src/stories/spinner/__tests__/spinner-taxonomy.test.ts apps/storybook-react/src/stories/spinner/__tests__/spinner-introduction-docs.test.ts`
  - `pnpm --filter ./apps/storybook-svelte test -- src/stories/spinner/__tests__/spinner-taxonomy.test.ts src/stories/spinner/__tests__/spinner-introduction-docs.test.ts`
  - `pnpm --filter @marwes-ui/vue test -- src/components/spinner/__tests__/spinner.test.ts src/components/spinner/__tests__/variants.test.ts`
  - `pnpm --filter @marwes-ui/react test -- src/components/spinner/__tests__/spinner.test.tsx src/components/spinner/__tests__/variants.test.tsx`
  - `pnpm --filter @marwes-ui/svelte test -- src/tests/spinner.test.ts src/tests/shared-contracts.test.ts`
  - `pnpm exec biome check packages/core/src/components/atoms/spinner/spinner-svg.ts packages/core/test/recipes/spinner.test.ts apps/storybook-vue/src/stories/spinner/empty-state-spinner.stories.ts apps/storybook-vue/src/stories/spinner/__tests__/spinner-taxonomy.test.ts apps/storybook-react/src/stories/spinner/empty-state-spinner.stories.tsx apps/storybook-react/src/stories/spinner/__tests__/spinner-taxonomy.test.ts`
  - `pnpm --filter @marwes-ui/core test:typecheck`
  - `pnpm --filter @marwes-ui/core build`
  - `pnpm --filter ./apps/storybook-vue typecheck`
  - `pnpm --filter ./apps/storybook-react typecheck`
  - `pnpm --filter ./apps/storybook-svelte typecheck`
  - `pnpm --filter ./apps/storybook-vue build`
  - `pnpm --filter ./apps/storybook-react build`
  - `pnpm --filter ./apps/storybook-svelte build`
  - `pnpm validate:family spinner`
  - `git diff --check -- packages/core/src/components/atoms/spinner/spinner-svg.ts packages/core/test/recipes/spinner.test.ts apps/storybook-vue/src/stories/spinner/empty-state-spinner.stories.ts apps/storybook-vue/src/stories/spinner/__tests__/spinner-taxonomy.test.ts apps/storybook-react/src/stories/spinner/empty-state-spinner.stories.tsx apps/storybook-react/src/stories/spinner/__tests__/spinner-taxonomy.test.ts docs/registry/families/spinner/registry.generated.json docs/planning/notion-design-feedback-fix-guide.md`
- Result:
  - Focused core, Vue package, React package, Svelte package/shared-contract, and React/Vue/Svelte Storybook spinner tests pass.
  - Core typecheck and build pass.
  - React/Vue/Svelte Storybook typechecks and builds pass. Builds complete with the existing Vite large chunk warning.
  - `pnpm validate:family spinner` passes Biome, core, presets, React package, Vue package, Svelte package/shared contracts, React/Vue/Svelte Storybook docs tests, Storybook consistency, and registry checks.
  - `pnpm validate:family spinner` then fails only at `pnpm check:compass` on the known pre-existing broken link: `docs/README.md` -> `./planning/release-1-0-0-hardening-plan.md`.
  - Svelte spinner/shared-contract tests still emit the existing unrelated Svelte warnings from accordion, checkbox, dialog, input, radio, tab, tooltip, and provider files.

## Phase 4 Validation Record

Date: 2026-05-14

Changes made during final validation:

- Tightened `tests/contracts/radio-group-field.contract.ts` so the shared RadioGroupField contract now requires the group label to use canonical small paragraph typography, matching the existing option-label typography requirement.
- Aligned React, Vue, and Svelte `RadioGroupField` group labels to `Paragraph size="sm"` / `mw-p--sm`.
- Updated the stale Svelte `field-compounds.test.ts` RadioGroupField assertion from native `legend` markup to the current labeled `role="radiogroup"` structure.
- Fixed `docs/README.md` so the Planning section points to the live Notion design feedback guide instead of the removed `release-1-0-0-hardening-plan.md`.

Validation:

- `pnpm test:typecheck:contracts` passes.
- `pnpm --filter @marwes-ui/svelte test -- src/tests/field-compounds.test.ts src/tests/radio-group-field.test.ts src/tests/shared-contracts.test.ts` passes: 230 tests.
- `pnpm --filter @marwes-ui/react test -- src/components/radio/__tests__/radio-group-field.test.tsx` passes: 13 tests.
- `pnpm --filter @marwes-ui/vue test -- src/components/radio/__tests__/radio-group-field.test.ts` passes: 13 tests.
- `pnpm exec biome check tests/contracts/radio-group-field.contract.ts packages/react/src/components/radio/radio-group-field.tsx packages/vue/src/components/radio/radio-group-field.ts packages/svelte/src/lib/components/radio/RadioGroupField.svelte packages/svelte/src/tests/field-compounds.test.ts` passes.
- `pnpm validate:packages` passes: package typechecks, package builds, core tests, presets tests, React tests, Vue tests, and Svelte tests all pass. Svelte still prints existing compiler warnings in unrelated/pre-existing files.
- `pnpm storybook:consistency` initially failed with 17 families reporting findings. `date-picker` was critical because Datepicker stories/docs are intentionally disabled while the component is not ready. The rest were primarily missing Svelte Storybook taxonomy/introduction docs tests and a few missing Svelte story stems.
- Follow-up fix: `date-picker` is now temporarily excluded in `.pi/storybook-companion.config.ts`; the Svelte Storybook consistency backlog now has taxonomy/introduction docs guards; `SuccessButton` has React/Vue/Svelte stories; acronym stem normalization now maps names such as `FAQAccordion` and `URLField` to canonical story stems; Spacing Storybook coverage is constrained to the canonical `spacing` story stem.
- `pnpm storybook:consistency` now passes: 23 families scanned, 23 healthy, 0 findings.
- `pnpm check:changed` now passes formatting, changeset validation, adapter boundaries, Compass links/API/repo-map rules, semantics, artifacts, registry, parity summary, Storybook consistency, and whitespace checks.

Handoff status:

- Package validation is release-green.
- Shared React/Vue/Svelte radio contract validation is tighter than before and release-green.
- Repo-level changed-scope validation is release-green.
- Datepicker remains intentionally hidden and temporarily excluded from Storybook consistency until it is ready for review.
- Manual visual signoff against the original Notion screenshots remains pending.

## Closeout Checklist

- [x] Every queue item has a validation record.
- [ ] Notion feedback screenshots have been checked against the final state.
- [x] Shared CSS/core changes have been verified in all affected frameworks.
- [x] Storybook builds pass for changed Storybook apps.
- [x] Package tests/typechecks pass for changed adapters.
- [x] `pnpm check:changed` result is recorded here before final handoff.
