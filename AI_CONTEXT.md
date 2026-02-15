# AI Context - Marwes

Read this file before making changes. It is the execution guide for AI-assisted work in this repository.

## Canonical Source of Truth
- Primary specification: [SPEC.md](SPEC.md)
- Supporting constraints: [docs/ENGINEERING.md](docs/ENGINEERING.md)
- Structural overview: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Product scope and intent: [docs/PROJECT.md](docs/PROJECT.md)
- Figma mapping rules: [docs/FIGMA_TO_MARWES.md](docs/FIGMA_TO_MARWES.md)

If docs conflict, follow this precedence:
1. `SPEC.md`
2. `docs/ENGINEERING.md`
3. `docs/ARCHITECTURE.md`
4. Package-level READMEs

## Current Snapshot (2026-02-11)
- Architecture: 3 layers (`@marwes/core` -> `@marwes/presets` -> `@marwes/react`)
- Implemented atoms: Button, Input, Checkbox, Icon, H1, H2, H3, Paragraph
- Implemented molecules: CheckboxField
- Planned next: Select, Textarea, FormField, Card, Divider, Spinner

## Required Reading Order
1. [SPEC.md](SPEC.md)
2. [docs/PROJECT.md](docs/PROJECT.md)
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. [docs/ENGINEERING.md](docs/ENGINEERING.md)
5. [docs/FIGMA_TO_MARWES.md](docs/FIGMA_TO_MARWES.md)

## Spec-Driven Execution Loop (Required)
For every non-trivial change, follow this order:

1. Define or update the spec first in `SPEC.md`.
   - Problem statement
   - Scope and non-goals
   - Acceptance criteria (testable)
   - Test plan
2. Create an implementation plan mapped to spec criteria.
3. Implement by layer:
   - Core logic and a11y
   - Preset CSS
   - React adapter wiring
4. Validate:
   - `pnpm typecheck`
   - `pnpm build`
   - relevant manual checks in Storybook/playground
5. Update docs and changelog for behavior/API changes.
6. If requirements changed, add/update a decision in `SPEC.md`.

## Component Implementation Checklist
- [ ] Define types in `packages/core/src/components/atoms/[component]/[component]-types.ts`
- [ ] Implement a11y in `[component]-a11y.ts`
- [ ] Implement recipe in `[component]-recipe.ts`
- [ ] Export from component and package indexes
- [ ] Add preset CSS in `packages/presets/src/firstEdition/[component].css`
- [ ] Import CSS via `packages/presets/src/firstEdition/styles.css`
- [ ] Implement React adapter in `packages/react/src/components/[component].tsx` (or folder)
- [ ] Add Storybook story in `apps/storybook-react/src/stories/`
- [ ] Verify behavior in `apps/playground-react`

## Definition of Done (AI Changes)
- Behavior is traceable to acceptance criteria in `SPEC.md`
- No framework logic leaked into `@marwes/core`
- No hardcoded design values in adapters
- A11y behavior lives in core mappings
- Docs are updated if behavior/API changes

## Anti-Patterns to Avoid
- React logic inside `@marwes/core`
- Core behavior duplicated in adapters
- Inline styles except CSS variable objects
- Untracked decisions made only in code (must be in `SPEC.md`)
- `any` in TypeScript

## Development Commands
```bash
pnpm dev                 # packages + playground
pnpm dev:storybook       # Storybook
pnpm dev:playground      # playground app
pnpm build               # full build
pnpm typecheck           # all packages/apps
```

## Build System Notes
- **Package builds**: Use `tsup` to generate `dist/` folders. Never run `tsc` directly in packages.
- **Type checking**: Use `pnpm typecheck` for type errors without emitting files.
- **Storybook build**: Use `storybook build` (not `vite build`) to generate deployable static site.
- **Build artifacts**: Only `dist/` and `storybook-static/` should exist. `src/` directories must never contain `.js`, `.d.ts`, or `.map` files.

### If You See Build Artifacts in src/
```bash
# Clean up accidental tsc output
find packages/*/src -type f \( -name "*.js" -o -name "*.d.ts" -o -name "*.map" \) -delete
```
