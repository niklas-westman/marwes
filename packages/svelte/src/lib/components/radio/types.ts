import type { RadioOptions } from "@marwes-ui/core"

export interface RadioProps extends RadioOptions {
  checked?: boolean
  onchange?: (e: Event & { currentTarget: HTMLInputElement }) => void
  oncheckedchange?: (checked: boolean) => void
  class?: string
}
