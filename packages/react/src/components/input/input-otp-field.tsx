import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { InputOtp, type InputOtpProps } from "./input-otp"

export type InputOtpFieldProps = {
  /** Optional: if omitted, a stable id is generated via useId(). */
  id?: string
  /** Field label (required for accessibility). */
  label: string
  /** Optional helper text shown below the cells. */
  helperText?: string
  /** Optional error message. */
  error?: string
  /** Props forwarded to the bare `InputOtp` atom. */
  inputOtp?: Omit<InputOtpProps, "id" | "ariaLabel" | "ariaLabelledBy" | "describedBy">
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
 * InputOtpField (Molecule)
 *
 * Labeled wrapper around the `InputOtp` atom. Renders the visible label,
 * the OTP cells (via the atom), and optional helper/error regions.
 * Auto-wires `aria-labelledby` and `aria-describedby`.
 *
 * Replaces the old self-contained `InputOtp` field — use this anywhere
 * you previously used `<InputOtp label={...} />`.
 */
export function InputOtpField(props: InputOtpFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-input-otp-${reactId}`
  const inputOtp = props.inputOtp ?? {}
  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)
  const invalid = hasError || inputOtp.invalid === true

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
    "mw-input-otp-field",
    hasError && "mw-input-otp-field--invalid",
    inputOtp.disabled && "mw-input-otp-field--disabled",
    props.className,
  )

  const otpProps: InputOtpProps = {
    ...inputOtp,
    id,
    invalid,
    ariaLabelledBy: `${id}-label`,
  }
  if (mergedDescribedBy) {
    otpProps.describedBy = mergedDescribedBy
  }

  return (
    <div className={wrapperClass}>
      <label className="mw-input-otp-field__label" htmlFor={id} id={`${id}-label`}>
        <Text variant="label">{props.label}</Text>
      </label>

      <InputOtp {...otpProps} />

      {hasError ? (
        <div className="mw-input-otp-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      ) : hasHelperText ? (
        <div className="mw-input-otp-field__helper" id={helperTextId}>
          <Text variant="caption">{props.helperText}</Text>
        </div>
      ) : null}
    </div>
  )
}
