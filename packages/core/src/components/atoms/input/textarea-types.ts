import type { CssVars } from "../../../shared/css-vars"
import type { InputTone } from "./input-types"

export type TextareaResize = "none" | "both" | "horizontal" | "vertical"

export type TextareaOptions = {
  id?: string
  name?: string

  value?: string
  defaultValue?: string

  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean

  inputMode?: "text" | "email" | "numeric" | "tel" | "url" | "search" | "decimal"
  autoComplete?: string
  rows?: number
  cols?: number
  resize?: TextareaResize

  tone?: InputTone
  invalid?: boolean
  describedBy?: string

  /** Accessible name for standalone textareas. TextareaField should use visible `label`. */
  ariaLabel?: string
  /** ID of an element whose text labels the textarea. Wins over `ariaLabel` if both are set. */
  ariaLabelledBy?: string
  label?: string
}

export type TextareaA11yProps = {
  id?: string
  name?: string

  disabled?: true
  readOnly?: true
  required?: true

  inputMode?: TextareaOptions["inputMode"]
  autoComplete?: string
  placeholder?: string
  rows?: number
  cols?: number

  ariaLabel?: string
  ariaLabelledBy?: string
  ariaInvalid?: true
  ariaDescribedBy?: string
}

export type TextareaRenderKit = {
  tag: "textarea"
  className: string
  vars: CssVars
  a11y: TextareaA11yProps
}
