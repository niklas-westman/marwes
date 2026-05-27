import { textRecipe } from "@marwes-ui/core"
import type { CssVars, TextAs, TextOptions, TextVariant } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import {
  getDefaultSlotChildren,
  mergeClassNames,
  mergeStyles,
  omitAttrs,
} from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"

export type TextProps = TextOptions & {
  variant?: TextVariant
  as?: TextAs
  className?: string
}

const textPropKeys = ["variant", "as", "id", "className"] as const

export const Text = defineComponent(
  (props: TextProps, { slots }) => {
    const attrs = useAttrs()
    const theme = useTheme()
    const kit = computed(() => textRecipe(props, theme))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h(
        renderKit.tag,
        {
          ...passthroughAttrs,
          id: renderKit.a11y.id,
          class: className,
          style,
        },
        getDefaultSlotChildren(slots),
      )
    }
  },
  {
    name: "MarwesText",
    inheritAttrs: false,
    props: [...textPropKeys],
  },
)

export type TextComponent = typeof Text
export const TypographyText = Text
