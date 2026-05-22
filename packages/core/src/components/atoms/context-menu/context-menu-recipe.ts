import { createFamilySemanticAttributes } from "../../../semantics"
import {
  resolveContextMenuA11y,
  resolveContextMenuDividerA11y,
  resolveContextMenuItemA11y,
} from "./context-menu-a11y"
import type {
  ContextMenuActionItem,
  ContextMenuEntry,
  ContextMenuEntryRenderKit,
  ContextMenuOptions,
  ContextMenuRenderKit,
} from "./context-menu-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function isActionItem(item: ContextMenuEntry): item is ContextMenuActionItem {
  return item.kind !== "divider"
}

function createContextMenuItemKey(item: ContextMenuEntry, index: number): string {
  if (isActionItem(item)) {
    return `item-${item.value}`
  }

  return item.id ?? `divider-${index}`
}

export function createContextMenuRecipe(options: ContextMenuOptions = {}): ContextMenuRenderKit {
  const rootDataAttributes = {
    ...createFamilySemanticAttributes("context-menu"),
    ...options.dataAttributes,
  }

  return {
    tag: "div",
    className: "mw-context-menu",
    vars: {},
    a11y: resolveContextMenuA11y(options),
    dataAttributes: rootDataAttributes,
    items: (options.items ?? []).map((item, index): ContextMenuEntryRenderKit => {
      const key = createContextMenuItemKey(item, index)

      if (!isActionItem(item)) {
        return {
          kind: "divider",
          key,
          item,
          className: "mw-context-menu__divider",
          vars: {},
          a11y: resolveContextMenuDividerA11y(),
          dataAttributes: {
            "data-component": "context-menu",
            "data-part": "divider",
            ...item.dataAttributes,
          },
        }
      }

      const disabled = item.disabled ?? false
      const destructive = item.destructive ?? false

      return {
        kind: "item",
        key,
        item,
        label: item.label,
        value: item.value,
        ...(item.icon ? { icon: item.icon } : {}),
        className: cx(
          "mw-context-menu__item",
          destructive && "mw-context-menu__item--destructive",
          disabled && "mw-context-menu__item--disabled",
        ),
        vars: {},
        a11y: resolveContextMenuItemA11y(disabled),
        dataAttributes: {
          "data-component": "context-menu",
          "data-part": "item",
          "data-value": item.value,
          "data-disabled": disabled ? "true" : undefined,
          "data-destructive": destructive ? "true" : undefined,
          ...item.dataAttributes,
        },
      }
    }),
  }
}
