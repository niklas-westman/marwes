# Milibry Dashboard Feedback Queue

## Purpose

Capture reusable component-system feedback found while integrating Marwes into the Milibry dashboard v2 surface.

This file is intentionally a planning queue, not a public API promise. Promote items into components, purpose variants, or blocks only after they repeat across real product surfaces or prove clear API value.

## Source surface

- App: Milibry
- Surface: `/metrics` dashboard v2
- Context: generation-6 decision dashboard using `@marwes-ui/react@1.0.5`
- Related Milibry checkpoint: `apps/milibry/neural-library/projects/milock/checkpoints/2026-05-04-milibry-dashboard-v2-marwes-integration-plan-01.md`

## Work items

### P1 — Metric tile variant

**Status:** first API prototype added to React/Vue `StatCard` with `value`, `note`, and `meta` slots, plus preset CSS for `.mw-stat-card__metric`, `.mw-stat-card__value`, `.mw-stat-card__note`, and `.mw-stat-card__meta`.

**Observed need:** Milibry uses `StatCard`, but still needed local `StatValue` and `StatLabel` wrappers for large KPI values and explanatory notes.

**Proposal:** Add a richer `StatCard` composition or purpose variant with named slots for:

- value
- label/note
- optional status/trend badge
- optional comparison copy

**Acceptance shape:** Milibry headline stats should be expressible without local KPI typography wrappers after Milibry consumes the updated Marwes package/build.

### P1 — Decision / verdict card

**Observed need:** The primary verdict card is central to the product, but currently uses a hand-built `Card` composition for status, confidence, source, and next-decision content.

**Proposal:** Explore a purpose card for decision dashboards, likely as a block first:

- verdict/status label
- confidence/source metadata
- supporting evidence rows
- next action or decision prompt

**Acceptance shape:** A dashboard can make the primary decision visible without inventing a local hero/verdict card pattern.

### P2 — Evidence list rows

**Observed need:** Milibry repeats compact label/value rows for gates, sources, missing proof, and verdict metadata.

**Proposal:** Add a small description/evidence row pattern, probably as a block-level helper before package API.

**Acceptance shape:** Audit and decision surfaces can show proof trails consistently without custom grid rows in every app.

### P2 — Confidence badge semantics

**Observed need:** Milibry maps confidence labels such as `high`, `building`, `provisional`, and `missing` to generic badge variants locally.

**Proposal:** Define confidence-specific badge guidance or a semantic helper around `StatusBadge`.

**Acceptance shape:** Product dashboards can communicate confidence without each app making its own color/variant mapping.

### P3 — Dashboard section shell

**Observed need:** Milibry now has a reusable dashboard rhythm: hero card, stat grid, tabbed sections, decision cards, evidence cards, and detailed accordions.

**Proposal:** Promote this as a Marwes block first, not a hard component API.

**Acceptance shape:** New apps can copy a decision-dashboard block that uses Marwes primitives and theme variables while keeping domain-specific visuals app-owned.

## Next recommendation

Validate whether the `StatCard` slot API is enough in real Milibry usage. If it holds, continue with the decision/verdict card. If it feels too app-specific, keep the API minimal and move richer dashboard composition into copyable Marwes blocks.
