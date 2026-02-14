# @marwes/core

Framework-agnostic Marwes core: theme system, typed component recipes, and a11y mapping.

## Responsibilities
- Define and normalize the `Theme` contract.
- Build component render kits (`tag`, `className`, `vars`, `a11y`).
- Centralize a11y behavior so adapters stay consistent.
- Stay independent from DOM and framework runtime.

## Non-Responsibilities
- No React/Vue rendering.
- No preset CSS authoring.
- No runtime styling engine.

## Public API
Theme and system:
- `defaultTheme`
- `mergeTheme`
- `normalizeTheme`
- `createSystem`
- Types: `Theme`, `ThemeOverrides`, `Preset`, `System`, `CssVars`

Atoms (recipes + types):
- `createButtonRecipe`
- `createInputRecipe`
- `checkboxRecipe`
- `createIconRecipe`
- `createHeadingRecipe`
- `createParagraphRecipe`

Molecules:
- `checkboxFieldRecipe`

## RenderKit Contract
Core recipes return typed render data consumed by adapters:
- `tag`: target HTML tag
- `className`: stable `.mw-*` classes
- `vars`: `Record<--mw-*, string>` CSS variables
- `a11y`: explicit typed accessibility fields
- optional control fields per component (for example `blockClick`, `indeterminate`)

## File Layout
- `src/theme/*` - theme types/defaults/merge/normalize/system
- `src/components/atoms/*` - atomic component contracts + recipes
- `src/components/molecules/*` - composed component contracts + recipes
- `src/shared/css-vars.ts` - CSS variable type contract

## Engineering Rules
- Keep core framework-agnostic.
- Do not use `any`.
- Put accessibility mapping in `*.a11y.ts`.
- Put visual decisions in presets, not in adapters.
- Only emit CSS variables and stable classnames from recipes.

## Figma Mapping
When implementing design changes from Figma, map tokens into theme keys and recipe vars as documented in:
- `../../docs/FIGMA_TO_MARWES.md`

## Scripts
- `pnpm --filter @marwes/core dev`
- `pnpm --filter @marwes/core build`
- `pnpm --filter @marwes/core typecheck`

## Related Docs
- `../../docs/PROJECT.md`
- `../../docs/ARCHITECTURE.md`
- `../../docs/ENGINEERING.md`
