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
  /** Accessible name of the dismiss button. Defaults to "Dismiss". */
  dismissLabel?: string
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
  dismissButton: { a11y: ToastDismissButtonA11yProps }
  dataAttributes: Record<string, string>
}

/** ARIA fields for the dismiss button. */
export interface ToastDismissButtonA11yProps {
  ariaLabel: string
}
