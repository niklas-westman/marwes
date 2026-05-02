import type { CssVars } from "../../../shared/css-vars"
import { resolveRichTextA11y } from "./rich-text-a11y"
import {
  resolveRichTextAllowedFormats,
  resolveRichTextClassName,
  resolveRichTextDataAttributes,
} from "./rich-text-styles"
import type { RichTextOptions, RichTextRenderKit } from "./rich-text-types"

export function createRichTextRecipe(opts: RichTextOptions): RichTextRenderKit {
  const vars: CssVars = {}
  const allowedFormats = resolveRichTextAllowedFormats(opts.allowedFormats)

  return {
    tag: "div",
    className: resolveRichTextClassName(opts),
    vars,
    a11y: resolveRichTextA11y(opts),
    dataAttributes: resolveRichTextDataAttributes(opts, allowedFormats),
  }
}
