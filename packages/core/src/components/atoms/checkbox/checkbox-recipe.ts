/**
 * Checkbox core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, css vars, strict a11y
 */

import { buildCheckboxA11y } from "./checkbox-a11y"
import type { CheckboxProps, CheckboxRenderKit } from "./checkbox-types"

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

export function checkboxRecipe({
  disabled = false,
  invalid = false,
  ...props
}: CheckboxProps): CheckboxRenderKit {
  const size = props.size ?? "md"

  const className = cx(
    "mw-checkbox",
    size === "sm" && "mw-checkbox--sm",
    size === "md" && "mw-checkbox--md",
    size === "lg" && "mw-checkbox--lg",
    disabled && "mw-checkbox--disabled",
    invalid && "mw-checkbox--invalid",
  )

  const a11y = buildCheckboxA11y({ disabled, invalid, ...props })
  const vars = {}

  // Controlled vs uncontrolled:
  // - If `checked` is present, adapter should pass it through and handle onChange.
  // - Otherwise adapter can use `defaultChecked` or leave it uncontrolled.
  const kit: CheckboxRenderKit = {
    tag: "input",
    className,
    vars,
    a11y,
    indeterminate: props.indeterminate ?? false,
  }

  if (props.checked !== undefined) {
    kit.checked = props.checked
  } else if (props.defaultChecked !== undefined) {
    kit.defaultChecked = props.defaultChecked
  }

  return kit
}
