/**
 * Vue adapter for the Marwes Stack layout primitive.
 * - Renders a flex container whose gap and padding come only from spacing tokens.
 * - Emits every resolved layout value as a data attribute.
 */

import { createStackRecipe } from "@marwes-ui/core"
import type { StackOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
import { getDefaultSlotChildren, mergeClassNames, omitAttrs } from "../../internal/render-utils"

export type StackProps = StackOptions & {
  className?: string
}

const stackPropKeys = definePropKeys<StackProps>()([
  "direction",
  "gap",
  "rowGap",
  "columnGap",
  "padding",
  "paddingX",
  "paddingY",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "alignItems",
  "justifyContent",
  "wrap",
  "as",
  "horizontalSizing",
  "verticalSizing",
  "className",
])

export const Stack = defineComponent(
  (props: StackProps, { slots }) => {
    const attrs = useAttrs()
    const kit = computed(() => createStackRecipe(props))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        renderKit.tag,
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          class: mergeClassNames(renderKit.className, props.className, attrs.class),
          // Vue normalises array styles and the later entry wins, so the token-backed
          // --mw-stack-* vars cannot be overridden by a consumer style string or object.
          style: [attrs.style, renderKit.vars],
        },
        getDefaultSlotChildren(slots),
      )
    }
  },
  {
    name: "MarwesStack",
    inheritAttrs: false,
    props: [...stackPropKeys],
  },
)
