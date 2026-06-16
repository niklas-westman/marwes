import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { DatePicker } from "./date-picker"
import type { DatePickerProps } from "./date-picker"

export type DatePickerFieldProps = {
  /** Optional: if omitted, a stable id is generated via useId(). */
  id?: string

  /** Field label (required for accessibility). */
  label: string

  /** Optional helper text shown below the calendar. */
  helperText?: string

  /** Optional error message. */
  error?: string

  /** Props forwarded to the DatePicker atom. */
  datePicker?: Omit<DatePickerProps, "ariaLabel" | "ariaLabelledBy" | "calendarLabel">

  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string

  className?: string
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

/**
 * DatePickerField (Molecule)
 *
 * A labeled wrapper around `DatePicker` that:
 * - renders a visible `<label>` wired via `aria-labelledby`
 * - generates a stable id via `useId()` when one isn't provided
 * - optionally renders helper text and error messages
 * - threads `aria-describedby` to the calendar when helper/error are present
 */
export function DatePickerField(props: DatePickerFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-date-picker-${reactId}`
  const labelId = `${id}-label`

  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)

  const {
    helperTextId,
    errorId,
    describedBy: mergedDescribedBy,
  } = buildInputFieldA11yIds({
    id,
    hasHelperText,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const wrapperClass = cx(
    "mw-date-picker-field",
    hasError && "mw-date-picker-field--invalid",
    props.className,
  )

  return (
    <div className={wrapperClass}>
      <span className="mw-date-picker-field__label" id={labelId}>
        <Text variant="label">{props.label}</Text>
      </span>

      <DatePicker
        {...props.datePicker}
        ariaLabelledBy={labelId}
        {...(mergedDescribedBy ? { ariaDescribedBy: mergedDescribedBy } : {})}
      />

      {hasHelperText && !hasError && (
        <div className="mw-date-picker-field__helper" id={helperTextId}>
          <Text variant="caption">{props.helperText}</Text>
        </div>
      )}

      {hasError && (
        <div className="mw-date-picker-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
