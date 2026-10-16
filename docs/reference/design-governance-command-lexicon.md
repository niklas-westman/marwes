# Design Governance Command Lexicon

Use this page when you know the task but not the command name. The normal path
uses `governance:*` commands. The older `design:*`, `figma:*`,
`reflection:*`, and `cohesive:*` commands are still available as advanced
building blocks.

## Daily verification commands

Run from the repository root with Node >=22. See the
[figma-governance-one guide](../guides/figma-governance-one.md) for setup and
interpretation of proof outcomes.

| Need | Command | Expected result |
| --- | --- | --- |
| Inspect current evidence | `pnpm governance:status -- --family button --json` | Read-only catalog projection with freshness and separate proof/review states. |
| Measure one family | `pnpm governance:verify -- --family button --adapter all` | New immutable structural and visual evidence for React, Vue and Svelte; failed/blocked proof exits nonzero. |
| Inspect review evidence | `pnpm governance:review -- --family button` | Current evidence projection; does not author acceptance. |
| Check source and compilation | `pnpm governance:check -- --family button` | Validates portable source integrity and compiles expectations; does not measure runtime components. |
| Open local inspector | `pnpm governance:ui` | Prints the loopback URL for figma-governance-one. |
| Run CI gate | `pnpm governance:ci` | Runs required verification and preserves failures/missing proof. |
| Run legacy visual loop | `pnpm governance:visual` | Reflection doctor, visual and review across all adapters. |
| Check legacy source/PNG integrity | `pnpm cohesive:check -- --family button --require-baseline-receipts` | Validates the existing source/PNG/receipt contract. |

Choose `--adapter react`, `vue` or `svelte` to narrow a verification run. A scoped
run is not evidence that all adapters or public variants passed. Use `--all` for
an explicit all-family verification. Unknown selections/options fail.

## Source and reference changes

The commands below describe legacy bridge/export tooling. Their write options
can modify active references and do not constitute design approval. Do not use
an import/export command to bypass staged, exact human-approved promotion. See
[staging boundaries](../guides/figma-governance-one.md#source-and-reference-promotion).

Syncing the local cache is distinct from obtaining fresh live Figma evidence.
Routine verification should use committed compact snapshots without MCP access.

## Source staging and promotion

```bash
pnpm governance:source:stage -- --family button --capture /path/to/capture.json
pnpm governance:source:preview -- --stage <stage-id>
pnpm governance:source:apply -- --family button --stage <stage-id> --approval /path/to/owner-approval.json
pnpm governance:source:recover -- --family button --transaction <transaction-id>
```

Stage and transaction arguments are UUID identifiers, not paths. Apply requires
exact owner-authored stage/hash/input/destination approval. Recovery repairs an
interrupted transaction before another apply. These operations are disabled in
CI. See the [capture and approval format](../guides/figma-governance-one.md#source-and-reference-promotion).

## Legacy Figma bridge and export tooling

These algorithms now live under `packages/design-governance/src/tooling/`;
`scripts/reflection/` entry points are compatibility wrappers. They support
inspection, Figma frame preparation and local export diagnostics. Active PNG or
receipt writes through legacy commands are refused; use staged promotion.

```bash
pnpm governance:sync -- --mode cache
pnpm governance:prepare -- --family badge --connect --dry-run --replace --accept-any-file
pnpm reflection:figma:compile -- --source /path/to/export --family badge
pnpm reflection:figma:receipts -- --family badge --dry-run
pnpm reflection:figma:export -- --family badge --dry-run
pnpm reflection:figma:rename-frames
pnpm governance:migrate-contracts -- --dry-run
```

The sync target is `.pi/figma-sync.json`. Cache mode uses previously captured
Figma data; remote mode deliberately fetches live data. Variables/frame bridge
operations require Figma Desktop with the development plugin from
`packages/design-governance/figma-plugin/manifest.json`. Routine portable
verification does not require that plugin or a live Figma request.

Creating frames in Figma and promoting local source/reference files are separate
operations. A generated frame ID, exported PNG or receipt does not grant human
acceptance. Do not use legacy `--write`, `--force` or `--export-baselines` options
to bypass the stage/apply workflow.

## Validation Commands

### `pnpm design:validate -- --family <family>`

Use after changing Figma artifacts, registry metadata, tokens, or family source
references.

It checks:

- local Figma artifact freshness
- Figma references
- Figma token parity
- runtime token parity
- framework surface paths

### `pnpm cohesive:check -- --family <family>`

Use after changing a Reflection family contract or baseline PNG.

It checks:

- `.pi/figma-sync.json` file key
- local raw Figma source and `variables.json`
- source component node bounds
- required bound tokens
- baseline PNG dimensions
- baseline PNG receipt hash, source fingerprint, and variable fingerprint
- comparison threshold and reason
- top-level frame provenance, as a warning by default

Use `--require-baseline-receipts` to make missing or stale receipts fail:

```bash
pnpm cohesive:check -- --all --require-baseline-receipts
```

### `pnpm cohesive:check:strict`

Same as `cohesive:check:all`, but receipt sidecars and generated-frame
provenance warnings become failures. Use this only when every active contract
has a matching committed `generated-frames.json` entry.

### `pnpm cohesive:check:complete`

Use this as the promotion gate when a batch should be considered fully wired.
It requires baseline receipts and also checks that registered or prepared
families have reflection contracts and that every contract `portalPath` exists
in the React, Vue, and Svelte Reflection portal implementations.

This is stricter than authoring mode. It should fail while a family only has
source registry or contract `prep` data and has not yet been promoted into
baselines, contracts, and adapter portal render cases.

### `pnpm reflection:doctor`

Checks the Reflection environment for React, Vue, and Svelte configs:

- Node support
- Playwright availability
- Chromium browser availability
- portal runtime configuration
- configured visual case count

### `pnpm reflection:visual`

Runs visual comparisons for React, Vue, and Svelte. Use this after runtime CSS,
portal cases, baselines, or thresholds change.

### `pnpm reflection:review`

Reads the latest `.reflection/<adapter>` runs and reports status plus artifact
paths. Use this after `reflection:visual` to find expected, actual, and diff
images.

## Common Workflows

### Inspect a new Figma PNG batch

```bash
pnpm reflection:figma:compile -- --source /path/to/export --family badge
pnpm reflection:figma:receipts -- --family badge --dry-run
```

Capture matching PNG/receipt/source files, stage them, inspect the exact preview
and obtain owner approval before applying. Then rerun source checks and runtime
verification. See the [inspection guide](../guides/figma-governance-one.md).

### Debug A Visual Failure

```bash
pnpm reflection:visual:react
pnpm reflection:review:react
```

Open the artifacts from `.reflection/react/runs/<latest>/visual/<case>/`:

```text
expected.png
actual.png
diff.png
```

If the diff is real, fix runtime CSS/tokens/portal rendering. If Figma truth
changed intentionally, stage the source/reference change, obtain exact approval
and apply that stage before rerunning the checks.

### Check Whether Figma Tokens Still Match Runtime

```bash
pnpm design:validate:runtime -- --family accordion
pnpm design:validate:runtime -- --family accordion --verbose
```

Verbose mode shows unsupported alias-to-CSS-variable mappings.

### Prepare For Push

```bash
pnpm check
pnpm design:check
pnpm cohesive:check:all
```

Run `pnpm governance:visual` when the change touched Reflection baselines, portal
cases, component CSS, theme variables, or adapter rendering.

## File Map

| File/Folder | Purpose |
| --- | --- |
| `.pi/figma-sync.json` | Active Figma target and local artifact paths. |
| `.figma/marwes` | Local Figma source artifacts used by validators. |
| `packages/design-governance/reflection-families/<family>/reflection-contract.json` | Static contract for one visual family. |
| `packages/design-governance/reflection-families/<family>/baselines/` | Figma-exported PNG truth images. |
| `packages/design-governance/reflection-families/pending-figma-frame-renames.json` | Map used by the PNG compiler and optional Figma frame renamer. |
| `packages/design-governance/src/runtime/reflection-config.ts` | Package-owned Reflection case/config builder. |
| `reflection.shared.ts` | Thin compatibility export for root configs. |
| `tests/reflection/*-portal*` | Adapter-specific component mount entries for Reflection portal routes. |
| `.reflection/<adapter>/runs/` | Local Reflection run reports and visual artifacts. |
| `artifacts/reflection/<adapter>/` | CI-style Reflection report output. |
