# Reflection Families

This directory contains package-owned visual contracts for Reflection component
baselines.

Each family owns one `reflection-contract.json` plus its Figma-exported baseline
PNGs. Reflection configs, Figma export tooling, and cohesive validation should
read these contracts instead of maintaining separate case lists.

```text
packages/design-governance/reflection-families/<family>/
  reflection-contract.json
  baselines/
    <case>.chromium-linux.<mode>.png
    <case>.chromium-linux.<mode>.meta.json
```

Normal Reflection run output still belongs under `.reflection/` locally or
`artifacts/reflection/` in CI. Do not copy runtime evidence screenshots into
this directory. Baselines here must come from the Figma export workflow.

For the full source-node, variable, generated-frame, PNG, and portal flow, see
the repo root document:

```text
REFLECTION_DESIGN_GOVERNANCE_FLOW.md
```

## Three-Source Contract

Every family contract must keep three sources connected:

```text
source Figma node + bound variables
  -> package-owned baseline PNG
  -> Reflection portal render
```

The source node and variables explain why a component should look a certain way.
The baseline PNG proves the exported Figma truth for a specific frame size. The
portal render proves React, Vue, and Svelte still produce that truth in the
browser.

Every committed baseline PNG must have a sidecar receipt:

```text
<case>.chromium-linux.<mode>.meta.json
```

The receipt is the durable local bridge from Figma to the repo. It records the
PNG hash and dimensions, the source catalog node, the source frame, the required
variable fingerprint, the viewport/framing contract, and the generated frame id
as informational evidence. Once `.figma/marwes`, `variables.json`, the PNG, and
the receipt are committed, the normal validation loop does not need to call
Figma.

When updating or debugging a family, use all three sources together:

- Read `source.componentNodeId`, `source.requiredBoundTokens`, and
  `source.componentBounds` from `reflection-contract.json`.
- Confirm the node exists in `.figma/marwes/_raw/<file-key>_full.json` and that
  its bound variables exist in `.figma/marwes/tokens/variables.json`.
- Inspect Reflection `expected.png`, `actual.png`, and `diff.png` only after the
  source node and token checks are understood.
- Patch runtime CSS, adapter portal fixtures, Figma variables, or baseline PNGs
  based on which side of the triangle is wrong.

Do not increase thresholds until source node geometry, variable bindings,
baseline dimensions, and runtime framing all agree. Non-zero tolerance is only
for documented Figma-export versus Chromium rendering noise.

## Pending Figma Renames

`pending-figma-frame-renames.json` is the repo-side rename handoff for top-level
Figma baseline frames that have been discovered but are not active Reflection
contracts yet.

Use it first as a local PNG compiler map:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write
pnpm reflection:figma:receipts -- --family badge --dry-run
```

The compiler is dry-run by default. `--target incoming` stages files under
`_incoming/<source-folder>/`; `--target active` writes to
`reflection-families/<family>/baselines/`.

The same file can later rename frames in Figma for strict provenance:

```bash
pnpm reflection:figma:rename-frames
pnpm reflection:figma:rename-frames -- --write
```

The rename command talks to the local Figma development plugin and is dry-run by
default. Once a case has the correct exported PNG, portal route, and
source-node contract, move or keep it in
`reflection-families/<family>/reflection-contract.json`.

## Source Frame Registry

`source-frame-registry.json` records the light/dark Figma catalog frame links
for families we expect to turn into Reflection cases. It is a source map, not an
active visual contract.

Use it when creating or expanding a family `frame-prep.json`:

```text
source-frame-registry.json
  -> <family>/frame-prep.json
  -> generated Figma frames named reflection/<family>/<case>/<mode>
  -> exported PNG baselines
  -> <family>/reflection-contract.json
```

`frame-prep.json` is the executable manifest. When it includes
`sourceFrameUrl` or `sourceNodeUrl`, `pnpm reflection:figma:prepare-frames`
checks that the URL file key and node id match the declared id. This keeps
copied Figma links useful as validated provenance rather than plain notes.

Normal generated-frame workflow:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --connect --dry-run --replace --accept-any-file
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file --export-baselines
```

The Figma bridge creates or replaces only plugin-managed `reflection/*` frames,
returns the generated frame ids, and stores metadata on the frames. Do not force
a full Figma REST fetch after every generated frame write. Refresh the local raw
Figma source and variable map at the start of a batch; use post-generation
remote fetches only for intentional strict audit/provenance passes.

Once generated PNGs and receipts are in place, move the active cases into the
family `reflection-contract.json`. The contract should still keep source catalog
node ids separate from generated baseline frame ids:

```text
figmaNodeId = generated Reflection baseline frame (optional strict provenance)
source.componentNodeId = original catalog/source node
baseline .meta.json = committed local proof for the PNG
```
