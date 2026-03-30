export type ToastIntent = "success" | "error" | "warning" | "info"

export type ToastPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left"

export interface ToastContainerOptions {
  placement?: ToastPlacement
  maxVisible?: number
}
