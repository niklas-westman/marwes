# Engineering Guide

This doc is the shared set of rules and conventions to keep Marwes consistent. If you’re adding or modifying code, follow these rules to avoid architectural drift.

## Architectural Rules
- **Core is framework‑agnostic**: no React, no DOM, no runtime styling.
- **Presets are static CSS**: classnames and CSS variables only.
- **Adapters are thin**: render elements, apply RenderKit, wire events.
- **A11y lives in core**: adapters must not re‑implement accessibility rules.

## Spec-Driven Rule
- For non-trivial work, update `SPEC.md` before implementation.
- Every change should map to explicit acceptance criteria in `SPEC.md`.
- If behavior changes, update docs/changelog in the same change set.
- If a tradeoff is unresolved, add or update an open decision in `SPEC.md`.

## RenderKit Contract
Core recipes return a typed RenderKit used by adapters:
- `tag`: element tag to render
- `className`: preset classes
- `vars`: CSS variables object (strings only)
- `a11y`: typed ARIA props
- `policy` (optional): behavior guards (e.g., prevent clicks)

Adapters must apply the RenderKit explicitly and avoid loose prop spreading.

RenderKit debug instrumentation is opt-in. Set `window.__MARWES_RENDERKIT_DEBUG__ = true` in development to emit `marwes/renderkit/renderkit-update` events.

## Styling Rules
- **No CSS‑in‑JS runtime styling.**
- CSS variables and classnames are the contract.
- Preset CSS must use `.mw-*` classnames and `--mw-*` variables.
- Theme values should map to CSS variables, not inline styles (except the vars object).

## TypeScript Rules
- Strict typing, no `any`.
- Public component contracts live in `*.types.ts`.
- A11y output types must be explicit and predictable.

## Code Style - Variable Naming
All variable and parameter names must be **pedagogical and self-documenting**. Avoid cryptic abbreviations that require context to understand.

### Bad Examples (Avoid)
```typescript
// ❌ Cryptic single-letter names
def.nodes.map((n, i) => {
  const Tag = n.tag;
  return <Tag key={i} {...n.attrs} />;
});

// ❌ Unclear abbreviations
const btn = document.querySelector('.button');
const usr = getCurrentUser();
const msg = formatMessage(data);
```

### Good Examples (Use)
```typescript
// ✅ Clear, descriptive names
def.nodes.map((iconNode, nodeIndex) => {
  const TagName = iconNode.tag;
  return <TagName key={nodeIndex} {...iconNode.attrs} />;
});

// ✅ Self-documenting variables
const buttonElement = document.querySelector('.button');
const currentUser = getCurrentUser();
const formattedMessage = formatMessage(data);
```

### Allowed Exceptions
Short names are acceptable in these specific contexts:
- **Coordinates**: `x`, `y`, `z` for spatial positioning
- **Generics**: `T`, `K`, `V`, `P` for type parameters
- **Very short scope**: Variables used within 2-3 lines (e.g., `const x = props.x * 2; return x;`)
- **Standard conventions**: `i`, `j`, `k` for pure numeric iteration where no semantic meaning exists
- **Well-known abbreviations**: `id`, `url`, `html`, `css`, `svg` (when universally understood)

### Rationale
- **Readability**: Code is read far more often than written
- **Onboarding**: New contributors understand code faster
- **Maintenance**: Reduces cognitive load when debugging or refactoring
- **AI Assistance**: Tools like GitHub Copilot work better with descriptive names

When in doubt, choose clarity over brevity.

## Event Naming Policy
- Prefer `onValueChange(value)` for value‑based controls.
- Adapters may expose `onChange(value)` as an alias but internal contracts must use `onValueChange`.

## Component File Layout (Core)
Each component in `@marwes-ui/core` follows a consistent structure:
- `*.types.ts` — public contracts
- `*.a11y.ts` — accessibility mapping
- `*.styles.ts` — theme/state to CSS variables + modifiers
- `*.recipe.ts` — combines logic into a RenderKit
- `index.ts` — exports

## When Adding a Component

Follow this layer order strictly — never skip ahead or work across layers simultaneously:

```
1. core          *.types.ts      — public contracts, InteractionState, props
2. core          *.a11y.ts       — ARIA attribute mapping
3. core          *.styles.ts     — state × variant → CSS variables + class modifiers
4. core          *.recipe.ts     — combines into a RenderKit
5. presets       *.css           — CSS classes + --mw-* variable consumption
6. react         component       — React adapter (applies RenderKit, wires events)
7. react         *.stories.ts    — Storybook stories covering all states and variants
8. vue           component       — Vue adapter (same RenderKit, same API surface)
9. vue           *.stories.ts    — Storybook stories matching React coverage
```

Each layer must be complete and passing before the next begins. Tests are written **before** the implementation they cover (TDD). A layer is done when:
- All tests pass
- `tsc --noEmit` clean
- Lint clean
- No regressions in visual snapshots (Chromatic)

## Implementation Workflow (Plan Agent TDD)

Non-trivial work follows the plan-agent flow before any implementation begins:

```
Research → Spec → Tickets → Implement
```

- **Research** — read the codebase, understand what exists, surface risks and options. Produces `research.md`.
- **Spec** — locked-down requirements, architecture, acceptance criteria. Produces `spec.md` (updates `docs/SPEC.md` for shared decisions).
- **Tickets** — TDD-style task list. Each ticket: write the test first, then implement. Produces `todo.md`.
- **Implement** — execute tickets in order, one at a time.

Each phase gates on explicit confirmation. No implementation without a signed-off spec.

## Build System

### Package Build Configuration
All packages (`@marwes-ui/core`, `@marwes-ui/presets`, `@marwes-ui/react`) use **tsup** for bundling:
- **Output**: `dist/` folder with ESM bundle, TypeScript declarations, and source maps
- **Entry**: `src/index.ts`
- **Format**: ESM only (`type: "module"`)
- **Published files**: Only the `dist/` folder (configured in `package.json` `files` field)

**Key Point**: TypeScript `tsconfig.json` files in packages have `noEmit: true` to prevent accidental build artifacts in `src/` directories. Only tsup generates output, and only to `dist/`.

### Building Packages
```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @marwes-ui/react build

# Clean and rebuild
pnpm --filter @marwes-ui/react clean && pnpm --filter @marwes-ui/react build
```

### Publishing to npm
```bash
cd packages/react
npm publish  # or pnpm publish
```

Ensure `version` is bumped and `CHANGELOG.md` is updated before publishing.

## Anti‑Patterns (Avoid)
- Duplicating logic in adapters.
- Mixing styling logic into core recipes.
- Adding ad‑hoc classnames without preset CSS support.
- Using inline styles for anything other than CSS variables.
- Introducing framework dependencies in `@marwes-ui/core`.

If a change would break these rules, it needs explicit discussion and a documented decision.
