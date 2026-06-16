import type { InputOtpA11yProps, InputOtpOptions } from "./input-otp-types"

export function resolveInputOtpA11y(options: InputOtpOptions): InputOtpA11yProps {
  const otpLength = Math.max(1, options.length ?? 6)
  const a11yProps: InputOtpA11yProps = {
    inputMode: "numeric",
    autoComplete: "one-time-code",
    maxLength: otpLength,
    pattern: "[0-9]*",
  }

  if (options.id) {
    a11yProps.id = options.id
  }

  if (options.name) {
    a11yProps.name = options.name
  }

  if (options.disabled) {
    a11yProps.disabled = true
  }

  if (options.readOnly) {
    a11yProps.readOnly = true
  }

  if (options.required) {
    a11yProps.required = true
  }

  if (options.ariaLabelledBy) {
    a11yProps.ariaLabelledBy = options.ariaLabelledBy
  } else if (options.ariaLabel) {
    a11yProps.ariaLabel = options.ariaLabel
  }

  if (options.invalid) {
    a11yProps.ariaInvalid = true
  }

  if (options.describedBy) {
    a11yProps.ariaDescribedBy = options.describedBy
  }

  return a11yProps
}
