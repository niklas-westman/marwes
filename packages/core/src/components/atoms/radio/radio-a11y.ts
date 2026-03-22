import type { RadioA11y, RadioOptions } from "./radio-types"

export function buildRadioA11y(opts: RadioOptions): RadioA11y {
  const a11y: RadioA11y = { type: "radio" }

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name
  if (opts.value) a11y.value = opts.value
  if (opts.disabled) a11y.disabled = true
  if (opts.required) a11y.required = true
  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.ariaLabelledBy) a11y.ariaLabelledBy = opts.ariaLabelledBy
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy
  if (opts.invalid) a11y.ariaInvalid = true

  return a11y
}
