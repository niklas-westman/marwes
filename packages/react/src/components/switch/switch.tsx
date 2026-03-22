import { createSwitchRecipe } from "@marwes-ui/core"
import type { SwitchOptions } from "@marwes-ui/core"
import type * as React from "react"

export type SwitchProps = SwitchOptions & {
  /** Label text rendered next to the toggle */
  children?: React.ReactNode
  className?: string
  id?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function Switch(props: SwitchProps): React.ReactElement {
  const { children, className, id, onClick, ...coreProps } = props
  const kit = createSwitchRecipe(coreProps)
  const { a11y } = kit

  return (
    <button
      id={id}
      type="button"
      role={a11y.role}
      aria-checked={a11y.ariaChecked}
      aria-disabled={a11y.ariaDisabled}
      aria-label={a11y.ariaLabel}
      aria-labelledby={a11y.ariaLabelledby}
      className={[kit.className, className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      <span className="mw-switch__track">
        <span className="mw-switch__thumb" />
      </span>
      {children}
    </button>
  )
}
