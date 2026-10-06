import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type { DrawerA11yProps, DrawerCloseButtonA11yProps } from "./drawer-types"

const drawerHtmlAttributeNames = {
  role: "role",
  ariaModal: "aria-modal",
  ariaLabel: "aria-label",
  ariaLabelledBy: "aria-labelledby",
  ariaDescribedBy: "aria-describedby",
} as const

export type DrawerHtmlAttributes = HtmlAttributesOf<
  DrawerA11yProps,
  typeof drawerHtmlAttributeNames
>

/** Translates resolved drawer a11y fields into HTML attribute names. */
export const toDrawerHtmlAttributes =
  defineHtmlAttributeMapper<DrawerA11yProps>()(drawerHtmlAttributeNames)

const drawerCloseButtonHtmlAttributeNames = {
  ariaLabel: "aria-label",
} as const

export type DrawerCloseButtonHtmlAttributes = HtmlAttributesOf<
  DrawerCloseButtonA11yProps,
  typeof drawerCloseButtonHtmlAttributeNames
>

/** Translates resolved drawer close button a11y fields into HTML attribute names. */
export const toDrawerCloseButtonHtmlAttributes =
  defineHtmlAttributeMapper<DrawerCloseButtonA11yProps>()(drawerCloseButtonHtmlAttributeNames)
