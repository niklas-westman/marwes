import { createFamilySemanticAttributes } from "../../../semantics"
import { resolveButtonA11y } from "./button-a11y"
import { resolveButtonLoading } from "./button-loading"
import type { ButtonOptions, ButtonRenderKit } from "./button-types"

export function createButtonRecipe(opts: ButtonOptions): ButtonRenderKit {
  const resolvedLoading = resolveButtonLoading(opts.loading)
  const { tag, a11y, blockClick } = resolveButtonA11y(opts, resolvedLoading)

  const size = opts.size ?? "md"
  const variant = opts.variant ?? "primary"
  const action = opts.action ?? (tag === "button" ? "button" : "navigate")

  return {
    tag,
    blockClick,
    loading: resolvedLoading,
    a11y: {
      ...a11y,
      title:
        opts.tooltip ||
        (opts.iconOnly
          ? (a11y.ariaLabel ??
            (resolvedLoading.isLoading ? resolvedLoading.loadingLabel : undefined))
          : undefined),
    },
    className: [
      "mw-btn",
      `mw-btn--${size}`,
      `mw-btn--${variant}`,
      opts.error ? "mw-btn--error" : "",
    ]
      .filter(Boolean)
      .join(" "),
    dataAttributes: {
      ...createFamilySemanticAttributes("button", {
        "data-action": action,
        "data-variant": variant,
        "data-size": size,
      }),
      "data-error": opts.error ? "true" : undefined,
      ...opts.dataAttributes,
    },
    vars: {},
  }
}
