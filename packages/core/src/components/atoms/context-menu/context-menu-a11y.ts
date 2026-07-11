import type {
  ContextMenuA11yProps,
  ContextMenuDividerA11yProps,
  ContextMenuItemA11yProps,
  ContextMenuOptions,
} from "./context-menu-types"

export function resolveContextMenuA11y(options: ContextMenuOptions = {}): ContextMenuA11yProps {
  return {
    role: "menu",
    ariaLabel: options.ariaLabel ?? "Context menu",
  }
}

export function resolveContextMenuItemA11y(disabled = false): ContextMenuItemA11yProps {
  return {
    role: "menuitem",
    type: "button",
    ...(disabled
      ? {
          disabled: true,
          ariaDisabled: "true",
        }
      : {}),
  }
}

export function resolveContextMenuDividerA11y(): ContextMenuDividerA11yProps {
  return {
    role: "separator",
    ariaOrientation: "horizontal",
  }
}
