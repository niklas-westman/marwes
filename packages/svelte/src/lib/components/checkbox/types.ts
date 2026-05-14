import type { CheckboxProps as CoreCheckboxProps } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface CheckboxProps extends Omit<CoreCheckboxProps, "ariaDescribedBy"> {
  checked?: boolean
  onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void
  oncheckedchange?: (checked: boolean) => void
  class?: string
  ariaDescribedBy?: string | undefined
}

export interface CheckboxFieldProps {
  id?: string
  label: string
  description?: string
  error?: string
  checkbox?: CheckboxProps
  ariaDescribedBy?: string
  checked?: boolean
  class?: string
}

export interface CheckboxGroupFieldProps {
  id?: string
  label: string
  description?: string
  error?: string
  ariaDescribedBy?: string
  children?: Snippet
  class?: string
}
