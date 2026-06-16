import { createSwitchRecipe } from "@marwes-ui/core"
import type { SwitchOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SwitchProps = SwitchOptions & {
  className?: string
  modelValue?: boolean
  onCheckedChange?: (checked: boolean) => void
  onClick?: (event: MouseEvent) => void
  id?: string
}

const switchPropKeys = [
  "size",
  "checked",
  "modelValue",
  "disabled",
  "ariaLabel",
  "label",
  "ariaLabelledBy",
  "ariaDescribedBy",
  "className",
  "onCheckedChange",
  "onClick",
  "id",
] as const

export const Switch = defineComponent(
  (props: SwitchProps, { slots, emit }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: SwitchOptions = {}
      if (props.size !== undefined) opts.size = props.size
      const checked = props.modelValue ?? props.checked
      if (checked !== undefined) opts.checked = checked
      if (props.disabled !== undefined) opts.disabled = props.disabled
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      if (props.label !== undefined) opts.label = props.label
      if (props.ariaLabelledBy !== undefined) opts.ariaLabelledBy = props.ariaLabelledBy
      if (props.ariaDescribedBy !== undefined) opts.ariaDescribedBy = props.ariaDescribedBy
      return createSwitchRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const isDisabled = a11y.ariaDisabled === true
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
          disabled: isDisabled,
          role: a11y.role,
          "aria-checked": a11y.ariaChecked,
          "aria-disabled": a11y.ariaDisabled,
          "aria-label": a11y.ariaLabel,
          "aria-labelledby": a11y.ariaLabelledBy,
          "aria-describedby": a11y.ariaDescribedBy,
          onClick: (event: MouseEvent) => {
            props.onClick?.(event)

            if (isDisabled || event.defaultPrevented) {
              return
            }

            const nextChecked = !a11y.ariaChecked
            props.onCheckedChange?.(nextChecked)
            emit("update:modelValue", nextChecked)
            emit("checked-change", nextChecked)
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
    emits: ["update:modelValue", "checked-change"],
  },
)
