import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { DialogA11yProps, DialogCloseButtonA11yProps } from "./dialog-types"

const dialogHtmlAttributeNames = {
  role: "role",
  ariaModal: "aria-modal",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
} as const

export type DialogHtmlAttributes = HtmlAttributesOf<
  DialogA11yProps,
  typeof dialogHtmlAttributeNames
>

/** Translates resolved dialog a11y fields into HTML attribute names. */
export const toDialogHtmlAttributes =
  defineHtmlAttributeMapper<DialogA11yProps>()(dialogHtmlAttributeNames)

const dialogCloseButtonHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type DialogCloseButtonHtmlAttributes = HtmlAttributesOf<
  DialogCloseButtonA11yProps,
  typeof dialogCloseButtonHtmlAttributeNames
>

/** Translates resolved dialog close button a11y fields into HTML attribute names. */
export const toDialogCloseButtonHtmlAttributes =
  defineHtmlAttributeMapper<DialogCloseButtonA11yProps>()(dialogCloseButtonHtmlAttributeNames)
