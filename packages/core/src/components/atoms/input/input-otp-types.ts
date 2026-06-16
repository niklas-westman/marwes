import type { CssVars } from "../../../shared/css-vars"

export type InputOtpOptions = {
  id?: string
  name?: string

  value?: string
  defaultValue?: string

  length?: number
  placeholderCharacter?: string

  disabled?: boolean
  readOnly?: boolean
  required?: boolean

  invalid?: boolean
  describedBy?: string
  ariaLabel?: string
  /** ID of an element whose text labels the OTP input. Wins over `ariaLabel` if both are set. */
  ariaLabelledBy?: string
}

export type InputOtpA11yProps = {
  id?: string
  name?: string
  disabled?: true
  readOnly?: true
  required?: true
  inputMode: "numeric"
  autoComplete: "one-time-code"
  maxLength: number
  pattern: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaInvalid?: true
  ariaDescribedBy?: string
}

export type InputOtpDisplayCell = {
  key: string
  character: string
  filled: boolean
}

export type InputOtpRenderKit = {
  tag: "div"
  className: string
  vars: CssVars
  a11y: InputOtpA11yProps
  displayValue: string
  displayCharacters: string[]
  displayCells: InputOtpDisplayCell[]
}
