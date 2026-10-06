import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { ParagraphA11y } from "./paragraph-types"

const paragraphHtmlAttributeNames = {
  id: "id",
} as const

export type ParagraphHtmlAttributes = HtmlAttributesOf<
  ParagraphA11y,
  typeof paragraphHtmlAttributeNames
>

/** Translates resolved paragraph a11y fields into HTML attribute names. */
export const toParagraphHtmlAttributes = defineHtmlAttributeMapper<ParagraphA11y>()(
  paragraphHtmlAttributeNames,
)
