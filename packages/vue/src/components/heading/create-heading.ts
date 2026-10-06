import { headingRecipe, toHeadingHtmlAttributes } from "@marwes-ui/core"
import type { CssVars, HeadingOptions, HeadingSize } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
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

const headingPropKeys = definePropKeys<HeadingBaseProps>()(["size", "id", "ariaLabel", "className"])

export function createHeadingComponent<L extends HeadingLevel>(level: L) {
  const tagName = `h${level}` as HeadingTag
  return defineComponent(
    (props: HeadingBaseProps, { slots }) => {
      const attrs = useAttrs()
      const theme = useTheme()
      const kit = computed(() => headingRecipe({ ...props, level }, theme))

      return () => {
        const renderKit = kit.value
        const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
        const className = mergeClassNames(renderKit.className, props.className, attrs.class)
        const style = mergeStyles(renderKit.vars as CssVars, attrs.style)

        return h(
          tagName,
          {
            ...passthroughAttrs,
            ...toHeadingHtmlAttributes(renderKit.a11y),
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
