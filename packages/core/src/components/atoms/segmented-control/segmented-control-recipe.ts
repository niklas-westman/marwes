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
  const variant = opts.variant ?? "surface"

  return {
    tag: "div",
    className: cx(
      "mw-segmented-control",
      `mw-segmented-control--${variant}`,
      opts.disabled && "mw-segmented-control--disabled",
    ),
    vars: {},
    a11y: resolveSegmentedControlA11y(opts),
    dataAttributes: {
      "data-component": "segmented-control",
      "data-layer": "atom",
      "data-variant": variant,
      "data-state": opts.disabled ? "disabled" : "interactive",
    },
  }
}

export function createSegmentedControlItemRecipe(
  opts: SegmentedControlItemOptions,
): SegmentedControlItemRenderKit {
  const variant = opts.variant ?? "surface"

  return {
    tag: "button",
    className: cx(
      "mw-segmented-control__item",
      `mw-segmented-control__item--${variant}`,
      opts.selected && "mw-segmented-control__item--selected",
      opts.disabled && "mw-segmented-control__item--disabled",
    ),
    vars: {},
    a11y: resolveSegmentedControlItemA11y(opts),
    dataAttributes: {
      "data-variant": variant,
      "data-state": opts.disabled ? "disabled" : opts.selected ? "selected" : "unselected",
    },
  }
}
