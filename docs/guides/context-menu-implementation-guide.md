# Implementation Guide: Context Menu Component

Created: 2026-05-21
Status: implemented
Branch: dashboard-teaser

## Living Document

Update this guide while implementing:

- [x] Check off tasks as completed
- [x] Add notes when reality diverges from plan
- [x] Reorder or split phases when blockers are discovered
- [x] Mark skipped tasks with a reason
- [x] Record phase completion status

Last updated: 2026-05-21
Current phase: complete

## 0. Project Discovery

| Variable | Value |
|---|---|
| Package manager | pnpm (`pnpm-lock.yaml`) |
| Monorepo | Yes: `packages/`, `apps/` |
| Test runner | Vitest (`vitest.config.ts`) |
| Test command | `pnpm test` / targeted package scripts |
| Typecheck | `pnpm typecheck`, `pnpm test:typecheck:packages` |
| Lint | `pnpm exec biome check .` |
| Build | `pnpm build:packages`, `pnpm build` |
| Domain checks | `pnpm artifacts:check`, `pnpm registry:check`, `pnpm parity:summary:check`, `pnpm storybook:consistency`, `pnpm check:adapter-boundaries` |
| CI | `.github/workflows/ci.yml`, `.github/workflows/_ci.yml`, `.github/workflows/release.yml` |
| Feature paths | `packages/core/src/components/atoms/context-menu`, `packages/presets/src/firstEdition/context-menu.css`, framework adapters, Storybook stories |
| Figma refs | `.figma/marwes/components/context-menu.json`, `.figma/marwes/components/partscontext-menucontext-menu-item.json`, `.figma/marwes/pages/-context-menu/*` |

## 1. Architecture Contract

Build a public `ContextMenu` component using the repo rule:

```text
core recipe -> preset CSS -> React adapter -> Vue adapter -> Svelte adapter
```

Core owns item typing, role/a11y render kits, and stable semantic data. Presets own all `.mw-context-menu*` styling. Adapters render buttons, icons, dividers, and item callbacks without duplicating styling rules.

Non-goals:

- no popover positioning or open-state management
- no framework logic in core
- no Figma API calls

## 2. Implementation Phases

### Phase 1: Core Contract

Status: complete

Tasks:

- [x] Add `REQ-CONTEXT-MENU-001` to `docs/reference/spec.md`
- [x] Add core types, a11y, recipe, and tests
- [x] Export core API from atom indexes and root index

Exit checks:

- [x] `pnpm test:core`
- [x] `pnpm test:typecheck:core`

### Phase 2: Preset CSS

Status: complete

Tasks:

- [x] Add `packages/presets/src/firstEdition/context-menu.css`
- [x] Import it from `packages/presets/src/firstEdition/styles.css`
- [x] Cover Figma light/dark shell, item, icon, divider, focus, hover, disabled, and destructive states

Exit checks:

- [x] `pnpm --filter @marwes-ui/presets test -- test/theme-token-coverage.test.ts test/first-edition-css.test.ts test/exports.test.ts`

### Phase 3: Framework Adapters

Status: complete

Tasks:

- [x] Add React adapter and tests
- [x] Add Vue adapter and tests
- [x] Add Svelte adapter and types
- [x] Update package exports
- [x] Replace dashboard teaser mock menu with React `ContextMenu`

Exit checks:

- [x] `pnpm test:react`
- [x] `pnpm test:vue`
- [x] `pnpm test:svelte`
- [x] `pnpm test:typecheck:core`
- [ ] `pnpm test:typecheck:packages` (blocked by pre-existing pagination/banner exact-optional type errors outside context-menu)

### Phase 4: Stories, Metadata, and Validation

Status: complete

Tasks:

- [x] Add React/Vue/Svelte Storybook introduction and atom stories
- [x] Add Storybook taxonomy/docs tests
- [x] Wire registry/trust sources when public metadata requires it
- [x] Regenerate/check artifacts and registry if metadata changes
- [ ] Run targeted browser verification (blocked: Playwright MCP cannot find Chrome; repo-local Playwright CLI is not installed)

Exit checks:

- [x] `pnpm storybook:consistency`
- [x] `pnpm registry:check`
- [x] `pnpm artifacts:check`
- [x] `pnpm parity:summary:check`
- [x] `pnpm check:changed`

## 3. Acceptance Criteria

- [x] `ContextMenu` renders a Figma-aligned menu surface with icon items and dividers
- [x] Menu items are button-backed, keyboard focusable, and expose `role="menuitem"`
- [x] Disabled items cannot trigger selection
- [x] Destructive item state is styleable and testable
- [x] React, Vue, and Svelte exports are available
- [x] Dashboard teaser no longer owns app-local context menu styling
- [x] Validation results are recorded in the final response
