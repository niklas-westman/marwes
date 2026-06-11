import type { ButtonOptions, ButtonVariant, IconName } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface ButtonProps extends ButtonOptions {
  children?: Snippet
  onclick?: (e: MouseEvent) => void
  class?: string
  style?: string
}

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "hasVisibleText" | "iconLeft" | "iconOnly" | "iconRight"> {
  icon: IconName
  ariaLabel: string
  variant?: ButtonVariant
}
