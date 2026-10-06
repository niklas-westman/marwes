import type { InputFieldActionA11yProps, InputFieldActionOptions } from "./input-field-types"

export function resolveInputFieldActionsA11y(
  options: InputFieldActionOptions & { passwordVisible: boolean },
): { passwordToggle: InputFieldActionA11yProps; clearButton: InputFieldActionA11yProps } {
  const passwordToggleLabel = options.passwordVisible
    ? (options.hidePasswordLabel ?? "Hide password")
    : (options.showPasswordLabel ?? "Show password")

  return {
    passwordToggle: { ariaLabel: passwordToggleLabel },
    clearButton: { ariaLabel: options.clearLabel ?? "Clear search" },
  }
}
