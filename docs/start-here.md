# Start Here

This is the single starting point for Marwes.

Pick what you are trying to do, follow one short path, and run one matching validation command. If you want a contributor-friendly build guide, open [Want to contribute?](./want-to-contribute.md). If you want the same route model in the terminal, run `pnpm compass`. If you need the full connection contract, open [Repo Map](./reference/repo-map.md).

## The one-minute model

```text
Marwes = core recipe → preset CSS → framework adapter

START HERE
  ├─ contribute to Marwes
  ├─ change a component
  ├─ update docs or registry
  ├─ review accessibility
  └─ prepare release confidence
```

## I want to contribute to Marwes

Go here:

1. [Want to contribute?](./want-to-contribute.md)
2. [Architecture](./reference/architecture.md)
3. [Repo Map](./reference/repo-map.md)

Run before handing off:

```bash
pnpm check:changed
```

Move to `pnpm validate:family <family>`, `pnpm check:repo-map`, or `pnpm validate:release` when the change touches a component family, generated truth, or release-sensitive behavior.

Stop if:

- you are unsure whether logic belongs in core, presets, adapters, stories, or app code
- React and Vue parity might drift
- the change would create a package API from a one-off example need

## I want to change a component

Go here:

1. [Architecture](./reference/architecture.md)
2. [Repo Map](./reference/repo-map.md)
3. [Family Validation](./reference/family-validation.md)

Run:

```bash
pnpm validate:family <family>
```

Example:

```bash
pnpm validate:family card
```

Stop if:

- React and Vue behavior drift apart
- adapter code starts owning logic that belongs in core
- visual language moves into adapters instead of preset CSS

## I want to update docs, registry, or generated truth

Go here:

1. [Repo Map](./reference/repo-map.md)
2. [Component Registry](./registry/README.md)
3. [Testing](./reference/testing.md)

Run:

```bash
pnpm check:repo-map
```

Stop if:

- docs disagree with package source or generated artifacts
- registry changes need regenerated artifacts but `pnpm registry:check` fails

## I want to review accessibility

Go here:

1. [Accessibility support model](./reference/accessibility.md)
2. [Audit Status](./audits/status.md)
3. The relevant family audit under `docs/audits/`

Run:

```bash
pnpm validate:family <family>
```

Stop if:

- a manual-review boundary is being presented as fully automated confidence
- a family status changes but `docs/audits/status.md` is not updated

## I want release-level confidence

Go here:

1. [Governance](./reference/governance.md)
2. [Testing](./reference/testing.md)
3. [Repo Map](./reference/repo-map.md)

Run:

```bash
pnpm validate:release
```

Stop if:

- generated artifacts are stale
- Storybook consistency fails
- security validation fails

## Fast local confidence

When you are on a branch and want the smallest useful check, run:

```bash
pnpm check:changed
```

It detects changed docs/source/families, runs the relevant focused checks, and finishes with `git diff --check`.

If you want this routing model in the terminal, run:

```bash
pnpm compass
```

## Where to zoom out

- [Want to contribute?](./want-to-contribute.md) — contributor-friendly build guide
- [Architecture](./reference/architecture.md) — the core principle
- [Repo Map](./reference/repo-map.md) — how all threads connect
- [Testing](./reference/testing.md) — which validation gate to choose
- [Docs index](./README.md) — full documentation index
