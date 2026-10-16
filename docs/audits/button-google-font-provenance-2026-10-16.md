# Google Fonts provenance control — 2026-10-16

**Result: current official Google Fonts Instrument Sans500 does not change any
of the19 tested native screenshots, on either Darwinarm64 or Linuxarm64.**
No production font replacement or Google Fonts loader change is justified.

Niklas confirms the Figma family comes from
[Google Fonts Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans?preview.script=Latn).
This establishes the provider, not the exact authoring binary/version or which
font-service transformation produced the pinned Figma glyphs.

## Marwes integration

`packages/core/src/theme/font-loader.ts` deliberately classifies Instrument Sans
as bundled and skips its automatic Google Fonts network loader, including when
listed in googleFamilies. Presets import400/500/600/700 from @fontsource.
React/Vue/Svelte providers share that decision. This is deliberate offline font
loading, not evidence that Marwes uses a different typeface.

## Official source inspection

Fetched2026-10-16T17:04:46Z using explicit modern-Chromium and generic user agents.
Exact responses/headers/request URLs/file hashes are in `fetch-manifest.json`.

- [Google CSS2, static500](https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500&display=swap).
- [Google CSS2, weight range](https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&display=swap).
- [Google CSS2, both axes](https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&display=swap).
- [Official Google Fonts variable source](https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentsans/InstrumentSans%5Bwdth%2Cwght%5D.ttf).
- [Google CSS2 API documentation](https://developers.google.com/fonts/docs/css2).

Current static500Latin WOFF2 served from fonts.gstatic.com/s/instrumentsans/v4:
`c9a822fb921b4c65846539eba1bc191c9a75336b8961a113e3c55ff09fc8015b`.
Bundled @fontsource5.2.8Latin500 WOFF2:
`9d3547da16d950d12a677c772a3ff9b69846e60e7dcd1b5efd540993f7286532`.
Both identify InstrumentSans-Medium,Version1.000;gftools[0.9.28].

All decomposed outlines and whole-string HarfBuzz positions agree exactly for
Confirm,Please wait,Refresh,Filter,Success at14px/−.42tracking/explicitliga1.
GPOS/GSUB/GDEF,metrics,name,cmap and other relevant static tables match. The Google
modern500file removes a prep scan-control table present in the actual bundled
WOFF2; neither has per-glyph hint instructions. This was a genuine different
provider binary worth testing, rather than assuming semantic identity from names.

The previously examined WOFF lacks prep; its table findings must not be applied
to the actual WOFF2 without qualification. Font tables and shaping were decoded
independently here; `font-tables.json`, `semantic-preflight.json`, `shaping.json`.

Current official full variable TTF is exactly
`b24f1812584816958afcf22e22d08e44318c5e51651e25d2438efdde389b33b1`, identical to the
previously tested artifact. It was not redundantly retested natively. Current
served variable subsets retain the same tested glyph outlines/positions as that
file atwdth100/wght500. All version names remain1.000; provider confirmation does
not supply a newer authoring binary.

## Native controls

Published Reflection0.6.0/Playwright1.60.0, real React HTML fixtures, exact existing
Figma WebP references, unchanged thresholds, interaction and stabilization policies.
The candidate is loaded under an isolated FontFace alias and inherited by the
label. No SVG replacement, geometry fitting, offsets or raster normalization.

| Profile | Candidate cases | Passed / failed | Actual image hashes unchanged |
| --- | ---: | ---: | ---: |
| Darwinarm64 |19|4/15|19/19 |
| Linuxarm64, existing Playwright1.60.0Noble image |19|2/17|19/19 |

Each phase includes all15 remaining Darwin failures plus Primary and recovered
Success-default light/dark controls. All19 reference hashes, capture-policy hashes,
thresholds and measured control/label geometry remain unchanged per profile.
The candidate's native actual PNG bytes are identical to the prior bundled-font
captures for all38 pairs. There are zero recoveries, regressions or pixel changes.
Linux retains two additional Confirm failures compared with Darwin. It does not
establish ubuntu-latestAMD64 CI parity or Vue/Svelte Linux outcomes.

Darwin concurrent CDP inspection against the exact same native portal confirms
custom InstrumentSans-Medium,six Confirm glyphs and anHTTP200 font body matching
candidate SHA c9a822... . It is a separate font inspection, not an in-capture engine
hook. Native font provenance records loaded face/hash/URL/geometry for every case
on both profiles. See `google500-cdp.json`, `google500-native-results.json`,
`google500-native-integrity.json`, `google500-linux-results.json` and native reports.

## Conclusion and cleanup

The provider clarification narrows provenance and independently confirms the
bundled current static typeface behaves like the currently served Google static
font for the tested strings. It does not resolve the remaining native text
rasterization discrepancies or identify Figma's exact authoring bytes. Keep those
failures visible; no reference, threshold, acceptance rule or canonical input
was changed. No new Reflection API is requested by this investigation.

All writes stay in this ignored directory. Linux reused existing isolated
Linux dependencies read-only; hostnode_modules and Docker settings were untouched.
Owned random ports65270/51403 and the owned container have been cleaned up.
Existing6176 inspector and canonical portals were preserved. No more experiments
are proposed without new source evidence.
