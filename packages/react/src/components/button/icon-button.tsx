import type { AccessibleButtonName, ButtonOptions, IconName } from "@marwes-ui/core"
import { ButtonVariant } from "@marwes-ui/core"
import { Button, type ButtonProps } from "./button"

export type IconButtonProps = Omit<
  ButtonProps,
  | "ariaLabel"
  | "ariaLabelledBy"
  | "children"
  | "hasVisibleText"
  | "iconLeft"
  | "iconOnly"
  | "iconRight"
  | "label"
> & {
  icon: IconName
} & AccessibleButtonName

export function IconButton(props: IconButtonProps) {
  const { icon, variant = ButtonVariant.neutral, ...buttonProps } = props

  return (
    <Button
      {...(buttonProps as ButtonOptions)}
      variant={variant}
      iconLeft={icon}
      iconOnly
      hasVisibleText={false}
    />
  )
}
