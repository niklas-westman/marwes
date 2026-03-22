import { resolveInputA11y } from "./input-a11y"
import type { InputOptions, InputRenderKit } from "./input-types"

export function createInputRecipe(opts: InputOptions): InputRenderKit {
  const tone = opts.tone ?? "default"
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"

  return {
    tag: "input",
    className: ["mw-input", `mw-input--${tone}`, invalid].join(" "),
    vars: {},
    a11y: resolveInputA11y(opts),
  }
}
