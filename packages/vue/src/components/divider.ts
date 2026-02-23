import { createDividerRecipe } from "@marwes-ui/core"
import type { CssVars, DividerOptions, DividerOrientation, DividerSize } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../internal/render-utils"
import { useTheme } from "../provider/use-theme"

export type DividerProps = DividerOptions & {
  size?: DividerSize
  orientation?: DividerOrientation
  className?: string
}

export const Divider = defineComponent({
  name: "MarwesDivider",
  inheritAttrs: false,
  props: ["size", "orientation", "id", "className"],
  setup(rawProps) {
    const props = rawProps as unknown as DividerProps
    const attrs = useAttrs()
    const theme = useTheme()
    const kit = computed(() => createDividerRecipe(theme.value, props))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

      return h("hr", {
        ...passthroughAttrs,
        ...renderKit.a11y,
        ...renderKit.dataAttributes,
        class: className,
        style,
      })
    }
  },
})
