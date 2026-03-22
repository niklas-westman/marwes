/**
 * Core types for Badge.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export type BadgeVariant = "neutral" | "brand" | "info" | "success" | "warning" | "error"

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
