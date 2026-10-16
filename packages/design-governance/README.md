# Marwes Design Governance

Private Node/TypeScript tooling for developers maintaining Figma parity across
React, Vue and Svelte. `@marwes-ui/design-governance` owns source compilation,
structural assertions, Reflection orchestration, evidence and outcome policy.
Runtime component packages do not depend on this package.

Figma JSON and exported variables supply independent expectations. Real browser
components supply measurements. Reflection 0.3.0 supplies the complementary PNG
comparison. A passing supported subset does not prove every property or pixel.

## Setup

From the repository root, use Node >=22 and the repository's pnpm version:

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm reflection:doctor
```

Doctor checks all three adapter configurations. Routine verification uses
committed compact snapshots and needs neither Figma MCP nor credentials. Updating
the captured design source is a separate operation; offline verification cannot
establish that the live Figma file has not changed.

## Daily workflow

The complete 32-family rollout is tracked in
[`design-compliance-rollout.md`](../../docs/guides/design-compliance-rollout.md).
Use `pnpm governance:inventory` for required public families and validation groups,
and `pnpm governance:provider` for the proposed versioned Reflection UI projection.
The provider endpoint is `/api/provider/v1`; the external UI acceptance gate is
separate from provider readiness.

```bash
pnpm governance:status -- --family button --json
pnpm governance:verify -- --family button --adapter all
pnpm governance:review -- --family button
pnpm governance:check -- --family button
pnpm governance:ui
```

`verify` creates immutable run evidence and exits nonzero for failed or blocked
proof. `status` and `review` read runtime evidence. `check` validates portable source
integrity and compiles mapped expectations without browser measurements; it
exits nonzero on source or required compilation failures. `review` is an
inspection command, not a human acceptance action. Open the loopback URL printed
by `governance:ui` to use **figma-governance-one**; stop it with Ctrl-C.

For CI, use `pnpm governance:ci`. Required missing, stale, unsupported or failed
proof must remain visible and block the gate. Preserve legacy `reflection:doctor`,
`reflection:visual`, and `reflection:review` as the visual evidence workflow.

## Source and evidence

```text
reflection-families/<family>/
  reflection-contract.json      visual cases, viewport, framing and thresholds
  structural-contract.json      semantic parts, node/property mappings and modes
  coverage-contract.json        required inventory, independent of enrolled fixtures
  source/snapshot.json           compact Figma nodes and variable dependencies
  source/manifest.json           snapshot hash and inherited capture provenance
  baselines/                    Figma PNGs and receipt sidecars
```

The Button inspector presents required items in a comparison table: Figma,
React, Vue and Svelte. Missing selections and proof remain visible. Use
`verify --family button --stage <stage-id> --adapter all` to test an isolated
proposed capture before owner-approved promotion. Staged results identify their
exact stage and do not replace active references.

Structural expectations include source node/property and variable alias/mode
provenance. They never come from runtime CSS or previous runtime observations.
Mappings connect semantic parts rather than requiring identical Figma and DOM
wrapper trees. Unenrolled families and unmapped cases stay visible.

Local combined runs live under `.reflection/governance/<run-id>/`; CI uses
`artifacts/reflection/governance/<run-id>/`. Each run contains `report.json`,
measurements and hash-bound images. Reading a report compares its input fingerprint
with current inputs; changed code, source, policy, fixtures, assets or tooling
makes historical proof stale. Inspect structural, visual, coverage, freshness and
human review separately. Behavior tests remain a separate proof path.

Do not copy runtime screenshots into active Figma references, lower thresholds to
secure a pass or treat generated-frame metadata as human acceptance. Any source
or reference promotion needs an exact staged change and human approval bound to
its stage hash, input fingerprint and destinations. Inspection, verification and
CI never author that decision.

## Validation and recovery

```bash
pnpm --filter @marwes-ui/design-governance test
pnpm --filter @marwes-ui/design-governance typecheck
pnpm --filter @marwes-ui/design-governance test:browser
pnpm --filter @marwes-ui/design-governance build:ui
pnpm --filter @marwes-ui/design-governance validate -- --family button
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family button
pnpm design:check
```

`build:ui` checks the static UI assets; the server serves them directly. A failed
case should be diagnosed from its source-backed expected/actual table and visual
artifacts before editing the owning source, mapping or runtime layer. Missing
snapshots/mappings require explicit enrollment. Stale evidence requires a new
verification run. Missing or corrupt artifacts require a new run, not edits to
historical evidence.

The Reflection upgrade retained a pre-existing Button text light failure across
all adapters; the upgrade itself did not approve it. See the
[upgrade audit](../../docs/audits/figma-governance-one-upgrade.md).

Read the [inspection guide](../../docs/guides/figma-governance-one.md),
[command lexicon](../../docs/reference/design-governance-command-lexicon.md) and
[testing protocol](../../docs/reference/testing.md) for operational details.
Read-only outlined text/vector diagnostics are available through
`pnpm reflection:figma:export-source-svg`; see
[the source export guide](../../docs/guides/figma-outlined-source-export.md).
This uses Marwes Figma Bridge (9223–9232), preserves provenance and never promotes
references or claims a pinned source version.

Advanced Figma bridge/import tools remain compatibility tooling; use staged
promotion for active source/reference changes.

Button enrollment includes native hover, pressed and disabled selections and small/large
size selections. Reflection 0.5.1 supports browser-forced hover/focus, but cannot hold
pointer-down during component image capture. Required pressed cases stay in governance
with native structural measurement and unsupported visual proof; the standalone
Reflection image configuration excludes them with an explicit diagnostic. It never
compares a default image under a pressed case identity. Missing references and incomplete
state/behavior mappings remain blocking until independently verified and approved.

Figma state overlays use invariant foundation paints exposed as `--mw-color-black`
and `--mw-color-white` (`mwTheme.color.black` / `.white`). These stay black and white
across semantic theme overrides; deriving white from a primary label or border role
would change overlay behavior when a custom theme changes contrast.

### Text diagnostics

The workspace pins published `reflection-check@0.5.1` exactly. Prepare optional,
isolated diagnostic bundles/configs with `pnpm reflection:text:prepare -- --plan
<explicit-plan.json>`; see [the guide](../../docs/guides/reflection-text-diagnostics.md).
Source outlines and typography observations are diagnostic only. Native screenshot
outcomes, thresholds, inventory, approvals and reference promotion are unchanged.
The existing inspector remains available; the HTML report panel does not satisfy
the external interactive UI acceptance gate.


### Portable comparison reports

The inspector can open or download a self-contained report for an exact run.
Use `pnpm governance:report -- --family button --run <run-id>` or append `--html`
to a complete `governance:verify` command. Required rows and all adapters remain
visible; freshness and review are frozen at export, and failed proof stays failed.
See [the report protocol](../../docs/guides/figma-governance-one.md#portable-exact-run-html-report).
