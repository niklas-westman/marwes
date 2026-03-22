/**
 * Radio core recipe:
 * - returns a render kit for adapters
 * - stable classnames, modifier classes, strict a11y
 */

import { buildRadioA11y } from "./radio-a11y"
import type { RadioOptions, RadioRenderKit } from "./radio-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function radioRecipe({
  disabled = false,
  invalid = false,
  ...opts
}: RadioOptions): RadioRenderKit {
  const className = cx("mw-radio", disabled && "mw-radio--disabled", invalid && "mw-radio--invalid")

  const kit: RadioRenderKit = {
    tag: "input",
    className,
    vars: {},
    a11y: buildRadioA11y({ disabled, invalid, ...opts }),
  }

  if (opts.checked !== undefined) {
    kit.checked = opts.checked
  } else if (opts.defaultChecked !== undefined) {
    kit.defaultChecked = opts.defaultChecked
  }

  return kit
}
