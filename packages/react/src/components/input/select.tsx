import type {
  SelectAppearance as CoreSelectAppearance,
  SelectOption as CoreSelectOption,
  CssVars,
  SelectOptions,
} from "@marwes-ui/core"
import { createSelectRecipe } from "@marwes-ui/core"
import * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { SelectArrowIcon } from "./select-arrow-icon"

type StyleWithVars = React.CSSProperties & CssVars

export type SelectAppearance = CoreSelectAppearance
export type SelectOption = CoreSelectOption

export type SelectProps = SelectOptions & {
  onValueChange?: (value: string) => void
  className?: string
}

function getInitialSelectValue(props: SelectProps): string {
  if (props.value !== undefined) {
    return props.value
  }

  if (props.defaultValue !== undefined) {
    return props.defaultValue
  }

  if (props.placeholder !== undefined) {
    return ""
  }

  return props.options[0]?.value ?? ""
}

export function Select(props: SelectProps) {
  const kit = createSelectRecipe(props)
  const isControlled = props.value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
    getInitialSelectValue(props),
  )

  useRenderKitDebug(kit, "Select")

  const style = kit.vars as StyleWithVars
  const className = props.className ? `${kit.className} ${props.className}` : kit.className
  const value = isControlled ? (props.value ?? "") : uncontrolledValue
  const hasPlaceholder = props.placeholder !== undefined
  const placeholderSelected = hasPlaceholder && value === ""

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = e.target.value

    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    props.onValueChange?.(nextValue)
  }

  const selectElement = (
    <select
      className={className}
      style={style}
      data-placeholder-selected={placeholderSelected ? "true" : undefined}
      id={kit.a11y.id}
      name={kit.a11y.name}
      disabled={kit.a11y.disabled}
      required={kit.a11y.required}
      aria-label={kit.a11y.ariaLabel}
      aria-invalid={kit.a11y.ariaInvalid}
      aria-describedby={kit.a11y.ariaDescribedBy}
      value={value}
      onChange={handleChange}
    >
      {props.placeholder ? (
        <option value="" disabled={props.required ? true : undefined}>
          {props.placeholder}
        </option>
      ) : null}
      {props.options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled ? true : undefined}
        >
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <span className="mw-select__control">
      {selectElement}
      <SelectArrowIcon className="mw-select__control-icon" />
    </span>
  )
}
