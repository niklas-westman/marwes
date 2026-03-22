import { createSwitchRecipe } from "@marwes-ui/core"
import type { SwitchOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SwitchProps = SwitchOptions & {
  className?: string
  onClick?: (event: MouseEvent) => void
  id?: string
}

const switchPropKeys = [
  "checked",
  "disabled",
  "ariaLabel",
  "ariaLabelledby",
  "className",
  "onClick",
  "id",
] as const

export const Switch = defineComponent(
  (props: SwitchProps, { slots }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: SwitchOptions = {}
      if (props.checked !== undefined) opts.checked = props.checked
      if (props.disabled !== undefined) opts.disabled = props.disabled
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      if (props.ariaLabelledby !== undefined) opts.ariaLabelledby = props.ariaLabelledby
      return createSwitchRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars, attrs.style)

      return h(
        "button",
        {
          ...passthroughAttrs,
          id: props.id,
          type: "button",
          class: className,
          style,
          role: a11y.role,
          "aria-checked": a11y.ariaChecked,
          "aria-disabled": a11y.ariaDisabled,
          "aria-label": a11y.ariaLabel,
          "aria-labelledby": a11y.ariaLabelledby,
          onClick: (event: MouseEvent) => {
            props.onClick?.(event)
          },
        },
        [
          h("span", { class: "mw-switch__track" }, [h("span", { class: "mw-switch__thumb" })]),
          slots.default?.(),
        ],
      )
    }
  },
  {
    name: "MarwesSwitch",
    inheritAttrs: false,
    props: [...switchPropKeys],
    emits: ["click"],
  },
)
