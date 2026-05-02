import type { TabA11yProps, TabOptions } from "./tab-types"

export function resolveTabA11y(opts: TabOptions): TabA11yProps {
  const a11y: TabA11yProps = {
    role: "tab",
    ariaSelected: opts.selected ?? false,
    // Only the selected enabled tab participates in roving focus.
    // Disabled tabs are rendered as disabled controls and skipped by TabGroup navigation.
    tabIndex: opts.selected && !opts.disabled ? 0 : -1,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaControls) a11y.ariaControls = opts.ariaControls

  return a11y
}
