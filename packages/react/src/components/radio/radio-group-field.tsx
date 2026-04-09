/**
 * RadioGroupField (Molecule) — Recommended
 *
 * An accessible radio group with field semantics: group label, optional
 * description, optional error, and selection state management.
 *
 * Composes `Radio` atoms into a `role="radiogroup"` container with:
 * - a visible label wired via `aria-labelledby`
 * - optional `description` and `error` regions
 * - automatic `aria-describedby` wiring (description + error + external IDs)
 * - automatic `aria-invalid` when `error` is present
 * - controlled (`value` + `onChange`) or uncontrolled (`defaultValue`) state
 *
 * Use `RadioGroupField` for most forms. Use `Radio` directly only when you
 * need a highly custom layout (tables, list rows, compound list items, etc.).
 *
 * **AI Context:**
 * - Renders `role="radiogroup"` with proper ARIA wiring
 * - Manages selection state for child Radio atoms
 * - All child radios share the same `name` for native keyboard navigation
 * - Supports both controlled and uncontrolled patterns
 *
 * @example Basic (uncontrolled)
 * ```tsx
 * <RadioGroupField
 *   name="color"
 *   label="Favorite color"
 *   options={[
 *     { value: "red", label: "Red" },
 *     { value: "blue", label: "Blue" },
 *     { value: "green", label: "Green" },
 *   ]}
 *   defaultValue="red"
 * />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [color, setColor] = React.useState("red");
 *
 * <RadioGroupField
 *   name="color"
 *   label="Favorite color"
 *   options={[
 *     { value: "red", label: "Red" },
 *     { value: "blue", label: "Blue" },
 *   ]}
 *   value={color}
 *   onChange={setColor}
 * />
 * ```
 *
 * @example With description and error
 * ```tsx
 * <RadioGroupField
 *   name="plan"
 *   label="Select a plan"
 *   description="Choose the plan that best fits your needs."
 *   error="Please select a plan to continue."
 *   options={[
 *     { value: "free", label: "Free" },
 *     { value: "pro", label: "Pro" },
 *   ]}
 * />
 * ```
 */

import { buildRadioGroupFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Paragraph } from "../paragraph"
import { Radio } from "./radio"

export interface RadioGroupFieldOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface RadioGroupFieldProps {
  /** Shared name for all radio inputs in the group. */
  name: string

  /** Visible label for the radio group. */
  label: React.ReactNode

  /** Optional description text below the label. */
  description?: React.ReactNode

  /** Error message. When present, sets aria-invalid on the group. */
  error?: React.ReactNode

  /** Controlled: current selected value. */
  value?: string

  /** Controlled: called with the new value when selection changes. */
  onChange?: (value: string) => void

  /** Uncontrolled: initial selected value. */
  defaultValue?: string

  /** Radio options to render. */
  options: RadioGroupFieldOption[]

  /** Disables all radio inputs in the group. */
  disabled?: boolean

  /** Marks the group as required. */
  required?: boolean

  /** Explicit ID. If omitted, generated via useId(). */
  id?: string

  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string

  /** Data attributes for AI-friendly metadata (used by context variants). */
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

export function RadioGroupField(props: RadioGroupFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-radio-group-${reactId}`

  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)
  const isInvalid = hasError || false

  const { labelId, descriptionId, errorId, describedBy } = buildRadioGroupFieldA11yIds({
    id,
    hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  // Controlled vs uncontrolled state
  const isControlled = props.value !== undefined
  const [internalValue, setInternalValue] = React.useState(props.defaultValue)
  const selectedValue = isControlled ? props.value : internalValue

  const handleSelect = (optionValue: string): void => {
    if (!isControlled) {
      setInternalValue(optionValue)
    }
    props.onChange?.(optionValue)
  }

  const wrapperClass = cx(
    "mw-radio-group-field",
    props.disabled && "mw-radio-group-field--disabled",
    isInvalid && "mw-radio-group-field--invalid",
  )

  return (
    <div className={wrapperClass} {...props.dataAttributes}>
      <div className="mw-radio-group-field__label" id={labelId}>
        <Paragraph size="md">{props.label}</Paragraph>
      </div>

      {hasDescription && (
        <div className="mw-radio-group-field__description" id={descriptionId}>
          <Paragraph size="sm">{props.description}</Paragraph>
        </div>
      )}

      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={isInvalid ? true : undefined}
        aria-required={props.required ? true : undefined}
        className="mw-radio-group-field__options"
      >
        {props.options.map(({ value, label, disabled: optionDisabled }) => {
          const optionId = `${id}-option-${value}`
          const isDisabled = props.disabled || optionDisabled || false

          return (
            <label key={value} className="mw-radio-group-field__option" htmlFor={optionId}>
              <Radio
                id={optionId}
                name={props.name}
                value={value}
                checked={selectedValue === value}
                disabled={isDisabled}
                invalid={isInvalid}
                {...(props.required ? { required: true } : {})}
                onCheckedChange={(checked) => {
                  if (checked) handleSelect(value)
                }}
              />
              <Paragraph size="sm">{label}</Paragraph>
            </label>
          )
        })}
      </div>

      {hasError && (
        <div className="mw-radio-group-field__error" id={errorId} aria-live="polite">
          <Paragraph size="sm">{props.error}</Paragraph>
        </div>
      )}
    </div>
  )
}
