# Add New Reflection Component

This guide describes the durable Marwes Reflection contract flow for adding a component family to visual baseline validation.

```text
                 Figma source node
                       |
                       v
Figma variables -> reflection contract -> Figma baseline PNG
                       |
                       v
              Reflection portal visual run
```

Figma remains the visual source of truth. Runtime screenshots are evidence, not baseline sources.

## The Required Triangle

Every Reflection family is validated through three sources in parallel:

1. **Figma source node**: the real component/source instance in the local Figma
   dump. This gives dimensions, layout, text styles, fills, strokes, effects,
   and the bound-variable map.
2. **Figma variables**: `.figma/marwes/tokens/variables.json` plus the source
   node `boundVariables`. This proves that Figma is using the expected token
   names and that Marwes maps those tokens to runtime CSS variables.
3. **Figma baseline PNG plus receipt and Reflection runtime output**: the
   exported `reflection/<family>/<case>/<mode>` PNG, its `.meta.json` receipt,
   and the portal render at the same `viewportSize`.

Do not treat the baseline PNG diff as the whole truth. A failed visual case must
be investigated by checking all three sides first:

- If the source node and variables agree but the runtime differs, fix Marwes CSS
  or the adapter portal fixture.
- If the source node uses the wrong or missing variable, fix Figma or update the
  contract only after the design intent is clear.
- If the baseline PNG does not match the source node or viewport contract,
  re-export or recompile the Figma baseline and update its receipt.
- If all three agree and only text rasterization differs, keep the narrowest
  documented tolerance in `comparison.toleranceReason`.

Command lookup:

```text
docs/reference/design-governance-command-lexicon.md
```

Full product-level walkthrough:

```text
REFLECTION_DESIGN_GOVERNANCE_FLOW.md
```

## Layer 1: Figma Source

Preferred path: generate top-level Reflection frames from existing catalog
frames through the Marwes Figma Reflection Frame Prep plugin.

Start by adding or confirming the catalog frame links in:

```text
packages/design-governance/reflection-families/source-frame-registry.json
```

Then create or update:

```text
packages/design-governance/reflection-families/<family>/frame-prep.json
```

Frame naming:

```text
reflection/<family>/<case>/<mode>
```

Examples:

```text
reflection/button/basic/light
reflection/button/secondary/light
reflection/button/text/light
reflection/button/destructive/light
```

Run the Figma plugin from:

```text
packages/design-governance/figma-reflection-plugin/manifest.json
```

Dry-run:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --connect --dry-run --replace --accept-any-file
```

Write generated frames:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file
```

Each generated or manual frame must:

- Be a top-level frame, not a raw component node or nested instance.
- Have a fixed fill, initially `#ffffff` for light mode.
- Have fixed integer dimensions.
- Contain only the component state being tested.
- Center the component on both axes unless the case explicitly tests another alignment.
- Avoid labels, docs text, guide marks, annotations, visible hidden artifacts, or showcase UI.
- Export as PNG at `scale: 1`.

The frame size must match the contract `viewportSize` exactly.

Manual `Reflection Baselines` page setup is still valid, but generated
source-page frames are preferred when the source content already exists in the
catalog.

## Layer 2: Local Figma Artifacts

Marwes reads local Figma artifacts from the target declared in:

```text
.pi/figma-sync.json
```

The current Marwes target writes to:

```text
.figma/marwes
```

The two key files for validation are:

```text
.figma/marwes/_raw/<fileKey>_full.json
.figma/marwes/tokens/variables.json
```

Do not run a remote sync casually. Use cached/local artifacts unless an explicit Figma refresh is intended.

Do not run a full remote Figma sync after every generated baseline frame write.
The frame-prep bridge is already connected to Figma, returns the generated frame
ids, and stores plugin metadata. Refresh local raw Figma artifacts at the start
of a batch; reserve post-generation remote fetches for intentional strict audit.

Before changing runtime CSS for a Reflection failure, inspect the source node
facts from the local raw dump or family component JSON. Capture the values that
matter for the failed diff: bounds, text style, stroke behavior, fill/effect
values, and any `boundVariables` entries. Those values should explain the CSS
patch.

## Layer 3: Reflection Family Contract

Each family lives under `@marwes-ui/design-governance`:

```text
packages/design-governance/reflection-families/<family>/
  reflection-contract.json
  baselines/
    <case>.chromium-linux.<mode>.png
    <case>.chromium-linux.<mode>.meta.json
```

The contract owns:

- The Figma file key.
- The top-level Reflection baseline frame id.
- The existing local source component node id.
- The baseline PNG path.
- The portal route.
- The viewport size and framing.
- Required Figma-bound variables.
- Expected source-node component bounds.
- The visual comparison threshold and its reason.
- The receipt sidecar that binds PNG hash, source node, source frame, variables,
  viewport, and framing into one local proof.

The `figmaNodeId` field points to the generated top-level Reflection baseline
frame and is optional strict provenance. The `source.componentNodeId` field
points to the real component source node in the local Figma dump. The receipt
sidecar is the durable local proof used by normal CI.

## Layer 4: Cohesive Static Check

Run:

```bash
pnpm cohesive:check -- --family button
```

This checks:

- `.pi/figma-sync.json` target file key matches the contract.
- `.figma/marwes/tokens/variables.json` exists.
- `.figma/marwes/_raw/<fileKey>_full.json` exists.
- Each source component node exists in the raw Figma dump.
- Each source component node bounds match `source.componentBounds`.
- Each required token is bound to the source component node.
- Each component JSON file exists and contains the source node.
- Each baseline PNG exists.
- Each baseline PNG dimensions match `viewportSize`.
- Each baseline PNG receipt exists and still matches the PNG hash, source node,
  required variables, viewport, and framing.
- Each comparison threshold has an explicit reason.

This check is the static triangle gate. It is not optional before interpreting a
Reflection visual diff, because it proves the node, variables, and baseline
contract still refer to the same design source.

Receipt warnings can be made blocking without requiring Figma:

```bash
pnpm cohesive:check -- --all --require-baseline-receipts
```

Generated frame ids can still be audited separately. By default missing or stale
generated frame provenance is a warning so local development can proceed from
the committed PNGs and receipts. For strict provenance, run:

```bash
pnpm cohesive:check -- --family button --require-figma-frames
```

That mode fails until every `figmaNodeId` is a real top-level frame id whose bounds match `viewportSize`.

## Layer 5: Figma Baseline PNG Compiler

For generated source-page frames, export PNG baselines directly from generated
frame ids:

```bash
pnpm reflection:figma:prepare-frames -- --family <family> --write --replace --accept-any-file --export-baselines
```

This writes both PNG baselines and `.meta.json` receipts.

For manual baseline ingestion, export PNGs from Figma into the normal light/dark
export folders, then compile them locally into the Reflection family layout:

```bash
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3
pnpm reflection:figma:compile -- --source /path/to/component-reflection-experiment/v3 --target active --family badge --write
pnpm reflection:figma:receipts -- --family badge --dry-run
```

The compiler reads:

```text
packages/design-governance/reflection-families/pending-figma-frame-renames.json
```

It maps duplicated Figma export names by their discovered grid order, verifies
each PNG dimension against `viewportSize`, and writes files as:

```text
packages/design-governance/reflection-families/<family>/baselines/<case>.chromium-linux.<mode>.png
```

Use the default `--target incoming` while sorting a new batch. Use
`--target active` only when the family contract and portal route are ready.
Active writes also write receipt sidecars. To backfill or audit existing
committed baselines without Figma, run:

```bash
pnpm reflection:figma:receipts -- --all --dry-run
pnpm reflection:figma:receipts -- --all --write
```

## Layer 6: Strict Figma Baseline Export

After the top-level Figma frames are in place and the contract has real frame node ids:

```bash
pnpm reflection:figma:export -- --family button --dry-run
pnpm reflection:figma:export -- --family button
```

The export script reads:

```text
packages/design-governance/reflection-families/<family>/reflection-contract.json
```

It writes PNGs and receipts to the family `baselines/` directory and refuses
exports whose PNG dimensions do not match `viewportSize`.

This strict path is provenance hardening. It is useful once Figma frame names and
frame ids are clean, but it is not required for day-to-day local PNG ingestion.

## Layer 7: Reflection Portal

Reflection runtime cases are generated from the same family contracts in:

```text
reflection.shared.ts
```

Each adapter has only a mount entry:

```text
tests/reflection/react-portal.tsx
tests/reflection/vue-portal.ts
tests/reflection/svelte-portal.ts
```

The portal route must match the contract `portalPath`.

Run:

```bash
pnpm cohesive:visual
```

This executes:

```bash
pnpm reflection:doctor
pnpm reflection:visual
pnpm reflection:review
```

When visual output fails, classify the failure with the triangle before patching:

- **Geometry/stroke/layout**: source node dimensions or stroke behavior differs
  from runtime. Example: Figma inside stroke versus CSS border changing browser
  layout size.
- **Token/color drift**: source node is bound to a variable but runtime uses a
  different CSS variable or fallback.
- **Typography drift**: source node text styles differ from runtime font size,
  weight, line height, letter spacing, or smoothing behavior.
- **Baseline/export drift**: PNG dimensions or frame contents do not match the
  contract source.
- **Adapter fixture drift**: React, Vue, or Svelte portal code is not rendering
  the same component API shape.
- **Font rendering noise**: source node, variables, and geometry agree, but
  Chromium and Figma rasterize text differently.

## Threshold Policy

Use exact static checks for:

- Source-node existence.
- Source-node dimensions.
- Baseline PNG dimensions.
- Viewport size.
- Figma-bound variables.
- Runtime token availability.

Use tiny visual thresholds only for known rasterization differences between Figma PNG export and Chromium text rendering. Every non-zero threshold must include `comparison.toleranceReason`.

Do not use tolerance to hide:

- Wrong component size.
- Wrong frame size.
- Wrong token mapping.
- Wrong color.
- Missing source node.
- Missing baseline provenance.

## Adding The Next Family

1. Create or identify the Figma frames on `Reflection Baselines`.
2. Export or sync the local Figma artifacts if needed.
3. Add `packages/design-governance/reflection-families/<family>/reflection-contract.json`.
4. Compile the Figma-exported PNGs into that family `baselines/` directory.
5. Add adapter portal cases for React, Vue, and Svelte.
6. Run `pnpm cohesive:check -- --family <family>`.
7. Run `pnpm cohesive:visual`.
8. Run `pnpm check:changed`.
