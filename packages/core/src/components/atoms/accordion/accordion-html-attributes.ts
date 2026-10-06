import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { AccordionA11yProps, AccordionFieldA11yProps } from "./accordion-types"

const accordionHtmlAttributeNames = {
  triggerId: false,
  panelId: false,
  ariaExpanded: "aria-expanded",
  ariaDisabled: "aria-disabled",
} as const

export type AccordionHtmlAttributes = HtmlAttributesOf<
  AccordionA11yProps,
  typeof accordionHtmlAttributeNames
>

/** Translates resolved accordion a11y fields into HTML attribute names. */
export const toAccordionHtmlAttributes = defineHtmlAttributeMapper<AccordionA11yProps>()(
  accordionHtmlAttributeNames,
)

const accordionFieldHtmlAttributeNames = {
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
} as const

export type AccordionFieldHtmlAttributes = HtmlAttributesOf<
  AccordionFieldA11yProps,
  typeof accordionFieldHtmlAttributeNames
>

/** Translates resolved AccordionField wrapper a11y fields into HTML attribute names. */
export const toAccordionFieldHtmlAttributes = defineHtmlAttributeMapper<AccordionFieldA11yProps>()(
  accordionFieldHtmlAttributeNames,
)
