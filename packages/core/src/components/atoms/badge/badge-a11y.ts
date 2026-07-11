import type { BadgeA11yProps, BadgeOptions } from "./badge-types"

export function resolveBadgeA11y(opts: BadgeOptions): BadgeA11yProps {
  const a11y: BadgeA11yProps = {}
  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  return a11y
}
