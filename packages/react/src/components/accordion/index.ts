// `Accordion` (the atom — a single collapsible panel) is intentionally NOT
// re-exported here. Use `AccordionField` (for groups) or a purpose variant
// (`FAQAccordion`, `SettingsAccordion`, `SectionsAccordion`) instead.
// Internal consumers can deep-import from "./accordion" directly.

export { AccordionField } from "./accordion-field"
export type { AccordionFieldProps, AccordionFieldItem } from "./accordion-field"

export { FAQAccordion, SettingsAccordion, SectionsAccordion } from "./variants"
export type {
  FAQAccordionProps,
  SettingsAccordionProps,
  SectionsAccordionProps,
} from "./variants"
