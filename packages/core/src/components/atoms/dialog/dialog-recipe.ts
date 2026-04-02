import { resolveDialogA11y } from "./dialog-a11y"
import type { DialogOptions, DialogRenderKit } from "./dialog-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createDialogRecipe(opts: DialogOptions = {}): DialogRenderKit {
  const size = opts.size ?? "medium"
  const showFooter = opts.showFooter ?? true
  const showCloseButton = opts.dismissible ?? true

  return {
    tag: "section",
    className: cx(
      "mw-dialog",
      `mw-dialog--${size}`,
      showFooter ? "mw-dialog--with-footer" : "mw-dialog--without-footer",
      showCloseButton && "mw-dialog--dismissible",
    ),
    vars: {},
    size,
    showFooter,
    showCloseButton,
    a11y: resolveDialogA11y(opts),
  }
}
