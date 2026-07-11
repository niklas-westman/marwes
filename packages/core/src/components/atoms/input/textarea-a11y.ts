import type { TextareaA11yProps, TextareaOptions } from "./textarea-types"

export function resolveTextareaA11y(opts: TextareaOptions): TextareaA11yProps {
  const a11y: TextareaA11yProps = {}

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name

  if (opts.disabled) a11y.disabled = true
  if (opts.readOnly) a11y.readOnly = true
  if (opts.required) a11y.required = true

  if (opts.inputMode) a11y.inputMode = opts.inputMode
  if (opts.autoComplete) a11y.autoComplete = opts.autoComplete
  if (opts.placeholder) a11y.placeholder = opts.placeholder
  if (opts.rows !== undefined) a11y.rows = opts.rows
  if (opts.cols !== undefined) a11y.cols = opts.cols

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
