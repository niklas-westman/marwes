# Marwes Design Governance

Private repo tooling for keeping Marwes aligned with Figma.

Figma is the source of truth. This package owns the local sync and validation
loop that proves the generated `.figma` artifacts, registry metadata, theme
tokens, preset CSS, framework surfaces, and Reflection visual baselines still
agree.

```text
Figma file
  -> .pi sync target
  -> .figma raw nodes + variables
  -> registry + token contracts
  -> design-governance reflection family contracts
  -> Reflection portal visual checks
```

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

## Contract Layers

### 1. Figma Source

The configured Figma file key is the authority. The active sync target is stored
in `.pi/figma-sync.json`, and the exported local artifacts live under
`.figma/marwes`.

Required local Figma artifacts include:

- `.figma/marwes/_raw/<file-key>_full.json`
- `.figma/marwes/tokens/variables.json`
- `.figma/marwes/components/<family>.json`

### 2. Registry And Tokens

The registry says which Figma nodes and variables belong to each component
family. The validators check that registry references still exist, bound Figma
variables still match, and runtime CSS variables expose the expected values.

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

When the real baseline frame ids are present, run the strict provenance check:

```bash
pnpm cohesive:check -- --family button --require-figma-frames
```

Without `--require-figma-frames`, missing baseline frame ids are warnings so a
family can be introduced before the final Figma frame ids are wired in.

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
- React, Vue, and Svelte render through the Reflection portal
- Reflection review passes with documented narrow tolerances

Remaining Button provenance step:

- replace the `TODO_REFLECTION_BUTTON_*_LIGHT_FRAME` values in
  `reflection-families/button/reflection-contract.json` with the real top-level
  Figma frame ids for the `reflection/button/.../light` frames.

After that, `pnpm cohesive:check -- --family button --require-figma-frames`
should pass without warnings.

## Pre-Push And CI

Local pre-push runs:

```bash
pnpm check
pnpm design:check
pnpm cohesive:check:all
```

That catches static governance drift before pushing without forcing every push to
run browser screenshots.

Pull request CI runs:

```bash
pnpm cohesive:ci
```

That is the merge gate for package-owned visual contracts. It checks every
Reflection family contract, installs the Chromium browser used by
`reflection-check`, compares React, Vue, and Svelte portal renders against the
Figma-exported baseline PNGs, and uploads `artifacts/reflection/` when review
evidence is needed.

The current CI command intentionally does not pass `--require-figma-frames`
because Button still needs the real top-level Figma baseline frame ids. After
those ids replace the `TODO_REFLECTION_BUTTON_*_LIGHT_FRAME` values, switch the
CI matrix command from `pnpm cohesive:ci` to `pnpm cohesive:ci:strict`.

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
pnpm cohesive:check -- --family button
```

This static check validates the Figma sync target, local raw nodes,
`variables.json`, source component bounds, required bound variables, baseline PNG
dimensions, and comparison threshold policy. Add `--require-figma-frames` when
the top-level `Reflection Baselines` frame node ids should be mandatory.

Run the full visual Reflection loop:

```bash
pnpm cohesive:visual
```

That runs `reflection:doctor`, `reflection:visual`, and `reflection:review`.

Run the CI visual gate locally:

```bash
pnpm cohesive:ci
```

Once all contracts have real top-level Figma baseline frame ids, use:

```bash
pnpm cohesive:ci:strict
```

## Figma Plugin

Import the bridge plugin from:

```text
packages/design-governance/figma-plugin/manifest.json
```

Run it in Figma Desktop with:

```text
Plugins > Development > Marwes Variables Bridge
```

The plugin exports local variables plus document-bound variables that are not
returned by Figma's local variable export.

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

1. Create strict Figma baseline frames on the `Reflection Baselines` page.
2. Export each frame as PNG at scale `1`.
3. Add a family folder under `reflection-families/<family>/`.
4. Add `reflection-contract.json` with Figma frame ids, source component node ids,
   viewport sizes, portal paths, required bound tokens, and comparison policy.
5. Add baselines under `reflection-families/<family>/baselines/`.
6. Run `pnpm cohesive:check -- --family <family>`.
7. Run `pnpm cohesive:check -- --family <family> --require-figma-frames` once
   the real top-level baseline frame ids are present.
8. Run `pnpm cohesive:visual`.

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
