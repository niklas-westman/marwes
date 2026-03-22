import { createBadgeRecipe } from "@marwes-ui/core"
import type { BadgeOptions } from "@marwes-ui/core"
import type * as React from "react"

export type BadgeProps = BadgeOptions & {
  children?: React.ReactNode
  className?: string
  id?: string
}

export function Badge(props: BadgeProps): React.ReactElement {
  const { children, className, id, ...coreProps } = props
  const kit = createBadgeRecipe(coreProps)

  return (
    <span
      id={id}
      className={[kit.className, className].filter(Boolean).join(" ")}
      aria-label={kit.a11y.ariaLabel}
    >
      {children}
    </span>
  )
}
