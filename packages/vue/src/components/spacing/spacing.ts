import { createSpacingRecipe } from "@marwes-ui/core"
import type { CssVars, SpacingOptions, SpacingSize } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type SpacingProps = SpacingOptions & {
  size?: SpacingSize
  spacing?: SpacingSize
  className?: string
}

export type SpacerProps = SpacingProps

const spacingPropKeys = ["size", "spacing", "scale", "className"] as const

export const Spacing = defineComponent(
  (props: SpacingProps) => {
    const attrs = useAttrs()
    const kit = computed(() => {
      const resolvedSize = props.spacing ?? props.size

      return createSpacingRecipe({
        ...(resolvedSize !== undefined ? { size: resolvedSize } : {}),
        ...(props.scale !== undefined ? { scale: props.scale } : {}),
      })
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h("div", {
        ...passthroughAttrs,
        ...renderKit.a11y,
        ...renderKit.dataAttributes,
        class: className,
        style,
      })
    }
  },
  {
    name: "MarwesSpacing",
    inheritAttrs: false,
    props: [...spacingPropKeys],
  },
)

export const Spacer = Spacing
