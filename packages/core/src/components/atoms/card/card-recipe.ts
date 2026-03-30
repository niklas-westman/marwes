/**
 * Card core recipe:
 * - returns a render kit for adapters
 * - single stable classname; no modifiers in current Figma spec
 */

import type { CardOptions, CardRenderKit } from "./card-types"

export function createCardRecipe(opts: CardOptions = {}): CardRenderKit {
  const renderKit: CardRenderKit = {
    tag: "div",
    className: "mw-card",
    vars: {},
  }

  if (opts.dataAttributes) {
    renderKit.dataAttributes = opts.dataAttributes
  }

  return renderKit
}
