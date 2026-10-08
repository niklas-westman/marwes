---
"@marwes-ui/core": patch
"@marwes-ui/react": patch
"@marwes-ui/presets": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

`SwitchField` now sets `aria-invalid="true"` on the switch while an error is shown, so assistive technology announces the invalid state the same way it does for `Checkbox` and `Slider`. Previously the error text was only linked through `aria-describedby`. `Switch` accepts a new optional `invalid` option for the same purpose.
