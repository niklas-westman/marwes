// `Accordion` (the atom — a single collapsible panel) is intentionally NOT
// re-exported here. Use `AccordionField` (for groups) or a purpose variant
// instead. Internal consumers can deep-import "./Accordion.svelte" directly.
export { default as AccordionField } from "./AccordionField.svelte"
export { default as FAQAccordion } from "./FAQAccordion.svelte"
export { default as SettingsAccordion } from "./SettingsAccordion.svelte"
export { default as SectionsAccordion } from "./SectionsAccordion.svelte"
export type {
  AccordionFieldItem,
  AccordionFieldProps,
  FAQAccordionProps,
  SettingsAccordionProps,
  SectionsAccordionProps,
} from "./types.js"
