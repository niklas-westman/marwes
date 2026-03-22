import { resolveButtonA11y } from "./button-a11y"
import type { ButtonOptions, ButtonRenderKit } from "./button-types"

export function createButtonRecipe(opts: ButtonOptions): ButtonRenderKit {
  const { tag, a11y, blockClick } = resolveButtonA11y(opts)

  const size = opts.size ?? "md"
  const variant = opts.variant ?? "primary"
  const action = opts.action ?? (tag === "button" ? "button" : "navigate")

  return {
    tag,
    blockClick,
    a11y: {
      ...a11y,
      title: opts.tooltip || (opts.iconOnly ? a11y.ariaLabel : undefined),
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
      "data-component": "button",
      "data-action": action,
      "data-variant": variant,
      "data-size": size,
      "data-error": opts.error ? "true" : undefined,
      ...opts.dataAttributes,
    },
    vars: {},
  }
}
