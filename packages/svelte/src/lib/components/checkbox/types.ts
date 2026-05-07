import type { CheckboxProps as CoreCheckboxProps } from "@marwes-ui/core"

export interface CheckboxProps extends Omit<CoreCheckboxProps, "ariaDescribedBy"> {
  checked?: boolean
  onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void
  oncheckedchange?: (checked: boolean) => void
  class?: string
  ariaDescribedBy?: string | undefined
}
