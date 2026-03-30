import type { ToastIntent } from "@marwes-ui/core"
import * as React from "react"
import { Toast, type ToastProps } from "./toast"
import type { ManagedToast, ToastContainerProps } from "./toast-manager-types"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "./variants"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function renderToastByIntent(
  toast: ManagedToast,
  onDismiss: ((id: string) => void) | undefined,
): React.ReactElement {
  const sharedProps: ToastProps = {
    id: toast.id,
    children: toast.children,
  }
  const dismissHandler = onDismiss ? () => onDismiss(toast.id) : undefined

  if (toast.icon !== undefined) {
    sharedProps.icon = toast.icon
  }

  if (toast.action !== undefined) {
    sharedProps.action = toast.action
  }

  if (dismissHandler) {
    sharedProps.onDismiss = dismissHandler
  }

  if (toast.className !== undefined) {
    sharedProps.className = toast.className
  }

  if (toast.variant !== undefined) {
    sharedProps.variant = toast.variant
  }

  if (toast.ariaLive !== undefined) {
    sharedProps.ariaLive = toast.ariaLive
  }

  if (toast.dataAttributes !== undefined) {
    sharedProps.dataAttributes = toast.dataAttributes
  }

  switch (toast.intent as ToastIntent | undefined) {
    case "success":
      return <SuccessToast {...sharedProps} />
    case "error":
      return <ErrorToast {...sharedProps} />
    case "warning":
      return <WarningToast {...sharedProps} />
    case "info":
      return <InfoToast {...sharedProps} />
    default:
      return <Toast {...sharedProps} />
  }
}

function ToastViewportItem(props: {
  toast: ManagedToast
  onDismiss?: (id: string) => void
}): React.ReactElement {
  React.useEffect(() => {
    if (!props.onDismiss || props.toast.duration === undefined || props.toast.duration === null) {
      return
    }

    if (props.toast.duration <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      props.onDismiss?.(props.toast.id)
    }, props.toast.duration)

    return () => {
      window.clearTimeout(timer)
    }
  }, [props.onDismiss, props.toast.duration, props.toast.id])

  return (
    <div className="mw-toast-container__item">
      {renderToastByIntent(props.toast, props.onDismiss)}
    </div>
  )
}

export function ToastContainer(props: ToastContainerProps): React.ReactElement {
  const placement = props.placement ?? "top-right"
  const visibleToasts =
    props.maxVisible && props.maxVisible > 0 ? props.toasts.slice(-props.maxVisible) : props.toasts

  return (
    <div className={cx("mw-toast-container", `mw-toast-container--${placement}`, props.className)}>
      {visibleToasts.map((toast) => (
        <ToastViewportItem
          key={toast.id}
          toast={toast}
          {...(props.onDismiss ? { onDismiss: props.onDismiss } : {})}
        />
      ))}
    </div>
  )
}
