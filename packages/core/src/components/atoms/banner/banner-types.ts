/**
 * Core types for Banner.
 * Figma: .figma/marwes/components/banner.json
 *
 * A single token-driven component. Color → Banner states.
 * Toggle: Show icon / Show CTA / Show Close.
 */

/** Banner visual variant / intent. */
export const BannerVariant = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
} as const
export type BannerVariant = (typeof BannerVariant)[keyof typeof BannerVariant]

export interface BannerOptions {
  /** Visual intent of the banner. Defaults to "neutral". */
  variant?: BannerVariant
  /** Whether to show the leading icon. Defaults to true. */
  showIcon?: boolean
  /** Whether to show the CTA action area. Defaults to false. */
  showAction?: boolean
  /** Whether to show the dismiss/close button. Defaults to true. */
  dismissible?: boolean
  /** Accessible label for the banner region. */
  ariaLabel?: string
}

export interface BannerA11yProps {
  role: "status" | "alert"
  ariaLabel?: string | undefined
  ariaLive: "polite" | "assertive"
}

export interface BannerRenderKit {
  root: {
    className: string
    a11y: BannerA11yProps
    dataAttributes: Record<string, string>
  }
  content: {
    className: string
  }
  icon: {
    className: string
    visible: boolean
  }
  message: {
    className: string
  }
  action: {
    className: string
    visible: boolean
  }
  dismiss: {
    className: string
    visible: boolean
    ariaLabel: string
  }
}
