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
    const { value, note, meta, ...cardProps } = props

    return () => {
      const hasMetricTileContent = value !== undefined || note !== undefined || meta !== undefined

      return h(
        Card,
        {
          ...attrs,
          ...cardProps,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "stat-card",
          },
        },
        hasMetricTileContent
          ? {
              default: () =>
                h("div", { class: "mw-stat-card__metric", "data-slot": "metric-tile" }, [
                  value !== undefined
                    ? h("strong", { class: "mw-stat-card__value" }, String(value))
                    : null,
                  note !== undefined ? h("span", { class: "mw-stat-card__note" }, note) : null,
                  meta !== undefined ? h("span", { class: "mw-stat-card__meta" }, meta) : null,
                ]),
            }
          : slots,
      )
    }
  },
})
