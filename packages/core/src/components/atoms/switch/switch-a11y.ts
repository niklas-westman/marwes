import type { SwitchA11yProps, SwitchOptions } from "./switch-types"

export function resolveSwitchA11y(opts: SwitchOptions): SwitchA11yProps {
  const a11y: SwitchA11yProps = {
    role: "switch",
    ariaChecked: opts.checked ?? false,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  if (opts.ariaLabelledBy) a11y.ariaLabelledBy = opts.ariaLabelledBy
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy

  return a11y
}
