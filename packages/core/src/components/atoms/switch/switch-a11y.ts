import type { SwitchA11yProps, SwitchOptions } from "./switch-types"

export function resolveSwitchA11y(opts: SwitchOptions): SwitchA11yProps {
  const a11y: SwitchA11yProps = {
    role: "switch",
    ariaChecked: opts.checked ?? false,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaLabelledby) a11y.ariaLabelledby = opts.ariaLabelledby

  return a11y
}
