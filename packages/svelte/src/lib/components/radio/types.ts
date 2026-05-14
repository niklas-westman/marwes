import type { RadioOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface RadioProps extends RadioOptions {
  checked?: boolean
  onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void
  oncheckedchange?: (checked: boolean) => void
  class?: string
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
