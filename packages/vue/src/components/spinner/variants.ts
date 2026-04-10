import type { CssVars } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { mergeStyles } from "../../internal/render-utils"
import { Spinner, type SpinnerProps } from "./spinner"

const spinnerPropKeys = [
  "variant",
  "size",
  "decorative",
  "ariaLabel",
  "id",
  "className",
  "dataAttributes",
] as const

export type ButtonSpinnerProps = SpinnerProps & {
  inverted?: boolean
}

export const ButtonSpinner = defineComponent({
  name: "MarwesButtonSpinner",
  inheritAttrs: false,
  props: [...spinnerPropKeys, "inverted"],
  setup(rawProps, { attrs }) {
    return () => {
      const props = rawProps as unknown as ButtonSpinnerProps
      const spinnerStyle = mergeStyles(
        {
          "--mw-spinner-track-color": props.inverted
            ? "rgba(255, 255, 255, 0.8)"
            : "color-mix(in srgb, currentColor 35%, transparent)",
          "--mw-spinner-indicator-color": props.inverted ? "#ffffff" : "currentColor",
        } as CssVars,
        attrs.style,
      )

      return h(Spinner, {
        ...attrs,
        ...props,
        variant: props.variant ?? "classic",
        size: props.size ?? "xs",
        decorative: props.decorative ?? true,
        style: spinnerStyle,
        dataAttributes: {
          ...props.dataAttributes,
          "data-purpose": "button-loading",
          "data-context": "button-loading",
        },
      })
    }
  },
})

export type EmptyStateSpinnerProps = SpinnerProps

export const EmptyStateSpinner = defineComponent({
  name: "MarwesEmptyStateSpinner",
  inheritAttrs: false,
  props: [...spinnerPropKeys],
  setup(rawProps, { attrs }) {
    return () => {
      const props = rawProps as unknown as EmptyStateSpinnerProps

      return h(Spinner, {
        ...attrs,
        ...props,
        variant: props.variant ?? "dots-round",
        size: props.size ?? "lg",
        decorative: props.decorative ?? true,
        dataAttributes: {
          ...props.dataAttributes,
          "data-purpose": "empty-state",
          "data-context": "empty-state",
        },
      })
    }
  },
})
