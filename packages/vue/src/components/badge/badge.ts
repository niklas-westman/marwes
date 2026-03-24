import { createBadgeRecipe } from "@marwes-ui/core"
import type { BadgeOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, mergeStyles, omitAttrs } from "../../internal/render-utils"

export type BadgeProps = BadgeOptions & {
  className?: string
  id?: string
  /** Data attributes for AI-friendly metadata (used by context variants). */
  dataAttributes?: Record<string, string>
}

const badgePropKeys = ["variant", "ariaLabel", "className", "id", "dataAttributes"] as const

export const Badge = defineComponent(
  (props: BadgeProps, { slots }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: BadgeOptions = {}
      if (props.variant !== undefined) opts.variant = props.variant
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      return createBadgeRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const a11y = renderKit.a11y
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.className, props.className, attrs.class)
      const style = mergeStyles(renderKit.vars, attrs.style)

      return h(
        "span",
        {
          ...passthroughAttrs,
          ...(props.dataAttributes ?? {}),
          id: props.id,
          class: className,
          style,
          "aria-label": a11y.ariaLabel,
        },
        slots.default?.(),
      )
    }
  },
  {
    name: "MarwesBadge",
    inheritAttrs: false,
    props: [...badgePropKeys],
  },
)
