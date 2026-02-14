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

## Styling Rules
- **No CSS‑in‑JS runtime styling.**
- CSS variables and classnames are the contract.
- Preset CSS must use `.mw-*` classnames and `--mw-*` variables.
- Theme values should map to CSS variables, not inline styles (except the vars object).

## TypeScript Rules
- Strict typing, no `any`.
- Public component contracts live in `*.types.ts`.
- A11y output types must be explicit and predictable.

## Event Naming Policy
- Prefer `onValueChange(value)` for value‑based controls.
- Adapters may expose `onChange(value)` as an alias but internal contracts must use `onValueChange`.

## Component File Layout (Core)
Each component in `@marwes/core` follows a consistent structure:
- `*.types.ts` — public contracts
- `*.a11y.ts` — accessibility mapping
- `*.styles.ts` — theme/state to CSS variables + modifiers
- `*.recipe.ts` — combines logic into a RenderKit
- `index.ts` — exports

## When Adding a Component
1. Define types in `*.types.ts`.
2. Implement a11y in `*.a11y.ts`.
3. Implement styles in `*.styles.ts`.
4. Build the RenderKit in `*.recipe.ts`.
5. Add preset CSS in `@marwes/presets`.
6. Add the adapter component in `@marwes/react`.
7. Add a Storybook story and a playground example.

## Anti‑Patterns (Avoid)
- Duplicating logic in adapters.
- Mixing styling logic into core recipes.
- Adding ad‑hoc classnames without preset CSS support.
- Using inline styles for anything other than CSS variables.
- Introducing framework dependencies in `@marwes/core`.

If a change would break these rules, it needs explicit discussion and a documented decision.
