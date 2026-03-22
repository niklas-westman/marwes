/**
 * Core types for Radio.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export interface RadioOptions {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean

  id?: string
  name?: string
  value?: string

  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface RadioA11y {
  type: "radio"
  id?: string
  name?: string
  value?: string
  disabled?: true
  required?: true
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaInvalid?: true
}

export interface RadioRenderKit {
  tag: "input"
  className: string
  vars: Record<string, string>
  a11y: RadioA11y
  checked?: boolean
  defaultChecked?: boolean
}
