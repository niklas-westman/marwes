# Refresh geometry checkpoint — 2026-10-15

Refresh now uses the pinned canonical outline at resolved stroke width 2. Other
requested widths, including the public default width 3, retain configurable
stroked rendering. Numeric `2` and token `sm` select the same canonical geometry.
Source: Figma file `nybMu3iJUnnOvWtuxjMG8b`, master `1382:9310`, Union
`1382:9311`. The 12px source path and transform scale into the existing 24px icon
viewport without changing size, accessibility or public props.

The canonical fill and existing strokes share the preset's color selection via
`--mw-icon-color`, preserving currentColor, primary, secondary and muted behavior.
A defect control reproduces the initial filled-path color regression. Independent
review found no remaining implementation blocker. Complete visual parity is
still failed; no threshold changed and no reference was promoted.

## Validation

- Core icon tests: 16 passed; full core suite before the subsequent color-only
  adjustment: 768 passed. Preset suite after the adjustment: 130 passed.
- Actual purpose-wrapper tests: 27 per adapter passed.
- Focused Chromium tests: six independent source-geometry tests and three
  actual-adapter color tests passed. Colors cover both themes and all four
  public classes, with a negative control for the original defect.
- Core test typecheck, governance typecheck, focused Button static/runtime
  validation and Reflection doctor passed.
- Final diagnostic: 12 affected selections per adapter, including two genuine
  Pressed structural/behavior selections. All 36 structural and 36 behavior
  checks passed. Supported visuals: two passed and eight failed per adapter.
  Pressed visuals remain unsupported, without substitute screenshots.

Full Button inventory remains 231 required item/mode obligations. This selected
diagnostic is **not a family report**, coverage improvement or owner acceptance.
The inspector retains the historical full run as stale.

| Final diagnostic identity | Value |
| --- | --- |
| Stage | `9b67e4b4-c484-4caf-9808-d195742e8d9c` |
| Stage SHA-256 | `3f53dc583785e68d84f1662109f45fceae37bb397e91f0e9a27d79cc4583ee56` |
| Input fingerprint | `1c12b86c7c29a394e6ff7e3aaf3b120bd626ff4d695d5218b5b99483ebe9f346` |
| Local artifacts | `.reflection/upgrade-0.4.0/refresh-diagnostic-1792089569617/` |
| Local results | `.reflection/upgrade-0.4.0/refresh-diagnostic-results.json` |

The stage reuses the same 185 source-backed WebP references and receipts; its
input binding includes the approved focus implementation. This is not fresh
full-family verification or promoted active-reference evidence.

## Remaining visual difference

Complete Refresh results are identical across React, Vue and Svelte:

| Mode | Before: icon / label differing pixels | After: icon / label differing pixels | After total |
| --- | --- | --- | --- |
| Light | 10 / 85 | 1 / 85 | 86 |
| Dark | 9 / 97 | 1 / 97 | 98 |

Counts use Reflection's produced diff images, decoded by its production decoder,
split by independently measured icon/label boxes. No differing pixels are outside
those boxes for these selections. The isolated canonical glyph test has zero
alpha error against the independent Figma outline; the one remaining icon pixel
in the complete capture does not establish an incorrect path.

Source label nodes `I3978:38909;3873:42870` and `I3978:39216;3873:42870`
specify Instrument Sans / `InstrumentSans-Medium`, Medium, weight500, size14px,
tracking−0.42px and line height16px, with no character overrides. The local static
font has the same PostScript name and reports version `1.000;gftools[0.9.28]`.
Figma JSON records no font version or binary checksum. No alternative Instrument
Sans asset was identified in the inspected local font directories or Figma
font-cache inventory. Matching names do not establish binary or raster identity.

Next source investigation: obtain Figma-outlined text exports or independently
identified authoring-font bytes, then compare glyph outlines before choosing a
runtime correction. Do not substitute guessed fonts, caption shifts, weight
adjustments or threshold changes. Established thresholds still fail these complete
Refresh selections.

Existing Frame Prep protocol cannot supply outlined text: it supports file info,
frame preparation, registry inspection and PNG frame export only. Its export call
hardcodes PNG and returns `pngBase64`; it has no SVG, `svgOutlineText`, general
execution or export-settings passthrough. Independent text-outline capture needs
a narrowly scoped plugin capability and reload, or another authorized source
export path. The current PNG exporter cannot silently provide that evidence.

Subsequent implementation: Niklas requested that capability in **Marwes Figma
Bridge**. The new read-only `EXPORT_SOURCE_SVG` command and capture CLI are
implemented and verified live against both Refresh label nodes. See the
[outlined-source export guide](../guides/figma-outlined-source-export.md).
The final capture is
`.reflection/figma-source-svg/1792093814030-27ca1690-22b7-496e-baca-275525c01ce8/`.
Both 5,511-byte SVGs contain outlined paths and no text elements. Governance
unit tests (235), typecheck, transport/legacy CLI smoke checks and independent
review passed. Glyph/font comparison remains next; these new live diagnostic
sources do not themselves pass or promote the existing visual comparisons.
