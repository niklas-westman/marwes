/**
 * Checkbox core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, css vars, strict a11y
 */

import type { Theme } from "../../../theme/theme-types"
import { buildCheckboxA11y } from "./checkbox-a11y"
import type { CheckboxProps, CheckboxRenderKit } from "./checkbox-types"

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

export function checkboxRecipe({
  theme,
  disabled = false,
  invalid = false,
  ...props
}: CheckboxProps & { theme: Theme }): CheckboxRenderKit {
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
  // No component-specific vars required initially.
  // (Edition CSS should target .mw-checkbox + modifiers.)
  const vars = {
    "--mw-checkbox-border": theme.color.border,
    "--mw-checkbox-bg": theme.color.surface,
    "--mw-checkbox-radius": `${theme.ui.radius}px`,
    "--mw-radius": `${theme.ui.radius}px`,
    "--mw-checkbox-size": size === "sm" ? "16px" : size === "md" ? "18px" : "22px",
    "--mw-checkbox-checked-bg": theme.color.primary,
    "--mw-danger": theme.color.danger,
    "--mw-on-primary": theme.color.onPrimary, // Fixed: use onPrimary instead of primary
    "--mw-primary": theme.color.primary,
    "--mw-border": theme.color.border,
    "--mw-surface": theme.color.surface,
    "--mw-focus": theme.color.focus,
    "--mw-font-primary": theme.font.primary,
  }

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
