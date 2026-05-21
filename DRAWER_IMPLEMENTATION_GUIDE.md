# Implementation Guide: Drawer Component

Created: 2026-05-21
Status: in progress
Branch: `dashboard-teaser`

---

## Living Document

This guide MUST be updated during implementation:

- [ ] Check off tasks as they are completed
- [ ] Add notes when reality diverges from plan
- [ ] Reorder or split phases when blockers are discovered
- [ ] Add new tasks discovered during implementation
- [ ] Mark tasks as "skipped - reason" when they become irrelevant
- [ ] Record timestamps on phase completions for velocity tracking
- [ ] Update test coverage map as tests are written

**Last updated:** 2026-05-21
**Current phase:** 8

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | pnpm |
| Monorepo | Yes - `packages/`, `apps/` |
| Test runner | vitest plus Storybook smoke/a11y scripts |
| Test command | `pnpm test` / focused package tests |
| Typecheck | `pnpm typecheck` / focused package typechecks |
| Lint | `pnpm lint` and `pnpm exec biome check .` |
| Build | `pnpm build` / focused package builds |
| Domain checks | `pnpm check:repo-map`, `pnpm check:adapter-boundaries`, `pnpm registry:check`, `pnpm storybook:consistency` |
| CI | No root `.github/workflows` discovered in the current checkout |
| Feature paths | `packages/core/src/components/atoms/drawer/`, `packages/presets/src/firstEdition/drawer.css`, `packages/react/src/components/drawer/`, `packages/vue/src/components/drawer/`, `packages/svelte/src/lib/components/drawer/`, Storybook apps, `apps/dashboard-teaser/` |
| Existing tests | Component tests live beside package adapters under `__tests__`; preset CSS contract tests live in `packages/presets/test/` |

### Figma Inputs

Use the current local generated files only:

| Source | Path |
|---|---|
| AI entry point | `.figma/INDEX.md` |
| Primary component JSON | `.figma/marwes/components/drawer.json` |
| Component lookup | `.figma/marwes/components/_index.json` |
| Sync metadata | `.figma/marwes/manifest.json` |
| Curated references | `.figma/nodes.json`, `.figma/NODE_REFERENCE.md` |
| Page frames | `.figma/marwes/pages/-drawer/-drawer_1609-15651.json`, `.figma/marwes/pages/-drawer/-drawer-dark_1610-15934.json` |

Important design facts from the local references:

- Drawer is a side panel, not an app-local one-off surface.
- Sizes map to `small = 320px`, `medium = 400px`, `large = 560px`.
- Footer visibility is a boolean.
- A scrim is composed behind the drawer in usage.
- The component has light and dark references.

### Validation Stack

| Purpose | Command | Scope |
|---|---|---|
| Core tests | `pnpm --filter @marwes-ui/core test` | Core recipe and a11y |
| Preset tests | `pnpm --filter @marwes-ui/presets test` | CSS contract |
| React tests | `pnpm --filter @marwes-ui/react test` | React adapter |
| Vue tests | `pnpm --filter @marwes-ui/vue test` | Vue adapter |
| Svelte tests | `pnpm --filter @marwes-ui/svelte test` | Svelte adapter |
| Package typecheck | `pnpm test:typecheck:packages` | Package contracts |
| Adapter boundaries | `pnpm check:adapter-boundaries` | Layering |
| Repo map | `pnpm check:repo-map` | Registry, story consistency, generated docs checks |
| Storybook React | `pnpm --filter ./apps/storybook-react test` | React stories |
| Storybook Vue | `pnpm --filter ./apps/storybook-vue test` | Vue stories |
| Storybook Svelte | `pnpm --filter ./apps/storybook-svelte test` | Svelte stories |
| Dashboard teaser | `pnpm --filter dashboard-teaser typecheck && pnpm --filter dashboard-teaser build` | Usage replacement |

---

## 1. Architecture Contract

### Problem Statement

`apps/dashboard-teaser` currently needs drawer behavior, but the drawer must be a real Marwes component that follows the library architecture instead of an app-local implementation. The new component must be available through core recipes, firstEdition preset CSS, React, Vue, and Svelte adapters, all Storybooks, and dashboard-teaser usage.

### Chosen Approach

Implement Drawer in the same family as Dialog: core owns size, placement, footer, scrim, dismissibility, and a11y contracts; `@marwes-ui/presets` owns all visual styling through `--mw-*` variables seeded from theme variables; React, Vue, and Svelte render thin adapters; Storybook coverage proves parity; dashboard-teaser imports the React Drawer instead of defining a local drawer.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| Core | Drawer public types, a11y mapping, semantic data attributes, recipe output | DOM mutation, framework hooks, CSS |
| Presets | `.mw-drawer*` and `.mw-drawer-scrim` CSS, component-scoped variables mapped to theme vars | Behavior and framework rendering |
| React | Thin JSX adapter, ids, close button event wiring, slots | Visual token hardcoding |
| Vue | Thin Vue render adapter, ids, emits/callback parity | Reimplemented core a11y |
| Svelte | Thin Svelte component and types | Divergent API or preset CSS |
| Storybooks | Demonstration and visual states across frameworks | Component internals |
| Dashboard teaser | Product composition using exported React Drawer | App-local drawer fork |

### Non-Negotiables

- [ ] Follow `core recipe -> preset CSS -> React adapter -> Vue adapter -> Svelte adapter`.
- [ ] Drawer sizes must match Figma: `small = 320px`, `medium = 400px`, `large = 560px`.
- [ ] Use `--mw-*` variables and seed visual values from the theme object/CSS vars.
- [ ] Keep framework adapters thin and free from token hardcoding.
- [ ] Add all Storybook surfaces: React, Vue, and Svelte.
- [ ] Remove dashboard-teaser local drawer usage in favor of `@marwes-ui/react`.
- [ ] Commit coherent milestones along the way.

---

## 2. Implementation Phases

### Phase 1: Guide And Spec

**Goal:** Capture the implementation contract before code changes.
**Depends on:** None
**Status:** Complete

#### Outputs

- `DRAWER_IMPLEMENTATION_GUIDE.md`
- `docs/reference/spec.md` requirement for Drawer

#### Tasks

- [x] Create a drawer-specific root implementation guide.
- [x] Add `REQ-DRAWER-001` to the canonical spec.
- [x] Commit the guide/spec milestone.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Documentation sanity | Referenced paths exist | Manual | `test -f <path>` |
| Git hygiene | Only intended files staged | Auto | `git status --short` |

#### Exit Criteria

- [x] Guide exists at repo root.
- [x] Spec has testable Drawer acceptance criteria.
- [x] First commit created.

### Phase 2: Core Drawer Contract

**Goal:** Add framework-agnostic Drawer recipes, types, and a11y.
**Depends on:** Phase 1
**Status:** Complete

#### Outputs

- `packages/core/src/components/atoms/drawer/drawer-types.ts`
- `packages/core/src/components/atoms/drawer/drawer-a11y.ts`
- `packages/core/src/components/atoms/drawer/drawer-recipe.ts`
- `packages/core/src/components/atoms/drawer/index.ts`
- Core exports updated
- Core tests

#### Tasks

- [x] Add `DrawerSize`, `DrawerPlacement`, `DrawerOptions`, `DrawerRenderKit`.
- [x] Generate root, panel, and optional scrim data attributes from core.
- [x] Resolve `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`, and label fallback.
- [x] Add tests for size, placement, footer, scrim, dismissible, modal, and a11y.
- [x] Update core exports.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Recipe classes/data/a11y | No -> create | `pnpm --filter @marwes-ui/core test -- drawer` |
| Type safety | Public exports | Auto | `pnpm --filter @marwes-ui/core test:typecheck` |

#### Exit Criteria

- [x] Core tests pass.
- [x] Core typecheck passes.
- [x] Guide status updated.
- [x] Commit created.

### Phase 3: Preset CSS And Theme Variables

**Goal:** Add firstEdition Drawer styling tied to theme variables.
**Depends on:** Phase 2
**Status:** Complete

#### Outputs

- `packages/presets/src/firstEdition/drawer.css`
- `packages/presets/src/firstEdition/styles.css` import
- `packages/presets/test/drawer-css-contract.test.ts`

#### Tasks

- [x] Style drawer shell, scrim, panel, header, close button, content, dividers, footer.
- [x] Map panel surface/text/border/focus/radius/font to existing theme CSS vars.
- [x] Use component variables for sizes: `--mw-drawer-width-small`, `--mw-drawer-width-medium`, `--mw-drawer-width-large`.
- [x] Add dark mode styling without fixed adapter values.
- [x] Add CSS contract tests for classes, data hooks, size variables, and theme var usage.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | CSS contains required selectors/vars | No -> create | `pnpm --filter @marwes-ui/presets test -- drawer` |
| Type safety | Preset package | Auto | `pnpm --filter @marwes-ui/presets test:typecheck` |

#### Exit Criteria

- [x] Preset tests pass.
- [x] Preset typecheck passes.
- [x] `drawer.css` imported from `styles.css`.
- [x] Commit created.

### Phase 4: React Adapter And Stories

**Goal:** Expose Drawer through `@marwes-ui/react` and React Storybook.
**Depends on:** Phase 3
**Status:** In progress

#### Outputs

- `packages/react/src/components/drawer/drawer.tsx`
- `packages/react/src/components/drawer/index.ts`
- React tests
- `apps/storybook-react/src/stories/drawer/`
- React root exports updated

#### Tasks

- [x] Create `Drawer` with title, description, footer, children, scrim, `onClose`, className, and data attributes.
- [x] Apply core RenderKit explicitly.
- [x] Add adapter tests for labels, close button, footer, scrim, and sizes.
- [x] Add React stories for small/medium/large, no footer, right/left placement, and composed scrim.
- [x] Update React exports.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | React rendering and events | No -> create | `pnpm --filter @marwes-ui/react test -- drawer` |
| Storybook | React story compiles | No -> create | `pnpm --filter ./apps/storybook-react test -- drawer` |
| Type safety | React package | Auto | `pnpm --filter @marwes-ui/react test:typecheck` |

#### Exit Criteria

- [x] React tests pass.
- [ ] React typecheck passes. Blocked by pre-existing `packages/react/src/components/banner/__tests__/contract.test.tsx` `vi.fn()` type mismatch.
- [x] React Storybook tests pass.
- [x] Commit created.

### Phase 5: Vue Adapter And Stories

**Goal:** Expose Drawer through `@marwes-ui/vue` and Vue Storybook.
**Depends on:** Phase 4
**Status:** Complete

#### Outputs

- `packages/vue/src/components/drawer/drawer.ts`
- `packages/vue/src/components/drawer/index.ts`
- Vue tests
- `apps/storybook-vue/src/stories/drawer/`
- Vue root exports updated

#### Tasks

- [x] Mirror the React Drawer API where practical.
- [x] Emit close events and support `onClose` parity callback.
- [x] Apply core RenderKit explicitly.
- [x] Add Vue tests and Vue Storybook stories matching React coverage.
- [x] Update Vue exports.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Vue rendering and emits | No -> create | `pnpm --filter @marwes-ui/vue test -- drawer` |
| Storybook | Vue story compiles | No -> create | `pnpm --filter ./apps/storybook-vue test -- drawer` |
| Type safety | Vue package | Auto | `pnpm --filter @marwes-ui/vue test:typecheck` |

#### Exit Criteria

- [x] Vue tests pass.
- [x] Vue typecheck passes.
- [x] Vue Storybook tests pass.
- [x] Commit created.

### Phase 6: Svelte Adapter And Stories

**Goal:** Expose Drawer through `@marwes-ui/svelte` and Svelte Storybook.
**Depends on:** Phase 5
**Status:** Complete

#### Outputs

- `packages/svelte/src/lib/components/drawer/Drawer.svelte`
- `packages/svelte/src/lib/components/drawer/types.ts`
- `packages/svelte/src/lib/components/drawer/index.ts`
- Svelte tests/stories
- Svelte root exports updated

#### Tasks

- [x] Implement Svelte Drawer against the core recipe.
- [x] Add close event support.
- [x] Add Svelte stories for the same states as React/Vue.
- [x] Update Svelte exports.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Unit | Svelte package tests | No -> create/extend | `pnpm --filter @marwes-ui/svelte test -- drawer` |
| Storybook | Svelte story compiles | No -> create | `pnpm --filter ./apps/storybook-svelte test -- drawer` |
| Type safety | Svelte package | Auto | `pnpm --filter @marwes-ui/svelte test:typecheck` |

#### Exit Criteria

- [x] Svelte tests/typecheck pass.
- [x] Svelte Storybook tests pass.
- [ ] Commit created.

### Phase 7: Dashboard Teaser Replacement

**Goal:** Remove app-local drawer implementation/usage and consume the real React Drawer.
**Depends on:** Phase 4
**Status:** Complete

#### Outputs

- `apps/dashboard-teaser` imports `Drawer` from `@marwes-ui/react`.
- Any app-local drawer CSS/helpers removed or replaced.

#### Tasks

- [x] Find dashboard-teaser drawer implementation and usage.
- [x] Replace local drawer markup with React `Drawer`.
- [x] Keep dashboard behavior and visual intent intact.
- [x] Run dashboard typecheck/build.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Type safety | Dashboard usage compiles | Auto | `pnpm --filter dashboard-teaser typecheck` |
| Build | Dashboard app builds | Auto | `pnpm --filter dashboard-teaser build` |
| Visual | Drawer opens and lays out correctly | Manual/browser | local Vite app |

#### Exit Criteria

- [x] No local drawer component remains in dashboard-teaser.
- [x] Dashboard typecheck/build pass.
- [x] Browser check completed or explicitly documented as not run. Blocked: Playwright MCP could not launch because configured Chrome path is missing.
- [ ] Commit created.

### Phase 8: Registry, Docs, And Full Validation

**Goal:** Connect Drawer into docs/registry tooling and run final validation.
**Depends on:** Phases 2-7
**Status:** In progress

#### Outputs

- Registry/docs updates required by repo tooling.
- Final validation status recorded in this guide.

#### Tasks

- [ ] Run `pnpm registry:generate` or update generated registry artifacts if required by checks.
- [ ] Run `pnpm docs:generate` if Storybook docs generation requires it.
- [ ] Run `pnpm check:adapter-boundaries`.
- [ ] Run focused package tests and typechecks.
- [ ] Run `pnpm check:changed` if feasible with the dirty worktree.
- [ ] Update this guide with completion statuses and any residual risks.

#### Tests For This Phase

| Test Type | What to Test | Exists? | Path / Command |
|---|---|---|---|
| Domain | Registry/docs/story consistency | Auto | `pnpm check:repo-map` |
| Package | All package contracts | Auto | `pnpm validate:packages` |
| Changed files | Relevant repo gates | Auto | `pnpm check:changed` |

#### Exit Criteria

- [ ] Final validation complete or blocked checks documented.
- [ ] All implementation phases marked complete/skipped with reason.
- [ ] Final commit created.

---

## 3. Repeatable Unit Contract

### Unit Template: Framework Drawer Adapter

| Step | Description | Path | Action | Verify | Test |
|---|---|---|---|---|---|
| 1 | Consume `createDrawerRecipe` | Adapter package | Create/Edit | package typecheck | adapter unit test |
| 2 | Render panel, optional scrim, header, content, footer | Adapter package | Create/Edit | package test | adapter unit test |
| 3 | Wire close event/callback | Adapter package | Create/Edit | package test | close event test |
| 4 | Add Storybook coverage | Storybook app | Create/Edit | app story test | story smoke |
| 5 | Export from package root | Adapter index | Edit | typecheck | export test where pattern exists |

### Units

| Unit | Status | Tests | Validation | Notes |
|---|---|---|---|---|
| Core | Complete | pass | pass | Source of truth |
| Preset | Complete | pass | pass | Theme variable contract |
| React | Complete | pass | blocked | Package typecheck blocked by pre-existing banner test typing issue |
| Vue | Complete | pass | pass | Parity adapter |
| Svelte | Complete | pass | pass | Parity adapter |
| Dashboard teaser | Complete | pass | pass | Browser MCP blocked by missing Chrome install |

---

## 4. Test Strategy

### Principles

- Tests are phase exit criteria, not optional.
- New behavior needs package-level tests before cross-package validation.
- Adapters test rendering/events; core tests recipe/a11y contracts.
- Presets test selectors and variable usage, not browser layout internals.
- Storybook coverage must exist for React, Vue, and Svelte.

### Coverage Map

| Phase | What's Tested | Test Type | Exists? | Path |
|---|---|---|---|---|
| Core | Size, placement, footer, scrim, a11y | Unit | No | `packages/core/src/components/atoms/drawer/__tests__/` |
| Preset | Required selectors and theme variables | Unit | No | `packages/presets/test/drawer-css-contract.test.ts` |
| React | DOM output and close callback | Unit | No | `packages/react/src/components/drawer/__tests__/` |
| Vue | DOM output and close emit/callback | Unit | No | `packages/vue/src/components/drawer/__tests__/` |
| Svelte | Type/story compile and behavior where supported | Unit/story | No | `packages/svelte`, `apps/storybook-svelte` |
| Dashboard | Real component usage | Type/build/browser | No | `apps/dashboard-teaser` |

### Full Validation Run

```bash
pnpm --filter @marwes-ui/core test -- drawer
pnpm --filter @marwes-ui/presets test -- drawer
pnpm --filter @marwes-ui/react test -- drawer
pnpm --filter @marwes-ui/vue test -- drawer
pnpm --filter @marwes-ui/svelte test -- drawer
pnpm test:typecheck:packages
pnpm check:adapter-boundaries
pnpm --filter dashboard-teaser typecheck
pnpm --filter dashboard-teaser build
pnpm check:repo-map
```

---

## 5. Failure And Rollback Protocol

| Failure Type | Detection | Action |
|---|---|---|
| Test failure | Test command exits non-zero | Fix in current phase before proceeding |
| Type error | Typecheck exits non-zero | Check cross-package exports and recipe/adapter contracts |
| Lint failure | Biome exits non-zero | Format or adjust code style |
| Build failure | Package/app build exits non-zero | Check imports, package exports, and Storybook aliases |
| Missing input | Required Figma/local path absent | Stop and document blocker |
| Ambiguous behavior | Cannot map design to public API | Stop and ask Niklas |
| Dirty worktree collision | Existing unrelated changes overlap | Do not revert; stage only drawer-task paths |

---

## 6. Completion Tracker

| Phase | Title | Status | Tests | Validation | Completed |
|---|---|---|---|---|---|
| 1 | Guide And Spec | Complete | pass | pass | 2026-05-21 |
| 2 | Core Drawer Contract | Complete | pass | pass | 2026-05-21 |
| 3 | Preset CSS And Theme Variables | Complete | pass | pass | 2026-05-21 |
| 4 | React Adapter And Stories | Complete | pass | blocked | 2026-05-21 |
| 5 | Vue Adapter And Stories | Complete | pass | pass | 2026-05-21 |
| 6 | Svelte Adapter And Stories | Complete | pass | pass | 2026-05-21 |
| 7 | Dashboard Teaser Replacement | Complete | pass | pass | 2026-05-21 |
| 8 | Registry, Docs, And Full Validation | In progress | pending | pending | - |

---

## 7. Post-Completion Checklist

- [ ] All phases marked complete or skipped with reason.
- [ ] Full focused validation suite passes.
- [ ] No skipped tests without documented reason.
- [ ] Guide reflects final state.
- [ ] Drawer is exported from core, React, Vue, and Svelte.
- [ ] Drawer appears in React, Vue, and Svelte Storybooks.
- [ ] Dashboard teaser uses the real Drawer.
- [ ] Follow-up work documented.
