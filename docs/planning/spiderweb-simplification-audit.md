# Compass + Repo Map Simplification Audit

## Purpose

Use [Start Here](../start-here.md), `pnpm compass`, and [Repo Map](../reference/repo-map.md) as diagnostic tools for simplifying Marwes' internal system.

The goal is not to remove useful rigor. The goal is to make the rigor easier to enter, easier to route through, and easier to automate.

## Current read

Marwes now has a good top-level shape:

```text
start-here.md = singular human entry point
repo-map.md   = connection-contract view
testing.md    = validation depth
registry      = family-level knowledge
audits        = accessibility evidence/history
artifacts     = generated truth
```

The remaining risk is not lack of documentation. The risk is **too many places acting like truth at the same time**.

## Audit method

For each thread, classify the next action as:

- **Keep** — valuable as-is.
- **Simplify** — valuable, but too expensive to understand or update.
- **Automate** — repetitive coupling should be checked/generated.
- **Merge** — two docs/surfaces are carrying the same truth.
- **Remove** — obsolete or temporary once durable docs exist.

## Findings

### 1. Entrypoint clarity

Status: **Keep + simplify**

What works:

- `docs/start-here.md` gives one singular point for humans.
- It routes by intent instead of folder structure.
- It keeps each route short and pairs it with one command.

Friction:

- `docs/README.md` is still a large index and can compete with `start-here.md` as the perceived first page.
- The repo root `README.md` may still route users somewhere else first.

Recommendation:

- Make `docs/README.md` clearly secondary: "full docs index" only.
- Add a prominent root README link to `docs/start-here.md`.
- Keep `start-here.md` short. Do not let it become a second docs index.

Priority: **P0**

### 2. Repo map as dependency contract

Status: **Keep + automate**

What works:

- The change matrix finally makes hidden coupling explicit.
- It gives contributors a checklist for downstream updates.

Friction:

- The matrix is currently human-enforced.
- It may drift as files/scripts evolve.

Recommendation:

- Keep the human matrix.
- Add a Compass repo-map rule that verifies key links/commands/paths mentioned by the map exist.
- Eventually use the same source data to power `pnpm compass`.

Priority: **P1**

### 3. Validation command surface

Status: **Simplify + automate**

What works:

- `pnpm check:changed` is a strong simplification: one local confidence command.
- `validate:family <family>` is the right component-family gate.
- `check:repo-map` is the right generated-truth/docs gate.

Friction:

- There are still many commands in `package.json`, and several names overlap mentally: `check`, `check:changed`, `check:repo-map`, `validate:release`.
- `check:repo-map` does a lot. For pure block docs, this is honest but maybe heavier than necessary.

Recommendation:

- Keep all existing commands for now.
- Document only four primary commands in `start-here.md`: `check:changed`, `validate:family`, `check:repo-map`, `validate:release`.
- Treat all others as supporting commands in `testing.md`.
- Later consider a `pnpm compass` command that prints the four-command model.

Priority: **P0 for docs framing, P2 for CLI helper**

### 4. Registry, audits, and accessibility truth

Status: **Simplify + merge**

What works:

- `docs/audits/status.md` creates a compact current-status surface.
- Audit docs can stay as evidence/history instead of becoming the only way to understand status.
- Registry family docs remain useful for family-specific knowledge.

Friction:

- `docs/audits/README.md`, `docs/audits/status.md`, registry family docs, and `docs/reference/accessibility.md` can all contain status-like claims.
- This is the highest drift risk in the docs/repo-map system.

Recommendation:

- Make `docs/audits/status.md` the only compact family-status table.
- Keep `docs/audits/README.md` as process/queue, not status duplication.
- Keep registry docs as family contract surfaces, not audit-progress surfaces.
- Add wording to `audits/README.md` and registry docs template that status changes should route through `audits/status.md`.

Priority: **P1**

### 5. Spec document weight

Status: **Simplify**

What works:

- `docs/reference/spec.md` is valuable as a formal contract/history surface.

Friction:

- It is very large and can become intimidating.
- Some details may be better owned by registry family docs or reference subdocs.

Recommendation:

- Do not rewrite it now.
- Add a future pass: split into a short `spec.md` overview plus section-level details only if repeated friction appears.
- Ensure `start-here.md` does not route casual contributors into `spec.md` too early.

Priority: **P2**

### 6. Blocks vs package API boundary

Status: **Keep + automate lightly**

What works:

- Blocks now explicitly say they are copyable app-owned patterns, not `@marwes-ui/*` exports.
- `repo-map.md` repeats the promotion rule.

Friction:

- Docs examples can accidentally reference unpublished component props.
- Block ideas can leak into package code before the API has repeated evidence.

Recommendation:

- Keep boundary text.
- Add docs/API drift patterns when a stale or unpublished API appears repeatedly.
- Keep prototype package work on separate branches or explicitly mark it as prototype, not P0 adoption.

Priority: **P0**

### 7. Adapter parity burden

Status: **Automate**

What works:

- `validate:family` already checks React/Vue, story consistency, registry, docs links, and relevant tests.
- `check:adapter-boundaries` catches strong boundary slips.

Friction:

- React/Vue parity still depends on contributors knowing what semantic/prop parity means per family.
- The boundary checker is intentionally coarse.

Recommendation:

- Keep boundary checker coarse to avoid false confidence.
- Add family-specific parity expectations into registry docs only when a family has special behavior.
- Consider a future generated parity summary from package exports + story files.

Priority: **P1**

### 8. Planning docs lifecycle

Status: **Remove or promote after merge**

What works:

- `docs/planning/repo-stabilization-roadmap-temp.md` is useful while this branch is active.
- `docs/planning/spiderweb-simplification-audit.md` is useful during this simplification pass.

Friction:

- Planning docs can become stale if not removed/promoted.

Recommendation:

- Before final merge, decide which planning docs stay active.
- Promote durable conclusions into `start-here.md`, `repo-map.md`, `testing.md`, or `audits/status.md`.
- Remove temp roadmap once it is no longer needed.

Priority: **P0 before merge**

## Prioritized action list

### P0 — Do next

- [x] Make root `README.md` point clearly to `docs/start-here.md`.
- [x] Reframe `docs/README.md` as full index, not first entry.
- [x] Keep `start-here.md` limited to the four-command mental model.
- [x] Decide before merge whether temporary planning docs stay, are removed, or are promoted.

### P1 — Good next simplification

- [x] Tighten audit/status ownership so `audits/status.md` is the only compact family status table.
- [x] Add a lightweight repo-map coverage check for important links/paths/commands.
- [x] Expand adapter parity automation only where real drift repeats.

### P2 — Later polish

- [x] Consider `pnpm compass` to print the same route model as `start-here.md`.
- [x] Split or slim `docs/reference/spec.md` only if contributors keep getting lost there.
- [x] Generate a parity summary from exports/stories/registry data.

## Suggested target architecture for docs

```text
README.md
  → docs/start-here.md          # human entry
      → docs/reference/repo-map.md   # spiderweb view
      → docs/reference/testing.md    # validation depth
      → docs/blocks/README.md        # adoption blocks
      → docs/audits/status.md        # compact accessibility state
      → docs/registry/README.md      # family knowledge
```

The key simplification principle:

> One human entry, one spiderweb map, one current status surface per concern.

## Recommendation

Do not add much more documentation yet. The next best improvement is **routing polish**:

1. root README routes to `docs/start-here.md`
2. docs README becomes a pure index
3. temporary planning roadmap removed before merge; this simplification audit remains while P1/P2 work is active

That gives Marwes the cleanest mental model without weakening the useful validation and evidence system.

## P0 implementation note

Completed in the P0 cleanup pass:

- root `README.md` now points directly to `docs/start-here.md`
- `docs/README.md` is framed as the full documentation index, not the primary entry point
- `docs/start-here.md` remains a short four-command routing surface
- removed `docs/planning/repo-stabilization-roadmap-temp.md` after promoting its durable outcomes into `start-here.md`, `repo-map.md`, `testing.md`, and this audit

## P1 implementation note

Completed in the P1 simplification pass:

- `docs/audits/status.md` is now documented as the compact current family status surface
- `docs/audits/README.md` is reframed as queue/process rather than status ownership
- registry docs/template now point family status changes back to `docs/audits/status.md`
- added Compass repo-map coverage rules and `pnpm check:repo-map`
- `pnpm check:repo-map` now includes repo-map coverage
- registry family template now captures family-specific adapter parity expectations without duplicating generic rules

## Compass + Repo Map consolidation note

Completed after P2 as a naming and validation cleanup pass:

- `pnpm compass` is now the primary route-finder command
- `pnpm compass` remains as a compatibility alias
- `scripts/compass/check.mjs` centralizes Compass routing/docs-system checks
- `check:compass` and `check:compass` are compatibility wrappers over focused Compass rules
- `pnpm check:compass` is the primary Compass rule runner
- `pnpm check:repo-map` is the full docs/repo-map/generated-truth integrity gate
- Repo Map remains the connection contract, validated by Compass rules
- implementation plan captured in `docs/planning/compass-repo-map-implementation.md`

## P2 implementation note

Completed in the P2 polish pass:

- added `pnpm compass` as a terminal version of the singular route model
- added generated `docs/reference/framework-parity-summary.md` from `artifacts/framework-parity.json`
- added `pnpm parity:summary` and `pnpm parity:summary:check`
- `pnpm check:repo-map` now checks the generated parity summary
- `docs/reference/spec.md` now explicitly points newcomers back to `docs/start-here.md` instead of acting as the onboarding route
