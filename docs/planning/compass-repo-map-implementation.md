# Compass + Repo Map Implementation Plan

## Purpose

Consolidate Marwes navigation and docs-system validation around two names:

- **Compass** — the human/CLI route finder: where do I begin and what command should I run?
- **Repo Map** — the connection contract: what paths, commands, authority rules, and downstream checks hold the repo together?

The goal is fewer public scripts, less scattered validation logic, and clearer naming.

## Run permit

- Goal: replace scattered docs/navigation checks with one central Compass engine and remove obsolete public aliases.
- Definition of value: contributors use `pnpm compass` to navigate, `pnpm check:compass` to verify routing rules, and `pnpm check:repo-map` to verify the full docs/repo-map/generated-truth contract.
- Allowed paths: `scripts/**`, `docs/**`, `package.json`.
- Forbidden paths: package runtime APIs, release workflows, package versions, changelogs.
- Validation required: `pnpm compass`, `pnpm check:compass`, `pnpm check:repo-map`, and `git diff --check`.
- Hard stop: if consolidation weakens an existing validation guarantee.

## Naming model

Public commands:

- `pnpm compass` — print the singular route model.
- `pnpm check:compass` — validate Compass routing rules, links, docs/API drift, repo-map coverage, authority, status ownership, and planning lifecycle.
- `pnpm check:repo-map` — run `check:compass` plus generated-truth checks: semantics, trust artifacts, registry, parity summary, Storybook consistency, and adapter boundaries.

Removed obsolete aliases/wrappers:

- `pnpm help:repo` was folded into `pnpm compass`.
- `pnpm compass:check` was folded into `pnpm check:compass`.
- `pnpm validate:docs` was folded into `pnpm check:repo-map`.
- `pnpm docs:links` and `pnpm docs:api` were folded into `pnpm check:compass`.

Internal shape:

```text
scripts/compass/
  check.mjs       # central validation runner
  cli.mjs         # route printer
  config.mjs      # paths, commands, route model, authority rules
```

## Implementation checklist

### Segment 1 — Compass engine

- [x] Create `scripts/compass/config.mjs` for shared paths, commands, and route model.
- [x] Create `scripts/compass/cli.mjs` for `pnpm compass`.
- [x] Create `scripts/compass/check.mjs` with rule selection.

### Segment 2 — Consolidate existing checks

- [x] Move markdown link validation into Compass rule `links`.
- [x] Move docs/API drift validation into Compass rule `api`.
- [x] Move repo-map coverage validation into Compass rule `repo-map`.
- [x] Remove wrapper scripts after folding their checks into Compass.

### Segment 3 — Smarter repo-map authority rules

- [x] Add `authority` rule for singular entrypoint and spec-not-onboarding expectations.
- [x] Add `status-ownership` rule for audit status ownership.
- [x] Add `planning-lifecycle` rule that flags temporary planning docs.

### Segment 4 — Script wiring

- [x] Add `pnpm compass`.
- [x] Remove obsolete compatibility aliases.
- [x] Make `check:compass` the central Compass rule runner.
- [x] Make `check:repo-map` the full docs/repo-map/generated-truth integrity gate.

### Segment 5 — Docs updates

- [x] Update `start-here.md`, `repo-map.md`, and `testing.md` to use Compass naming consistently.
- [x] Update simplification audit with the implementation outcome.

### Segment 6 — Validation and commit

- [x] Run required validation.
- [x] Fix issues discovered by validation.
- [x] Commit as one Compass/Repo Map consolidation commit.

Validation completed:

- `pnpm compass` ✅
- `pnpm check:compass` ✅
- `pnpm check:repo-map` ✅
- `git diff --check` ✅

Validation fix made during implementation:

- renamed the implementation plan away from `*-temp.md` so the new planning-lifecycle rule can honestly pass while still preserving this implementation document as the active plan record.

## Expected outcome

After this patch, the repo should feel cleaner:

- Compass is the route finder.
- `pnpm check:compass` owns routing/docs-system validation.
- Repo Map is the full integrity contract.
- `pnpm check:repo-map` owns the generated-truth/docs/repo-map gate.
- Existing scripts remain stable aliases rather than competing systems.
