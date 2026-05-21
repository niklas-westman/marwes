import type { DrawerA11yProps, DrawerOptions } from "./drawer-types"

export function resolveDrawerA11y(opts: DrawerOptions): DrawerA11yProps {
  const a11y: DrawerA11yProps = {
    role: "dialog",
  }

  if (opts.modal) {
    a11y.ariaModal = true
  }

  if (opts.ariaLabel) {
    a11y.ariaLabel = opts.ariaLabel
  }

  if (opts.ariaLabelledBy) {
    a11y.ariaLabelledBy = opts.ariaLabelledBy
  }

  if (opts.ariaDescribedBy) {
    a11y.ariaDescribedBy = opts.ariaDescribedBy
  }

  return a11y
}
