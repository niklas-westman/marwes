---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Complete the `label` accessible-name alias rollout across standalone controls.

`Radio` and `InputOtp` now accept `label` alongside `ariaLabel`, matching the pattern already used by `Checkbox`, `Switch`, `Slider`, `Input`, `Select`, `Textarea`, and `RichText`. `IconButton` prop types now surface `label` explicitly for IDE discoverability (the underlying `Button` recipe already resolved it). Consumers can now use `label="…"` uniformly across every standalone control; `ariaLabel` continues to work.
