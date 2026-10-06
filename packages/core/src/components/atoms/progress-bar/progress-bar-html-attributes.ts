import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { ProgressBarA11yProps } from "./progress-bar-types"

const progressBarHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaValueMin: "aria-valuemin",
  ariaValueMax: "aria-valuemax",
  ariaValueNow: "aria-valuenow",
  ariaValueText: "aria-valuetext",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaDisabled: "aria-disabled",
} as const

export type ProgressBarHtmlAttributes = HtmlAttributesOf<
  ProgressBarA11yProps,
  typeof progressBarHtmlAttributeNames
>

/** Translates resolved progress bar a11y fields into HTML attribute names. */
export const toProgressBarHtmlAttributes = defineHtmlAttributeMapper<ProgressBarA11yProps>()(
  progressBarHtmlAttributeNames,
)
