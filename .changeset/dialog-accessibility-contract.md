---
"@marwes-ui/core": patch
"@marwes-ui/presets": patch
"@marwes-ui/react": patch
"@marwes-ui/vue": patch
---

Clarify the Dialog accessibility contract by keeping the raw `Dialog` shell non-modal by default, moving modal semantics to `DialogModal`, adding shared React/Vue modal contract coverage, strengthening focus-fallback styling, and aligning Storybook docs and stories with the actual dialog layers.
