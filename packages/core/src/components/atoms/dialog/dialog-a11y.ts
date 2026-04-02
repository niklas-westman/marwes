import type { DialogA11yProps, DialogOptions } from "./dialog-types"

export function resolveDialogA11y(opts: DialogOptions): DialogA11yProps {
  const a11y: DialogA11yProps = {
    role: "dialog",
    ariaModal: true,
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
