import type { TabA11yProps, TabOptions } from "./tab-types"

export function resolveTabA11y(opts: TabOptions): TabA11yProps {
  const a11y: TabA11yProps = {
    role: "tab",
    ariaSelected: opts.selected ?? false,
    // Disabled tabs are not interactive but remain in the tab sequence as -1
    tabIndex: opts.selected && !opts.disabled ? 0 : -1,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaControls) a11y.ariaControls = opts.ariaControls

  return a11y
}
