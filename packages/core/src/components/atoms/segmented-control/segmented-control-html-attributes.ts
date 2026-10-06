import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  SegmentedControlA11yProps,
  SegmentedControlItemA11yProps,
} from "./segmented-control-types"

const segmentedControlHtmlAttributeNames = {
  role: "role",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaDisabled: "aria-disabled",
} as const

export type SegmentedControlHtmlAttributes = HtmlAttributesOf<
  SegmentedControlA11yProps,
  typeof segmentedControlHtmlAttributeNames
>

/** Translates resolved segmented control a11y fields into HTML attribute names. */
export const toSegmentedControlHtmlAttributes =
  defineHtmlAttributeMapper<SegmentedControlA11yProps>()(segmentedControlHtmlAttributeNames)

const segmentedControlItemHtmlAttributeNames = {
  role: "role",
  ariaChecked: "aria-checked",
  ariaDisabled: "aria-disabled",
  tabIndex: "tabindex",
  ariaLabel: "aria-label",
} as const

export type SegmentedControlItemHtmlAttributes = HtmlAttributesOf<
  SegmentedControlItemA11yProps,
  typeof segmentedControlItemHtmlAttributeNames
>

/** Translates resolved segmented control item a11y fields into HTML attribute names. */
export const toSegmentedControlItemHtmlAttributes =
  defineHtmlAttributeMapper<SegmentedControlItemA11yProps>()(segmentedControlItemHtmlAttributeNames)
