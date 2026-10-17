---
"@marwes-ui/core": minor
"@marwes-ui/presets": minor
"@marwes-ui/react": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Add the public `resolveButtonIcons` helper and share purpose-icon resolution
across React, Vue and Svelte.

Align purpose Button icon defaults with the pinned Figma design: trailing Check
for Confirm/Success and X for Destructive; leading CheckCircle, Edit, Upload,
Download, Search and Refresh for the corresponding wrappers. Explicit caller icons replace
canonical defaults without injecting an extra icon. Loading continues to replace
icons with the spinner.

Calibrate Check, CheckCircle, Edit and Search glyph geometry to the independently
exported Figma outlines while retaining configurable stroked SVG rendering.

Match Classic Spinner geometry to its canonical Figma master: a full viewport
ring and the exported rounded lower-right indicator outline.

Render RefreshCw from the exact canonical Figma outline at resolved stroke width
2; retain configurable stroked geometry for every other requested width.

Share the existing Icon color selection between stroked and canonical filled
geometries so primary, secondary, muted and inherited colors remain consistent.
