# Design Governance Command Lexicon

Use this page when you know the task but not the command name. The normal path
is: sync Figma artifacts, compile baseline PNGs, run cohesive static checks, run
Reflection visual checks.

## Most Common Commands

| Need | Command | What It Does |
| --- | --- | --- |
| Refresh local Figma artifacts | `pnpm design:sync -- --mode cache` | Rebuilds `.figma/marwes` from the local Figma cache. |
| Validate one component family | `pnpm design:validate -- --family badge` | Checks Figma references, tokens, runtime token parity, and adapter surfaces. |
| Validate runtime token mapping only | `pnpm design:validate:runtime -- --family badge` | Checks whether preset/theme CSS exposes the variables implied by Figma. |
| Check Reflection/Figma static contract | `pnpm cohesive:check -- --family badge` | Checks contract shape, source node, bound tokens, baseline PNG dimensions, receipt sidecar, and comparison policy. |
| Check all Reflection/Figma contracts | `pnpm cohesive:check:all` | Runs cohesive static checks for every reflection family. |
| Check complete adapter promotion | `pnpm cohesive:check:complete` | Fails if registered/prepared Reflection families are not fully promoted into contracts, receipts, and React/Vue/Svelte portal cases. |
| Prepare generated Figma frames | `pnpm reflection:figma:prepare-frames -- --family badge --connect --dry-run --replace --accept-any-file` | Validates source selectors and previews generated `reflection/*` frames in the open Figma file. |
| Write generated Figma frames | `pnpm reflection:figma:prepare-frames -- --family badge --write --replace --accept-any-file` | Creates or replaces plugin-managed baseline frames near their source catalog page. |
| Export generated Figma frames | `pnpm reflection:figma:prepare-frames -- --family badge --write --replace --accept-any-file --export-baselines` | Exports generated frame ids into package-owned PNG baselines and receipt sidecars. |
| Compile exported PNGs locally | `pnpm reflection:figma:compile -- --source /path/to/export` | Maps Figma-exported PNGs into the Reflection baseline naming layout. Dry-run by default. |
| Place PNGs into active baselines | `pnpm reflection:figma:compile -- --source /path/to/export --target active --family badge --write` | Copies compiled PNGs into `reflection-families/<family>/baselines/` and writes receipt sidecars. |
| Backfill/check baseline receipts | `pnpm reflection:figma:receipts -- --all --dry-run` | Verifies every committed baseline PNG has a current local provenance receipt. |
| Run all portal visuals | `pnpm reflection:visual` | Compares React, Vue, and Svelte portal renders against Figma PNG baselines. |
| Review latest visual output | `pnpm reflection:review` | Prints JSON status and artifact paths for the latest Reflection runs. |
| Run the full visual loop | `pnpm cohesive:visual` | Runs `reflection:doctor`, `reflection:visual`, and `reflection:review`. |
| CI-style local gate | `pnpm cohesive:ci` | Runs the package-owned visual gate and writes CI-style artifacts. |

## Figma Refresh Commands

### `pnpm design:sync`

Runs the design-governance sync wrapper for the configured target in
`.pi/figma-sync.json`.

Use:

```bash
pnpm design:sync -- --mode cache
pnpm design:sync -- --mode remote
```

Prefer `--mode cache` when the Figma file was already fetched into
`~/.figma-cache`. Use `--mode remote` only when a live Figma fetch is intended.

### `pnpm figma:variables:sync`

Refreshes `.figma/marwes/tokens/variables.json` through the Figma Desktop bridge
plugin.

Use:

```bash
pnpm figma:variables:sync -- --accept-any-file --no-refresh
```

Then open Figma Desktop and run:

```text
Plugins > Development > Marwes Figma Bridge
```

## Baseline PNG Commands

### `pnpm reflection:figma:prepare-frames`

This is the preferred path when the source catalog frames already exist in the
Marwes Figma file. It reads each family `frame-prep.json`, connects to the local
Figma Reflection Frame Prep plugin, clones the selected source content into
clean fixed-size `reflection/<family>/<case>/<mode>` frames, and can export
those generated frame ids as PNG baselines.

Dry-run selector and placement validation:

```bash
pnpm reflection:figma:prepare-frames -- --family badge --connect --dry-run --replace --accept-any-file
```

Write plugin-managed frames:

```bash
pnpm reflection:figma:prepare-frames -- --family badge --write --replace --accept-any-file
```

Write frames and export baselines:

```bash
pnpm reflection:figma:prepare-frames -- --family badge --write --replace --accept-any-file --export-baselines
```

When `--export-baselines` writes PNGs, it also writes matching `.meta.json`
receipts. Those receipts let the repo validate the Figma source node,
variables, PNG hash, and viewport contract without a second Figma fetch.

Inspect source-frame registry entries:

```bash
pnpm reflection:figma:prepare-frames -- --inspect-source-registry --connect --json
```

Create source info frames for registry audit:

```bash
pnpm reflection:figma:prepare-frames -- --write-info-frames --replace --accept-any-file
```

The normal workflow does not require a full Figma REST fetch after generated
frames are written. Refresh `.figma/marwes` and `variables.json` at the start of
a batch; treat post-generation remote fetches as optional strict provenance
audits.

### `pnpm reflection:figma:compile`

This is the fallback/manual importer for PNGs exported from Figma outside the
generated-frame bridge workflow.

Dry-run a full export folder:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3
```

Dry-run one family:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --family badge
```

Write one active family:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write
```

Overwrite existing active baselines:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write --force
```

When `--target active --write` is used, the compiler also writes receipt
sidecars for the copied PNGs. The family must already have a matching
`reflection-contract.json` case so the receipt can bind the PNG to the local
source node and required variables.

The compiler reads
`packages/design-governance/reflection-families/pending-figma-frame-renames.json`.
It maps duplicated Figma export filenames by the discovered grid order, verifies
PNG dimensions, and writes normalized filenames such as:

```text
packages/design-governance/reflection-families/badge/baselines/warning.chromium-linux.dark.png
```

### `pnpm reflection:figma:receipts`

Backfills or audits receipt sidecars for already committed baselines. It does
not connect to Figma; it reads only local contracts, `.figma/marwes/_raw`, local
variables, and PNG files.

Dry-run all active families:

```bash
pnpm reflection:figma:receipts -- --all --dry-run
```

Write missing or stale receipts:

```bash
pnpm reflection:figma:receipts -- --all --write
```

### `pnpm reflection:figma:export`

Strict export path for cases whose `reflection-contract.json` already has real
top-level Figma frame node ids.

Use:

```bash
pnpm reflection:figma:export -- --family badge --dry-run
pnpm reflection:figma:export -- --family badge
```

This is provenance hardening. It is not required for the practical PNG compiler
flow.

### `pnpm reflection:figma:rename-frames`

Optional Figma-file cleanup. It batch-renames Figma frames using the same
pending rename map. It requires Figma Desktop and the local plugin.

Use:

```bash
pnpm reflection:figma:rename-frames
pnpm reflection:figma:rename-frames -- --write
```

This is not needed to place PNGs. It only makes the Figma file itself match the
`reflection/<family>/<case>/<mode>` convention.

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

Same as `cohesive:check:all`, but receipt sidecars and Figma frame provenance
warnings become failures. Use this only when every active contract has real
top-level Figma frame ids and names.

### `pnpm cohesive:check:complete`

Use this as the promotion gate when a batch should be considered fully wired.
It requires baseline receipts and also checks that registered or prepared
families have reflection contracts and that every contract `portalPath` exists
in the React, Vue, and Svelte Reflection portal implementations.

This is stricter than authoring mode. It should fail while a family only has
source registry or `frame-prep.json` data and has not yet been promoted into
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

### Import A New Figma PNG Batch

```bash
pnpm reflection:figma:compile -- --source /path/to/export
pnpm reflection:figma:compile -- --source /path/to/export --target active --family badge --write
pnpm reflection:figma:receipts -- --family badge --dry-run
pnpm cohesive:check -- --family badge --require-baseline-receipts
pnpm reflection:visual
pnpm reflection:review
```

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

If the diff is real, fix runtime CSS/tokens/portal rendering. If the Figma truth
changed intentionally, compile the new PNG baseline and rerun the checks.

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

Run `pnpm cohesive:visual` when the change touched Reflection baselines, portal
cases, component CSS, theme variables, or adapter rendering.

## File Map

| File/Folder | Purpose |
| --- | --- |
| `.pi/figma-sync.json` | Active Figma target and local artifact paths. |
| `.figma/marwes` | Local Figma source artifacts used by validators. |
| `packages/design-governance/reflection-families/<family>/reflection-contract.json` | Static contract for one visual family. |
| `packages/design-governance/reflection-families/<family>/baselines/` | Figma-exported PNG truth images. |
| `packages/design-governance/reflection-families/pending-figma-frame-renames.json` | Map used by the PNG compiler and optional Figma frame renamer. |
| `reflection.shared.ts` | Builds Reflection cases from family contracts. |
| `tests/reflection/*-portal*` | Adapter-specific component mount entries for Reflection portal routes. |
| `.reflection/<adapter>/runs/` | Local Reflection run reports and visual artifacts. |
| `artifacts/reflection/<adapter>/` | CI-style Reflection report output. |
