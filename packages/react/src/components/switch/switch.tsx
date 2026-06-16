import { createSwitchRecipe } from "@marwes-ui/core"
import type { SwitchOptions } from "@marwes-ui/core"
import type * as React from "react"

export type SwitchProps = SwitchOptions & {
  /** Label text rendered next to the toggle */
  children?: React.ReactNode
  className?: string
  id?: string
  onCheckedChange?: (checked: boolean) => void
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function Switch(props: SwitchProps): React.ReactElement {
  const { children, className, id, onCheckedChange, onClick, ...coreProps } = props
  const kit = createSwitchRecipe(coreProps)
  const { a11y } = kit
  const isDisabled = a11y.ariaDisabled === true

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event)

    if (isDisabled || event.defaultPrevented) {
      return
    }

    onCheckedChange?.(!a11y.ariaChecked)
  }

  return (
    <button
      id={id}
      type="button"
      role={a11y.role}
      disabled={isDisabled}
      aria-checked={a11y.ariaChecked}
      aria-disabled={a11y.ariaDisabled}
      aria-label={a11y.ariaLabel}
      aria-labelledby={a11y.ariaLabelledBy}
      aria-describedby={a11y.ariaDescribedBy}
      className={[kit.className, className].filter(Boolean).join(" ")}
      style={kit.vars}
      onClick={handleClick}
    >
      <span className="mw-switch__track">
        <span className="mw-switch__thumb" />
      </span>
      {children}
    </button>
  )
}
