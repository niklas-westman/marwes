import type { CssVars } from "../../../shared/css-vars"
import type { InputTone } from "./input-types"

export type SelectAppearance = "marwes" | "native"
export type SelectMode = SelectAppearance

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type SelectOptions = {
  id?: string
  name?: string

  value?: string
  defaultValue?: string

  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  required?: boolean

  native?: boolean
  tone?: InputTone
  appearance?: SelectAppearance
  invalid?: boolean
  describedBy?: string

  /** Accessible name for standalone selects. SelectField should use visible `label`. */
  ariaLabel?: string
  label?: string
}

export type SelectA11yProps = {
  id?: string
  name?: string
  disabled?: true
  required?: true
  ariaLabel?: string
  ariaInvalid?: true
  ariaDescribedBy?: string
}

export type SelectRenderKit = {
  tag: "select"
  className: string
  vars: CssVars
  a11y: SelectA11yProps
}

export function resolveSelectMode(args: Pick<SelectOptions, "native" | "appearance">): SelectMode {
  if (args.native === true) {
    return "native"
  }

  if (args.native === false) {
    return "marwes"
  }

  return args.appearance ?? "marwes"
}
