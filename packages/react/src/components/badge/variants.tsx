/**
 * Purpose Components — Badge
 *
 * Pre-configured badge compositions that encode a specific semantic purpose.
 * Each sets `data-purpose` for machine-readable intent while keeping the
 * visual `variant` prop for presentation only.
 */

import type * as React from "react"
import { Badge, type BadgeProps } from "./badge"

// ============================================================================
// STATUS BADGE - Operational/lifecycle status
// ============================================================================

export type StatusBadgeProps = BadgeProps

/**
 * StatusBadge - For operational or lifecycle status indicators.
 *
 * **AI Context:**
 * - Adds `data-purpose="status"` for AI parsing
 * - Ideal for active/inactive, online/offline, enabled/disabled states
 *
 * @example
 * ```tsx
 * import { BadgeVariant } from "@marwes-ui/core";
 *
 * <StatusBadge variant={BadgeVariant.success}>Active</StatusBadge>
 * <StatusBadge variant={BadgeVariant.error}>Offline</StatusBadge>
 * ```
 */
export function StatusBadge(props: StatusBadgeProps): React.ReactElement {
  return (
    <Badge
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "status",
      }}
    />
  )
}

// ============================================================================
// PRIORITY BADGE - Urgency or importance levels
// ============================================================================

export type PriorityBadgeProps = BadgeProps

/**
 * PriorityBadge - For urgency or importance indicators.
 *
 * **AI Context:**
 * - Adds `data-purpose="priority"` for AI parsing
 * - Ideal for critical/high/medium/low priority labels
 *
 * @example
 * ```tsx
 * import { BadgeVariant } from "@marwes-ui/core";
 *
 * <PriorityBadge variant={BadgeVariant.error}>Critical</PriorityBadge>
 * <PriorityBadge variant={BadgeVariant.warning}>High</PriorityBadge>
 * ```
 */
export function PriorityBadge(props: PriorityBadgeProps): React.ReactElement {
  return (
    <Badge
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "priority",
      }}
    />
  )
}

// ============================================================================
// NOTIFICATION BADGE - Counts and alerts
// ============================================================================

export type NotificationBadgeProps = BadgeProps

/**
 * NotificationBadge - For notification counts and alert indicators.
 *
 * **AI Context:**
 * - Adds `data-purpose="notification"` for AI parsing
 * - Ideal for unread counts, new items, alert badges
 * - Always provide `ariaLabel` for numeric-only content
 *
 * @example
 * ```tsx
 * import { BadgeVariant } from "@marwes-ui/core";
 *
 * <NotificationBadge variant={BadgeVariant.info} ariaLabel="5 unread messages">5</NotificationBadge>
 * <NotificationBadge variant={BadgeVariant.brand}>New</NotificationBadge>
 * ```
 */
export function NotificationBadge(props: NotificationBadgeProps): React.ReactElement {
  return (
    <Badge
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "notification",
      }}
    />
  )
}
