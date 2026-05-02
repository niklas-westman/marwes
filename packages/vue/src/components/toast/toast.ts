import { createToastRecipe } from "@marwes-ui/core"
import type { ToastOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface ToastProps extends ToastOptions {
  onDismiss?: () => void
  className?: string
  id?: string
  dataAttributes?: Record<string, string>
}

const toastPropKeys = [
  "variant",
  "ariaLive",
  "onDismiss",
  "className",
  "id",
  "dataAttributes",
] as const

export const Toast = defineComponent(
  (props: ToastProps, { slots }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: ToastOptions = {}
      if (props.variant !== undefined) opts.variant = props.variant
      if (props.ariaLive !== undefined) opts.ariaLive = props.ariaLive
      return createToastRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)

      const children = [
        slots.icon
          ? h("span", { class: "mw-toast__icon", "aria-hidden": "true" }, slots.icon())
          : null,
        h("div", { class: "mw-toast__body" }, [
          h("span", { class: "mw-toast__text" }, slots.default?.()),
          slots.action ? h("span", { class: "mw-toast__action" }, slots.action()) : null,
        ]),
        props.onDismiss
          ? h("button", {
              type: "button",
              class: "mw-toast__dismiss",
              "aria-label": "Dismiss",
              onClick: () => props.onDismiss?.(),
            })
          : null,
      ].filter(Boolean)

      return h(
        "div",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          ...(props.dataAttributes ?? {}),
          id: props.id,
          class: className,
          role: a11y.role,
          "aria-live": a11y.ariaLive,
          "aria-atomic": "true",
        },
        children,
      )
    }
  },
  {
    name: "MarwesToast",
    inheritAttrs: false,
    props: [...toastPropKeys],
    emits: ["dismiss"],
  },
)
