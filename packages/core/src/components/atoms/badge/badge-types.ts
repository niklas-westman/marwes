/**
 * Core types for Badge.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

/**
 * Badge visual variant.
 * Use `BadgeVariant.success` for type-safe access.
 */
export const BadgeVariant = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  error: "error",
} as const
export type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant]

export interface BadgeOptions {
  variant?: BadgeVariant
  /** For numeric/icon-only badges without visible text context */
  ariaLabel?: string
}

export interface BadgeA11yProps {
  ariaLabel?: string
}

export interface BadgeRenderKit {
  tag: "span"
  className: string
  vars: Record<string, string>
  a11y: BadgeA11yProps
}
