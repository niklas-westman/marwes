import { buildCheckboxGroupFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Paragraph } from "../paragraph"
import { Checkbox, type CheckboxProps } from "./checkbox"

export interface CheckboxGroupFieldOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
  indeterminate?: boolean
}

export type CheckboxGroupFieldCheckboxProps = Omit<
  CheckboxProps,
  | "ariaDescribedBy"
  | "ariaLabel"
  | "ariaLabelledBy"
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "id"
  | "indeterminate"
  | "invalid"
  | "name"
  | "onChange"
  | "onCheckedChange"
  | "required"
  | "value"
>

export interface CheckboxGroupFieldProps {
  label: React.ReactNode
  options: CheckboxGroupFieldOption[]
  description?: React.ReactNode
  error?: React.ReactNode
  value?: string[]
  onChange?: (value: string[]) => void
  defaultValue?: string[]
  checkbox?: CheckboxGroupFieldCheckboxProps
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) return false
  if (typeof value === "string") return value.trim().length > 0
  return true
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function orderSelectedValues(values: string[], options: CheckboxGroupFieldOption[]): string[] {
  const optionValues = new Set(options.map((option) => option.value))
  const selectedValues = new Set(values)
  const knownValues = options
    .map((option) => option.value)
    .filter((value) => selectedValues.has(value))
  const unknownValues = values.filter((value) => !optionValues.has(value))
  return [...knownValues, ...unknownValues]
}

export function CheckboxGroupField(props: CheckboxGroupFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-checkbox-group-${reactId}`

  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)
  const isInvalid = hasError

  const { labelId, descriptionId, errorId, describedBy } = buildCheckboxGroupFieldA11yIds({
    id,
    hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const isControlled = props.value !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    orderSelectedValues(props.defaultValue ?? [], props.options),
  )
  const selectedValues = orderSelectedValues(
    isControlled ? (props.value ?? []) : internalValue,
    props.options,
  )
  const selectedValueSet = new Set(selectedValues)

  const handleToggle = (nextValue: string): void => {
    const rawNextValue = selectedValueSet.has(nextValue)
      ? selectedValues.filter((value) => value !== nextValue)
      : [...selectedValues, nextValue]
    const orderedNextValue = orderSelectedValues(rawNextValue, props.options)

    if (!isControlled) {
      setInternalValue(orderedNextValue)
    }

    props.onChange?.(orderedNextValue)
  }

  const wrapperClass = cx(
    "mw-checkbox-group-field",
    props.disabled && "mw-checkbox-group-field--disabled",
    isInvalid && "mw-checkbox-group-field--invalid",
  )

  return (
    <fieldset
      className={wrapperClass}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-invalid={isInvalid ? true : undefined}
      aria-required={props.required ? true : undefined}
      disabled={props.disabled ? true : undefined}
      {...props.dataAttributes}
    >
      <legend className="mw-checkbox-group-field__label" id={labelId}>
        <Paragraph size="md">{props.label}</Paragraph>
      </legend>

      {hasDescription && (
        <div className="mw-checkbox-group-field__description" id={descriptionId}>
          <Paragraph size="sm">{props.description}</Paragraph>
        </div>
      )}

      <div className="mw-checkbox-group-field__options">
        {props.options.map((option, index) => {
          const optionId = `${id}-option-${index}`
          const isOptionDisabled = props.disabled || option.disabled || false
          const checkboxProps: CheckboxProps = {
            ...(props.checkbox ?? {}),
            id: optionId,
            value: option.value,
            checked: selectedValueSet.has(option.value),
            disabled: isOptionDisabled,
            invalid: isInvalid,
            onCheckedChange: () => handleToggle(option.value),
          }

          if (props.name !== undefined) {
            checkboxProps.name = props.name
          }

          if (option.indeterminate !== undefined) {
            checkboxProps.indeterminate = option.indeterminate
          }

          return (
            <label
              key={option.value}
              className="mw-checkbox-group-field__option"
              htmlFor={optionId}
            >
              <Checkbox {...checkboxProps} />
              <Paragraph size="md">{option.label}</Paragraph>
            </label>
          )
        })}
      </div>

      {hasError && (
        <div className="mw-checkbox-group-field__error" id={errorId} aria-live="polite">
          <Paragraph size="sm">{props.error}</Paragraph>
        </div>
      )}
    </fieldset>
  )
}
