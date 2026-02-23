import { paragraphRecipe } from "@marwes-ui/core"
import type { CssVars, ParagraphOptions, ParagraphSize } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import {
  getDefaultSlotChildren,
  mergeClassNames,
  mergeStyles,
  omitAttrs,
} from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"

export type ParagraphProps = ParagraphOptions & {
  size?: ParagraphSize
  className?: string
}

export const Paragraph = defineComponent({
  name: "MarwesParagraph",
  inheritAttrs: false,
  props: ["size", "id", "className"],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as ParagraphProps
    const attrs = useAttrs()
    const theme = useTheme()
    const kit = computed(() => paragraphRecipe(props, theme.value))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h(
        "p",
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
})
