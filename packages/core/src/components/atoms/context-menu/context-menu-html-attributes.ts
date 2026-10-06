import { defineHtmlAttributeMapper } from "../../../shared/html-attributes"
import type { HtmlAttributesOf } from "../../../shared/html-attributes"
import type {
  ContextMenuA11yProps,
  ContextMenuDividerA11yProps,
  ContextMenuItemA11yProps,
} from "./context-menu-types"

const contextMenuHtmlAttributeNames = {
  role: "role",
  ariaLabel: "aria-label",
} as const

export type ContextMenuHtmlAttributes = HtmlAttributesOf<
  ContextMenuA11yProps,
  typeof contextMenuHtmlAttributeNames
>

/** Translates resolved context menu a11y fields into HTML attribute names. */
export const toContextMenuHtmlAttributes = defineHtmlAttributeMapper<ContextMenuA11yProps>()(
  contextMenuHtmlAttributeNames,
)

const contextMenuItemHtmlAttributeNames = {
  role: "role",
  type: "type",
  disabled: "disabled",
  ariaDisabled: "aria-disabled",
} as const

export type ContextMenuItemHtmlAttributes = HtmlAttributesOf<
  ContextMenuItemA11yProps,
  typeof contextMenuItemHtmlAttributeNames
>

/** Translates resolved context menu item a11y fields into HTML attribute names. */
export const toContextMenuItemHtmlAttributes =
  defineHtmlAttributeMapper<ContextMenuItemA11yProps>()(contextMenuItemHtmlAttributeNames)

const contextMenuDividerHtmlAttributeNames = {
  role: "role",
  ariaOrientation: "aria-orientation",
} as const

export type ContextMenuDividerHtmlAttributes = HtmlAttributesOf<
  ContextMenuDividerA11yProps,
  typeof contextMenuDividerHtmlAttributeNames
>

/** Translates resolved context menu divider a11y fields into HTML attribute names. */
export const toContextMenuDividerHtmlAttributes =
  defineHtmlAttributeMapper<ContextMenuDividerA11yProps>()(contextMenuDividerHtmlAttributeNames)
