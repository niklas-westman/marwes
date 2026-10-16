# Refresh typography diagnosis — 2026-10-15

**Finding:** much of the remaining Refresh discrepancy follows Chromium's native
text-rendering path versus outlined-vector rendering. No tested font or CSS change
provides a source-backed correction. Keep the current font, HTML label and visual
failure. This investigation does not approve a threshold change or certify Button.

## Controlled comparison

The same staged Figma WebP reference, viewport, device scale, established
`maxDiffPixels: 60` / `maxDiffPixelRatio: 0.0008`, colors and Button layout were
used throughout. No reference or runtime implementation was changed.

| Diagnostic rendering | Light differing pixels | Dark differing pixels | Result |
| --- | --- | --- | --- |
| Actual HTML label / current component | 86 | 98 | Failed |
| Captured Figma label outlines at source-derived coordinates | 16 | 21 | Diagnostic passes |
| Complete Figma reference-frame SVG rendered in Chromium | 15 | 20 | Diagnostic passes |

The actual-label and source-outlined-label comparison was rerun independently
through React, Vue and Svelte in both themes; all three adapters produced the
same 86/98 and 16/21 totals. This confirms the tested discrepancy is shared across
adapters, not an adapter-specific label implementation difference.

The outlined-label and full-frame SVG experiments diagnose the rendering paths;
they are **not implementation proof** and do not replace the required screenshot
of the real HTML component. Production labels remain selectable, accessible HTML.
The full-frame SVGs come from the exact generated reference-frame node IDs
`6020:16049` / `6020:16091`, rather than an approximate reconstruction.

SVG path positions used floating-point SVG transforms derived from captured
render bounds. An initial CSS-positioned probe rounded offsets to CSS layout's
1/64px grid and produced 68/72 differing pixels; correcting the diagnostic to
preserve the source coordinates produced 16/21. This adjustment was confined to
the diagnostic SVG overlay, not applied as a component CSS offset.

The actual HTML label box is `(179,102,48,16)` in both modes. Its measured baseline
is y115. Corresponding Figma contour coordinates imply approximately y115.00003.
That source baseline is an inference from matching contour coordinates, not a
direct Figma baseline property. It supplies no justification for a caption shift.

## Font geometry and shaping

The source identifies Instrument Sans Medium, weight500, width-axis100, size14px,
line height16px and tracking−3% (−0.42px). The local font has the matching
`InstrumentSans-Medium` PostScript name. Neither naming compatibility nor these
experiments establish exact authoring-font binary identity.

Independent FontTools analysis rendered the seven source and local glyph
silhouettes at 64× magnification. After independently aligning each glyph to its
source-derived origin, total absolute alpha-area difference was 0.2401px² over
180.0612px² of ink, approximately **0.1333%**. This demonstrates close similarity
of these tested shapes **after alignment**; it does not prove full-string shaping,
kerning, every codepoint or font-file identity. Predicted local shaping places the
last glyph origin within approximately 0.0229px of the exported source origin.

The font contains no embedded TrueType glyph instructions, `fpgm`, `prep` or
`cvt ` table. This does not rule out automatic fitting or quantization inside the
browser rasterizer. There is no hidden set of font hints to remove as a fix.

## Rejected diagnostic changes

| Probe | Light / Dark differing pixels | Conclusion |
| --- | --- | --- |
| Current WOFF2 | 86 / 98 | Existing failure retained |
| WOFF with identical outline source | 87 / 99 | No improvement |
| Temporary WOFF `gasp` flags10 | 87 / 99 | No improvement |
| Temporary WOFF `gasp` flags2 | 87 / 99 | No improvement |
| WebKit antialiased or subpixel smoothing | 86 / 98 | No improvement |
| Explicit normal kerning, normal features, synthesis disabled | 86 / 98 | No improvement |
| Text rendering auto, optimizeLegibility or optimizeSpeed | 118 / 134 | Worse |
| Kerning disabled | 205 / 278 | Worse and contrary to source shaping |
| Compositor hints / identity transform | About 86 / 98 | No useful improvement |

Temporary `gasp` probes changed only that table and the required head checksum;
outlines, advances, metrics, kerning, names and mappings were byte-identical. They
remain ignored diagnostic files and are not proposed production font assets.

## Provenance, limitations and next action

Outlined-source captures are live observations from the independently checked
Marwes file `nybMu3iJUnnOvWtuxjMG8b`, with caller-attested identity because the
plugin reports a null file key. They are not immutable October14 version exports.
Comparing them with the retained staged references is diagnostic evidence, not
permission to replace pinned truth. Browser/platform conclusions remain limited
to the actual Chromium environment and tested selections.

Local evidence:

- `.reflection/font-outline-analysis/result.json`, `geometry.json` and
  `gasp-probes.json`: shape/position analysis and font-table controls.
- `.reflection/upgrade-0.4.0/refresh-outline-probe-exact-{react,vue,svelte}.json`:
  actual label versus source-outline diagnostic.
- `.reflection/upgrade-0.4.0/refresh-frame-svg-probe.json`: complete source frames.
- `.reflection/upgrade-0.4.0/refresh-font-rendering-probe.json` and
  `refresh-font-assets-probe.json`: rejected CSS/font candidates.
- `.reflection/figma-source-svg/1792094238073-cb330f4f-3820-4c0b-a080-36b9e5c68173/`:
  generated reference-frame SVGs and provenance.

Independent review found no justified runtime font/CSS substitution. The existing
visual gate remains failed, and family coverage/approval requirements are intact.

Recommended Reflection follow-up: expose native screenshot differences alongside
independent outlined-source diagnostics as separate evidence. A future text proof
must compare complete shaping in a common coordinate system and detect wrong
size, weight, tracking, baseline, missing glyphs and fallback fonts; the manually
aligned diagnostic here is insufficient as an acceptance gate. Any change to
which proof establishes compliance requires an explicit revision of the current
approved completion rules. Do not silently waive PNG failures or substitute source
outlines into runtime components.
