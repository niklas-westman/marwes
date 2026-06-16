/**
 * SegmentedControl core recipe:
 * - returns render kits for the track and items
 * - stable classnames, modifier classes, strict a11y
 */

import {
  resolveSegmentedControlA11y,
  resolveSegmentedControlItemA11y,
} from "./segmented-control-a11y"
import type {
  SegmentedControlItemOptions,
  SegmentedControlItemRenderKit,
  SegmentedControlOptions,
  SegmentedControlRenderKit,
} from "./segmented-control-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createSegmentedControlRecipe(
  opts: SegmentedControlOptions,
): SegmentedControlRenderKit {
  const variant = opts.variant ?? "default"
  const size = opts.size ?? "md"

  return {
    tag: "div",
    className: cx(
      "mw-segmented-control",
      variant !== "default" && `mw-segmented-control--${variant}`,
      size !== "md" && `mw-segmented-control--${size}`,
      opts.disabled && "mw-segmented-control--disabled",
      opts.fullWidth && "mw-segmented-control--full-width",
    ),
    vars: {},
    a11y: resolveSegmentedControlA11y(opts),
  }
}

export function createSegmentedControlItemRecipe(
  opts: SegmentedControlItemOptions,
): SegmentedControlItemRenderKit {
  return {
    tag: "button",
    className: cx(
      "mw-segmented-control__item",
      opts.selected && "mw-segmented-control__item--selected",
      opts.disabled && "mw-segmented-control__item--disabled",
      opts.iconOnly && "mw-segmented-control__item--icon-only",
    ),
    vars: {},
    a11y: resolveSegmentedControlItemA11y(opts),
  }
}
