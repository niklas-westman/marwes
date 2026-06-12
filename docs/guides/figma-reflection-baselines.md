# Figma Reflection Baselines

Figma is the visual source of truth for strict Reflection component checks. The exported Figma PNG, the manifest entry, and the Reflection portal runtime screenshot must all describe the same fixed rectangle.

Do not create one wide universal frame. Use per-case frame dimensions declared in `packages/design-governance/reflection-families/<family>/reflection-contract.json`, then make Reflection capture the matching portal route at the exact same size.

## Figma Page Setup

Create a page named `Reflection Baselines`.

Organize it with one section or frame group per component family, for example `Button`. Each exported baseline must be a top-level Figma frame. Do not point the manifest at a raw component node, nested instance, row in a showcase, or documentation canvas.

Name each exported frame with this pattern:

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

Frame requirements:

- Fixed fill: start with `#ffffff` for light mode.
- Fixed dimensions matching the manifest `viewportSize`.
- Runtime framing in the manifest must match the frame: `background: "#ffffff"`, `align: "center"`, `padding: 0` for Button v1.
- Contains only the component state being tested.
- Component is centered on both axes.
- No labels, helper text, guide marks, docs copy, annotations, or surrounding showcase UI.
- No hidden visible artifacts, overlays, selection marks, or prototype leftovers.
- All frame dimensions, component positions, and child positions land on integer pixels.
- Export as PNG at `scale: 1`.

The Figma frame size must match Reflection runtime capture size exactly. If the exported PNG is `390x220`, the Reflection case must use `viewportSize: { "width": 390, "height": 220 }`.

## Frame Size Policy

Use a small set of explicit frame sizes instead of a single catch-all canvas.

Recommended starting sizes:

| Component shape | Size |
| --- | --- |
| Compact atoms such as Button, Badge, Spinner | `390x220` |
| Card or inline form examples | per-case, commonly `640x360` |
| Dialog, Date Picker, Toast group, or composite surfaces | per-case, large enough for the full state |

If a component needs multiple layouts, create multiple cases instead of resizing one baseline:

```text
button.basic
button.icon-only
button.loading
button.full-width
```

Each case gets its own top-level Figma frame, manifest entry, exported PNG, and Reflection portal route.

## Manifest Setup

The family contract is `packages/design-governance/reflection-families/<family>/reflection-contract.json`.

Each case entry must include:

- `caseId`: stable family-scoped case id, for example `button.basic`.
- `family`: component family, for example `button`.
- `mode`: visual mode, initially `light`.
- `figmaFileKey`: Figma file key from the Marwes source file.
- `figmaNodeId`: top-level `Reflection Baselines` frame node id in colon format, for example `1234:5678`.
- `exportScale`: always `1`.
- `viewport`: semantic Reflection viewport label, for example `button-default`.
- `viewportSize`: exact runtime screenshot size.
- `framing`: runtime canvas framing applied before screenshot capture.
- `baseline`: PNG path under the contract `baselineRoot`.
- `source.componentNodeId`: existing local Figma component/source node used for static node, geometry, and variable validation.
- `source.requiredBoundTokens`: tokens that must be bound to the source component node.
- `comparison.threshold`: visual tolerance for Reflection, normally exact or very small.
- `comparison.toleranceReason`: required explanation for every non-zero visual tolerance.

To get the Figma node id, copy the frame URL in Figma and convert the `node-id` value from hyphen format to colon format:

```text
node-id=1234-5678 -> 1234:5678
```

Do not use the existing Button showcase/component node ids as strict baseline ids. They are useful design references, but strict baseline exports must point at the new top-level frames on the `Reflection Baselines` page.

## Export Workflow

After creating or updating the Figma frames:

```bash
node scripts/reflection/export-figma-baselines.mjs --family button --dry-run
node scripts/reflection/export-figma-baselines.mjs --family button
```

The export script calls `figma-node-fetch images marwes --node-id <ids> --scale 1`, writes PNGs under the contract `baselineRoot`, and fails if an exported PNG dimension differs from the contract `viewportSize`.

After the PNGs are exported:

```bash
pnpm reflection:doctor
pnpm reflection:visual
pnpm reflection:review
pnpm cohesive:check -- --family button
pnpm check:changed
```

Do not use `reflection update` for these Figma truth baselines. The baseline PNGs come from Figma exports, not from runtime evidence screenshots.

## Current Button V1 Cases

The initial strict rollout tracks these light-mode Button cases:

- `button.basic`
- `button.secondary`
- `button.text`
- `button.destructive`

React, Vue, and Svelte each render their adapter-specific Reflection portal entry, but all three compare against the same exported Figma PNG for the case.
