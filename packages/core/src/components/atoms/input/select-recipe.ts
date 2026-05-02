import { resolveSelectA11y } from "./select-a11y"
import { type SelectOptions, type SelectRenderKit, resolveSelectMode } from "./select-types"

export function createSelectRecipe(opts: SelectOptions): SelectRenderKit {
  const tone = opts.tone ?? "default"
  const appearance = resolveSelectMode(opts)
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"

  return {
    tag: "select",
    className: ["mw-select", `mw-select--${tone}`, `mw-select--${appearance}`, invalid].join(" "),
    vars: {},
    a11y: resolveSelectA11y(opts),
  }
}
