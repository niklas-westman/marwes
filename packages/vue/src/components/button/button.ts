import type { ButtonOptions, CssVars } from "@marwes-ui/core"
import { createButtonRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import {
  getDefaultSlotChildren,
  mergeClassNames,
  mergeStyles,
  omitAttrs,
} from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"
import { Icon } from "../icon"

export type ButtonProps = ButtonOptions & {
  onClick?: (event: MouseEvent) => void
  className?: string
}

const buttonPropKeys = [
  "as",
  "href",
  "size",
  "variant",
  "disabled",
  "loading",
  "error",
  "toggle",
  "pressed",
  "ariaLabel",
  "hasVisibleText",
  "ariaExpanded",
  "ariaControls",
  "iconLeft",
  "iconRight",
  "iconOnly",
  "action",
  "tooltip",
  "confirmation",
  "dataAttributes",
  "onClick",
  "className",
] as const

export const Button = defineComponent(
  (props: ButtonProps, { slots, emit }) => {
    const attrs = useAttrs()
    const theme = useTheme()

    const kit = computed(() => createButtonRecipe(theme.value, props))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      const slotChildren = getDefaultSlotChildren(slots)
      const content = []

      if (props.iconLeft) {
        content.push(h(Icon, { name: props.iconLeft, size: "xs", decorative: true }))
      }
      if (slotChildren) {
        content.push(...slotChildren)
      }
      if (props.iconRight) {
        content.push(h(Icon, { name: props.iconRight, size: "xs", decorative: true }))
      }

      if (renderKit.tag === "button") {
        return h(
          "button",
          {
            ...passthroughAttrs,
            ...renderKit.dataAttributes,
            type: renderKit.a11y.type,
            disabled: renderKit.a11y.disabled,
            "aria-label": renderKit.a11y.ariaLabel,
            "aria-busy": renderKit.a11y.ariaBusy,
            "aria-disabled": renderKit.a11y.ariaDisabled,
            "aria-pressed": renderKit.a11y.ariaPressed,
            "aria-expanded": renderKit.a11y.ariaExpanded,
            "aria-controls": renderKit.a11y.ariaControls,
            title: renderKit.a11y.title,
            class: className,
            style,
            onClick: (event: MouseEvent) => {
              emit("click", event)
            },
          },
          content,
        )
      }

      return h(
        "a",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          href: renderKit.a11y.href,
          role: renderKit.a11y.role,
          tabindex: renderKit.a11y.tabIndex,
          "aria-label": renderKit.a11y.ariaLabel,
          "aria-busy": renderKit.a11y.ariaBusy,
          "aria-disabled": renderKit.a11y.ariaDisabled,
          "aria-pressed": renderKit.a11y.ariaPressed,
          "aria-expanded": renderKit.a11y.ariaExpanded,
          "aria-controls": renderKit.a11y.ariaControls,
          title: renderKit.a11y.title,
          class: className,
          style,
          onClick: (event: MouseEvent) => {
            if (renderKit.blockClick) {
              event.preventDefault()
              return
            }
            emit("click", event)
          },
        },
        content,
      )
    }
  },
  {
    name: "MarwesButton",
    inheritAttrs: false,
    props: [...buttonPropKeys],
    emits: ["click"],
  },
)
