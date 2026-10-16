# figma-governance-one

A local evidence inspector for developers maintaining Marwes component parity.
The private design-governance package compares captured Figma facts with real
React, Vue and Svelte components, then exposes the same results through CLI,
CI and this HTML interface. No Rust runtime or paid Figma MCP access is required.

## Start the tool

Run from the repository root with Node >=22.12.0 and the workspace pnpm version:

```bash
pnpm install --frozen-lockfile
pnpm reflection:install-browsers -- chromium
pnpm reflection:doctor
pnpm governance:ui
```

Open the loopback URL printed by the command. Keep the terminal running and use
Ctrl-C to stop the server. The server is local tooling, not a public deployment.
Use `pnpm governance:ui -- --port 6175` if the default port is occupied.

The default inspector reads local `.reflection` runs. To inspect already retained
CI results under `artifacts/reflection/governance`, start it with
`CI=true pnpm governance:ui`. Validation jobs then use that same evidence root.

## Inspect and validate a family

Button uses a required-item table with Figma, React, Vue and Svelte columns.
Each row identifies its variant, state, size, icon selection and theme. Missing
design selections, fixtures, mappings or behavior proof stay visible even when
every enrolled screenshot passes. Select a comparison for its exact-run images,
pixel diff and measured properties.

Use **Proof** with **Result** to isolate visual failures, unsupported captures,
structural failures or behavior failures. Integrity and coverage guard failures
remain selectable for normal obligations; behavior-only rows retain their own
requirements. The table shows visible and total required items together, so mode,
adapter and outcome filters do not hide the full denominator.

The family's `coverage-contract.json` declares required items independently of
the enrolled fixtures. Compiler-discovered variants add gaps to that inventory;
deleting a fixture cannot reduce the required denominator.

To inspect proposed source/reference changes before promotion, verify an exact
stage:

```bash
pnpm governance:verify -- --family button --stage <stage-id> --adapter all
```

This uses isolated staged proof inputs while rendering the real repository
components. The inspector labels these references as awaiting promotion approval;
running validation from that view retains the selected stage. Staged proof does
not approve or replace active references.

Select a family, then an adapter/case. The catalog includes families without
structural enrollment so missing coverage remains visible. Inspect:

- The captured Figma source link and node/property provenance.
- Expected and measured values, deltas and tolerances for semantic parts.
- Structural, visual and coverage outcomes separately from freshness and review.
- Screenshots from the selected immutable run, with reference/diff images when
  an actual Figma reference exists.

**Run validation** starts a selected family/adapter job using the package core.
Jobs serialize; the interface refreshes evidence when execution finishes. Inspect
proof outcomes even when a job says completed. A finished runner can produce
failed or blocked proof. Browsing and validation cannot accept a design result,
change comparison policy or promote a reference.

Equivalent terminal workflow:

```bash
pnpm governance:status -- --family button --json
pnpm governance:verify -- --family button --adapter all
pnpm governance:review -- --family button
pnpm governance:check -- --family button
```

Use `--adapter react`, `vue` or `svelte` for a scoped run. Verification exits
nonzero for failed/blocked evidence. Status and review are read-only projections. Check validates portable source
integrity and expectation compilation without running a browser; it does not
establish that runtime output matches those expectations.

## Interpret evidence

| State | Meaning and next action |
| --- | --- |
| Passed | Declared supported checks passed; inspect coverage and review separately. |
| Failed | A required comparison or execution failed. Use expected/actual diagnostics to fix the owning layer. |
| Blocked | Required proof is missing, unsupported or otherwise unusable. Complete source/mapping/runner coverage. |
| Never-run | No usable run exists for the selection. Enroll its contract if needed, then verify. |
| Stale | Relevant inputs changed after the run. Rerun verification; historical proof remains available. |
| Invalid | Evidence or inputs cannot be trusted. Read the diagnostic, fix the input/artifact problem and create a new run. |
| Unreviewed | Automated evidence has no current human acceptance. The inspection command does not grant it. |

Figma JSON supplies independent expectations for mapped geometry, spacing,
text and paint properties. Runtime CSS never supplies its own oracle. Successful
font loading and matching declarations do not prove glyph rasterization. Complex
paint, effects, icons, optical appearance and unmapped states need declared proof
coverage; reference images remain useful for those checks. Use claims such as
“these mapped structural properties pass” with the exact case/adapter scope.

Snapshots record inherited offline capture provenance. Their integrity does not
prove the live Figma document is unchanged. Theme selections use collection/mode
IDs; a label such as light or dark alone is not a complete variable resolution.

## Source and reference promotion

Changing design truth is separate from validating components. Prepare a staged
source/reference/receipt set without writing active files. Inspect its stage ID,
manifest hash, input fingerprint, destination list and change summary. Niklas's
approval must bind to that exact stage and scope; a general approval of the
project or a passing run is not reference approval.

The package promotion core validates the supplied approval and unchanged inputs,
then applies through a journal with rollback. A wrong/stale stage, changed active
file or modified staged artifact must reject application. Interrupted transactions
need recovery before retrying. The UI only inspects/runs validation; it does not
create approval records or apply stages.

Use the public staging commands from the repository root:

```bash
pnpm governance:source:stage -- --family button --capture /path/to/capture.json
pnpm governance:source:preview -- --stage <stage-id>
pnpm governance:source:apply -- --family button --stage <stage-id> --approval /path/to/owner-approval.json
pnpm governance:source:recover -- --family button --transaction <transaction-id>
```

Stage/transaction identifiers are the UUIDs printed by these commands, not
filesystem paths. Stages live in `.reflection/governance/stages/`; transaction
journals live in `.reflection/governance/transactions/`. Recovery takes the exact
transaction ID from an interrupted apply. These operations are disabled in CI.

A capture manifest names files relative to its own directory. For example, a
source capture contains both the snapshot and its manifest:

For fresh generated-frame PNGs, run Reflection Frame Prep in the configured
Figma copy, then `pnpm reflection:figma:prepare-frames -- --family button --write
--capture-references --json`. This prepares generated frames and saves exact
Figma exports and their node IDs/SHA-256 hashes under
`.reflection/governance/captures/<uuid>/`. It does not change active baselines,
receipts or owner approval. Refresh the raw file after frame generation, bind
the contract to the returned frame IDs, and assemble matching source/reference/
receipt artifacts for staging. A reported null file key requires independently
confirming the open copy before using `--accept-any-file`.

Centered browser fixtures use the generated frame plugin's whole-pixel case
origin. This moves only the outer fixture; component widths, paint, typography
and relative geometry remain measured independently. A framing correction can
expose a previously hidden fractional outline difference, which remains a
blocking visual result at the existing threshold.

```json
{
  "schemaVersion": 1,
  "family": "button",
  "artifacts": [
    {"sourcePath": "snapshot.json", "destination": "source/snapshot.json", "kind": "source"},
    {"sourcePath": "manifest.json", "destination": "source/manifest.json", "kind": "source"}
  ]
}
```

Reference and receipt entries use `baselines/<file>.png` and
`baselines/<file>.png.meta.json` destinations with `reference` and `receipt`
kinds. The source manifest must describe the exact snapshot hash/capture identity;
missing dependencies or a different Figma file identity reject promotion.

The separately owner-authored approval has `schemaVersion: 1`,
`decision: "approve"`, `reviewer`, `approvedAt` (UTC ISO timestamp), `family`,
`stageId`, `stageHash`, `inputFingerprint` and the exact `destinations` list from
the preview. Do not generate an approval as a side effect of staging. Changed
inputs require a new stage and a new decision.

Human review of a validation run is a separate record tied to its family, run ID,
evidence hash, input fingerprint and explicit cases. Store owner-authored records under
`.reflection/governance/reviews/<family>/<run-id>.json`. Scope cases by
`<case-id>:<adapter>:<mode>` and bind the exact report-byte SHA-256 hash and
input fingerprint. A newer run or changed inputs invalidates earlier acceptance. Scoped exceptions require assertion IDs, a reason
and an expiry; they do not silently turn missing proof into verified coverage.

## Troubleshooting

- **Chromium unavailable:** run `pnpm reflection:install-browsers -- chromium`, then
  `pnpm reflection:doctor`.
- **Port occupied:** choose `--port 6175`; open the exact `127.0.0.1` URL printed
  by the server.
- **Missing source/mapping:** add the family's compact snapshot and semantic
  mapping; do not use runtime CSS to generate expectations.
- **Measurement mismatch:** inspect the source node, variable alias/mode chain,
  semantic selector and browser actual value before changing the component.
- **Visual mismatch:** compare the exact run's expected/actual/diff images. Fix
  source, contract, fixture or runtime drift at its owning layer. Do not lower
  thresholds or overwrite Figma references to secure a pass.
- **Stale results after shared edits:** conservative fingerprints intentionally
  invalidate more than one family. Rerun the needed selection after edits settle.
- **Missing/corrupt artifact or malformed report:** the UI must show an error.
  Generate a new run; never edit immutable historical evidence.

See [testing](../reference/testing.md), the
[command lexicon](../reference/design-governance-command-lexicon.md) and the
[upgrade audit](../audits/figma-governance-one-upgrade.md).


## Portable exact-run HTML report

The inspector has **Open report** and **Download HTML report** links for its
selected canonical run. Filters do not restrict the export: it includes the full
current required inventory and all three adapters. Each report is a read-only,
self-contained HTML file with embedded images and JSON assertion artifacts.
Open the downloaded file directly without a server or credentials. It cannot
validate, accept review, promote references or detect later repository changes.

Export a specific run from the command line:

```bash
pnpm governance:report -- --family button --run <exact-run-id>
```

The command prints the new report path. Use `--output <new-report.html>` for an
explicit destination. Existing files are never overwritten, and reports cannot
be written into canonical run/stage evidence. Default output is `.reflection/reports/`
locally or `artifacts/reflection/reports/` in CI. These are generated artifacts,
not design inputs to commit.

Generate the report as part of the next complete verification:

```bash
pnpm governance:verify -- --family button --adapter all --stage <fresh-stage-id> --html
```

The report is exported even when required proof fails; verification still exits
nonzero. Prepare a fresh stage under the ordinary protocol first. The flag does
not grant reference promotion or approval. Without `--stage`, normal active-input
verification is used.

The table distinguishes required-row coverage from unique case/mode proof tallies.
Mapped items are fixture mappings, not passes; behavior-only rows do not require
visual images. Filtering preserves the family denominator. Image roles are
explicit, and structural captures remain labeled separately from native visual
results. Shared Figma images require matching adapter reference hashes.

Diff counts are supplementary calculations from hash-verified images using
Reflection's production comparator. Thresholds come from the exact archived
staged policy, or from active policy only while its input fingerprint matches.
Historical active runs without archived policy show unavailable thresholds.
Recomputed measurements never rewrite recorded outcomes. Source facts, artifact
hashes, input/run identity, stage identity and owner review remain inspectable.

Freshness and review are assessed **at export time**. A stale run remains stale;
new or changed current requirements retain missing/unmatched rows instead of
borrowing historical proof. Corrupt, missing, escaped or incorrectly typed image
artifacts block export without selecting an older passing run. The HTML is a
review artifact, not a signed certificate or proof of live Figma freshness.


### Start with the attention overview

Portable reports put the automated result, frozen freshness, exact run, recorded
engine, source scope and review state above an action overview. Categories show
recorded visual failures, approved rules ready for enrollment, design mapping,
missing fixtures and capture gaps; nonvisual proof failures are prominent when
present. Expand the affected-item lists or select a category to inspect only
those rows. Counts overlap and are never added together. Full metadata and
case-level tallies stay available in collapsed sections.

A confirmed absent design can declare a source disposition in its required
inventory entry:

```json
"source": {
  "availability": "needs-design",
  "reason": "Describe the confirmed missing treatment and the design work needed"
}
```

This produces **Skipped — design needed** for the visual review disposition.
It does not turn recorded proof into a pass, remove the requirement, skip behavior
or structural checks, or imply complete design coverage. Supply a concrete source
assessment before assigning this status. A missing screenshot or fixture alone
is not evidence that no design exists.

Use `needs-mapping` for unresolved source selection, or `rule-defined` with a
reason identifying approved independent design rules. Existing declarations
without a source node default to mapping needed, not confirmed design absence.
A `needs-design` declaration requires a reason and cannot also select a source
node. Changing availability/reason invalidates exact requirement matching.

Button inventory update — 2026-10-16: the current contract retains 273 required
item/mode obligations, with 203 fixture bindings and 70 missing fixtures. Approved
DC-009 focus applicability is explicit for 12 generic variant selections, 38
purpose-wrapper selections and two neutral/md IconButton selections: 52 approved
rules still need independent proof. Fourteen selections have scoped design gaps:
XS, both icons and persistent toggle in both themes, plus neutral/text/success/danger
loading in both themes. Visual review may defer those selections; every required
structural, visual and behavior proof remains in the denominator.

Six remaining mapping/enrollment decisions cover Primary loading, fullWidth and
the unbordered IconButton master in both themes. Primary loading has direct Figma
selections 1780:2692 / 1780:2744; fullWidth has Fill=True group authority requiring
explicit standalone scope. IconButton Border=False master 3017:36466 has design
authority, while public variant mapping and compact node enrollment remain open.
The two Primary focus fixtures are enrolled; 50 other focus fixtures remain missing.
This records source and fixture enrollment, not passing staged proof. The
two generic icon-only feature rows reuse exact neutral/md IconButton cases and
certify only that selection. Counts overlap. Historical reports retain their exact
run's inventory and outcomes; source metadata changes do not rewrite old proof.
