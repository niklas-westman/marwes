/**
 * Vue adapter for the Marwes StackItem.
 * - A declared Stack child that carries horizontal/vertical sizing (fix | hug | fill).
 * - Sizing only has an effect when the parent is a Stack.
 */

import { createStackItemRecipe } from "@marwes-ui/core"
import type { StackItemOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
import { getDefaultSlotChildren, mergeClassNames, omitAttrs } from "../../internal/render-utils"

export type StackItemProps = StackItemOptions & {
  className?: string
}

const stackItemPropKeys = definePropKeys<StackItemProps>()([
  "as",
  "horizontalSizing",
  "verticalSizing",
  "className",
])

export const StackItem = defineComponent(
  (props: StackItemProps, { slots }) => {
    const attrs = useAttrs()
    const kit = computed(() => createStackItemRecipe(props))

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])

      return h(
        renderKit.tag,
        {
          ...passthroughAttrs,
          ...renderKit.dataAttributes,
          class: mergeClassNames(renderKit.className, props.className, attrs.class),
          style: [attrs.style, renderKit.vars],
        },
        getDefaultSlotChildren(slots),
      )
    }
  },
  {
    name: "MarwesStackItem",
    inheritAttrs: false,
    props: [...stackItemPropKeys],
  },
)
