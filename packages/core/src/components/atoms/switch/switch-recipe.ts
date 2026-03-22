/**
 * Switch core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, strict a11y (role="switch")
 */

import { resolveSwitchA11y } from "./switch-a11y"
import type { SwitchOptions, SwitchRenderKit } from "./switch-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createSwitchRecipe(opts: SwitchOptions): SwitchRenderKit {
  return {
    tag: "button",
    className: cx(
      "mw-switch",
      opts.checked && "mw-switch--checked",
      opts.disabled && "mw-switch--disabled",
    ),
    vars: {},
    a11y: resolveSwitchA11y(opts),
  }
}
