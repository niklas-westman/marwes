import type { RadioA11y, RadioGroupFieldA11yProps, RadioOptions } from "./radio-types"

export function buildRadioA11y(opts: RadioOptions): RadioA11y {
  const a11y: RadioA11y = { type: "radio" }

  if (opts.id) a11y.id = opts.id
  if (opts.name) a11y.name = opts.name
  if (opts.value) a11y.value = opts.value
  if (opts.disabled) a11y.disabled = true
  if (opts.required) a11y.required = true
  const accessibleLabel = opts.ariaLabel ?? opts.label
  if (accessibleLabel) a11y.ariaLabel = accessibleLabel
  if (opts.ariaLabelledBy) a11y.ariaLabelledBy = opts.ariaLabelledBy
  if (opts.ariaDescribedBy) a11y.ariaDescribedBy = opts.ariaDescribedBy
  if (opts.invalid) a11y.ariaInvalid = true

  return a11y
}

export function resolveRadioGroupFieldA11y(args: {
  labelId: string
  describedBy?: string | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
}): RadioGroupFieldA11yProps {
  const a11y: RadioGroupFieldA11yProps = { role: "radiogroup", ariaLabelledBy: args.labelId }
  if (args.describedBy) a11y.ariaDescribedBy = args.describedBy
  if (args.invalid) a11y.ariaInvalid = true
  if (args.required) a11y.ariaRequired = true
  return a11y
}
