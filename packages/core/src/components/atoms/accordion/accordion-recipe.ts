/**
 * Accordion core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, aria IDs
 */

import { resolveAccordionA11y } from "./accordion-a11y"
import type { AccordionOptions, AccordionRenderKit } from "./accordion-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createAccordionRecipe(opts: AccordionOptions): AccordionRenderKit {
  return {
    tag: "div",
    className: cx(
      "mw-accordion",
      opts.open && "mw-accordion--open",
      opts.disabled && "mw-accordion--disabled",
    ),
    vars: {},
    a11y: resolveAccordionA11y(opts),
  }
}
