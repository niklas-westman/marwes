import { BadgeGroup, NotificationBadge, StatusBadge } from "@marwes-ui/react"

export function Example() {
  return (
    <BadgeGroup label="Account status">
      <StatusBadge variant="success">Active</StatusBadge>
      <NotificationBadge variant="info" ariaLabel="3 unread messages">
        3
      </NotificationBadge>
    </BadgeGroup>
  )
}
