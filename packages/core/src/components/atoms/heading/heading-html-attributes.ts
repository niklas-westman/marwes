import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { HeadingA11y } from "./heading-types"

const headingHtmlAttributeNames = {
  id: "id",
  ariaLabel: "aria-label",
} as const

export type HeadingHtmlAttributes = HtmlAttributesOf<HeadingA11y, typeof headingHtmlAttributeNames>

/** Translates resolved heading a11y fields into HTML attribute names. */
export const toHeadingHtmlAttributes =
  defineHtmlAttributeMapper<HeadingA11y>()(headingHtmlAttributeNames)
