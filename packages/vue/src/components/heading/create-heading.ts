import { headingRecipe } from "@marwes-ui/core"
import type { CssVars, HeadingOptions, HeadingSize } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import {
  getDefaultSlotChildren,
  mergeClassNames,
  mergeStyles,
  omitAttrs,
} from "../../internal/render-utils"
import { useTheme } from "../../provider/use-theme"

type HeadingBaseProps = Omit<HeadingOptions, "level"> & {
  size?: HeadingSize
  className?: string
}

export function createHeadingComponent(level: 1 | 2 | 3, tagName: "h1" | "h2" | "h3") {
  return defineComponent({
    name: `Marwes${tagName.toUpperCase()}`,
    inheritAttrs: false,
    props: ["size", "id", "ariaLabel", "className"],
    setup(rawProps, { slots }) {
      const props = rawProps as unknown as HeadingBaseProps
      const attrs = useAttrs()
      const theme = useTheme()
      const kit = computed(() => headingRecipe({ ...props, level }, theme.value))

      return () => {
        const renderKit = kit.value
        const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
        const className = mergeClassNames(renderKit.className, props.className, attrs.class)
        const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

        return h(
          tagName,
          {
            ...passthroughAttrs,
            id: renderKit.a11y.id,
            "aria-label": renderKit.a11y.ariaLabel,
            class: className,
            style,
          },
          getDefaultSlotChildren(slots),
        )
      }
    },
  })
}

export type { HeadingBaseProps }
