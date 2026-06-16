import type { SelectA11yProps, SelectOptions } from "./select-types"

export function resolveSelectA11y(opts: SelectOptions): SelectA11yProps {
  const a11y: SelectA11yProps = {}

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name

  if (opts.disabled) a11y.disabled = true
  if (opts.required) a11y.required = true

  if (opts.ariaLabelledBy) {
    a11y.ariaLabelledBy = opts.ariaLabelledBy
  } else {
    const accessibleLabel = opts.ariaLabel ?? opts.label
    if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  }
  if (opts.invalid) a11y.ariaInvalid = true
  if (opts.describedBy) a11y.ariaDescribedBy = opts.describedBy

  return a11y
}
