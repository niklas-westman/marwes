import { type CssVars, type TooltipOptions, createTooltipRecipe } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type TooltipProps = TooltipOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const tooltipPropKeys = ["id", "className", "dataAttributes"] as const

export const Tooltip = defineComponent(
  (props: TooltipProps, { slots }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const tooltipOptions: TooltipOptions = {}

      if (props.id !== undefined) {
        tooltipOptions.id = props.id
      }

      return createTooltipRecipe(tooltipOptions)
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          ...(props.dataAttributes ?? {}),
          id: renderKit.a11y.id,
          class: className,
          style,
          role: renderKit.a11y.role,
        },
        slots.default?.(),
      )
    }
  },
  {
    name: "MarwesTooltip",
    inheritAttrs: false,
    props: [...tooltipPropKeys],
  },
)
