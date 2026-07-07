import * as React from "react"
import { createPortal } from "react-dom"
import { MarwesContext } from "../../provider/marwes-context"
import { Dialog, type DialogProps } from "./dialog"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return []
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        "button:not([disabled])",
        "[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
      ].join(","),
    ),
  ).filter(
    (element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true",
  )
}

function focusFirstElement(container: HTMLElement | null): void {
  const focusableElements = getFocusableElements(container)
  const firstFocusable = focusableElements[0]

  if (firstFocusable) {
    firstFocusable.focus()
    return
  }

  container?.focus()
}

export interface DialogFooterControls {
  close: () => void
}

export type DialogModalTone = "default" | "calm"
export type DialogModalDivider = "visible" | "hidden"

export interface DialogModalProps extends Omit<DialogProps, "footer" | "onClose"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  closeOnEscape?: boolean
  closeOnScrimClick?: boolean
  restoreFocus?: boolean
  portalTarget?: HTMLElement | null
  overlayClassName?: string
  surfaceWidth?: string | number
  tone?: DialogModalTone
  divider?: DialogModalDivider
  footer?: React.ReactNode | ((controls: DialogFooterControls) => React.ReactNode)
}

type DialogModalStyle = React.CSSProperties & {
  "--mw-dialog-surface-width"?: string
}

function toCSSDimension(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value
}

export function DialogModal(props: DialogModalProps): React.ReactElement | null {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnScrimClick = true,
    restoreFocus = true,
    portalTarget,
    overlayClassName,
    surfaceWidth,
    tone = "default",
    divider = "visible",
    footer,
    ...dialogProps
  } = props
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const resolvedOpen = isControlled ? open : internalOpen
  const marwesContext = React.useContext(MarwesContext)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const lastFocusedElementRef = React.useRef<HTMLElement | null>(null)

  const close = React.useCallback(() => {
    if (!resolvedOpen) {
      return
    }

    if (!isControlled) {
      setInternalOpen(false)
    }

    onOpenChange?.(false)
  }, [isControlled, onOpenChange, resolvedOpen])

  React.useEffect(() => {
    if (!resolvedOpen || typeof document === "undefined") {
      return
    }

    const previousOverflow = document.body.style.overflow
    lastFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = "hidden"

    const frameId = window.requestAnimationFrame(() => {
      const dialogElement = overlayRef.current?.querySelector<HTMLElement>(".mw-dialog") ?? null
      focusFirstElement(dialogElement)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      document.body.style.overflow = previousOverflow

      if (restoreFocus) {
        lastFocusedElementRef.current?.focus()
      }
    }
  }, [resolvedOpen, restoreFocus])

  React.useEffect(() => {
    if (!resolvedOpen || !closeOnEscape || typeof document === "undefined") {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        close()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [close, closeOnEscape, resolvedOpen])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault()
        event.stopPropagation()
        close()
        return
      }

      if (event.key !== "Tab") {
        return
      }

      const dialogElement = overlayRef.current?.querySelector<HTMLElement>(".mw-dialog") ?? null
      const focusableElements = getFocusableElements(dialogElement)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialogElement?.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      } else if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    },
    [close, closeOnEscape],
  )

  const renderedFooter = React.useMemo(
    () => (typeof footer === "function" ? footer({ close }) : footer),
    [close, footer],
  )

  if (!resolvedOpen || typeof document === "undefined") {
    return null
  }

  const modalStyle: DialogModalStyle | undefined =
    surfaceWidth === undefined
      ? undefined
      : { "--mw-dialog-surface-width": toCSSDimension(surfaceWidth) }

  const modalMarkup = (
    <div
      ref={overlayRef}
      className={cx("mw-dialog-modal", overlayClassName)}
      style={modalStyle}
      data-surface-width={surfaceWidth === undefined ? undefined : "custom"}
      data-tone={tone}
      data-divider={divider}
      onClick={(event) => {
        if (!closeOnScrimClick) {
          return
        }

        const clickTarget = event.target

        if (!(clickTarget instanceof Node)) {
          return
        }

        if (surfaceRef.current?.contains(clickTarget)) {
          return
        }

        close()
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="mw-dialog-modal__scrim" aria-hidden="true" />
      <div ref={surfaceRef} className="mw-dialog-modal__surface">
        <Dialog {...dialogProps} modal footer={renderedFooter} onClose={close} />
      </div>
    </div>
  )

  if (portalTarget === null) {
    return modalMarkup
  }

  const resolvedTarget = portalTarget ?? marwesContext?.providerElement ?? document.body
  return createPortal(modalMarkup, resolvedTarget)
}
