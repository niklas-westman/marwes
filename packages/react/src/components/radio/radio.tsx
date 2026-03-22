/**
 * React adapter for Marwes Radio.
 * - Renders a native <input type="radio"> using the core render kit.
 * - Applies strict a11y fields and modifier classes.
 */

import { radioRecipe } from "@marwes-ui/core"
import type { RadioOptions } from "@marwes-ui/core"
import type * as React from "react"

export type RadioProps = RadioOptions & {
  /** Called with the next checked value when the user selects this radio. */
  onCheckedChange?: (checked: boolean) => void
  /** Raw event access escape hatch. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export function Radio(props: RadioProps): React.ReactElement {
  const { onCheckedChange, onChange, ...coreProps } = props
  const kit = radioRecipe(coreProps)
  const { a11y } = kit

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e)
    onCheckedChange?.(e.currentTarget.checked)
  }

  return (
    <input
      type="radio"
      className={kit.className}
      id={a11y.id}
      name={a11y.name}
      value={a11y.value}
      disabled={a11y.disabled === true}
      required={a11y.required === true}
      aria-label={a11y.ariaLabel}
      aria-labelledby={a11y.ariaLabelledBy}
      aria-describedby={a11y.ariaDescribedBy}
      aria-invalid={a11y.ariaInvalid === true ? true : undefined}
      checked={kit.checked}
      defaultChecked={kit.defaultChecked}
      onChange={handleChange}
    />
  )
}
