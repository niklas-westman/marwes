---
"@marwes-ui/core": patch
"@marwes-ui/react": patch
"@marwes-ui/presets": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

Vue: change callbacks passed as props (`onValueChange`, `onChange`, `onCheckedChange`, `onOpenChange`) on Input, Textarea, Select, InputOtp, RichText, Slider, Radio, RadioGroupField, Checkbox, Switch and TooltipGroup now run once per change instead of twice (four times for RadioGroupField).
