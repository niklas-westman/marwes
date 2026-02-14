import type { Theme } from "../../../theme/theme-types";
import type { ButtonOptions, ButtonRenderKit } from "./button-types";
import { resolveButtonA11y } from "./button-a11y";

export function createButtonRecipe(
  theme: Theme,
  opts: ButtonOptions,
): ButtonRenderKit {
  const { tag, a11y, blockClick } = resolveButtonA11y(opts);

  const size = opts.size ?? "md";
  const tone = opts.tone ?? "primary";
  const action = opts.action ?? (tag === "button" ? "button" : "navigate");

  return {
    tag,
    blockClick,
    a11y: {
      ...a11y,
      title: opts.tooltip || (opts.iconOnly ? a11y.ariaLabel : undefined),
    },
    className: [
      "mw-btn",
      //   `mw-btn--${variant}`, --- Example left for later use ---
      `mw-btn--${size}`,
      `mw-btn--${tone}`,
      opts.error ? "mw-btn--error" : "",
    ]
      .filter(Boolean)
      .join(" "),
    dataAttributes: {
      "data-component": "button",
      "data-action": action,
      "data-tone": tone,
      "data-size": size,
      "data-error": opts.error ? "true" : undefined,
      ...opts.dataAttributes,
    },
    vars: {
      "--mw-primary": theme.color.primary,
      "--mw-secondary": theme.color.secondary,
      "--mw-on-primary": theme.color.onPrimary,
      "--mw-danger": theme.color.danger,
      "--mw-on-danger": theme.color.onDanger,
      "--mw-focus": theme.color.focus,
      "--mw-radius": `${theme.ui.radius}px`,
      "--mw-font-primary": theme.font.primary,
    },
  };
}
