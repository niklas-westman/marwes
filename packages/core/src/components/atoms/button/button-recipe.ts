import { createFamilySemanticAttributes } from "../../../semantics"
import { resolveButtonA11y } from "./button-a11y"
import { resolveButtonLoading } from "./button-loading"
import type { ButtonOptions, ButtonRenderKit, ButtonVariant } from "./button-types"

// Exhaustive on purpose: adding a ButtonVariant fails to compile until it is classified here.
const BUTTON_VARIANT_IS_FILLED: Record<ButtonVariant, boolean> = {
  primary: true,
  secondary: false,
  neutral: false,
  text: false,
  success: true,
  danger: true,
}

export function createButtonRecipe(opts: ButtonOptions): ButtonRenderKit {
  const resolvedLoading = resolveButtonLoading(opts.loading)
  const { tag, a11y, blockClick } = resolveButtonA11y(opts, resolvedLoading)

  const size = opts.size ?? "md"
  const variant = opts.variant ?? "primary"
  const action = opts.action ?? (tag === "button" ? (a11y.type ?? "button") : "navigate")
  const hasAffordance = resolvedLoading.isLoading || Boolean(opts.iconLeft || opts.iconRight)

  return {
    tag,
    blockClick,
    loading: { ...resolvedLoading, spinnerInverted: BUTTON_VARIANT_IS_FILLED[variant] },
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
      "data-has-affordance": hasAffordance ? "true" : undefined,
      "data-icon-only": opts.iconOnly ? "true" : undefined,
      ...opts.dataAttributes,
    },
    vars: {},
  }
}
