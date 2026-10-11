/**
 * Stack recipe: options → render kit.
 * - Gap and padding resolve to --mw-stack-* vars that point at the --mw-spacing-* token scale.
 * - Every resolved value is emitted as a data attribute, defaults included.
 * - Unknown tokens, enum values and `as` throw a TypeError.
 */

import type { Spacings } from "../spacing"
import type { StackOptions, StackRenderKit } from "./stack.types"
import {
  assertStackValue,
  stackAlignItemsValues,
  stackAsValues,
  stackDirections,
  stackJustifyContentValues,
  stackSizings,
  stackSpacingValues,
  stackWraps,
} from "./stack.values"

function resolveSpacing(prop: string, value: Spacings): Spacings {
  assertStackValue(prop, value, stackSpacingValues)
  return value
}

function toSpacingVar(token: Spacings): string {
  return `var(--mw-spacing-${token})`
}

export function createStackRecipe(opts: StackOptions = {}): StackRenderKit {
  const direction = opts.direction ?? "column"
  const alignItems = opts.alignItems ?? "start"
  const justifyContent = opts.justifyContent ?? "start"
  const wrap = opts.wrap ?? "nowrap"
  const tag = opts.as ?? "div"
  const horizontalSizing = opts.horizontalSizing ?? "hug"
  const verticalSizing = opts.verticalSizing ?? "hug"

  assertStackValue("direction", direction, stackDirections)
  assertStackValue("alignItems", alignItems, stackAlignItemsValues)
  assertStackValue("justifyContent", justifyContent, stackJustifyContentValues)
  assertStackValue("wrap", wrap, stackWraps)
  assertStackValue("as", tag, stackAsValues)
  assertStackValue("horizontalSizing", horizontalSizing, stackSizings)
  assertStackValue("verticalSizing", verticalSizing, stackSizings)

  const rowGap = resolveSpacing("rowGap", opts.rowGap ?? opts.gap ?? "sp-0")
  const columnGap = resolveSpacing("columnGap", opts.columnGap ?? opts.gap ?? "sp-0")
  const paddingTop = resolveSpacing(
    "paddingTop",
    opts.paddingTop ?? opts.paddingY ?? opts.padding ?? "sp-0",
  )
  const paddingRight = resolveSpacing(
    "paddingRight",
    opts.paddingRight ?? opts.paddingX ?? opts.padding ?? "sp-0",
  )
  const paddingBottom = resolveSpacing(
    "paddingBottom",
    opts.paddingBottom ?? opts.paddingY ?? opts.padding ?? "sp-0",
  )
  const paddingLeft = resolveSpacing(
    "paddingLeft",
    opts.paddingLeft ?? opts.paddingX ?? opts.padding ?? "sp-0",
  )

  return {
    tag,
    className: "mw-stack",
    vars: {
      "--mw-stack-row-gap": toSpacingVar(rowGap),
      "--mw-stack-column-gap": toSpacingVar(columnGap),
      "--mw-stack-padding-top": toSpacingVar(paddingTop),
      "--mw-stack-padding-right": toSpacingVar(paddingRight),
      "--mw-stack-padding-bottom": toSpacingVar(paddingBottom),
      "--mw-stack-padding-left": toSpacingVar(paddingLeft),
    },
    dataAttributes: {
      "data-component": "stack",
      "data-direction": direction,
      "data-row-gap": rowGap,
      "data-column-gap": columnGap,
      "data-padding-top": paddingTop,
      "data-padding-right": paddingRight,
      "data-padding-bottom": paddingBottom,
      "data-padding-left": paddingLeft,
      "data-align-items": alignItems,
      "data-justify-content": justifyContent,
      "data-wrap": wrap,
      "data-horizontal-sizing": horizontalSizing,
      "data-vertical-sizing": verticalSizing,
    },
  }
}
