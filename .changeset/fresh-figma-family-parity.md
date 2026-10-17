---
"@marwes-ui/core": patch
"@marwes-ui/presets": patch
"@marwes-ui/react": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

Align default border and disabled action paints with the captured Figma palette.
Correct small destructive-button spacing and icon size, Checkbox fractional
strokes and dark indeterminate fills, and Dialog description/divider opacity,
header spacing and close-control geometry. Use the low-contrast dark Radio
border and medium-contrast disabled Radio border roles.

Round Secondary Button intrinsic widths to Figma's whole-pixel surface bounds
in supporting browsers, with ordinary intrinsic sizing as the fallback.

Match dark Secondary Button default text and outline to Figma's light neutral
paint, and use geometric text rendering for Text Button glyph alignment.

Align standard small and large Button geometry with the pinned Figma selections
(32px and 48px heights), preserving the distinct 36px destructive small style.

Match Primary, Success, Destructive and Neutral state overlays without dimming
labels, preserve independent disabled paint alpha, and align error icon/label
roles. Keep loading buttons semantically disabled while retaining their loading
design. Use the captured Success action surface in both modes and the captured
Destructive surface in dark mode; status colors remain separate. Align outlined
loading spinner paints and compact navigation-link geometry with Figma.

Map the Neutral visual role and Cancel, Copy, Filter, Sort, Close and Refresh
purposes to Figma Ghost. Align default purpose icons with their catalog
selections and retain purpose markers across React, Vue and Svelte so styles
apply consistently. These runtime changes require fresh final parity evidence;
they do not promote staged Figma references.

Correct the shared disabled-text role to Figma black/white at 30% alpha while
preserving the separate subtle-gray role. This shared token update requires fresh
validation of other families that consume disabled text.

Use the pinned 60% black/white secondary-text role for Link labels and retain the
transparent Figma Pill element. This shared muted-text correction also invalidates
older evidence for consuming families.

Match Figma auto-width label boxes by removing trailing tracking from the text
advance and rounding up to whole pixels in supporting Chromium versions. Keep
labels left aligned within those boxes. Match the separate IconButton md size
collection at 32px and its 15% contrast outline, without changing ordinary Button
md geometry or any public size names.

Use the owner-approved standard keyboard-focus geometry across Button variants,
purpose wrappers and IconButton: a 2px ring with a 4px clear gap. Correct the
shared dark focus-ring token to the pinned Semantic `focus/ring` alias (#ABABFD).
Increased-contrast focus remains a separate design policy.

Preserve the Figma `fi` ligature in Button labels with nonzero tracking by
explicitly enabling `liga` on the Button root. Caller font-feature overrides
continue to inherit into labels. This corrects Confirm/Success shaping without
replacing accessible HTML text or changing visual thresholds.

Paint the standard focus ring using its source-derived rounded border geometry,
with a native system-color focus outline in forced-colors mode. Preserve real
keyboard focus and caller font-feature overrides.
