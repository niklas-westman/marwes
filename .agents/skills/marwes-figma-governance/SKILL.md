---
name: marwes-figma-governance
description: Operate and extend Marwes Figma governance and Reflection validation. Use for family parity fixes, source snapshots, structural mappings, evidence diagnostics, figma-governance-one, and staged source/reference promotion in this repository.
---

# Marwes Figma governance

Current handoff — 2026-10-16: start with
`docs/audits/button-debrief-2026-10-16.md`. Fresh staged run
`button-1792170000033-043e9c38-b43a-4a7a-91c9-b31e19be4eeb` records172/187 visual
passes,15 failures,187 structural passes and191 behavior/integrity passes per
adapter. Coverage remains273 required/203 mapped/70 missing. The additional50
focus and four mapping proposals are unapplied; the proposed composition plugin
has an unresolved live-paint acknowledgment review finding. No source/reference
promotion or release approval occurred. Historical counts below are not current.
Keep future work bounded: targeted diagnostics first, broad release gates after
relevant changes settle; do not run a full family audit for each font experiment.

Use the private `@marwes-ui/design-governance` package as the authority for
`Figma truth -> registry contract -> runtime result`. Work from the repository
root. Use Node >=22.12.0 and the workspace pnpm version. Routine validation works
offline; live Figma MCP, Rust and credentials are not prerequisites.

## Find the relevant evidence

For the 32-family rollout, start with `pnpm governance:inventory` and
`docs/guides/design-compliance-rollout.md`. The versioned Marwes UI projection is
available through `pnpm governance:provider` and `GET /api/provider/v1`.
Provider availability does not establish acceptance of the external Reflection UI.
Keep broader family rollout blocked until the Button and external UI gates pass.
The project inventory covers 32 public families, 36 required validation groups
and 18 currently enrolled visual groups. Current inventory status uses validated
exact-run evidence and retains invalid latest evidence; CI fails closed for
missing required enrollment. Never interpret file presence as certification.

Button enrollment on 2026-10-15 is 185 visual selections plus four behavior-only
form fixtures (567 case/adapter results). The final staged run passes all 185
structural and 189 behavior checks per adapter; visual totals are 132 passed,
27 failed and 26 Pressed unsupported per adapter. Required coverage remains
incomplete. Read `docs/audits/button-compliance-2026-10-15.md` for exact identities.
The Figma PNG exports use the pinned October 14 capture without a raw REST
refresh. Niklas approved Neutral and Cancel/Copy/Filter/Sort/Close/Refresh mapping
to Ghost, not reference promotion or run acceptance. Actual purpose defaults,
including icons and Svelte purpose markers, must be exercised by fixtures.
Keep unresolved XS, both-icons, full-width and loading policy visible.
Niklas approved shared standard keyboard focus across Button variants, purpose
wrappers and IconButton on 2026-10-15: a 2px ring with a 4px clear gap. That later
preset/token change stales the checkpoint run; focus enrollment and fresh staged
proof remain required. Increased-contrast focus has separate unresolved policy.

Historical full-family checkpoint: `docs/audits/button-audit-2026-10-16.md` supersedes the
historical October15 totals. Its0.5.1 staged run recorded139 visual passes,
20 failures and26 Pressed unsupported per adapter,185 structural and189 behavior
passes. A Button-only fixture layout-origin fix recovered seven selections per
adapter, with zero regressions and unchanged reference bytes, thresholds and
measurements. Coverage remains231 required items,199 mapped and32 missing.
Read exact run/stage identities from that audit before using these counts.
Inspector Proof/Result filters retain the denominator; artifact roles control image
selection and structural captures never establish visual proof. Next independent
batch: primary focus light/dark using pinned source-rule composition and real Tab
activation; see `docs/audits/button-focus-enrollment-2026-10-16.md`.
Loading stabilization is now supported by0.6.0; label-fidelity work remains.
No stage promotion or owner acceptance has occurred.

Use the published, exactly pinned `reflection-check@0.6.0`. It supports lossless
WebP baselines natively. Reference conversion must preserve decoded RGBA bytes,
source provenance and receipts through an approved stage. Old PNG removal is a
separate approved cleanup after active WebP verification. Do not claim storage
savings while both encodings remain. Reflection0.6.0 supports genuine held-pointer Pressed capture and case-level
stabilization independent of interaction. Read
`docs/audits/reflection-0.6.0-integration-2026-10-16.md` for the fresh diagnostic
pilot and compatibility scope. The full diagnostic Pressed batch captures all26
per adapter:23 visual passes and three failures, with no capture errors. Repeated
loading RGBA is identical, but95/128 residual pixels still fail. Earlier canonical
runs are stale after this upgrade.
Canonical enrollment update — 2026-10-16: all 26 Pressed selections now use native
held-pointer capture with verified animation stabilization, after all-adapter
capture/release diagnostics and repeated-pixel checks. Loading stabilization is
explicit and stateless. Fresh exact-run family evidence remains required after
later input changes. Inspect native capturePolicy/captureOutcome/captureError,
active state, release and repeated decoded pixels. A state/capture error must fail closed. Loading
stabilization must not fabricate Hover/Focus, and its remaining label failures
must stay failed. Never substitute structural captures or defaults for native
Pressed actual images. Exact staged family policies must reach the native runner,
not just its baseline paths. The stage validator permits encoding-only contract
changes; semantic runtime policy enrollment happens before restaging.

Read `packages/design-governance/README.md` and the affected family's files in
`packages/design-governance/reflection-families/<family>/`. Read only the relevant
sections of these maintained references:

- `docs/guides/figma-governance-one.md`: inspector operation, evidence states,
  staging, approval schemas and crash recovery.
- `docs/reference/testing.md`: required Reflection gates and visual review.
- `docs/reference/design-governance-command-lexicon.md`: command boundaries.
- `docs/audits/figma-governance-one-upgrade.md`: historical upgrade findings;
  rerun status before treating any finding as current.

Start with the affected scope:

```bash
pnpm governance:status -- --family <family> --json
pnpm governance:check -- --family <family>
pnpm governance:review -- --family <family>
```

`check` proves source integrity and expectation compilation, not runtime parity.
`review` inspects evidence; it does not grant human acceptance. Read the latest
report and exact-run expected/actual/diff artifacts. A completed job can still
contain failed or blocked proof. Missing/corrupt latest evidence must not fall
back to an older passing run.

For UI inspection, use `pnpm governance:ui` when requested or useful within the
authorized task. Local evidence lives in `.reflection/governance/<run-id>/`.
`CI=true pnpm governance:ui` reads `artifacts/reflection/governance/<run-id>/`.
Use the printed loopback URL; the UI has no approve/promote action.

For portable comparison reports, use `pnpm governance:report -- --family <family>
--run <exact-run-id>` or the inspector's Open/Download HTML report links. A fresh
full verification can add `--html` to export its exact run, including failed runs;
failed verification retains its nonzero exit. Reports are self-contained and
read-only, with frozen freshness/review, all required rows, explicit artifact roles
and supplementary recomputed pixel metrics. Never treat report export as approval
or evidence refresh. See the portable-report section in the inspector guide.
Generated HTML belongs in ignored local output or retained CI artifacts, not
canonical inputs or committed screenshots. Existing files are never overwritten.

Report triage is action-first. Explicit `source.availability: "needs-design"`
with a concrete reason marks visual review skipped pending design; it never
removes required rows, waives other proofs or rewrites outcomes. No selected
source node may accompany a needs-design declaration. Unknown source mappings
and missing screenshots are not confirmed missing designs. `rule-defined`
identifies approved rules awaiting independent mapping/fixture/proof enrollment.
Inventory update — 2026-10-16: Button retains 273 required rows, 203 fixture-bound
and 70 missing. Approved DC-009 focus applicability covers 12 generic variant
selections, 38 purpose-wrapper selections and two neutral/md IconButton selections,
for 52 rule-defined obligations awaiting proof. Fourteen scoped design gaps defer
visual review: XS, both icons and persistent toggle in both themes, plus
neutral/text/success/danger loading in both themes. Keep every required proof.
Primary loading has direct source nodes 1780:2692 / 1780:2744; fullWidth has
Fill=True layout authority needing bounded standalone applicability. IconButton
Border=False master 3017:36466 has independent design authority but needs public
variant mapping, compact node enrollment and theme-specific proof. These six rows
remain mapping/enrollment work. Two Primary focus fixtures are enrolled; the other
50 focus fixtures remain missing. Enrollment does not establish passing proof. The two generic icon-only rows map only to
the exact existing neutral/md IconButton cases, preserving the original rows.
These counts describe enrollment, not certified coverage. Historical reports keep
their own recorded inventory. Changed source availability/reason must not bind an
older requirement's proof.

## Diagnose and fix the responsible layer

For independent outlined text or vector source diagnostics, use
`pnpm reflection:figma:export-source-svg` and read
`docs/guides/figma-outlined-source-export.md`. The **Marwes Figma Bridge** plugin
scans 9223–9232 (9231 may belong to figma-console-mcp); **Reflection Frame Prep**
uses 9243–9252; native Figma Dev Mode MCP uses 3845. Check the correct bridge.
For native Reflection text diagnostics, prepare isolated bundles/configs with
`pnpm reflection:text:prepare -- --plan <explicit-plan.json>` and read
`docs/guides/reflection-text-diagnostics.md`. Keep live SVG source unversioned,
caller-attested identity explicit, and records bound to exact adapters/runs.
Diagnostics never replace native screenshot outcomes, approval or promotion.
SVG capture is read-only and saves new ignored diagnostic artifacts. Never
represent an unversioned live export as pinned truth or a null reported file key
as independently verified by the plugin. An explicit verified-file URL requires
prior independent inspection of the actual active desktop URL and file name.

Separate integrity, structural, visual, behavior, coverage, freshness and owner
review. Inspect case, adapter, viewport, theme collection/mode IDs, text, size and
icon selection before changing CSS. A Figma small icon variant compared with a
default no-icon fixture is a selection problem until proven otherwise.

| Layer | Relevant files and action |
| --- | --- |
| Source identity/dependencies | `.pi/figma-sync.json`, family `source/snapshot.json` and `source/manifest.json`, `src/source/`. Select the configured file exactly; inspect imported masters, variable aliases and modes. |
| Registry/visual contract | Family `reflection-contract.json`, registry metadata and baseline receipts. Confirm source nodes, cases, framing and viewport. |
| Structural contract/compiler | Family `structural-contract.json`, `src/compile/`. Map semantic browser parts to independent Figma node/property facts. |
| Runtime/fixtures | Real React/Vue/Svelte components and adapter fixtures; `src/runtime/`. Match the declared design selection before measuring. |
| Evidence/outcome policy | `src/contracts/`, `src/evidence/`, `src/review/`. Preserve immutable reports, artifact hashes and current-input binding. |
| Inspector/orchestration | `figma-governance-one/`, `src/cli/`, `src/tooling/`. Keep policy in the package core; root scripts remain compatibility wrappers. |

All `src/` and `figma-governance-one/` paths above are relative to
`packages/design-governance/`. Do not introduce runtime dependencies on this
private package into published components.

The ignored `.figma/` full capture may be absent in clean clones. Normal
verification must use committed compact snapshots and tracked configured identity.
Capture ingestion/promotion has stricter local provenance requirements. Do not
select the first available raw dump or substitute missing imported dependencies.

Expectations must come from Figma, never runtime CSS, tokens under test or previous
runtime measurements. Preserve variable alias chains and collection/mode IDs;
light/dark labels alone do not resolve variables. Inspect paint opacity and
compositing before treating opaque and alpha colors as equivalent.

For enrollment, adapt an existing structural contract, declare its sidecar in
`reflection-contract.json`, and trace every assertion to source provenance.
Keep unmapped public/source variants and unsupported properties visible. Do not
delete required mappings or shrink the denominator to obtain a pass. Font loading
and matching typography declarations do not establish identical glyph rendering.
JSON assertions and PNG comparisons remain complementary proof paths.

## Validate the changed behavior

After edits, create fresh real-browser evidence for the affected family:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --family <family>
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family <family>
pnpm governance:verify -- --family <family> --adapter all
pnpm governance:review -- --family <family>
```

Use a single adapter during diagnosis; final claims must name the actually tested
scope. Shared inputs can stale other families. Never edit historical reports to
make them current; rerun the affected scope after edits settle.

For package engine changes, run package `test` and `typecheck`; for measurement,
portal or inspector changes, also run `test:browser`. Run `build:ui` after UI edits
and `pnpm reflection:fixtures:check` after fixture/config changes. Add meaningful
defect controls when changing assertions so tests demonstrate detection of drift.

For component visual completion, retain the repository's required gates:

```bash
pnpm reflection:doctor
pnpm reflection:visual
pnpm reflection:review
```

If one gate exits nonzero, still collect the remaining independent review evidence
without suppressing its failure. Before pushing, run `pnpm design:check`.
For cross-family changes or CI enforcement, run `pnpm governance:ci` and preserve
its exit status. Legacy static `design:check` success does not imply combined
governance CI success. Strict mode adds generated-frame requirements; do not
quietly change strictness to evade a required gate.

## Source, reference and owner decisions

Never lower thresholds, promote runtime screenshots into Figma references, author
owner approval, or remove required proof to silence a failure. Project/skill
approval is not approval of a particular visual result.

When the task requires a source/reference change, first prepare and inspect the
exact stage through `governance:source:stage` and `governance:source:preview`.
Read the guide's promotion schema before assembling capture files. Present the
stage ID/hash, input fingerprint, destinations and differences to Niklas.
Apply only with explicit owner approval bound to that unchanged stage and scope,
using `governance:source:apply`; CI must never promote. For an interrupted apply,
inspect its transaction journal and use `governance:source:recover` before retrying.
Do not bypass staging through legacy exporters or direct active-file writes.

Owner review of a validation run is separate from promotion: it binds exact
report bytes, fingerprint, run and cases. A newer run or changed inputs invalidates
earlier acceptance. Read the guide before processing externally supplied review
records; the agent must not create acceptance on the owner's behalf.

## Report the result

Report **Changed**, **Validated** and **Risks**, including the exact family/case/
mode/adapter scope, current report/artifact paths, failed gates and uncovered
variants. Describe passed mapped properties precisely; do not claim universal
1:1 design parity from a passing subset or screenshot threshold. Distinguish
implementation completion from unresolved design compliance and human review.
