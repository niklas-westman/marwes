/**
 * Banner core recipe.
 * Returns a render kit consumed by framework adapters.
 *
 * Figma reference:
 * - .figma/marwes/components/banner.json
 * - .figma/marwes/pages/-banner/-banner_1593-5094.json
 */

import { resolveBannerA11y } from "./banner-a11y"
import type { BannerOptions, BannerRenderKit } from "./banner-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function createBannerRecipe(opts: BannerOptions): BannerRenderKit {
  const variant = opts.variant ?? "neutral"
  const showIcon = opts.showIcon ?? true
  const showAction = opts.showAction ?? false
  const dismissible = opts.dismissible ?? true

  return {
    root: {
      className: cx("mw-banner", `mw-banner--${variant}`),
      a11y: resolveBannerA11y(opts),
      dataAttributes: {
        "data-mw-component": "banner",
        "data-variant": variant,
      },
    },
    content: {
      className: "mw-banner__content",
    },
    icon: {
      className: "mw-banner__icon",
      visible: showIcon,
    },
    message: {
      className: "mw-banner__message",
    },
    action: {
      className: "mw-banner__action",
      visible: showAction,
    },
    dismiss: {
      className: "mw-banner__dismiss",
      visible: dismissible,
      ariaLabel: "Dismiss banner",
    },
  }
}
