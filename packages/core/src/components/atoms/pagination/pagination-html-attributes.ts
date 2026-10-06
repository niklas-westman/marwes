import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  PaginationA11yProps,
  PaginationControlA11yProps,
  PaginationEllipsisA11yProps,
  PaginationListA11yProps,
  PaginationPageA11yProps,
} from "./pagination-types"

const paginationHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
  ariaDisabled: "aria-disabled",
} as const

export type PaginationHtmlAttributes = HtmlAttributesOf<
  PaginationA11yProps,
  typeof paginationHtmlAttributeNames
>

/** Translates resolved pagination a11y fields into HTML attribute names. */
export const toPaginationHtmlAttributes = defineHtmlAttributeMapper<PaginationA11yProps>()(
  paginationHtmlAttributeNames,
)

const paginationListHtmlAttributeNames = {
  role: "role",
} as const

export type PaginationListHtmlAttributes = HtmlAttributesOf<
  PaginationListA11yProps,
  typeof paginationListHtmlAttributeNames
>

/** Translates resolved pagination list a11y fields into HTML attribute names. */
export const toPaginationListHtmlAttributes = defineHtmlAttributeMapper<PaginationListA11yProps>()(
  paginationListHtmlAttributeNames,
)

const paginationControlHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaDisabled: "aria-disabled",
} as const

export type PaginationControlHtmlAttributes = HtmlAttributesOf<
  PaginationControlA11yProps,
  typeof paginationControlHtmlAttributeNames
>

/** Translates resolved pagination control a11y fields into HTML attribute names. */
export const toPaginationControlHtmlAttributes =
  defineHtmlAttributeMapper<PaginationControlA11yProps>()(paginationControlHtmlAttributeNames)

const paginationPageHtmlAttributeNames = {
  ariaLabel: "aria-label",
  ariaCurrent: "aria-current",
  ariaDisabled: "aria-disabled",
} as const

export type PaginationPageHtmlAttributes = HtmlAttributesOf<
  PaginationPageA11yProps,
  typeof paginationPageHtmlAttributeNames
>

/** Translates resolved pagination page a11y fields into HTML attribute names. */
export const toPaginationPageHtmlAttributes = defineHtmlAttributeMapper<PaginationPageA11yProps>()(
  paginationPageHtmlAttributeNames,
)

const paginationEllipsisHtmlAttributeNames = {
  ariaHidden: "aria-hidden",
} as const

export type PaginationEllipsisHtmlAttributes = HtmlAttributesOf<
  PaginationEllipsisA11yProps,
  typeof paginationEllipsisHtmlAttributeNames
>

/** Translates resolved pagination ellipsis a11y fields into HTML attribute names. */
export const toPaginationEllipsisHtmlAttributes =
  defineHtmlAttributeMapper<PaginationEllipsisA11yProps>()(paginationEllipsisHtmlAttributeNames)
