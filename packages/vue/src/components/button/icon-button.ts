import type { ButtonOptions, IconName } from "@marwes-ui/core"
import { ButtonVariant } from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"
import { omitAttrs } from "../../internal/render-utils"
import { Button, type ButtonProps } from "./button"

export type IconButtonProps = Omit<
  ButtonProps,
  "hasVisibleText" | "iconLeft" | "iconOnly" | "iconRight"
> & {
  icon: IconName
}

const iconButtonPropKeys = [
  "as",
  "href",
  "type",
  "size",
  "variant",
  "disabled",
  "loading",
  "error",
  "toggle",
  "pressed",
  "ariaLabel",
  "ariaLabelledBy",
  "label",
  "ariaExpanded",
  "ariaControls",
  "action",
  "tooltip",
  "confirmation",
  "dataAttributes",
  "onClick",
  "className",
  "icon",
] as const

const IconButtonImplementation = defineComponent(
  (rawProps) => {
    const attrs = useAttrs()

    return () => {
      const props = rawProps as unknown as IconButtonProps
      const forwardedProps = omitAttrs(props as unknown as Record<string, unknown>, [
        "icon",
        "className",
        "variant",
        "iconLeft",
        "iconOnly",
        "hasVisibleText",
      ])

      return h(Button, {
        ...(attrs as Record<string, unknown>),
        ...forwardedProps,
        ...(props.className !== undefined ? { className: props.className } : {}),
        variant: props.variant ?? ButtonVariant.neutral,
        iconLeft: props.icon,
        iconOnly: true,
        hasVisibleText: false,
      } as ButtonOptions & Record<string, unknown>)
    }
  },
  {
    name: "MarwesIconButton",
    inheritAttrs: false,
    props: [...iconButtonPropKeys],
  },
)

/** Vue component type that preserves IconButton's public props at call sites. */
export const IconButton = IconButtonImplementation as unknown as new () => {
  $props: IconButtonProps
}
