/**
 * React adapter for Marwes Tab.
 * - Renders a native <button> using the core render kit.
 * - Applies strict a11y fields and modifier classes.
 */

import { createTabRecipe, toTabHtmlAttributes } from "@marwes-ui/core"
import type { TabOptions } from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

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
      {...toReactAttributes(toTabHtmlAttributes(a11y))}
      disabled={coreProps.disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}
