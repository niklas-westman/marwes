# Reflection text diagnostics in Marwes

Marwes pins the published `reflection-check@0.5.1` exactly. Its optional text
records explain typography/geometry and native-text/vector-rendering differences.
They do not change screenshot thresholds, results, exit codes, family inventories,
owner review or reference promotion. Keep the actual HTML text in the component.

The external interactive Reflection UI and held Pressed capture remain separate
workstreams. Continue using `figma-governance-one`; Reflection's new HTML report
panel does not complete the interactive UI integration gate.

## Prepare independent inputs

Use [Marwes Figma Bridge](figma-outlined-source-export.md) to capture the exact
reference frame and, optionally, its text outlines. Existing verified captures
can be reused; another Figma download is not required. Export actual characters
and source typography, not expectations derived from the runtime under test.

Create an explicit JSON plan with schema `marwes.reflection-text-plan/v1`:

```json
{
  "schema": "marwes.reflection-text-plan/v1",
  "expectedFile": {
    "key": "nybMu3iJUnnOvWtuxjMG8b",
    "name": "Marwes governance — 2026-10-14"
  },
  "selections": [{
    "caseId": "button.purpose-refresh",
    "mode": "light",
    "frame": { "capturePath": "frame/capture.json", "nodeId": "6020:16049" },
    "reference": {
      "path": "staged/purpose-refresh.chromium-linux.light.webp",
      "sha256": "REPLACE_WITH_EXACT_REFERENCE_SHA256",
      "bytes": 1234,
      "mediaType": "image/webp",
      "nodeId": "6020:16049"
    },
    "parts": [{
      "id": "refresh-label",
      "nodeId": "I6020:16051;3873:42870",
      "selector": ".mw-btn__label",
      "outline": {
        "capturePath": "label/capture.json",
        "nodeId": "I3978:38909;3873:42870"
      }
    }]
  }]
}
```

The example needs real paths, byte length and hash before use. Paths resolve
relative to the plan; absolute explicit input paths are also supported. Choose
the reference from the intended active/staged scope and verify its receipt and
frame identity first. Supplying a hash fixes bytes; it does not establish Figma
provenance or approval on its own. The converter requires the reference node ID
to equal the selected frame ID. Add a separate selection for dark mode with its
own frame, reference and matching text/outline nodes.

Selectors live in configuration; they must each match exactly one runtime node.
The converter gets provider-neutral source facts only. The source layer named
`Cancel` contains `Refresh`; actual characters supply `expectedText`.

```bash
pnpm reflection:text:prepare -- --plan /absolute/path/to/plan.json
```

This creates a fresh ignored `.reflection/text-diagnostics/<id>/` directory:

- One self-contained `reflection.text-source/v1` bundle per selection/adapter.
- Original reference and SVG bytes, original captures and a conversion receipt.
- Three isolated configs, for React, Vue and Svelte, selecting only the requested
  enrolled visual cases. They retain native thresholds, framing and browser state.
- `preparation.json` with exact case/config identities and the plan hash.

The preparation does not run checks or edit active contracts/references. A failed
preparation has no completed manifest; do not use partial output. An existing
output is never reused. Run configurations use a stable loopback port selected
at preparation; if it becomes occupied, prepare again instead of replacing the
listener. Preparations are local operational files, not portable committed configs.

## Validate and inspect

Use the printed paths:

```bash
pnpm exec reflection doctor --config <generated-config.ts>
pnpm exec reflection run --config <generated-config.ts> --mode visual \
  --report-dir <fresh-report-directory> --workers 1
pnpm exec reflection review --report-dir <report-directory> --json
```

Do this for all three adapters. Preserve nonzero exit codes: a useful diagnostic
can accompany a failed native screenshot. Read the exact run's `report.html`,
`report.json` and `visual/<case>/text-diagnostics/record.json`.

Check the record's state, reasons, actual text, font observations, raw geometry
and typography deltas, source scope, inference limitations and binding key.
Inspect native reference/actual/diff first; source outlines and experimental
renders are separate diagnostic artifacts. A different run/adapter/theme/stage
cannot supply missing evidence. A missing latest record means no diagnostic
proof for that case. The proposed Marwes provider does not yet project these
records into the existing inspector.

The source bundle remains `live-diagnostic`, `sourceVersion: null`. The captured
reported key stays null beside the caller's independently verified attestation.
No baseline is invented from runtime observations; the current converter sets
unknown source baseline/transform and authoring-font checksum to null. It omits
unknown direction and PostScript name. Therefore stronger font/shaping claims
are unavailable. Reflection 0.5.1 has no full-string shaping proof and supports
these component diagnostics only at device scale 1.

Reflection 0.5.1 recognizes source-declared style-qualified font names. For
Refresh, `Instrument Sans` + `Medium` maps to Chromium's internal `Instrument Sans
Medium` name. Keep the classification and raw evidence visible; this is not
font-binary equivalence. See the verified patch results.

## Conversion boundaries

The converter validates capture identities, hashes/bytes, PNG or lossless-WebP
pixels through Reflection's production decoder, exact frame dimensions and
translation-only source transforms. It preserves fractional frame-relative boxes
and places label SVGs using their source render-bound offset and intrinsic SVG
extent without rescaling. It rejects conflicting text/styles/paint/modes, mixed
styles, scaled/rotated source transforms, unsafe paths, symlinks and existing
destinations. Reflection doctor performs the final strict bundle/SVG validation;
conversion success alone does not make an artifact usable or compliant.

The reusable implementation is
`packages/design-governance/src/tooling/figma-text-source-bundle.mjs`; the
preparation command is `prepare-text-diagnostics.mjs` in the same directory.
Generated images, reports and source captures remain local/CI artifacts. Commit
compact licensed inputs only when intentionally enrolled; approval and exact-stage
promotion still follow [the governance guide](figma-governance-one.md).
