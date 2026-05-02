import type { CssVars } from "../../../shared/css-vars"
import { resolveTextareaA11y } from "./textarea-a11y"
import type { TextareaOptions, TextareaRenderKit } from "./textarea-types"

export function createTextareaRecipe(opts: TextareaOptions): TextareaRenderKit {
  const tone = opts.tone ?? "default"
  const invalid = opts.invalid === true ? "is-invalid" : "is-valid"
  const vars: CssVars = {}

  if (opts.resize) {
    vars["--mw-textarea-resize"] = opts.resize
  }

  return {
    tag: "textarea",
    className: ["mw-textarea", `mw-textarea--${tone}`, invalid].join(" "),
    vars,
    a11y: resolveTextareaA11y(opts),
  }
}
