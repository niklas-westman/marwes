import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SpacingA11y } from "./spacing.types"

const spacingHtmlAttributeNames = {
  "aria-hidden": "aria-hidden",
} as const

export type SpacingHtmlAttributes = HtmlAttributesOf<SpacingA11y, typeof spacingHtmlAttributeNames>

/** Translates resolved spacing a11y fields into HTML attribute names. */
export const toSpacingHtmlAttributes =
  defineHtmlAttributeMapper<SpacingA11y>()(spacingHtmlAttributeNames)
