import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { TextA11y } from "./text-types"

const textHtmlAttributeNames = {
  id: "id",
} as const

export type TextHtmlAttributes = HtmlAttributesOf<TextA11y, typeof textHtmlAttributeNames>

/** Translates resolved text a11y fields into HTML attribute names. */
export const toTextHtmlAttributes = defineHtmlAttributeMapper<TextA11y>()(textHtmlAttributeNames)
