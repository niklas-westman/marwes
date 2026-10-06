import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SliderA11yProps } from "./slider-types"

const sliderHtmlAttributeNames = {
  type: "type",
  id: "id",
  name: "name",
  min: "min",
  max: "max",
  step: "step",
  disabled: "disabled",
  required: "required",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaValueText: "aria-valuetext",
  ariaOrientation: "aria-orientation",
} as const

export type SliderHtmlAttributes = HtmlAttributesOf<
  SliderA11yProps,
  typeof sliderHtmlAttributeNames
>

/** Translates resolved slider a11y fields into HTML attribute names. */
export const toSliderHtmlAttributes =
  defineHtmlAttributeMapper<SliderA11yProps>()(sliderHtmlAttributeNames)
