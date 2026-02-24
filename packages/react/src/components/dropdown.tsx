import type { CssVars, DropdownOptions } from "@marwes-ui/core"
import { createDropdownRecipe } from "@marwes-ui/core"
import type * as React from "react"
import { useRenderKitDebug } from "../hooks/use-renderkit-debug"
import { useTheme } from "../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type DropdownOption = {
  value: string
  label: string
  disabled?: boolean
}

export type DropdownProps = DropdownOptions & {
  options: DropdownOption[]
  onValueChange?: (value: string) => void
  className?: string
}

export function Dropdown(props: DropdownProps) {
  const { options, onValueChange, className: customClassName, ...coreOptions } = props

  const theme = useTheme()
  const kit = createDropdownRecipe(theme, coreOptions)

  // Debug hook for Storybook RenderKit addon
  useRenderKitDebug(kit, "Dropdown")

  const style = kit.vars as StyleWithVars
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange?.(e.target.value)
  }

  return (
    <select
      className={className}
      style={style}
      id={kit.a11y.id}
      name={kit.a11y.name}
      disabled={kit.a11y.disabled}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      value={props.value}
      defaultValue={props.defaultValue}
      onChange={handleChange}
    >
      {props.placeholder && (
        <option value="" disabled hidden>
          {props.placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
