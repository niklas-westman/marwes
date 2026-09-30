---
"@marwes-ui/presets": patch
---

Restore density-aware spacing between AccordionField group labels and accordion items in React and Vue. Native fieldset legends do not receive the fieldset's grid gap; the shared preset now applies that spacing explicitly while preserving Svelte's existing grid-based label spacing.
