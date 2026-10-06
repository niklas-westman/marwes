import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { SkeletonA11yProps } from "./skeleton-types"

const skeletonHtmlAttributeNames = {
  id: "id",
  role: "role",
  ariaHidden: "aria-hidden",
  ariaLabel: "aria-label",
  ariaLive: "aria-live",
} as const

export type SkeletonHtmlAttributes = HtmlAttributesOf<
  SkeletonA11yProps,
  typeof skeletonHtmlAttributeNames
>

/** Translates resolved skeleton a11y fields into HTML attribute names. */
export const toSkeletonHtmlAttributes = defineHtmlAttributeMapper<SkeletonA11yProps>()(
  skeletonHtmlAttributeNames,
)
