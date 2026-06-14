# Marwes Design Governance

Private repo tooling for keeping Marwes aligned with Figma.

Figma is the source of truth. This package owns the local sync and validation
loop that proves the generated `.figma` artifacts, registry metadata, theme
tokens, preset CSS, framework surfaces, and Reflection visual baselines still
agree.

```text
                 Figma source node
                       |
                       v
Figma variables -> reflection contract -> Figma baseline PNG
                       |
                       v
              Reflection portal runtime
```

The core value is the triangle, not any single artifact:

- **Figma source node** proves the intended component structure, dimensions,
  typography, fills, strokes, effects, and variable bindings.
- **Figma variables** prove that the node is using the expected design tokens
  and that Marwes exposes matching runtime CSS variables.
- **Figma baseline PNG plus Reflection portal output** proves that React, Vue,
  and Svelte render the same visual result at the contract `viewportSize`.

When a visual check fails, do not fix from the PNG diff alone. First reconcile
all three sides: inspect the source node facts, confirm bound variables, then
use the expected/actual/diff images to decide whether the runtime CSS, adapter
fixture, contract, or Figma export is wrong.

## What This Package Owns

- Figma sync configuration and local artifact validation.
- Registry and component-family source contracts.
- Token parity checks between Figma variables and Marwes runtime CSS variables.
- Reflection family contracts under `reflection-families/<family>/`.
- Figma-exported baseline PNG ownership for Reflection visual comparisons.
- Static checks that prove the baseline PNG, Figma nodes, variables, and runtime
  comparison policy belong to the same contract.

This package should be the durable contract layer for design governance. Other
packages can render components, but this package owns the question: "Does the
implementation still match the design source of truth?"

For command lookup, use:

```text
docs/reference/design-governance-command-lexicon.md
```

For the full source-node, variable, generated-frame, baseline PNG, and portal
workflow, use:

```text
REFLECTION_DESIGN_GOVERNANCE_FLOW.md
```

## Default Workflow

Use the `governance:*` commands for normal design-change work. The older
`figma:*`, `reflection:*`, and `cohesive:*` commands still exist, but they are
now the advanced building blocks behind this smaller surface.

```bash
pnpm governance:status
pnpm governance:sync -- --mode cache
pnpm governance:prepare -- --family <family> --connect --dry-run
pnpm governance:prepare -- --family <family> --write --replace --export-baselines --accept-any-file
pnpm governance:ingest -- --family <family> --dry-run
pnpm governance:check -- --family <family>
pnpm governance:visual
pnpm governance:ci -- --skip-browser-install
```

For strict provenance audits, where generated Figma frame ids are required:

```bash
pnpm governance:ci:strict -- --skip-browser-install
```

`governance:status` is the fastest orientation command. It groups the local
state into baseline PNGs, receipts, source nodes, generated-frame provenance,
adapter portal coverage, and latest Reflection visual reports.

## Contract Layers

### 1. Figma Source

The configured Figma file key is the authority. The active sync target is stored
in `.pi/figma-sync.json`, and the exported local artifacts live under
`.figma/marwes`.

Required local Figma artifacts include:

- `.figma/marwes/_raw/<file-key>_full.json`
- `.figma/marwes/tokens/variables.json`
- `.figma/marwes/components/<family>.json`

The source node is the first diagnostic source when Reflection fails. Read its
absolute bounds, layout, text styles, stroke alignment behavior, fills, effects,
and `boundVariables` before changing CSS or thresholds.

### 2. Registry And Tokens

The registry says which Figma nodes and variables belong to each component
family. The validators check that registry references still exist, bound Figma
variables still match, and runtime CSS variables expose the expected values.

This layer is mandatory for Reflection fixes. A visual mismatch caused by a
wrong color, radius, typography value, or surface should be traced through the
Figma node's bound variable and the Marwes runtime variable before hard-coding a
literal. Literal values are acceptable only for values that are genuinely not
tokenized in Figma, and the reason should be clear in the family contract or CSS
comment.

### 3. Reflection Families

Reflection-specific contracts live here:

```text
packages/design-governance/reflection-families/<family>/
  reflection-contract.json
  baselines/
    <case>.chromium-linux.<mode>.png
```

The contract connects every visual case to:

- the Figma file key
- the Figma baseline frame id and frame name
- the baseline PNG path
- the exact viewport size
- the runtime portal path
- the source component node in the local Figma dump
- required bound variables
- the comparison threshold and reason
- optional `prep` metadata for generating and exporting strict Figma baseline
  frames

For Button, the current contract is:

```text
packages/design-governance/reflection-families/button/reflection-contract.json
```

### 4. Figma Baseline Frames

Each baseline PNG must come from a top-level Figma frame named like:

```text
reflection/button/basic/light
```

That frame is separate from the source component node. The source component node
proves the component definition, while the baseline frame proves the exact
exported screenshot surface.

Frame requirements:

- fixed size matching `viewportSize`
- white background unless the contract says otherwise
- one component state centered inside the frame
- no labels, docs text, guides, or showcase UI
- integer pixel position and dimensions
- PNG export at scale `1`

For practical baseline ingestion, compile a normal Figma PNG export folder into
the package-owned baseline layout:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write
pnpm reflection:figma:receipts -- --family badge --dry-run
```

Generated source-page frames are now the preferred path when catalog source
frames already exist. They are created by the local Figma Reflection Frame Prep
plugin from each family contract's `prep` metadata:

```bash
pnpm governance:prepare -- --family badge --connect --dry-run --replace --accept-any-file
pnpm governance:prepare -- --family badge --write --replace --accept-any-file
pnpm governance:prepare -- --family badge --write --replace --accept-any-file --export-baselines
```

The bridge creates or replaces only plugin-managed frames, returns generated
frame ids, exports PNGs, and writes local generated-frame provenance into:

```text
packages/design-governance/reflection-families/<family>/generated-frames.json
```

Do not force a full Figma REST fetch after every generated frame write. Refresh
the local Figma raw source and variables at the start of a batch. After frame
generation/export, the local strict evidence is `generated-frames.json`, not a
fresh raw Figma dump that happens to include the temporary frames.

The older compiler path still reads `pending-figma-frame-renames.json`,
validates PNG dimensions, and renames files locally before placing them. It is
useful for manual export folders. Active writes also create `.meta.json`
receipts. Figma frame renames are still useful, but the committed
generated-frame provenance is the durable audit artifact.

Legacy `frame-prep.json` files are still accepted for one migration window, but
new families should put preparation metadata directly in
`reflection-contract.json`. Use this when migrating old manifests:

```bash
pnpm governance:migrate-contracts -- --dry-run
pnpm governance:migrate-contracts -- --write
```

When `generated-frames.json` is present for the family, run the strict
provenance check:

```bash
pnpm governance:check -- --family button --require-figma-frames
```

Without `--require-figma-frames`, missing or stale generated-frame provenance is
a warning so a family can be introduced before the final export evidence is
captured.

### 5. Reflection Portal Runtime

Reflection renders components through the generated portal, not Storybook, for
new visual contracts. The portal consumes the same `viewportSize` and `framing`
declared in the family contract, then compares the rendered result against the
Figma-exported baseline PNG.

The visual comparison is intentionally strict by default. Small tolerances are
allowed only when they are documented in `comparison.toleranceReason`, for
example Figma PNG versus Chromium font antialiasing drift after all static
contract checks have passed.

## Button Status

Button is the first full family using this model.

Current Button guarantees:

- local Figma source component nodes exist
- local component JSON files contain the source nodes
- required bound variables exist on the source nodes
- baseline PNGs exist under this package
- baseline PNG dimensions match the contract viewport
- baseline PNG receipt sidecars match the PNG hash, source node, variables, and
  viewport contract
- React, Vue, and Svelte render through the Reflection portal
- Reflection review passes with documented narrow tolerances

Remaining Button provenance step:

- replace the `TODO_REFLECTION_BUTTON_*_LIGHT_FRAME` values in
  `reflection-families/button/reflection-contract.json` with the real top-level
  Figma frame ids for the `reflection/button/.../light` frames.

After that, `pnpm governance:check -- --family button --strict`
should pass without warnings.

## Pre-Push And CI

Local pre-push runs:

```bash
pnpm check
pnpm design:check
pnpm cohesive:check:all
pnpm reflection:figma:receipts -- --all --dry-run
```

That catches static governance drift before pushing without forcing every push to
run browser screenshots.

Pull request CI runs:

```bash
pnpm governance:ci
```

That is the merge gate for package-owned visual contracts. It checks every
Reflection family contract, installs the Chromium browser used by
`reflection-check`, compares React, Vue, and Svelte portal renders against the
Figma-exported baseline PNGs, and uploads `artifacts/reflection/` when review
evidence is needed.

The current CI command requires baseline receipts, so it is fully local once
`.figma/marwes`, `variables.json`, baseline PNGs, and `.meta.json` receipts are
committed. It intentionally does not require generated-frame provenance. Use
`pnpm governance:ci:strict` only for a provenance audit where every active case
has a matching committed `generated-frames.json` entry.

The older `cohesive:ci` and `cohesive:ci:strict` scripts still work and are what
the governance aliases wrap.

When a Reflection batch should be considered fully promoted across adapters,
run:

```bash
pnpm governance:check -- --complete
```

That gate fails if registered or prepared families are not yet promoted into
contracts, baseline receipts, and React/Vue/Svelte portal render cases.

## Commands

Sync the current configured Figma target:

```bash
pnpm --filter @marwes-ui/design-governance sync -- --mode cache
```

Use `--mode remote` only when the local cache is missing or stale and a live
Figma fetch is intended.

Validate one family:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --family badge
```

Validate runtime token parity only:

```bash
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family badge
```

Validate every registry family:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --all
```

Root aliases are available for normal use:

```bash
pnpm design:sync
pnpm design:validate -- --family badge
pnpm design:validate:runtime -- --family badge
pnpm design:suggest-tokens card
pnpm design:check
```

Validate the package-owned Reflection/Figma visual contract for one family:

```bash
pnpm governance:check -- --family button
```

This static check validates the Figma sync target, local raw nodes,
`variables.json`, source component bounds, required bound variables, baseline PNG
dimensions, receipt sidecars, and comparison threshold policy. Add
`--require-baseline-receipts` when receipts should be mandatory. Add
`--require-figma-frames` when top-level generated frame node ids should also be
mandatory.

When investigating a failing Reflection case, use this order:

1. Run `pnpm governance:check -- --family <family>` to prove the source node,
   required variables, baseline PNG, and contract still connect.
2. Inspect the source node in `.figma/marwes/_raw/<file-key>_full.json` or the
   family component JSON to collect dimensions, text styles, fills, strokes,
   effects, and bound variables.
3. Compare Reflection `expected.png`, `actual.png`, and `diff.png` to identify
   whether the runtime problem is geometry, token/color drift, typography,
   framing, adapter fixture shape, or font antialiasing.
4. Patch the owning runtime layer and rerun React, Vue, and Svelte visual checks.

Run the full visual Reflection loop:

```bash
pnpm governance:visual
```

That runs `reflection:doctor`, `reflection:visual`, and `reflection:review`.

Run the CI visual gate locally:

```bash
pnpm governance:ci
```

Once all contracts have real top-level Figma baseline frame ids, use:

```bash
pnpm governance:ci:strict
```

## Figma Plugin

Import the bridge plugin from:

```text
packages/design-governance/figma-plugin/manifest.json
```

Run it in Figma Desktop with:

```text
Plugins > Development > Marwes Figma Bridge
```

The plugin exports local variables plus document-bound variables that are not
returned by Figma's local variable export. It also applies Reflection baseline
frame renames from
`packages/design-governance/reflection-families/pending-figma-frame-renames.json`
through the local bridge command:

```bash
pnpm reflection:figma:rename-frames
pnpm reflection:figma:rename-frames -- --write
```

The first command is a dry run. Use `--family accordion` to limit the operation
while testing. After writing names, refresh `.figma/marwes` from the current
Figma file and run:

```bash
pnpm governance:check -- --all --strict
```

## Validation Layers

- **Fetch freshness**: confirms `.figma/marwes` has the required local artifacts.
- **Figma references**: checks registry Figma files still exist in the current export.
- **Figma token parity**: compares registry `figmaTokens` with bound Figma variable names.
- **Runtime token parity**: follows Figma token aliases to expected Marwes CSS vars and checks preset CSS/theme exposure.
- **Framework surfaces**: checks core, preset, React, Vue, and Svelte surface files exist.
- **Cohesive Reflection contracts**: checks
  `packages/design-governance/reflection-families/<family>/reflection-contract.json`
  against `.pi`, `.figma`, baseline PNGs, and the runtime comparison policy.
- **Reflection visual review**: checks React, Vue, and Svelte portal renders
  against the package-owned Figma baseline PNGs.

## Failure Meaning

- Missing Figma files usually means the registry contract points at stale node exports.
- Missing Figma tokens usually means the registry token list is stale or Figma bindings changed.
- Runtime token parity failures mean the registry and Figma agree, but the shipped theme/preset runtime uses the wrong CSS token.
- Reflection contract failures mean the family contract, Figma export, baseline
  image, or runtime comparison policy no longer describe the same visual case.
- Reflection visual failures mean the rendered component no longer matches the
  package-owned Figma baseline within the documented threshold.

Do not weaken validators to make drift disappear. Fix the layer that is no
longer aligned with Figma truth.

## Add A New Reflection Component

Use the full guide:

```text
docs/guides/add-new-reflection-component.md
```

Short version:

1. Add a family folder under `reflection-families/<family>/`.
2. Add `reflection-contract.json` with source component node ids, viewport
   sizes, portal paths, required bound tokens, comparison policy, and `prep`
   metadata.
3. Create strict generated Figma baseline frames with `pnpm governance:prepare`.
4. Export each frame as PNG at scale `1` with a `.meta.json` receipt.
5. Compile/export PNGs into `reflection-families/<family>/baselines/`.
6. Run `pnpm governance:ingest -- --family <family> --dry-run`.
7. Run `pnpm governance:check -- --family <family>`.
8. Run `pnpm governance:check -- --family <family> --strict` once
   the real top-level baseline frame ids are present.
9. Run `pnpm governance:visual`.

## Suggest Tokens

Discover which Figma variables are bound to a family's nodes:

```bash
pnpm design:suggest-tokens card
```

Outputs all color-relevant tokens with markers:

- `✓` already declared in `figmaTokens`
- `+` bound in Figma but not declared
- `✗` declared but not bound (stale)

## Verbose Mode

Pass `--verbose` to see which alias→CSS-var mappings are unsupported:

```bash
pnpm design:validate:runtime -- --family badge --verbose
```
