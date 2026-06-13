# Design Governance

Marwes design governance is the local workflow that keeps design, registry, and
runtime implementation in sync.

```text
Figma source node + Figma variables + Figma baseline PNG -> runtime result
```

Figma is the source of truth, but the proof is a triangle. Future Reflection
work must read all three sides together:

- the source Figma node, which carries geometry, typography, fills, strokes,
  effects, and bound-variable evidence
- the Figma variable map, which proves the design token names and expected
  Marwes runtime CSS variables
- the Figma-exported Reflection baseline PNG, which proves the exact frame and
  screenshot target that React, Vue, and Svelte must match

The repo then proves that truth through registry contracts, design-governance
family contracts, runtime token parity, and Reflection portal visual checks.

## Package

The workflow lives in the private workspace package:

```text
packages/design-governance
```

Use the root aliases for day-to-day work:

```bash
pnpm design:sync
pnpm design:validate -- --family badge
pnpm design:validate:runtime -- --family badge
pnpm design:check
```

For a full command lookup, see:

```text
docs/reference/design-governance-command-lexicon.md
```

For the full product-level walkthrough of the source-node, variable, generated
frame, baseline PNG, and Reflection portal loop, see:

```text
REFLECTION_DESIGN_GOVERNANCE_FLOW.md
```

## Refresh Workflow

For the recurring Marwes Figma refresh:

1. Copy or refresh the Marwes Figma file.
2. Update `.pi/figma-sync.json` to the copied file key.
3. Run raw sync:

```bash
pnpm design:sync -- --mode cache --skip-variables
```

Use `--mode remote` only when a live Figma fetch is intended.

4. Start the variable receiver:

```bash
pnpm figma:variables:sync -- --accept-any-file --no-refresh
```

5. In Figma Desktop, run:

```text
Plugins > Development > Marwes Figma Bridge
```

Import the plugin from:

```text
packages/design-governance/figma-plugin/manifest.json
```

6. Validate the touched family:

```bash
pnpm design:validate -- --family badge
```

7. Before pushing, run:

```bash
pnpm design:check
```

## Reflection Baseline Batch Workflow

Reflection baseline work uses the same Figma cache, but the inner loop is more
specific than a full design sync.

1. Register source catalog frames in:

```text
packages/design-governance/reflection-families/source-frame-registry.json
```

2. Create or update the executable frame-prep manifest:

```text
packages/design-governance/reflection-families/<family>/frame-prep.json
```

3. Start the Figma Reflection Frame Prep plugin from:

```text
packages/design-governance/figma-reflection-plugin/manifest.json
```

4. Dry-run generated frame creation:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --connect --dry-run --replace --accept-any-file
```

5. Write plugin-managed frames in Figma:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file
```

6. Export generated frames into package-owned baselines:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file --export-baselines
```

7. Update `reflection-contract.json`, add portal routes, and validate with:

```bash
pnpm cohesive:check -- --family <family>
pnpm reflection:doctor
pnpm reflection:visual
pnpm reflection:review
```

Do not require a full Figma REST fetch after every generated frame write. The
bridge is already connected to the open Figma file, returns concrete generated
frame ids, and stores plugin metadata on generated frames. Use a full remote
fetch only as an intentional batch refresh or strict audit step.

## Validation Layers

`design:validate` checks:

- local Figma cache freshness
- Figma file references from the registry
- bound Figma token parity
- runtime token parity
- framework surface paths

Runtime token parity catches cases where Figma and the registry agree, but the
implementation still uses the wrong Marwes CSS variable.

For Reflection visual work, do not diagnose from screenshots alone. First prove
the source node exists, inspect the node's `boundVariables`, confirm those
variables exist in `.figma/marwes/tokens/variables.json`, then compare the
Figma baseline PNG against the portal `actual.png` and `diff.png`.

Example:

```text
Figma token: status-display/border
Alias: status/success/border
Expected CSS var: --mw-color-status-success-border
Found CSS var: --mw-color-status-success-border-strong
```

## Git Gate

`pnpm design:check` is part of the pre-push gate. If it reports missing
`.figma/marwes` artifacts or a missing `variables.json`, refresh with:

```bash
pnpm design:sync
```

Do not silence failures by weakening the validator. Decide whether Figma,
registry metadata, or runtime code is wrong, then fix that layer.
