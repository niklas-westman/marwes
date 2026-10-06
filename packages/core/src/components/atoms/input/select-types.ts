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
  /** ID of an element whose text labels the select. Wins over `ariaLabel` if both are set. */
  ariaLabelledBy?: string
  label?: string
}

export type SelectA11yProps = {
  id?: string
  name?: string
  disabled?: true
  required?: true
  ariaLabel?: string
  ariaLabelledBy?: string
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

/** ARIA fields for the custom (non-native) select trigger, which acts as a combobox. */
export interface SelectComboboxA11yProps {
  role: "combobox"
  ariaControls: string
  ariaExpanded: boolean
  ariaHaspopup: "listbox"
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaInvalid?: true
  ariaRequired?: true
  ariaActivedescendant?: string
}

export interface SelectListboxA11yProps {
  id: string
  role: "listbox"
  tabIndex: -1
}

export interface SelectOptionA11yProps {
  id: string
  role: "option"
  ariaSelected: boolean
  ariaDisabled?: true
  tabIndex: -1
}
