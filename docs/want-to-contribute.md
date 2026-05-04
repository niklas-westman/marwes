# Want to contribute?

Welcome. This page is the contributor-friendly path for changing Marwes without having to learn the whole repo first.

If you only read three things before opening code, read:

1. [Start Here](./start-here.md) — choose the right route.
2. [Architecture](./reference/architecture.md) — understand what belongs where.
3. [Repo Map](./reference/repo-map.md) — know which files and checks move together.

## The short version

Marwes is built as:

```text
core recipe → preset CSS → framework adapters → stories/docs/blocks
```

That means most good changes keep these boundaries clear:

- `packages/core` owns shared recipes, semantics, contracts, and generated truth.
- `packages/presets` owns CSS variables, visual defaults, and theme/preset expression.
- `packages/react` and `packages/vue` adapt the shared recipe into framework APIs.
- `apps/storybook-*` prove examples, states, parity, and accessibility behavior.
- `docs/registry/**`, `docs/reference/**`, and `artifacts/**` keep the repo explainable and auditable.
- `docs/blocks/**` contains copyable product patterns, not new package APIs.

## Before you change code

Run the Compass route finder:

```bash
pnpm compass
```

Then pick the smallest matching path:

| Intent | Read | Validate |
|---|---|---|
| Change a component family | [Architecture](./reference/architecture.md), [Family Validation](./reference/family-validation.md), the family registry doc | `pnpm validate:family <family>` |
| Add or improve docs | [Repo Map](./reference/repo-map.md), relevant reference/guide page | `pnpm check:compass` or `pnpm check:repo-map` |
| Add or improve a block | [Blocks](./blocks/README.md), [Your First Marwes Screen](./guides/your-first-screen.md) | `pnpm check:repo-map` |
| Change generated truth | [Component Registry](./registry/README.md), [AI Metadata Protocol](./reference/ai-metadata.md) | `pnpm check:repo-map` |
| Prepare something release-sensitive | [Governance](./reference/governance.md), [Testing](./reference/testing.md) | `pnpm validate:release` |

## How to build a component change

Use this sequence for most component work:

1. **Start from the family registry** under `docs/registry/families/<family>/README.md`.
2. **Update core first** if the change affects semantics, attributes, recipes, or shared contracts.
3. **Update preset CSS** if the change affects visual states, spacing, variants, or tokens.
4. **Update React and Vue together** so framework behavior does not drift.
5. **Update Storybook in both frameworks** so examples stay comparable.
6. **Update docs and generated artifacts** if public API, semantics, registry data, or parity changed.
7. **Run the family gate**:

```bash
pnpm validate:family <family>
```

If you are not sure whether something belongs in core, presets, or an adapter, default to this rule:

> Shared behavior belongs lower in the stack; framework convenience belongs in adapters; product-specific composition belongs in blocks or app code.

## Good contributor habits

- Prefer one coherent change over several partially-related edits.
- Keep React and Vue parity visible.
- Do not add package APIs just because one example wants a shortcut.
- Keep blocks copyable and app-owned until a pattern repeats enough to deserve package surface.
- Update docs in the same change when behavior or public API changes.
- Run the smallest meaningful validation first, then a larger gate before review.
- Stop and ask when a change would weaken accessibility, generated-truth confidence, or adapter/core boundaries.

## Validation ladder

Use the smallest useful command, then move upward as risk increases:

```bash
pnpm check:changed
pnpm check:compass
pnpm validate:family <family>
pnpm check:repo-map
pnpm validate:packages
pnpm validate:release
```

Before a PR or handoff, at minimum run the command recommended by [Repo Map](./reference/repo-map.md) for the thing you changed.

## What not to do

- Do not put core logic in React or Vue adapters.
- Do not let preset CSS depend on app-specific assumptions.
- Do not treat `docs/blocks/**` as exported package API.
- Do not leave generated artifacts stale.
- Do not keep temporary planning docs around after a decision has moved into reference docs, registry docs, tests, or release notes.

## If you feel lost

Use:

```bash
pnpm compass
```

Then open [Start Here](./start-here.md). If the route still feels unclear, improve this page or [Repo Map](./reference/repo-map.md) as part of the change. Documentation is part of the product here.
