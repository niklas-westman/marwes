import type { Theme } from "../../../theme/theme-types"
import { resolveInputA11y } from "./input-a11y"
import type { InputOptions, InputRenderKit } from "./input-types"

export function createInputRecipe(theme: Theme, opts: InputOptions): InputRenderKit {
  const tone = opts.tone ?? "default"
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"

  return {
    tag: "input",
    className: ["mw-input", `mw-input--${tone}`, invalid].join(" "),
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
    a11y: resolveInputA11y(opts),
  }
}
