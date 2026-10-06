import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  AccordionA11yProps,
  AccordionFieldA11yProps,
  AccordionPanelA11yProps,
  AccordionTriggerA11yProps,
} from "./accordion-types"

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

const accordionTriggerHtmlAttributeNames = {
  id: "id",
  ariaExpanded: "aria-expanded",
  ariaControls: "aria-controls",
  ariaDisabled: "aria-disabled",
} as const

export type AccordionTriggerHtmlAttributes = HtmlAttributesOf<
  AccordionTriggerA11yProps,
  typeof accordionTriggerHtmlAttributeNames
>

/** Translates resolved accordion trigger a11y fields into HTML attribute names. */
export const toAccordionTriggerHtmlAttributes =
  defineHtmlAttributeMapper<AccordionTriggerA11yProps>()(accordionTriggerHtmlAttributeNames)

const accordionPanelHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaLabelledBy: "aria-labelledby",
} as const

export type AccordionPanelHtmlAttributes = HtmlAttributesOf<
  AccordionPanelA11yProps,
  typeof accordionPanelHtmlAttributeNames
>

/** Translates resolved accordion panel a11y fields into HTML attribute names. */
export const toAccordionPanelHtmlAttributes = defineHtmlAttributeMapper<AccordionPanelA11yProps>()(
  accordionPanelHtmlAttributeNames,
)
