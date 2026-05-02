import { createCardRecipe } from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export interface CardProps {
  className?: string
  id?: string
  /** Data attributes for AI-friendly metadata (used by purpose variants). */
  dataAttributes?: Record<string, string>
}

const cardPropKeys = ["className", "id", "dataAttributes"] as const

export const Card = defineComponent(
  (props: CardProps, { slots }) => {
    const attrs = useAttrs()

    return () => {
      const kit = createCardRecipe(
        props.dataAttributes ? { dataAttributes: props.dataAttributes } : {},
      )
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(kit.className, props.className, attrs.class)

      return h(
        "div",
        { ...passthroughAttrs, ...kit.dataAttributes, id: props.id, class: className },
        [
          slots.title
            ? h("div", { class: "mw-card__header" }, [
                h("span", { class: "mw-card__title" }, slots.title()),
              ])
            : null,
          h("div", { class: "mw-card__body" }, slots.default?.()),
        ].filter(Boolean),
      )
    }
  },
  {
    name: "MarwesCard",
    inheritAttrs: false,
    props: [...cardPropKeys],
  },
)
