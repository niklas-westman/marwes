# Reflection Design Governance Flow

This document explains the Marwes Figma-to-runtime validation loop as product
discussion material. It describes what exists now, why each layer exists, and
how the workflow can grow into a durable design-governance product.

The short version:

```text
Figma catalog source node
  + Figma variables
  + exported baseline PNG receipt
  + generated-frame provenance
  + Reflection portal runtime render
  = evidence that Marwes still matches design intent
```

Figma is the visual authority. The repo does not treat one PNG diff, one node
id, or one token file as enough by itself. The value comes from checking all
evidence surfaces together.

## Product Thesis

The system is trying to answer one question:

```text
Does the implemented component still match the design source of truth?
```

For Marwes, that means more than screenshot comparison. A screenshot can tell us
that something changed, but it cannot tell us whether the design changed, the
runtime changed, a token drifted, the wrong frame was exported, or the browser
rasterized text differently.

The durable product is the contract loop:

1. Figma owns the source design.
2. The local Figma cache proves what the design source currently says.
3. The Figma variable map proves which design tokens the node is actually using.
4. Generated Reflection frames isolate specific component states into clean,
   fixed-size visual truth frames.
5. Exported PNG baselines freeze those frames as testable visual artifacts.
6. Reflection portal renders React, Vue, and Svelte at the same size and framing.
7. Static and visual checks classify drift before merge.

The product opportunity is not only "visual regression testing." It is a
repeatable design governance pipeline where design source, token source,
baseline source, and runtime source are reconciled in one place.

## The Core Triangle

Every Reflection family should be understood through three design-side sources:

```text
             Figma source node
                    |
                    v
Figma variables -> reflection contract -> Figma baseline PNG
                    |
                    v
           Reflection portal runtime
```

The three design-side sources are:

| Source | What It Proves | Typical File |
| --- | --- | --- |
| Figma source node | Component geometry, layout, typography, fills, strokes, effects, and bound-variable usage. | `.figma/marwes/_raw/<fileKey>_full.json` and `.figma/marwes/components/<family>.json` |
| Figma variables | Token names, aliases, values, and mode-specific values. | `.figma/marwes/tokens/variables.json` |
| Figma baseline PNG | The exact exported visual truth for one isolated frame and one viewport size. | `packages/design-governance/reflection-families/<family>/baselines/*.png` |

Reflection portal is the runtime proof. It proves that React, Vue, and Svelte
produce the Figma truth in Chromium at the same frame size.

Do not debug a failed Reflection run from the diff image alone. The correct
question is:

```text
Which side of the contract is wrong?
```

Possible answers:

- Figma source node is wrong or incomplete.
- Figma variable binding is wrong or missing.
- Marwes token mapping is wrong.
- Baseline PNG was exported from the wrong frame or wrong size.
- Runtime CSS/component implementation is wrong.
- Adapter portal fixture is rendering the wrong state.
- The remaining difference is documented Figma export versus Chromium rendering
  noise.

## Main Artifacts

| Artifact | Owner | Purpose |
| --- | --- | --- |
| `.pi/figma-sync.json` | Design governance | Active Figma file key and local artifact target. |
| `.figma/marwes/_raw/<fileKey>_full.json` | Figma sync | Local snapshot of the Figma file used for node/source validation. |
| `.figma/marwes/tokens/variables.json` | Figma variable bridge | Local variable map used for token parity. |
| `packages/design-governance/reflection-families/source-frame-registry.json` | Design governance | Catalog frame link registry for future Reflection families. |
| `packages/design-governance/reflection-families/<family>/reflection-contract.json` | Design governance | The active visual contract for static checks, portal config generation, and Figma frame prep metadata. |
| `packages/design-governance/reflection-families/<family>/frame-prep.json` | Design governance | Legacy fallback selector manifest accepted during the contract-prep migration window. |
| `packages/design-governance/reflection-families/<family>/baselines/*.png` | Figma export workflow | Figma-exported visual truth images. |
| `packages/design-governance/reflection-families/<family>/baselines/*.meta.json` | Design governance | Receipt proving PNG hash, dimensions, source fingerprint, variable fingerprint, and case fingerprint. |
| `packages/design-governance/reflection-families/<family>/generated-frames.json` | Design governance | Local provenance for the temporary generated `reflection/*` Figma frames used to export baselines. |
| `reflection.shared.ts` | Repo Reflection config | Builds Reflection cases from family contracts. |
| `tests/reflection/*-portal*` | Adapter packages | Mounts the right React, Vue, and Svelte component state for each portal route. |
| `.reflection/<adapter>/runs/` | Reflection | Local expected/actual/diff/report artifacts. |
| `artifacts/reflection/<adapter>/` | CI | CI-style Reflection artifacts. |

## Step-By-Step Flow

### 1. Pick A Small Component Batch

Do not start with all components. Use batches small enough that each visual
failure can be understood.

Current good batch pattern:

```text
radio
radio-group
switch
segmented-control
```

For each component family, collect the light and dark catalog frame URLs from
Figma. Put those links in:

```text
packages/design-governance/reflection-families/source-frame-registry.json
```

This registry is not an active Reflection contract. It is the source map used to
build contract `prep` metadata for generated Reflection frames.

### 2. Refresh Local Figma Source Once Per Batch

At the start of a batch, make sure Marwes has current local Figma facts.

The active target is:

```text
.pi/figma-sync.json
```

Normal local-cache refresh:

```bash
pnpm governance:sync -- --mode cache --skip-variables
```

Variable refresh through the Figma Desktop bridge:

```bash
pnpm figma:variables:sync -- --accept-any-file --no-refresh
```

Then run the Marwes Figma Bridge plugin in Figma Desktop:

```text
Plugins > Development > Marwes Figma Bridge
```

Use remote Figma REST sync only when a live file fetch is intentionally needed:

```bash
pnpm governance:sync -- --mode remote --skip-variables
```

Remote sync is not the normal inner loop. It is slower, token-dependent, and not
needed after every generated Reflection frame. Once a baseline is exported, the
local loop relies on the committed PNG receipt and `generated-frames.json`.

### 3. Create Or Update Contract `prep`

Each family that will generate Reflection-ready frames declares prep metadata in:

```text
packages/design-governance/reflection-families/<family>/reflection-contract.json
```

Each active case can include a `prep` object that declares:

- family id
- Figma file key
- source catalog frame ids or URLs
- one or more cases
- mode-specific output frame names
- selector strategy
- viewport size
- framing background, alignment, and padding

Legacy `frame-prep.json` files are still accepted for one migration window. Move
old prep manifests into contracts with:

```bash
pnpm governance:migrate-contracts -- --dry-run
pnpm governance:migrate-contracts -- --write
```

Example output frame names:

```text
reflection/radio/states-default/light
reflection/radio/states-default/dark
reflection/switch/states-default/light
reflection/switch/states-default/dark
```

The selector strategy is how the bridge knows what to clone from the catalog
frame:

| Strategy | Use When |
| --- | --- |
| `rowChild` | A named row contains one named component child. |
| `rowContent` | A named row contains multiple children that together form the test state. |
| `directNode` | The exact source node should be cloned directly. |

The output frame should be the contract surface, not the whole catalog row. It
should contain only the component state being tested, centered inside the exact
viewport.

### 4. Dry-Run Frame Preparation

Start the Figma reflection plugin in Figma Desktop:

```text
Plugins > Development > Marwes Reflection Frame Prep
```

The plugin lives at:

```text
packages/design-governance/figma-reflection-plugin/manifest.json
```

Run a connected dry-run:

```bash
pnpm governance:prepare -- --family radio --connect --dry-run --replace --accept-any-file
```

Useful batch command:

```bash
pnpm governance:prepare -- --family radio --family radio-group --family switch --family segmented-control --connect --dry-run --replace --accept-any-file --json
```

The connected dry-run proves:

- the bridge can reach the open Figma file
- source frame ids exist
- selectors find the intended source content
- planned generated frames have the expected names and sizes
- existing generated frames are `missing`, `upToDate`, `stale`, `wrongPage`, or
  blocked by `unmanagedConflict`

This dry-run does not write frames.

### 5. Write Generated Reflection Frames

When the dry-run looks correct:

```bash
pnpm governance:prepare -- --family radio --write --replace --accept-any-file
```

The bridge creates or replaces only plugin-managed frames. It does not delete
manual Figma content.

Generated frames are:

- top-level frames named `reflection/<family>/<case>/<mode>`
- fixed to the declared `viewportSize`
- placed near the source catalog page, safely offset from existing content
- filled with the declared background
- populated with cloned source content
- centered according to the declared framing
- written with plugin metadata such as family, case id, mode, source node id,
  viewport size, selector, request hash, and source fingerprint

The bridge returns the generated Figma frame ids. Those ids can be stored in the
active `reflection-contract.json`.

### 6. Export Generated Frames To Baseline PNGs

When the generated frames look right in Figma, export directly from those frame
ids:

```bash
pnpm governance:prepare -- --family radio --write --replace --accept-any-file --export-baselines
```

This uses the generated `reflection/*` frame ids and exports PNGs into:

```text
packages/design-governance/reflection-families/<family>/baselines/
```

The export writes both the PNG and its `.meta.json` receipt. The exported PNG
must match `viewportSize` exactly. A `390x220` contract must produce a
`390x220` PNG.

Older/manual local PNG ingestion still exists:

```bash
pnpm reflection:figma:compile -- --source /path/to/figma-export --target active --family badge --write
pnpm reflection:figma:receipts -- --family badge --dry-run
```

Active compile writes receipts too. The generated-frame export path is preferred
when the Figma bridge has created the baseline frames and returned concrete node
ids.

### 7. Do Not Force A Full Figma Fetch After Every Frame Generation

This is a key product rule.

After generated frames are created, a second full Figma REST fetch is not
required in the normal loop.

Why:

- The Figma bridge is already connected to the open file.
- It returns concrete generated frame ids.
- It stores plugin metadata on those frames.
- The export step uses those exact frame ids.
- The local raw Figma snapshot and variable map still validate the original
  catalog source nodes and variables.

The generated frame is a derivative artifact. Its provenance should come from
the bridge response and plugin metadata, not from forcing a whole-file REST
fetch every time.

Recommended policy:

| Mode | What It Does |
| --- | --- |
| Normal authoring | Refresh local Figma source at the start of a batch, generate frames through the bridge, export PNGs from returned generated frame ids, validate contracts. |
| Strict audit | Optionally run a full Figma fetch after a batch or before release to independently verify generated frame ids and metadata. |
| CI | Validate committed local artifacts, contracts, baselines, and portal renders. Do not depend on live Figma availability. |

Future product improvement:

```text
bridge response -> generated-frame-provenance.json -> cohesive-check
```

That would let cohesive checks validate generated frame provenance from a
committed metadata artifact without requiring another full Figma fetch.

### 8. Update The Active Reflection Contract

Each active family contract lives at:

```text
packages/design-governance/reflection-families/<family>/reflection-contract.json
```

Each case entry connects:

- `caseId`
- `mode`
- `figmaNodeId` for the generated baseline frame
- `figmaFrameName`
- `viewportSize`
- `framing`
- baseline PNG path
- portal route
- source component node id
- source bounds
- required bound tokens
- comparison threshold and tolerance reason

The important distinction:

```text
figmaNodeId = generated Reflection baseline frame
source.componentNodeId = original catalog/source node
```

They are intentionally different. The source node proves design/token intent.
The generated frame proves the exact screenshot surface.

### 9. Add Or Update Portal Runtime Cases

Reflection portal cases are generated from the contracts in:

```text
reflection.shared.ts
```

Each adapter mounts the component state for the portal route:

```text
tests/reflection/react-portal.tsx
tests/reflection/vue-portal.ts
tests/reflection/svelte-portal.ts
tests/reflection/svelte-portal-case.svelte
```

The portal route must match the contract:

```text
/reflection/radio/states-default/light
/reflection/radio/states-default/dark
```

The portal uses the contract `viewportSize` and `framing`. It should not
duplicate frame dimensions in adapter code.

### 10. Run Static Contract Checks

Run the family check:

```bash
pnpm governance:check -- --family radio
```

Run all active families:

```bash
pnpm governance:check
```

Static checks prove:

- target Figma file key matches
- local Figma raw source exists
- variable map exists
- source component node exists
- source bounds match
- required bound tokens are found
- baseline PNG exists
- baseline PNG size matches `viewportSize`
- comparison policy is explicit
- generated frame ids are present, or reported as provenance warnings when not
  in strict mode

Strict provenance mode:

```bash
pnpm governance:check -- --all --strict
```

Use strict mode once generated frame ids and provenance are complete for all
active families.

### 11. Run Reflection Portal Visual Checks

Environment check:

```bash
pnpm reflection:doctor
```

Visual comparison:

```bash
pnpm reflection:visual
```

Review output:

```bash
pnpm reflection:review
```

The combined local visual loop:

```bash
pnpm governance:visual
```

Adapter-specific commands are available when debugging:

```bash
pnpm reflection:visual:react
pnpm reflection:review:react
pnpm reflection:visual:vue
pnpm reflection:review:vue
pnpm reflection:visual:svelte
pnpm reflection:review:svelte
```

Reflection writes reports and artifacts under:

```text
.reflection/<adapter>/runs/<timestamp>/
```

The key visual artifacts are:

```text
expected.png
actual.png
diff.png
report.json
```

### 12. Classify Failures

The normal failure protocol:

1. Confirm `cohesive:check` passes for the family.
2. Open the Reflection report summary.
3. Inspect `expected.png`, `actual.png`, and `diff.png`.
4. Compare the failed area against the source node and bound variables.
5. Decide which layer is wrong.
6. Fix that layer only.

Failure classes:

| Failure Class | Evidence | Fix |
| --- | --- | --- |
| Source-node mismatch | Local raw Figma source does not match intended design. | Fix Figma or update contract after design approval. |
| Token mismatch | Source node is bound to one token, runtime uses another. | Fix Marwes variable mapping or preset CSS. |
| Baseline/export mismatch | PNG size or contents do not match contract. | Recreate/export the Figma baseline. |
| Framing/layout mismatch | Runtime frame size, alignment, padding, or stroke model differs. | Fix contract framing or runtime CSS layout. |
| Adapter fixture mismatch | One adapter renders the wrong state or props. | Fix `tests/reflection/*-portal*`. |
| Runtime implementation mismatch | All Figma sources agree, but runtime differs. | Fix component CSS/API implementation. |
| Acceptable render noise | Static sources agree; only text/glyph antialiasing remains. | Keep the smallest documented threshold. |

Do not use thresholds to hide structural mismatches. A tolerance is only valid
after source node, variables, baseline dimensions, and runtime framing agree.

### 13. Gate The Work

Before pushing design-governance or visual-contract work:

```bash
pnpm check:changed
pnpm governance:check
pnpm governance:visual
```

CI-style gate:

```bash
pnpm governance:ci
```

Strict CI gate after provenance is complete:

```bash
pnpm governance:ci:strict
```

CI should not promote baselines. It should only validate committed contracts,
committed Figma-exported baselines, receipt sidecars, and runtime renders.
`pnpm governance:ci` requires receipts. `pnpm governance:ci:strict` adds
generated Figma frame-id provenance on top.

Never use non-dry Reflection baseline update commands for this workflow. Figma
exports remain the source of visual truth.

## How The Current Product Loop Feels

The ideal developer/designer workflow should become:

1. Designer provides or selects catalog source frames.
2. Tool reads the source-frame registry.
3. Tool generates clean Reflection frames in Figma.
4. Designer reviews the generated frames visually.
5. Tool exports PNG baselines.
6. Tool updates or proposes contract metadata.
7. Runtime portal renders the same cases.
8. Report explains whether the mismatch is token, geometry, baseline, adapter,
   runtime, or render-noise related.
9. CI blocks silent drift.

The important user experience is confidence. The system should say:

```text
This failed because Figma says token X, runtime uses token Y.
```

or:

```text
This passed because source node, variables, baseline PNG, and portal render all
agree within the documented tolerance.
```

## Product Opportunities

### 1. Generated Frame Provenance Artifact

Today the bridge can create frames and return ids. A next product step is to
write a committed metadata artifact:

```text
packages/design-governance/reflection-families/<family>/generated-frames.json
```

It could contain:

- generated frame id
- frame name
- mode
- viewport size
- source node ids
- selector
- request hash
- source fingerprint
- bridge prep version
- generated timestamp
- destination page

Then `cohesive:check` can validate generated frame provenance without requiring
a second full Figma REST fetch.

### 2. Figma Plugin Panel For Frame Prep

The current bridge is script-first. A product UI inside Figma could show:

- source registry entries
- missing generated frames
- stale frames
- wrong-page frames
- output frame preview
- export readiness

The plugin could make the designer approval moment explicit.

### 3. Baseline Export Wizard

The export step can become a guided workflow:

```text
select batch -> generate frames -> review -> export PNGs -> validate dimensions
```

This should avoid manual PNG folder sorting for bridge-generated frames.

### 4. Report Classification UI

Reflection 0.0.6 already improved diagnostics. Marwes can turn those diagnostics
into a clearer triage view:

- color drift
- geometry drift
- text/glyph drift
- density
- bounding boxes
- likely cause
- links to source node, baseline PNG, actual PNG, diff PNG, and report JSON

### 5. Batch Planner

A product layer can propose component batches from:

- React component exports
- registry families
- Figma source-frame registry
- missing contracts
- missing portal routes
- missing baselines

This would make scaling from 10 cases to 200 cases manageable.

### 6. CI Modes

The product should keep two modes:

| Mode | Purpose |
| --- | --- |
| Authoring mode | Fast, local, allows provenance warnings while frames are being prepared. |
| Strict mode | Release/merge confidence, no unresolved generated frame ids or stale provenance. |

### 7. Future MCP Or External Product

The Figma bridge could eventually move out of Marwes into a reusable MCP/plugin
package. The reusable product should preserve the same model:

```text
source registry -> generated frames -> exported baselines -> runtime portal -> classified report
```

Marwes is the proof-of-concept implementation.

## Open Questions For Product Discussion

1. Should generated frame provenance be committed per family or centralized?
2. Should the Figma plugin own export, or should export stay in CLI for CI-like
   repeatability?
3. Should strict provenance require full Figma REST refetch, or is bridge-signed
   metadata enough?
4. How much tolerance should be globally allowed for font rendering, and should
   that policy differ by component category?
5. Should reports be optimized for humans first, or machine classification first?
6. How should designers approve generated frames before they become active
   baselines?
7. What is the smallest UI that makes batch creation understandable for
   20-50 components?

## Current Recommendation

Keep the normal Marwes loop local and deterministic:

```text
refresh local Figma source once per batch
-> generate frames through the Figma bridge
-> export PNG baselines from generated frame ids
-> update family contracts
-> render through Reflection portal
-> validate with cohesive static checks and Reflection visual checks
```

Do not add a mandatory full Figma REST fetch after every generated frame write.
Make that an optional strict audit, or replace it with committed bridge-generated
provenance metadata.

The source-of-truth model should remain:

```text
Figma source node + Figma variables + Figma baseline PNG
```

The runtime proof should remain:

```text
Reflection portal output for React, Vue, and Svelte
```

That separation is what makes the system durable.
