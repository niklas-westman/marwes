/**
 * React adapter for Marwes Tab.
 * - Renders a native <button> using the core render kit.
 * - Applies strict a11y fields and modifier classes.
 */

import { createTabRecipe } from "@marwes-ui/core"
import type { TabOptions } from "@marwes-ui/core"
import type * as React from "react"

export type TabProps = TabOptions & {
  children?: React.ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  id?: string
}

export function Tab(props: TabProps): React.ReactElement {
  const { children, className, onClick, id, ...coreProps } = props
  const kit = createTabRecipe(coreProps)
  const { a11y } = kit

  return (
    <button
      id={id}
      className={[kit.className, className].filter(Boolean).join(" ")}
      style={Object.keys(kit.vars).length > 0 ? kit.vars : undefined}
      role={a11y.role}
      aria-selected={a11y.ariaSelected}
      aria-disabled={a11y.ariaDisabled}
      aria-label={a11y.ariaLabel}
      aria-controls={a11y.ariaControls}
      tabIndex={a11y.tabIndex}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
