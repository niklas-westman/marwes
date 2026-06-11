import { createPurposeSemanticAttributes } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { Badge, type BadgeProps } from "./badge"

const badgePropKeys = [
  "variant",
  "ariaLabel",
  "label",
  "className",
  "id",
  "dataAttributes",
] as const

// ============================================================================
// STATUS BADGE - Operational/lifecycle status
// ============================================================================

export type StatusBadgeProps = BadgeProps

export const StatusBadge = defineComponent({
  name: "MarwesStatusBadge",
  inheritAttrs: false,
  props: [...badgePropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as StatusBadgeProps

    return () =>
      h(
        Badge,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            ...createPurposeSemanticAttributes("status"),
          },
        },
        slots,
      )
  },
})

// ============================================================================
// PRIORITY BADGE - Urgency or importance levels
// ============================================================================

export type PriorityBadgeProps = BadgeProps

export const PriorityBadge = defineComponent({
  name: "MarwesPriorityBadge",
  inheritAttrs: false,
  props: [...badgePropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as PriorityBadgeProps

    return () =>
      h(
        Badge,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            ...createPurposeSemanticAttributes("priority"),
          },
        },
        slots,
      )
  },
})

// ============================================================================
// NOTIFICATION BADGE - Counts and alerts
// ============================================================================

export type NotificationBadgeProps = BadgeProps

export const NotificationBadge = defineComponent({
  name: "MarwesNotificationBadge",
  inheritAttrs: false,
  props: [...badgePropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as NotificationBadgeProps

    return () =>
      h(
        Badge,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            ...createPurposeSemanticAttributes("notification"),
          },
        },
        slots,
      )
  },
})
