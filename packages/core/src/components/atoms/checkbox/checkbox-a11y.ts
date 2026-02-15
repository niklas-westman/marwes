/**
 * Builds strict a11y output for Checkbox.
 * - Avoid assigning `undefined` to optional fields (exactOptionalPropertyTypes).
 */

import type { CheckboxA11y, CheckboxProps } from "./checkbox-types"

export function buildCheckboxA11y(props: CheckboxProps): CheckboxA11y {
  const a11y: CheckboxA11y = {
    type: "checkbox",
  }

  if (props.id) a11y.id = props.id
  if (props.name) a11y.name = props.name
  if (props.value) a11y.value = props.value

  if (props.disabled) a11y.disabled = true
  if (props.required) a11y.required = true

  if (props.ariaLabel) a11y.ariaLabel = props.ariaLabel
  if (props.ariaLabelledBy) a11y.ariaLabelledBy = props.ariaLabelledBy
  if (props.ariaDescribedBy) a11y.ariaDescribedBy = props.ariaDescribedBy

  // Mixed state: use aria-checked="mixed".
  // For checked/unchecked we omit ariaChecked and rely on native input semantics.
  if (props.indeterminate) a11y.ariaChecked = "mixed"

  if (props.invalid) a11y.ariaInvalid = true

  return a11y
}
