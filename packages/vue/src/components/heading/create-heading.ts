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

export type HeadingLevel = 1 | 2 | 3
type HeadingTag = `h${HeadingLevel}`

const headingPropKeys = ["size", "id", "ariaLabel", "className"] as const

export function createHeadingComponent<L extends HeadingLevel>(level: L) {
  const tagName = `h${level}` as HeadingTag
  return defineComponent(
    (props: HeadingBaseProps, { slots }) => {
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
    {
      name: `Marwes${tagName.toUpperCase()}`,
      inheritAttrs: false,
      props: [...headingPropKeys],
    },
  )
}

export type { HeadingBaseProps }
export type HeadingProps = HeadingBaseProps
