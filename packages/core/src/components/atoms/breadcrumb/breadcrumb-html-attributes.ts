import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  BreadcrumbA11yProps,
  BreadcrumbHomeA11yProps,
  BreadcrumbItemA11yProps,
  BreadcrumbListA11yProps,
  BreadcrumbSeparatorA11yProps,
} from "./breadcrumb-types"

const breadcrumbHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type BreadcrumbHtmlAttributes = HtmlAttributesOf<
  BreadcrumbA11yProps,
  typeof breadcrumbHtmlAttributeNames
>

/** Translates resolved breadcrumb a11y fields into HTML attribute names. */
export const toBreadcrumbHtmlAttributes = defineHtmlAttributeMapper<BreadcrumbA11yProps>()(
  breadcrumbHtmlAttributeNames,
)

const breadcrumbListHtmlAttributeNames = {
  role: "role",
} as const

export type BreadcrumbListHtmlAttributes = HtmlAttributesOf<
  BreadcrumbListA11yProps,
  typeof breadcrumbListHtmlAttributeNames
>

/** Translates resolved breadcrumb list a11y fields into HTML attribute names. */
export const toBreadcrumbListHtmlAttributes = defineHtmlAttributeMapper<BreadcrumbListA11yProps>()(
  breadcrumbListHtmlAttributeNames,
)

const breadcrumbSeparatorHtmlAttributeNames = {
  ariaHidden: "aria-hidden",
} as const

export type BreadcrumbSeparatorHtmlAttributes = HtmlAttributesOf<
  BreadcrumbSeparatorA11yProps,
  typeof breadcrumbSeparatorHtmlAttributeNames
>

/** Translates resolved breadcrumb separator a11y fields into HTML attribute names. */
export const toBreadcrumbSeparatorHtmlAttributes =
  defineHtmlAttributeMapper<BreadcrumbSeparatorA11yProps>()(breadcrumbSeparatorHtmlAttributeNames)

const breadcrumbItemHtmlAttributeNames = {
  ariaCurrent: "aria-current",
  ariaLabel: "aria-label",
} as const

export type BreadcrumbItemHtmlAttributes = HtmlAttributesOf<
  BreadcrumbItemA11yProps,
  typeof breadcrumbItemHtmlAttributeNames
>

/** Translates resolved breadcrumb item a11y fields into HTML attribute names. */
export const toBreadcrumbItemHtmlAttributes = defineHtmlAttributeMapper<BreadcrumbItemA11yProps>()(
  breadcrumbItemHtmlAttributeNames,
)

const breadcrumbHomeHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaCurrent: "aria-current",
} as const

export type BreadcrumbHomeHtmlAttributes = HtmlAttributesOf<
  BreadcrumbHomeA11yProps,
  typeof breadcrumbHomeHtmlAttributeNames
>

/** Translates resolved breadcrumb home a11y fields into HTML attribute names. */
export const toBreadcrumbHomeHtmlAttributes = defineHtmlAttributeMapper<BreadcrumbHomeA11yProps>()(
  breadcrumbHomeHtmlAttributeNames,
)
