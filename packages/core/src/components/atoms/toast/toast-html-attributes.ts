import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { ToastA11yProps } from "./toast-types"

const toastHtmlAttributeNames = {
  role: "role",
  ariaLive: "aria-live",
  ariaAtomic: "aria-atomic",
} as const

export type ToastHtmlAttributes = HtmlAttributesOf<ToastA11yProps, typeof toastHtmlAttributeNames>

/** Translates resolved toast a11y fields into HTML attribute names. */
export const toToastHtmlAttributes =
  defineHtmlAttributeMapper<ToastA11yProps>()(toastHtmlAttributeNames)
