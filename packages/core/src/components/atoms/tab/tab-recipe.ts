/**
 * Tab core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, strict a11y
 */

import { resolveTabA11y } from "./tab-a11y"
import type { TabOptions, TabRenderKit } from "./tab-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createTabRecipe(opts: TabOptions): TabRenderKit {
  return {
    tag: "button",
    className: cx(
      "mw-tab",
      opts.selected && "mw-tab--selected",
      opts.disabled && "mw-tab--disabled",
    ),
    vars: {},
    a11y: resolveTabA11y(opts),
  }
}
