import {
  type CssVars,
  type TooltipOptions,
  createTooltipRecipe,
  toTooltipHtmlAttributes,
} from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type TooltipProps = TooltipOptions & {
  className?: string
  dataAttributes?: Record<string, string>
}

const tooltipPropKeys = definePropKeys<TooltipProps>()(["id", "className", "dataAttributes"])

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
          class: className,
          style,
          ...toTooltipHtmlAttributes(renderKit.a11y),
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
