# Project Overview

Marwes is a component system designed to get teams up and running fast with beautiful defaults, a simple theme override API, and consistent accessibility across frameworks.

## Purpose
- Provide a compact set of high‑quality components people use daily.
- Make components look great out of the box via a preset (starting with `firstEdition`).
- Keep theming easy and minimal while still expressive.
- Ensure accessibility rules are consistent and testable in one place.

## How It Is Connected
Marwes is intentionally split into three layers that interact in a strict, predictable way:

1. **`@marwes-ui/core`** (TypeScript only)
   - Pure logic: theme normalization, a11y rules, component recipes.
   - Outputs a typed RenderKit (tag, className, vars, a11y).

2. **`@marwes-ui/presets`** (CSS + tokens)
   - Static CSS using `.mw-*` classnames and CSS variables.
   - Defines the “edition” look and feel (e.g., `firstEdition`).

3. **`@marwes-ui/react`** (React adapter)
   - Applies the RenderKit to actual React elements.
   - No duplicated logic; only rendering and wiring.

This keeps responsibilities clear and avoids drift between implementations.

## Goals
- Small, focused component set with excellent defaults.
- Framework‑agnostic logic so adapters stay thin.
- Strict typing throughout the stack.
- Zero runtime CSS‑in‑JS overhead.
- Accessibility treated as a first‑class feature.

## Non‑Goals
- Not a massive UI mega‑framework.
- Not shipping complex components early (date pickers, data tables, etc.).
- Not forcing a styling solution beyond CSS variables and classnames.

## Scope (Initial)
- Buttons, Inputs, and other daily‑use form controls.
- Base layout primitives like Card and Divider.
- A single preset (`firstEdition`) to establish the design system.

For deeper decisions, constraints, and roadmap notes, see `SPEC.md`.
