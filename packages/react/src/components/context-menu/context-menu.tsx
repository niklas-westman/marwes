import { createContextMenuRecipe } from "@marwes-ui/core"
import type { ContextMenuActionItem, ContextMenuEntry, ContextMenuOptions } from "@marwes-ui/core"
import type * as React from "react"
import { Icon } from "../icon"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export interface ContextMenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onSelect">,
    ContextMenuOptions {
  items: readonly ContextMenuEntry[]
  onSelect?: (value: string, item: ContextMenuActionItem) => void
}

export function ContextMenu(props: ContextMenuProps): React.ReactElement {
  const { items, ariaLabel, dataAttributes, onSelect, className, ...restProps } = props
  const recipeOptions: ContextMenuOptions = { items }

  if (ariaLabel !== undefined) {
    recipeOptions.ariaLabel = ariaLabel
  }

  if (dataAttributes !== undefined) {
    recipeOptions.dataAttributes = dataAttributes
  }

  const kit = createContextMenuRecipe(recipeOptions)

  return (
    <div
      {...restProps}
      {...kit.dataAttributes}
      className={cx(kit.className, className)}
      role={kit.a11y.role}
      aria-label={kit.a11y.ariaLabel}
    >
      {kit.items.map((item) => {
        if (item.kind === "divider") {
          return (
            <div
              key={item.key}
              className={item.className}
              role={item.a11y.role}
              aria-orientation={item.a11y.ariaOrientation}
              {...item.dataAttributes}
            />
          )
        }

        return (
          <button
            key={item.key}
            type={item.a11y.type}
            role={item.a11y.role}
            disabled={item.a11y.disabled}
            aria-disabled={item.a11y.ariaDisabled}
            className={item.className}
            onClick={() => {
              if (item.item.disabled) return
              onSelect?.(item.value, item.item)
            }}
            {...item.dataAttributes}
          >
            {item.icon && (
              <span className="mw-context-menu__icon" aria-hidden="true">
                <Icon name={item.icon} decorative />
              </span>
            )}
            <span className="mw-context-menu__label">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
