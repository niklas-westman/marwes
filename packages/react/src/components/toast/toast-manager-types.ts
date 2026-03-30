import type { ToastIntent, ToastPlacement, ToastVariant } from "@marwes-ui/core"
import type * as React from "react"

export interface ManagedToast {
  id: string
  children: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  onDismiss?: () => void
  className?: string
  variant?: ToastVariant
  ariaLive?: "polite" | "assertive"
  intent?: ToastIntent
  duration?: number | null
  dataAttributes?: Record<string, string>
}

export type ShowToastOptions = Omit<ManagedToast, "id">

export interface ToastContainerProps {
  toasts: ManagedToast[]
  placement?: ToastPlacement
  maxVisible?: number
  className?: string
  onDismiss?: (id: string) => void
}

export interface ToastProviderProps {
  children: React.ReactNode
  placement?: ToastPlacement
  maxVisible?: number
  defaultDuration?: number | null
  className?: string
}

export interface ToastController {
  show: (toast: ShowToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}
