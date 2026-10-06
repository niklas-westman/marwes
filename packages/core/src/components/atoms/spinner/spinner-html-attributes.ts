import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SpinnerA11yProps } from "./spinner-types"

const spinnerHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaHidden: "aria-hidden",
  ariaLabel: "aria-label",
  ariaLive: "aria-live",
} as const

export type SpinnerHtmlAttributes = HtmlAttributesOf<
  SpinnerA11yProps,
  typeof spinnerHtmlAttributeNames
>

/** Translates resolved spinner a11y fields into HTML attribute names. */
export const toSpinnerHtmlAttributes =
  defineHtmlAttributeMapper<SpinnerA11yProps>()(spinnerHtmlAttributeNames)
