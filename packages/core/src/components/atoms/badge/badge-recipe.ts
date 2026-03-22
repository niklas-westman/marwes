/**
 * Badge core recipe:
 * - returns a render kit for adapters
 * - stable classnames, variant modifier classes
 */

import { resolveBadgeA11y } from "./badge-a11y"
import type { BadgeOptions, BadgeRenderKit } from "./badge-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createBadgeRecipe(opts: BadgeOptions): BadgeRenderKit {
  const variant = opts.variant ?? "neutral"
  return {
    tag: "span",
    className: cx("mw-badge", `mw-badge--${variant}`),
    vars: {},
    a11y: resolveBadgeA11y(opts),
  }
}
