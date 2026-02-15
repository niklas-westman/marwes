import type { InputA11yProps, InputOptions } from "./input-types"

export function resolveInputA11y(opts: InputOptions): InputA11yProps {
  const a11y: InputA11yProps = {}

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name

  if (opts.disabled) a11y.disabled = true
  if (opts.readOnly) a11y.readOnly = true
  if (opts.required) a11y.required = true

  if (opts.type) a11y.type = opts.type
  if (opts.inputMode) a11y.inputMode = opts.inputMode
  if (opts.autoComplete) a11y.autoComplete = opts.autoComplete
  if (opts.placeholder) a11y.placeholder = opts.placeholder

  if (opts.ariaLabel) a11y.ariaLabel = opts.ariaLabel
  if (opts.invalid) a11y.ariaInvalid = true
  if (opts.describedBy) a11y.ariaDescribedBy = opts.describedBy

  return a11y
}
