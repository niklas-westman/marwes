import type { ToastIntent, ToastPlacement, ToastVariant } from "@marwes-ui/core"
import type { InjectionKey, VNodeChild } from "vue"

export interface ManagedToast {
  id: string
  children?: VNodeChild
  icon?: VNodeChild
  action?: VNodeChild
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
  placement?: ToastPlacement
  maxVisible?: number
  defaultDuration?: number | null
}

export interface ToastController {
  show: (toast: ShowToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

export const toastContextKey: InjectionKey<ToastController> = Symbol("MarwesToastContext")
