/**
 * Paragraph recipe: theme + options → render kit.
 * - Supports size variants: sm/md/lg.
 * - No spacing/margin (user-controlled).
 */

import type { CssVars } from "../../../shared/css-vars"
import type { ResolvedTheme } from "../../../theme/theme-css"
import type { ParagraphSize } from "../../../theme/theme-types"
import type { ParagraphOptions, ParagraphRenderKit } from "./paragraph-types"

export function paragraphRecipe(opts: ParagraphOptions, theme: ResolvedTheme): ParagraphRenderKit {
  // Default size to "md".
  const size: ParagraphSize = opts.size ?? "md"

  // Build class name.
  const className = ["mw-p", `mw-p--${size}`].filter(Boolean).join(" ")

  // Typography settings from theme.
  const typo = theme.typography.paragraph[size]

  // CSS variables.
  const vars: CssVars = {
    "--mw-p-size": `${typo.fontSize}px`,
    "--mw-p-line-height": `${typo.lineHeight}`,
  }

  // Build a11y props (minimal).
  const a11y: ParagraphRenderKit["a11y"] = {}
  if (opts.id) a11y.id = opts.id

  return {
    tag: "p",
    className,
    vars,
    a11y,
  }
}
