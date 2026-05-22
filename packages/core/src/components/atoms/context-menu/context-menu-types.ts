import type { IconName } from "../icon/icon-types"

export type ContextMenuItemKind = "item" | "divider"

export interface ContextMenuActionItem {
  kind?: "item"
  value: string
  label: string
  icon?: IconName
  disabled?: boolean
  destructive?: boolean
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface ContextMenuDividerItem {
  kind: "divider"
  id?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export type ContextMenuEntry = ContextMenuActionItem | ContextMenuDividerItem

export interface ContextMenuOptions {
  items?: readonly ContextMenuEntry[]
  ariaLabel?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface ContextMenuA11yProps {
  role: "menu"
  ariaLabel: string
}

export interface ContextMenuItemA11yProps {
  role: "menuitem"
  type: "button"
  disabled?: boolean
  ariaDisabled?: "true"
}

export interface ContextMenuDividerA11yProps {
  role: "separator"
  ariaOrientation: "horizontal"
}

export interface ContextMenuBaseRenderKit {
  key: string
  className: string
  vars: Record<string, string>
  dataAttributes: Record<string, string | boolean | undefined>
}

export interface ContextMenuActionItemRenderKit extends ContextMenuBaseRenderKit {
  kind: "item"
  item: ContextMenuActionItem
  a11y: ContextMenuItemA11yProps
  label: string
  value: string
  icon?: IconName
}

export interface ContextMenuDividerRenderKit extends ContextMenuBaseRenderKit {
  kind: "divider"
  item: ContextMenuDividerItem
  a11y: ContextMenuDividerA11yProps
}

export type ContextMenuEntryRenderKit = ContextMenuActionItemRenderKit | ContextMenuDividerRenderKit

export interface ContextMenuRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  a11y: ContextMenuA11yProps
  items: ContextMenuEntryRenderKit[]
  dataAttributes: Record<string, string | boolean | undefined>
}
