import { createTabRecipe } from "@marwes-ui/core"
import type { TabOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type TabProps = TabOptions & {
  className?: string
  onClick?: (event: MouseEvent) => void
  id?: string
}

const tabPropKeys = [
  "selected",
  "disabled",
  "ariaLabel",
  "label",
  "ariaControls",
  "className",
  "onClick",
  "id",
] as const

export const Tab = defineComponent(
  (props: TabProps, { slots }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: TabOptions = {}
      if (props.selected !== undefined) opts.selected = props.selected
      if (props.disabled !== undefined) opts.disabled = props.disabled
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      if (props.label !== undefined) opts.label = props.label
      if (props.ariaControls !== undefined) opts.ariaControls = props.ariaControls
      return createTabRecipe(opts)
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
          "aria-selected": a11y.ariaSelected,
          "aria-disabled": a11y.ariaDisabled,
          "aria-label": a11y.ariaLabel,
          "aria-controls": a11y.ariaControls,
          tabindex: a11y.tabIndex,
          disabled: props.disabled ? true : undefined,
          onClick: (event: MouseEvent) => {
            props.onClick?.(event)
          },
        },
        slots.default?.(),
      )
    }
  },
  {
    name: "MarwesTab",
    inheritAttrs: false,
    props: [...tabPropKeys],
    emits: ["click"],
  },
)
