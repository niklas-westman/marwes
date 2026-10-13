---
"@marwes-ui/core": patch
"@marwes-ui/react": patch
"@marwes-ui/presets": patch
"@marwes-ui/vue": patch
"@marwes-ui/svelte": patch
---

Expose error invalid states on SegmentedControlField, PaginationField and DatePickerField across adapters. Keep Svelte AccordionField descriptions consistent with their ARIA references, and translate InputOtp maxlength to React's maxLength attribute. Give DatePicker weekday columns stable keys when abbreviations repeat. Add shared field update/hydration contracts and public-component hydration smoke coverage; this does not declare official SSR support.
