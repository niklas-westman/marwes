import type { BannerA11yProps, BannerOptions } from "./banner-types"

/**
 * Resolve a11y props for Banner.
 * Error/warning variants use role="alert" with assertive live region;
 * info/success/neutral use role="status" with polite live region.
 */
export function resolveBannerA11y(opts: BannerOptions): BannerA11yProps {
  const variant = opts.variant ?? "neutral"
  const isUrgent = variant === "error" || variant === "warning"

  return {
    role: isUrgent ? "alert" : "status",
    ariaLabel: opts.ariaLabel,
    ariaLive: isUrgent ? "assertive" : "polite",
  }
}
