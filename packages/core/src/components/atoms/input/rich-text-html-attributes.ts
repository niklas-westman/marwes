import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { RichTextA11yProps, RichTextToolbarButtonA11yProps } from "./rich-text-types"

const richTextHtmlAttributeNames = {
  id: "id",
  role: "role",
  tabIndex: "tabindex",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaInvalid: "aria-invalid",
  ariaDisabled: "aria-disabled",
  ariaReadOnly: "aria-readonly",
  ariaRequired: "aria-required",
  ariaMultiline: "aria-multiline",
} as const

export type RichTextHtmlAttributes = HtmlAttributesOf<
  RichTextA11yProps,
  typeof richTextHtmlAttributeNames
>

/** Translates resolved rich text a11y fields into HTML attribute names. */
export const toRichTextHtmlAttributes = defineHtmlAttributeMapper<RichTextA11yProps>()(
  richTextHtmlAttributeNames,
)

const richTextToolbarButtonHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaPressed: "aria-pressed",
} as const

export type RichTextToolbarButtonHtmlAttributes = HtmlAttributesOf<
  RichTextToolbarButtonA11yProps,
  typeof richTextToolbarButtonHtmlAttributeNames
>

/** Translates resolved rich text toolbar button a11y fields into HTML attribute names. */
export const toRichTextToolbarButtonHtmlAttributes =
  defineHtmlAttributeMapper<RichTextToolbarButtonA11yProps>()(
    richTextToolbarButtonHtmlAttributeNames,
  )
