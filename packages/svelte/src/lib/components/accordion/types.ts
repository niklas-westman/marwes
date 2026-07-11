import type { AccordionOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface AccordionProps extends Partial<AccordionOptions> {
  title: string
  children?: Snippet
  class?: string
  ontoggle?: () => void
}

export interface AccordionFieldItem {
  value: string
  title: string
  content: string
  disabled?: boolean
}

export interface AccordionFieldProps {
  id?: string
  label: string
  description?: string
  error?: string
  items: AccordionFieldItem[]
  openItems?: string[]
  defaultOpenItems?: string[]
  onopenitemschange?: (items: string[]) => void
  multiple?: boolean
  ariaDescribedBy?: string
  class?: string
  disabled?: boolean
}

export type FAQAccordionProps = Omit<AccordionFieldProps, "multiple" | "disabled">
export type SettingsAccordionProps = Omit<AccordionFieldProps, "multiple" | "disabled">
export type SectionsAccordionProps = Omit<AccordionFieldProps, "disabled">
