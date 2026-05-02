import { resolveTooltipA11y } from "./tooltip-a11y"
import type { TooltipOptions, TooltipRenderKit } from "./tooltip-types"

export function createTooltipRecipe(options: TooltipOptions = {}): TooltipRenderKit {
  return {
    tag: "span",
    className: "mw-tooltip",
    vars: {},
    a11y: resolveTooltipA11y(options),
    dataAttributes: {
      "data-component": "tooltip",
    },
  }
}
