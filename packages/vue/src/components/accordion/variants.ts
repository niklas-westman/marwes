import { defineComponent, h } from "vue"
import { AccordionField, type AccordionFieldProps } from "./accordion-field"

const accordionFieldPropKeys = [
  "label",
  "description",
  "error",
  "items",
  "multiple",
  "openItems",
  "onOpenItemsChange",
  "defaultOpenItems",
  "disabled",
  "id",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
] as const

export type FAQAccordionProps = Omit<AccordionFieldProps, "multiple">

export const FAQAccordion = defineComponent({
  name: "MarwesFAQAccordion",
  inheritAttrs: false,
  props: [...accordionFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as FAQAccordionProps

    return () =>
      h(
        AccordionField,
        {
          ...attrs,
          ...props,
          multiple: false,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "faq",
          },
        },
        slots,
      )
  },
})

export type SettingsAccordionProps = Omit<AccordionFieldProps, "multiple">

export const SettingsAccordion = defineComponent({
  name: "MarwesSettingsAccordion",
  inheritAttrs: false,
  props: [...accordionFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as SettingsAccordionProps

    return () =>
      h(
        AccordionField,
        {
          ...attrs,
          ...props,
          multiple: true,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "settings",
          },
        },
        slots,
      )
  },
})

export type SectionsAccordionProps = AccordionFieldProps

export const SectionsAccordion = defineComponent({
  name: "MarwesSectionsAccordion",
  inheritAttrs: false,
  props: [...accordionFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as SectionsAccordionProps

    return () =>
      h(
        AccordionField,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "sections",
          },
        },
        slots,
      )
  },
})
