import type { DialogOptions, DialogSize } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface DialogProps extends DialogOptions {
  id?: string
  title?: string
  description?: string
  children?: Snippet
  footer?: Snippet<[{ close: () => void }]>
  onclose?: () => void
  class?: string
  dataAttributes?: Record<string, string>
}

export interface DialogModalProps extends Omit<DialogProps, "footer" | "onclose"> {
  open?: boolean
  closeOnEscape?: boolean
  closeOnScrimClick?: boolean
  restoreFocus?: boolean
  surfaceWidth?: string | number
  tone?: "default" | "calm"
  divider?: "visible" | "hidden"
  footer?: Snippet<[{ close: () => void }]>
  onopenchange?: (open: boolean) => void
  class?: string
  overlayClass?: string
}

export interface ConfirmDialogProps extends Omit<DialogModalProps, "footer"> {
  confirmLabel?: string
  cancelLabel?: string
  onconfirm?: () => void
  oncancel?: () => void
}

export interface DestructiveDialogProps extends Omit<DialogModalProps, "footer"> {
  confirmLabel?: string
  cancelLabel?: string
  onconfirm?: () => void
  oncancel?: () => void
}

export interface InfoDialogProps extends Omit<DialogModalProps, "footer"> {
  acknowledgeLabel?: string
  onacknowledge?: () => void
}
