import type { ButtonOptions, ButtonVariant, CssVars } from "@marwes-ui/core"
import { createButtonRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import {
  getDefaultSlotChildren,
  mergeClassNames,
  mergeStyles,
  omitAttrs,
} from "../../internal/render-utils"
import { Icon } from "../icon"
import { ButtonSpinner } from "../spinner"

function isFilledButtonVariant(variant: ButtonVariant): boolean {
  return variant === "primary" || variant === "success" || variant === "danger"
}

function hasSlotChildren(slotChildren: ReturnType<typeof getDefaultSlotChildren>): boolean {
  return slotChildren !== undefined && slotChildren.length > 0
}

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
  "label",
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

    const kit = computed(() => createButtonRecipe(props))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      const slotChildren = getDefaultSlotChildren(slots)
      const content = []
      const resolvedVariant = (props.variant ?? "primary") as ButtonVariant
      const resolvedLoading = renderKit.loading

      if (resolvedLoading.isLoading) {
        content.push(
          h(ButtonSpinner, {
            variant: resolvedLoading.spinnerVariant,
            inverted: isFilledButtonVariant(resolvedVariant),
          }),
        )
      } else if (props.iconLeft) {
        content.push(
          h(Icon, { name: props.iconLeft, size: "xs", strokeWidth: "sm", decorative: true }),
        )
      }

      if (resolvedLoading.isLoading && resolvedLoading.loadingLabel !== undefined) {
        content.push(h("span", { class: "mw-btn__label" }, resolvedLoading.loadingLabel))
      } else if (hasSlotChildren(slotChildren)) {
        content.push(h("span", { class: "mw-btn__label" }, slotChildren))
      }

      if (!resolvedLoading.isLoading && props.iconRight) {
        content.push(
          h(Icon, { name: props.iconRight, size: "xs", strokeWidth: "sm", decorative: true }),
        )
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
