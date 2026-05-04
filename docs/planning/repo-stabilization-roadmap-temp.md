# Repo Stabilization Implementation Roadmap (temporary)

## Purpose

Stabilize Marwes' internal contribution flow while SSH push access is being corrected.

This document is temporary implementation scaffolding. Keep it in `docs/planning/` while the work is active, then either remove it or promote the durable parts into reference docs once the branch is merged.

## Run permit

- Goal: simplify how contributors understand repo threads, validation gates, audit state, adapter boundaries, and blocks-vs-package-surface decisions.
- Definition of value: a contributor can answer "what must I update if I touch this?", choose the right validation command, and avoid accidentally turning docs blocks into public APIs.
- Allowed paths: `docs/**`, `scripts/**`, `package.json`, existing card prototype files already isolated on this stabilization branch.
- Forbidden paths: release config, publishing workflow changes, package version/changelog changes, external-service config.
- Autonomy level: continue through reversible repo/documentation/script changes without asking.
- Decision budget: one full implementation pass plus one validation/fix pass.
- Required validation: docs link check, docs/API drift check, adapter-boundary check, changed-scope check, diff whitespace check, and focused card tests if card prototype changes remain in branch.
- Ask triggers: destructive git operations, package publishing, ambiguous public API expansion beyond current StatCard prototype.
- Hard stops: failing generated artifacts that imply API drift, release/security validation failures unrelated to this branch, or missing dependency/tooling that prevents validation.

## Segment roadmap

### Segment 1 — Separate branch and implementation scaffold

- [x] Create a dedicated stabilization branch: `repo-stabilization-thread-map`.
- [x] Keep the previously committed P0 adoption docs as base context.
- [x] Preserve the StatCard metric-tile prototype as non-P0 stabilization/prototype work on this branch only.
- [x] Create this roadmap file before making the broader stabilization patch.

**Completion rule:** check items only after the branch exists and this file records the run permit.

### Segment 2 — Repo thread map and change matrix

- [x] Add a canonical repo map explaining implementation, generated truth, docs, registry, audits, stories, tests, and adoption blocks.
- [x] Add a change matrix: if you touch X, update/check Y.
- [x] Link the map from the docs hub and architecture docs.

**Completion rule:** check items only after the map is linked from user-visible docs and passes the markdown link checker.

### Segment 3 — Validation presets and contributor workflow

- [x] Add a changed-scope validation command for quick local checks.
- [x] Document when to use changed, family, docs, package, release, and Storybook gates.
- [x] Keep `validate:family <family>` as the canonical component-family gate.

**Completion rule:** check items only after the command is wired in `package.json` and documented in testing docs.

### Segment 4 — Audit status simplification

- [x] Add a compact audit status surface that separates blockers from manual-review boundaries.
- [x] Link it from the docs hub.
- [x] Keep detailed per-family audit files as evidence/history, not the only status surface.

**Completion rule:** check items only after a reader can see family status without opening every audit document.

### Segment 5 — Adapter/core boundary guardrail

- [x] Add a lightweight script that checks strong architecture boundary violations.
- [x] Wire it into validation scripts.
- [x] Document that the script is a guardrail, not a replacement for architecture review.

**Completion rule:** check items only after the script runs locally and reports a pass.

### Segment 6 — Blocks/adoption boundary

- [x] Strengthen docs wording that blocks are copyable product patterns, not package APIs.
- [x] Keep P0 adoption docs and prototype/component work conceptually separate.

**Completion rule:** check items only after blocks docs include the boundary and the repo map points to blocks as adoption material.

### Segment 7 — Validation and final review

- [x] Run required validation.
- [x] Fix branch-local issues discovered by validation.
- [x] Review `git diff --stat` and changed files.
- [ ] Report outcome, validation evidence, and subjective assessment of whether the repo feels simpler.

**Completion rule:** check items only after all validation commands have been run or a blocker is explicitly recorded.

Validation completed locally:

- `pnpm check:adapter-boundaries` ✅
- `pnpm docs:links` ✅
- `pnpm docs:api` ✅
- `pnpm check:changed` ✅
- `pnpm validate:docs` ✅
- `git diff --check` ✅

Branch-local issue fixed during validation:

- `pnpm validate:family card` initially failed under the container's inherited production `NODE_ENV`, causing React test `act(...) is not supported in production builds` failures. `scripts/validate-family.mjs` and `scripts/check-changed.mjs` now force `NODE_ENV=test` for spawned validation commands.

## Notes for final report

Report back with:

- branch name
- files changed
- validation commands and result
- whether the P0 branch remains reviewable separately
- what the stabilization update improves in practice
- what I would do next
