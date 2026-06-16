/**
 * Text recipe: theme + options → render kit.
 * - Supports non-heading typography variants from the Figma type scale.
 * - No spacing/margin (user-controlled).
 */

import type { CssVars } from "../../../shared/css-vars"
import type { TextVariant } from "../../../theme/text-variant"
import type { ResolvedTheme } from "../../../theme/theme-css"
import type { TextOptions, TextRenderKit } from "./text-types"

export function textRecipe(opts: TextOptions, theme: ResolvedTheme): TextRenderKit {
  const variant: TextVariant = opts.variant ?? "caption"
  const tag = opts.headingLevel ? (`h${opts.headingLevel}` as const) : (opts.as ?? "span")
  const className = ["mw-text", `mw-text--${variant}`].filter(Boolean).join(" ")
  const typo = theme.typography.text[variant]

  const vars: CssVars = {
    "--mw-text-size": `${typo.fontSize}px`,
    "--mw-text-line-height": `${typo.lineHeight}`,
    "--mw-text-weight": `${typo.fontWeight}`,
    "--mw-text-letter-spacing": `${typo.letterSpacing}px`,
    "--mw-text-transform": typo.textTransform ?? "none",
  }

  return {
    tag,
    className,
    vars,
    a11y: opts.id ? { id: opts.id } : {},
  }
}
