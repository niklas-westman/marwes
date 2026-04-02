/**
 * Spacing recipe: options → render kit.
 * - Delegates size to the --mw-spacing-* token scale via a single CSS variable.
 * - Default size: "md" (24px).
 */

import type { CssVars } from "../../../shared/css-vars"
import type { SpacingOptions, SpacingRenderKit, Spacings } from "./spacing.types"

export function createSpacingRecipe(opts: SpacingOptions = {}): SpacingRenderKit {
  const size: Spacings = opts.size ?? "md"
  const scale = opts.scale ?? 1

  const className = "mw-spacing"

  // scale=1 emits a plain var(); anything else wraps in calc() to multiply.
  const tokenRef = `var(--mw-spacing-${size})`
  const vars: CssVars = {
    "--mw-spacing-value": scale === 1 ? tokenRef : `calc(${tokenRef} * ${scale})`,
  }

  const a11y: SpacingRenderKit["a11y"] = {
    "aria-hidden": "true",
  }

  const dataAttributes: SpacingRenderKit["dataAttributes"] = {
    "data-component": "spacing",
    "data-size": size,
  }

  return {
    tag: "div",
    className,
    vars,
    a11y,
    dataAttributes,
  }
}
