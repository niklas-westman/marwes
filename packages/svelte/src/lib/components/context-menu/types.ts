import type { ContextMenuActionItem, ContextMenuEntry, ContextMenuOptions } from "@marwes-ui/core"

export interface ContextMenuProps extends ContextMenuOptions {
  items: readonly ContextMenuEntry[]
  onselect?: (value: string, item: ContextMenuActionItem) => void
  class?: string
}

export type { ContextMenuActionItem, ContextMenuEntry }
