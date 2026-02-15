/**
 * Heading recipe: theme + options → render kit.
 * - Determines semantic tag from level.
 * - Allows visual size override.
 * - No spacing/margin (user-controlled).
 */

import type { CssVars } from "../../../shared/css-vars"
import type { HeadingSize, Theme } from "../../../theme/theme-types"
import { buildHeadingA11y } from "./heading-a11y"
import type { HeadingOptions, HeadingRenderKit } from "./heading-types"

export function headingRecipe(opts: HeadingOptions, theme: Theme): HeadingRenderKit {
  const { level } = opts

  // Default size to match level (h1 → "h1", h2 → "h2", h3 → "h3").
  const size: HeadingSize = opts.size ?? (`h${level}` as HeadingSize)

  // Semantic tag based on level.
  const tag = `h${level}` as "h1" | "h2" | "h3"

  // Build class name.
  const className = ["mw-heading", `mw-heading--${size}`].filter(Boolean).join(" ")

  // Typography settings from theme.
  const typo = theme.typography[size]

  // CSS variables.
  const vars: CssVars = {
    "--mw-heading-font": theme.font.primary,
    "--mw-heading-size": `${typo.fontSize}px`,
    "--mw-heading-line-height": `${typo.lineHeight}`,
    "--mw-heading-weight": `${typo.fontWeight}`,
    "--mw-heading-letter-spacing": `${typo.letterSpacing}px`,
    "--mw-heading-color": theme.color.text,
  }

  // Build a11y props.
  const a11y = buildHeadingA11y(opts)

  return {
    tag,
    className,
    vars,
    a11y,
  }
}
