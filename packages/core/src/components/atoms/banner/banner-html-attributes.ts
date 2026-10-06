import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { BannerA11yProps, BannerDismissA11yProps } from "./banner-types"

const bannerHtmlAttributeNames = {
  role: "role",
  ariaLabel: "aria-label",
  ariaLive: "aria-live",
} as const

export type BannerHtmlAttributes = HtmlAttributesOf<
  BannerA11yProps,
  typeof bannerHtmlAttributeNames
>

/** Translates resolved banner a11y fields into HTML attribute names. */
export const toBannerHtmlAttributes =
  defineHtmlAttributeMapper<BannerA11yProps>()(bannerHtmlAttributeNames)

const bannerDismissHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type BannerDismissHtmlAttributes = HtmlAttributesOf<
  BannerDismissA11yProps,
  typeof bannerDismissHtmlAttributeNames
>

/** Translates resolved banner dismiss button a11y fields into HTML attribute names. */
export const toBannerDismissHtmlAttributes = defineHtmlAttributeMapper<BannerDismissA11yProps>()(
  bannerDismissHtmlAttributeNames,
)
