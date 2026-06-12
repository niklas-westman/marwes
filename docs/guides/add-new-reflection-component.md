# Add New Reflection Component

This guide describes the durable Marwes Reflection contract flow for adding a component family to visual baseline validation.

```text
Figma file
  -> .pi sync target
  -> .figma raw nodes + variables
  -> design-governance reflection family contract
  -> cohesive:check
  -> Reflection portal visual run
```

Figma remains the visual source of truth. Runtime screenshots are evidence, not baseline sources.

## Layer 1: Figma Source

Create top-level export frames on the Figma page named `Reflection Baselines`.

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

Each frame must:

- Be a top-level frame, not a raw component node or nested instance.
- Have a fixed fill, initially `#ffffff` for light mode.
- Have fixed integer dimensions.
- Contain only the component state being tested.
- Center the component on both axes unless the case explicitly tests another alignment.
- Avoid labels, docs text, guide marks, annotations, visible hidden artifacts, or showcase UI.
- Export as PNG at `scale: 1`.

The frame size must match the contract `viewportSize` exactly.

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

## Layer 3: Reflection Family Contract

Each family lives under `@marwes-ui/design-governance`:

```text
packages/design-governance/reflection-families/<family>/
  reflection-contract.json
  baselines/
    <case>.chromium-linux.<mode>.png
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

The `figmaNodeId` field points to the top-level `Reflection Baselines` frame. The `source.componentNodeId` field points to the real component source node in the local Figma dump. These are intentionally separate.

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
- Each comparison threshold has an explicit reason.

Current Button contracts still use TODO top-level baseline frame ids until the real `Reflection Baselines` frame node ids are copied from Figma. By default this is a warning so local development can proceed from the imported PNGs. For strict provenance, run:

```bash
pnpm cohesive:check -- --family button --require-figma-frames
```

That mode fails until every `figmaNodeId` is a real top-level frame id whose bounds match `viewportSize`.

## Layer 5: Figma Baseline Export

After the top-level Figma frames are in place and the contract has real frame node ids:

```bash
pnpm reflection:figma:export -- --family button --dry-run
pnpm reflection:figma:export -- --family button
```

The export script reads:

```text
packages/design-governance/reflection-families/<family>/reflection-contract.json
```

It writes PNGs to the family `baselines/` directory and refuses exports whose PNG dimensions do not match `viewportSize`.

## Layer 6: Reflection Portal

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

1. Create the Figma frames on `Reflection Baselines`.
2. Export or sync the local Figma artifacts if needed.
3. Add `packages/design-governance/reflection-families/<family>/reflection-contract.json`.
4. Add the Figma-exported PNGs under that family `baselines/` directory.
5. Add adapter portal cases for React, Vue, and Svelte.
6. Run `pnpm cohesive:check -- --family <family>`.
7. Run `pnpm cohesive:visual`.
8. Run `pnpm check:changed`.
