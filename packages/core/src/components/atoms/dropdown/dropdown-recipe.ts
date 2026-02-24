import type { Theme } from "../../../theme/theme-types"
import { resolveDropdownA11y } from "./dropdown-a11y"
import type { DropdownOptions, DropdownRenderKit } from "./dropdown-types"

export function createDropdownRecipe(theme: Theme, opts: DropdownOptions): DropdownRenderKit {
  const tone = opts.tone ?? "default"
  const size = opts.size ?? "md"
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"

  return {
    tag: "select",
    className: ["mw-dropdown", `mw-dropdown--${size}`, `mw-dropdown--${tone}`, invalid].join(" "),
    vars: {
      "--mw-primary": theme.color.primary,
      "--mw-border": theme.color.border,
      "--mw-text": theme.color.text,
      "--mw-text-muted": theme.color.textMuted,
      "--mw-surface": theme.color.surface,
      "--mw-danger": theme.color.danger,
      "--mw-success": theme.color.success,
      "--mw-focus": theme.color.focus,
      "--mw-radius": `${theme.ui.radius}px`,
      "--mw-font-primary": theme.font.primary,
    },
    a11y: resolveDropdownA11y(opts),
  }
}
