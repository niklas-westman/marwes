export type ToastIntent = "neutral" | "info" | "success" | "warning" | "error" | "brand"

export type ToastPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left"

export interface ToastContainerOptions {
  placement?: ToastPlacement
  maxVisible?: number
}
