/**
 * Card core recipe:
 * - returns a render kit for adapters
 * - single stable classname; no modifiers in current Figma spec
 */

import type { CardOptions, CardRenderKit } from "./card-types"

export function createCardRecipe(opts: CardOptions = {}): CardRenderKit {
  return {
    tag: "div",
    className: "mw-card",
    vars: {},
    dataAttributes: {
      ...opts.dataAttributes,
      "data-component": "card",
    },
  }
}
