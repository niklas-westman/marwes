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

export type StatCardProps = CardProps

export const StatCard = defineComponent({
  name: "MarwesStatCard",
  inheritAttrs: false,
  props: [...cardPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as StatCardProps

    return () =>
      h(
        Card,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "stat-card",
          },
        },
        slots,
      )
  },
})
