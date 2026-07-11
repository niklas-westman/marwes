import { createContextMenuRecipe } from "@marwes-ui/core"
import type { ContextMenuActionItem, ContextMenuEntry, ContextMenuOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Icon } from "../icon"

export type ContextMenuProps = ContextMenuOptions & {
  items: readonly ContextMenuEntry[]
  onSelect?: (value: string, item: ContextMenuActionItem) => void
  className?: string
}

const contextMenuPropKeys = [
  "items",
  "ariaLabel",
  "dataAttributes",
  "onSelect",
  "className",
] as const

export const ContextMenu = defineComponent(
  (props: ContextMenuProps, { emit }) => {
    const attrs = useAttrs()
    const kit = computed(() => {
      const options: ContextMenuOptions = { items: props.items }

      if (props.ariaLabel !== undefined) {
        options.ariaLabel = props.ariaLabel
      }

      if (props.dataAttributes !== undefined) {
        options.dataAttributes = props.dataAttributes
      }

      return createContextMenuRecipe(options)
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        "div",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          class: mergeClassNames(renderKit.className, props.className, attrs.class),
          role: renderKit.a11y.role,
          "aria-label": renderKit.a11y.ariaLabel,
        },
        renderKit.items.map((item) => {
          if (item.kind === "divider") {
            return h("div", {
              key: item.key,
              ...item.dataAttributes,
              class: item.className,
              role: item.a11y.role,
              "aria-orientation": item.a11y.ariaOrientation,
            })
          }

          return h(
            "button",
            {
              key: item.key,
              ...item.dataAttributes,
              type: item.a11y.type,
              role: item.a11y.role,
              disabled: item.a11y.disabled,
              "aria-disabled": item.a11y.ariaDisabled,
              class: item.className,
              onClick: () => {
                if (item.item.disabled) return
                emit("select", item.value, item.item)
              },
            },
            [
              item.icon
                ? h(
                    "span",
                    { class: "mw-context-menu__icon", "aria-hidden": "true" },
                    h(Icon, { name: item.icon, decorative: true }),
                  )
                : null,
              h("span", { class: "mw-context-menu__label" }, item.label),
            ],
          )
        }),
      )
    }
  },
  {
    name: "MarwesContextMenu",
    inheritAttrs: false,
    props: [...contextMenuPropKeys],
    emits: ["select"],
  },
)
