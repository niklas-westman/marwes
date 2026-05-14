import type { ToastIntent, ToastOptions, ToastPlacement, ToastVariant } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface ToastProps extends ToastOptions {
  children?: Snippet
  icon?: Snippet
  action?: Snippet
  ondismiss?: () => void
  class?: string
  id?: string
  dataAttributes?: Record<string, string>
}

export interface ManagedToast {
  id: string
  message: string
  icon?: Snippet
  action?: Snippet
  ondismiss?: () => void
  class?: string
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
  class?: string
  ondismiss?: (id: string) => void
}

export interface ToastProviderProps {
  children?: Snippet
  placement?: ToastPlacement
  maxVisible?: number
  defaultDuration?: number | null
  class?: string
}

export interface ToastController {
  show: (toast: ShowToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

export type SuccessToastProps = ToastProps
export type ErrorToastProps = ToastProps
export type WarningToastProps = ToastProps
export type InfoToastProps = ToastProps
