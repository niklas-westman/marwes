import type { CssVars } from "../../../shared/css-vars"

export type DropdownTone = "default" | "danger" | "success"
export type DropdownSize = "sm" | "md" | "lg"

export type DropdownOptions = {
  id?: string
  name?: string

  value?: string
  defaultValue?: string

  placeholder?: string
  disabled?: boolean
  required?: boolean

  tone?: DropdownTone
  size?: DropdownSize
  invalid?: boolean
  describedBy?: string

  ariaLabel?: string
}

export type DropdownA11yProps = {
  id?: string
  name?: string

  disabled?: true
  required?: true

  ariaLabel?: string
  ariaInvalid?: true
  ariaDescribedBy?: string
}

export type DropdownRenderKit = {
  tag: "select"
  className: string
  vars: CssVars
  a11y: DropdownA11yProps
}
