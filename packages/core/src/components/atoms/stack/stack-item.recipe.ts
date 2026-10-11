/**
 * StackItem recipe: options → render kit.
 * - Emits the declared horizontal/vertical sizing (default hug) as data attributes.
 * - Sizing only has an effect when the parent is a Stack.
 */

import type { StackItemOptions, StackItemRenderKit } from "./stack.types"
import { assertStackValue, stackItemAsValues, stackSizings } from "./stack.values"

export function createStackItemRecipe(opts: StackItemOptions = {}): StackItemRenderKit {
  const tag = opts.as ?? "div"
  const horizontalSizing = opts.horizontalSizing ?? "hug"
  const verticalSizing = opts.verticalSizing ?? "hug"

  assertStackValue("as", tag, stackItemAsValues, "StackItem")
  assertStackValue("horizontalSizing", horizontalSizing, stackSizings, "StackItem")
  assertStackValue("verticalSizing", verticalSizing, stackSizings, "StackItem")

  return {
    tag,
    className: "mw-stack-item",
    vars: {},
    dataAttributes: {
      "data-component": "stack-item",
      "data-horizontal-sizing": horizontalSizing,
      "data-vertical-sizing": verticalSizing,
    },
  }
}
