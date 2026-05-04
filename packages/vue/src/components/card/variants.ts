import { defineComponent, h } from "vue"
import { Card, type CardProps } from "./card"

const cardPropKeys = ["className", "id", "dataAttributes"] as const

export type ProductCardProps = CardProps

export const ProductCard = defineComponent({
  name: "MarwesProductCard",
  inheritAttrs: false,
  props: [...cardPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as ProductCardProps

    return () =>
      h(
        Card,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "product-card",
          },
        },
        slots,
      )
  },
})

export type ProfileCardProps = CardProps

export const ProfileCard = defineComponent({
  name: "MarwesProfileCard",
  inheritAttrs: false,
  props: [...cardPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as ProfileCardProps

    return () =>
      h(
        Card,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "profile-card",
          },
        },
        slots,
      )
  },
})

export interface StatCardProps extends CardProps {
  /** Primary metric value rendered with metric-tile semantics. */
  value?: string | number
  /** Supporting label or explanatory note for the metric. */
  note?: string
  /** Optional trend, status, or comparison content. */
  meta?: string
}

export const StatCard = defineComponent({
  name: "MarwesStatCard",
  inheritAttrs: false,
  props: [...cardPropKeys, "value", "note", "meta"],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as StatCardProps

    return () => {
      const hasMetricTileContent =
        props.value !== undefined || props.note !== undefined || props.meta !== undefined

      return h(
        Card,
        {
          ...attrs,
          className: props.className,
          id: props.id,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "stat-card",
          },
        },
        hasMetricTileContent
          ? {
              default: () =>
                h("div", { class: "mw-stat-card__metric", "data-slot": "metric-tile" }, [
                  props.value !== undefined
                    ? h("strong", { class: "mw-stat-card__value" }, String(props.value))
                    : null,
                  props.note !== undefined
                    ? h("span", { class: "mw-stat-card__note" }, props.note)
                    : null,
                  props.meta !== undefined
                    ? h("span", { class: "mw-stat-card__meta" }, props.meta)
                    : null,
                ]),
            }
          : slots,
      )
    }
  },
})
