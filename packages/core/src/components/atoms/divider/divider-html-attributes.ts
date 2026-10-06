import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { DividerA11y } from "./divider-types"

const dividerHtmlAttributeNames = {
  id: "id",
  role: "role",
  "aria-orientation": "aria-orientation",
} as const

export type DividerHtmlAttributes = HtmlAttributesOf<DividerA11y, typeof dividerHtmlAttributeNames>

/** Translates resolved divider a11y fields into HTML attribute names. */
export const toDividerHtmlAttributes =
  defineHtmlAttributeMapper<DividerA11y>()(dividerHtmlAttributeNames)
