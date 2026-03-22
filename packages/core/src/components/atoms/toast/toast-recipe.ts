/**
 * Toast core recipe:
 * - returns a render kit for adapters
 * - stable classnames, variant modifier classes, aria-live wiring
 */

import { resolveToastA11y } from "./toast-a11y"
import type { ToastOptions, ToastRenderKit } from "./toast-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createToastRecipe(opts: ToastOptions): ToastRenderKit {
  const variant = opts.variant ?? "subtle"
  return {
    tag: "div",
    className: cx("mw-toast", `mw-toast--${variant}`),
    vars: {},
    a11y: resolveToastA11y(opts),
  }
}
