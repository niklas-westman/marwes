import type { RadioOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface RadioProps extends RadioOptions {
  checked?: boolean
  onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void
  oncheckedchange?: (checked: boolean) => void
  class?: string
}

export interface RadioGroupFieldOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupFieldProps {
  id?: string
  label: string
  description?: string
  error?: string
  ariaDescribedBy?: string
  required?: boolean
  disabled?: boolean
  dataAttributes?: Record<string, string>
  children?: Snippet
  class?: string
}

export interface YesNoRadioGroupProps {
  name: string
  label: string
  description?: string
  error?: string
  yesLabel?: string
  noLabel?: string
  value?: string
  defaultValue?: string
  onchange?: (value: string) => void
  disabled?: boolean
  class?: string
}

export interface RatingRadioGroupProps {
  name: string
  label: string
  description?: string
  error?: string
  min?: number
  max?: number
  labelFn?: (value: number) => string
  value?: string
  defaultValue?: string
  onchange?: (value: string) => void
  disabled?: boolean
  class?: string
}

export interface OptionRadioGroupProps {
  name: string
  label: string
  description?: string
  error?: string
  ariaDescribedBy?: string
  options: RadioGroupFieldOption[]
  value?: string
  defaultValue?: string
  onchange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  class?: string
}
