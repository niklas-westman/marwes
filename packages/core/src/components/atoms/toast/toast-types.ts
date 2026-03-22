/**
 * Core types for Toast.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export type ToastVariant = "subtle" | "outline" | "rich"

export interface ToastOptions {
  variant?: ToastVariant
  /**
   * Controls aria-live urgency.
   * "polite" → role="status" (default, most toasts)
   * "assertive" → role="alert" (urgent/error toasts)
   */
  ariaLive?: "polite" | "assertive"
}

export interface ToastA11yProps {
  role: "status" | "alert"
  ariaLive: "polite" | "assertive"
  ariaAtomic: true
}

export interface ToastRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  a11y: ToastA11yProps
}
