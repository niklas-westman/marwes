/**
 * Core types for Dialog.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export type DialogSize = "small" | "medium" | "large"

export interface DialogOptions {
  size?: DialogSize
  showFooter?: boolean
  dismissible?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string | boolean | undefined>
}

export interface DialogA11yProps {
  role: "dialog"
  ariaModal: true
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface DialogRenderKit {
  tag: "section"
  className: string
  vars: Record<string, string>
  size: DialogSize
  showFooter: boolean
  showCloseButton: boolean
  a11y: DialogA11yProps
  dataAttributes: Record<string, string | boolean | undefined>
}
