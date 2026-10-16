# Reflection upgrade and unified governance evidence

2026-10-14. This records the compatibility evidence for upgrading Marwes from
Reflection 0.0.7 to 0.3.0 and introducing the package-owned governance inspector.
It is not design approval or a declaration of universal component parity.

## Compatibility evidence

The before/after inventory contains 48 visual cases per adapter:

| Adapter | Before 0.0.7 | After 0.3.0 | New failures |
| --- | --- | --- | --- |
| React | 47 passed, 1 failed | 47 passed, 1 failed | 0 |
| Vue | 47 passed, 1 failed | 47 passed, 1 failed | 0 |
| Svelte | 47 passed, 1 failed | 47 passed, 1 failed | 0 |

All three doctor configurations passed. Local retained evidence:

```text
.reflection/upgrade-before/inventory.json
.reflection/upgrade-before/<adapter>-report.json
.reflection/upgrade-after/<adapter>-report.json
.reflection/upgrade-after/comparison.json
```

These are local artifacts, not committed proof that a future run passes. The
existing `button.text` light visual mismatch persists across all adapters: the
Figma reference text is blue while runtime text is dark. A report that parses
successfully or an unchanged failure count does not approve that difference.
Reference PNGs and comparison thresholds were not promoted as part of the
upgrade. No human acceptance was authored.

## New proof model

The package retains Figma JSON and exported variables as independent design
input. Compact family snapshots include node facts, variable dependencies,
collection modes, source hashes and inherited capture provenance. Structural
contracts map those facts to semantic browser parts. Actual measurements come
from the real framework components, with separate Reflection PNG comparisons.

Combined evidence records expected/actual values and provenance, adapter/case
scope, coverage, execution environment, fingerprints and hash-bound artifacts.
The package exposes one outcome policy to the CLI, CI and figma-governance-one.
Missing required mappings/proof, stale inputs and failed comparisons remain
blocking; human review is separate from automated results.

The Button source manifest identifies its provenance as
`inherited-pinned-offline-capture; not a new Figma capture or approval`. This
makes the inherited source inspectable without claiming a new live Figma fetch.

## Current measured findings

The canonical Button run covers all three adapters. Basic and secondary cases
pass their structural and visual checks. Text passes structural measurements but
retains the known visual failure. Destructive passes visual comparison while
structural checks expose source/runtime drift:

| Property | Captured Figma | Browser runtime |
| --- | --- | --- |
| Bounds | 91 × 36 | 72.484 × 40 |
| Vertical padding | 10px | 12px |
| Gap | 6px | 4px |

This is evidence that property assertions detect drift the screenshot threshold
can miss. It is not an approved tolerance change; the owning source/mapping/runtime
layer must be reconciled before claiming Button parity. The captured destructive
variant includes IconRight and a small-mode selection; the current fixture uses
a default button without that icon. Reconcile fixture/size/icon selection before
treating every geometry difference as a CSS defect.

Portable source integrity passes for 13 of 18 active visual families in normal
(non-strict) mode. Five families remain blocked by captured dependencies:

| Family | Missing dependency |
| --- | --- |
| Accordion, Select | Component `1:461` |
| Slider | Component `2462:1127` |
| Radio, Switch | Variable IDs `VariableID:1358:5086`, `VariableID:1358:5087`, `VariableID:1358:7249` in the dependency set |

Restore the required captured source/variables rather than bypassing dependency
validation. Normal mode retains optional generated-frame provenance warnings;
strict mode makes those warnings failures. Neither mode authors approval.

Final implementation validation completed:

- 92 unit tests and 15 browser tests passed, including all three real adapters,
  intentional defects, font readiness, concurrent portals and inspector states.
- Package typecheck, UI build and 20 fixture checks passed.
- Focused Button static/runtime/cohesive checks and `pnpm design:check` passed.
- Documentation Compass and `git diff --check` passed.
- Full canonical CI produced current reports for all 18 active families and
  all 144 visual comparisons: 141 passed, three known text-button failures.
  No visual evidence was missing. CI correctly exited 1.

Combined required proof passed for ten families. Accordion, Badge, Button,
Dialog, Radio, Select, Slider and Switch remain failed. These outcomes combine
source integrity and declared structural/visual requirements; a family without
structural enrollment has no implied structural parity. Badge paint alpha differs
in 15 of 30 cases. Dialog description paint differs and nested geometry remains
explicitly unsupported. The Button coverage inventory also exposes 70 uncovered
source/public variants rather than omitting them from the inspector.

Local final evidence is retained in `.reflection/final-validation/`:
`unit.log`, `typecheck.log`, `governance-ci.log` and `summary.json`.
Immutable CI reports and exact-run images are under
`artifacts/reflection/governance/<run-id>/`. The inspector screenshot is
`.reflection/governance-ui/figma-governance-one-final.png`.

The next parity work is to reconcile the text-button reference/runtime color and
destructive fixture selection, resolve Badge/Dialog paint semantics and Dialog
geometry coverage, restore the five families' imported dependencies, then expand
uncovered variants. Reference changes still require exact staged owner approval.
No baseline, receipt or comparison threshold was changed in this implementation.

## Fidelity and remaining limits

Image-independent structural checks can catch individual spacing, geometry,
typography declaration and color errors even when the affected pixel region is
small. They only prove mapped properties for selected cases/modes/adapters.
Uncovered public variants, nested/stateful behavior, unsupported paint and glyph
rasterization must remain visible. PNG comparison and behavioral tests continue
as complementary proof paths.

Staging and approval-bound promotion provide a separate path for changing active
source/reference/receipt files. Checks, CI and UI inspection never author owner
approval or automatically promote baselines.

For current validation evidence, run:

```bash
pnpm governance:status -- --json
pnpm governance:verify -- --family button --adapter all
pnpm governance:review -- --family button
pnpm governance:ci
```

A nonzero verification or CI exit is expected while required failures or missing
coverage remain. Read the current report before claiming completion. See the
[inspection guide](../guides/figma-governance-one.md) for recovery steps.
