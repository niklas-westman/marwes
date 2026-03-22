import type { BadgeA11yProps, BadgeOptions } from "./badge-types"

export function resolveBadgeA11y(opts: BadgeOptions): BadgeA11yProps {
  const a11y: BadgeA11yProps = {}
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  return a11y
}
