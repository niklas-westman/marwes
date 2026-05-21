# Implementation Guide: Pagination Component

Created: 2026-05-21
Status: complete
Branch: `dashboard-teaser`

---

## Living Document

This guide MUST be updated during implementation:

- [x] Check off tasks as they are completed
- [x] Add notes when reality diverges from plan
- [x] Reorder or split phases when blockers are discovered
- [x] Add new tasks discovered during implementation
- [x] Mark tasks as "skipped — <reason>" when they become irrelevant
- [x] Record timestamps on phase completions for velocity tracking
- [x] Update test coverage map as tests are written

**Last updated:** 2026-05-21
**Current phase:** 6 complete

---

## 0. Project Discovery

### Discovery Summary

| Variable | Value |
|---|---|
| Package manager | pnpm (`pnpm-lock.yaml`) |
| Monorepo | Yes — `packages/`, `apps/` |
| Test runner | Vitest |
| Test command | `pnpm test`, focused package scripts |
| Typecheck | `pnpm typecheck`, focused package `typecheck` scripts |
| Lint | `pnpm lint`, `pnpm exec biome check ...` |
| Build | `pnpm build`, `pnpm --filter <package> build` |
| Domain checks | `pnpm check:changed`, `pnpm validate:family <family>`, `pnpm check:adapter-boundaries`, registry/docs checks |
| CI | `.github/workflows/ci.yml`, `.github/workflows/_ci.yml` |
| Feature paths | `packages/core/src/components/atoms/pagination/`, `packages/presets/src/firstEdition/pagination.css`, adapter package component folders, Storybook app folders, `apps/dashboard-teaser/` |
| Existing tests | Package Vitest tests plus Storybook taxonomy tests under `apps/storybook-*/src/stories/*/__tests__/` |

### Figma Inputs

| Source | Notes |
|---|---|
| `.figma/marwes/components/pagination.json` | Primary component: 308x32, horizontal, optional previous/next, 12px section gaps, 2px page item gap |
| `.figma/marwes/components/partspaginationpage-item.json` | Default page item: 32x32, radius 8, neutral text |
| `.figma/marwes/components/partspaginationactive-page-item.json` | Active item: 32x32, radius 8, `#2f31fc` fill, white text |
| `.figma/marwes/components/partspaginationellipsis.json` | Ellipsis item: 32x32 centered text |
| `apps/dashboard-teaser/src/sections/rows/RowButtonPaginationProgress.tsx` | Contains the local copy to remove and replace with the adapter import |

### Validation Stack

| Purpose | Command | Scope |
|---|---|---|
| Core tests | `pnpm --filter @marwes-ui/core test -- src/components/atoms/pagination` | New core helpers |
| Preset tests | `pnpm --filter @marwes-ui/presets test -- test/pagination-css-contract.test.ts test/exports.test.ts test/first-edition-css.test.ts` | CSS contract and exports |
| React tests | `pnpm --filter @marwes-ui/react test -- src/components/pagination/__tests__` | React adapter |
| Vue tests | `pnpm --filter @marwes-ui/vue test -- src/components/pagination/__tests__` | Vue adapter |
| Svelte tests | `pnpm --filter @marwes-ui/svelte test -- src/tests/pagination.test.ts` | Svelte adapter |
| Dashboard build | `pnpm --filter dashboard-teaser build` | Teaser integration |
| Changed scope | `pnpm check:changed` | Repository-focused gate |

---

## 1. Architecture Contract

### Problem Statement

Pagination exists as a one-off styled copy in the dashboard teaser app. It needs to become a first-class Marwes component with shared core behavior, preset styling, React/Vue/Svelte adapters, Storybook coverage, registry docs, and dashboard usage through `@marwes-ui/react`.

### Chosen Approach

Build Pagination in the normal Marwes layer order: core recipe and page-window helpers, firstEdition preset CSS matching the Figma dimensions, React adapter, Vue adapter, Svelte adapter, Storybook stories/tests for all three frameworks, registry metadata/docs, then replace the dashboard local implementation with the React adapter import.

### Architecture Boundaries

| Layer | Owns | Does NOT Own |
|---|---|---|
| Core | Pagination types, item-window generation, render-kit classnames, a11y attributes | Framework state hooks or DOM rendering |
| Presets | `.mw-pagination*` visual styling, Figma dimensions, token mapping | Adapter behavior |
| React/Vue/Svelte | Thin render/event adapters and framework-idiomatic change callbacks | Hardcoded visual styling or duplicated pagination math |
| Storybook/docs | Examples, taxonomy tests, registry metadata | Component behavior |
| Dashboard teaser | Consuming the public React component | Owning local pagination styles |

### Non-Negotiables

- [x] Use `core recipe -> preset CSS -> React adapter -> Vue adapter -> Svelte adapter`.
- [x] Remove the dashboard-local pagination implementation.
- [x] Match the Figma 32px item size, 8px radius, 2px page gap, 12px section gap, neutral labels, and active blue item.
- [x] Support optional previous/next controls.
- [x] Use accessible `nav`/list semantics and `aria-current="page"` for the active page.
- [x] Add stories and taxonomy tests for React, Vue, and Svelte.
- [x] Add focused tests before claiming completion.

---

## 2. Implementation Phases

### Phase 1: Core Contract

**Goal:** Add shared pagination types, a11y, recipe, and item-window helper.
**Depends on:** None
**Status:** complete

#### Outputs

- `packages/core/src/components/atoms/pagination/*`
- Core exports from `packages/core/src/components/atoms/index.ts` and `packages/core/src/index.ts`
- Core tests for item-window and a11y behavior

#### Tasks

- [x] Add pagination types and render-kit contracts.
- [x] Add page-window helper with page and ellipsis items.
- [x] Add a11y helpers for nav, page buttons, prev/next buttons, and ellipsis.
- [x] Add recipe functions with stable `.mw-pagination*` classnames.
- [x] Add core tests.

#### Exit Criteria

- [x] `pnpm --filter @marwes-ui/core test -- test/recipes/pagination.test.ts`
- [x] Core exports compile through focused typecheck later in full validation.

### Phase 2: Preset Styling

**Goal:** Add firstEdition CSS matching the Figma pagination component.
**Depends on:** Phase 1
**Status:** complete

#### Outputs

- `packages/presets/src/firstEdition/pagination.css`
- Import in `packages/presets/src/firstEdition/styles.css`
- `packages/presets/test/pagination-css-contract.test.ts`

#### Tasks

- [x] Add tokenized CSS for root, list, page item, active item, ellipsis, prev/next.
- [x] Add disabled, hover, and focus-visible states.
- [x] Add CSS contract tests for Figma dimensions and active styling.

#### Exit Criteria

- [x] `pnpm --filter @marwes-ui/presets test -- test/pagination-css-contract.test.ts test/exports.test.ts test/first-edition-css.test.ts`

### Phase 3: Framework Adapters

**Goal:** Add React, Vue, and Svelte Pagination adapters using the core recipe.
**Depends on:** Phase 2
**Status:** complete

#### Outputs

- `packages/react/src/components/pagination/*`
- `packages/vue/src/components/pagination/*`
- `packages/svelte/src/lib/components/pagination/*`
- Adapter package exports
- Focused adapter tests

#### Tasks

- [x] Add React component with controlled/uncontrolled page behavior.
- [x] Add Vue component with `modelValue` and `update:modelValue`.
- [x] Add Svelte component with bindable `page`.
- [x] Add tests for rendering, active page, disabled prev/next, and page change.
- [x] Update public package exports.

#### Exit Criteria

- [x] Focused React, Vue, and Svelte pagination tests pass.

### Phase 4: Storybook And Registry

**Goal:** Add stories, docs, and registry metadata for Pagination.
**Depends on:** Phase 3
**Status:** complete

#### Outputs

- `apps/storybook-react/src/stories/pagination/*`
- `apps/storybook-vue/src/stories/pagination/*`
- `apps/storybook-svelte/src/stories/pagination/*`
- `docs/registry/families/pagination/*`

#### Tasks

- [x] Add Introduction docs for all storybooks.
- [x] Add default, without prev/next, compact range, first/last, and disabled stories.
- [x] Add taxonomy tests for all storybooks.
- [x] Add registry README, meta JSON, and visual maps.

#### Exit Criteria

- [x] Storybook taxonomy tests pass for all three storybook apps.
- [x] Registry generation/checks run through changed-scope validation.

### Phase 5: Dashboard Integration

**Goal:** Replace the dashboard teaser local pagination copy with `@marwes-ui/react` Pagination.
**Depends on:** Phase 3
**Status:** complete

#### Outputs

- Updated `apps/dashboard-teaser/src/sections/rows/RowButtonPaginationProgress.tsx`

#### Tasks

- [x] Import `Pagination` from `@marwes-ui/react`.
- [x] Remove local styled pagination wrapper/button/ellipsis definitions.
- [x] Keep dashboard state and connect it to `page`/`onPageChange`.

#### Exit Criteria

- [x] `pnpm --filter dashboard-teaser build`

### Phase 6: Final Validation

**Goal:** Verify changed behavior and document known risks.
**Depends on:** Phases 1-5
**Status:** complete

#### Tasks

- [x] Run focused package tests.
- [x] Run dashboard build.
- [x] Run `pnpm check:changed`.
- [x] Update this guide with final phase statuses and validation notes.

#### Exit Criteria

- [x] All feasible checks are run and results are recorded.

---

## 3. Completion Tracker

| Phase | Title | Status | Tests | Validation | Completed |
|---|---|---|---|---|---|
| 1 | Core Contract | complete | pass | pass | 2026-05-21 |
| 2 | Preset Styling | complete | pass | pass | 2026-05-21 |
| 3 | Framework Adapters | complete | pass | pass | 2026-05-21 |
| 4 | Storybook And Registry | complete | pass | pass | 2026-05-21 |
| 5 | Dashboard Integration | complete | pass | pass | 2026-05-21 |
| 6 | Final Validation | complete | pass | pass | 2026-05-21 |

---

## 4. Final Notes

- `pnpm check:changed` passes.
- `pnpm validate:family pagination` passes.
- `pnpm --filter dashboard-teaser build` passes.
- `scripts/check-changed.mjs` was tightened so package export files and `firstEdition/styles.css` no longer become fake component families (`index.ts`, `styles`).
