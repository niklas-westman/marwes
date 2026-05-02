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

  if (toast.dataAttributes !== undefined || toast.intent !== undefined) {
    sharedProps.dataAttributes = {
      ...(toast.dataAttributes ?? {}),
      ...(toast.intent !== undefined ? { "data-intent": toast.intent } : {}),
    }
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
  const timerHandleRef = React.useRef<number | null>(null)
  const timerStartedAtRef = React.useRef<number | null>(null)
  const remainingDurationRef = React.useRef<number | null>(null)
  const pointerInsideRef = React.useRef(false)
  const focusInsideRef = React.useRef(false)

  const clearDismissTimer = React.useCallback(() => {
    if (timerHandleRef.current === null) {
      return
    }

    window.clearTimeout(timerHandleRef.current)
    timerHandleRef.current = null
    timerStartedAtRef.current = null
  }, [])

  const scheduleDismissTimer = React.useCallback(
    (delay: number) => {
      if (
        !props.onDismiss ||
        delay <= 0 ||
        pointerInsideRef.current ||
        focusInsideRef.current ||
        timerHandleRef.current !== null
      ) {
        return
      }

      timerStartedAtRef.current = Date.now()
      timerHandleRef.current = window.setTimeout(() => {
        timerHandleRef.current = null
        timerStartedAtRef.current = null
        remainingDurationRef.current = 0
        props.onDismiss?.(props.toast.id)
      }, delay)
    },
    [props.onDismiss, props.toast.id],
  )

  const pauseDismissTimer = React.useCallback(() => {
    if (timerHandleRef.current === null || timerStartedAtRef.current === null) {
      return
    }

    const elapsed = Date.now() - timerStartedAtRef.current
    const remainingDuration = remainingDurationRef.current ?? 0

    remainingDurationRef.current = Math.max(remainingDuration - elapsed, 0)
    clearDismissTimer()
  }, [clearDismissTimer])

  const resumeDismissTimer = React.useCallback(() => {
    if (pointerInsideRef.current || focusInsideRef.current) {
      return
    }

    const remainingDuration = remainingDurationRef.current

    if (remainingDuration === null || remainingDuration === undefined || remainingDuration <= 0) {
      return
    }

    scheduleDismissTimer(remainingDuration)
  }, [scheduleDismissTimer])

  React.useEffect(() => {
    clearDismissTimer()
    pointerInsideRef.current = false
    focusInsideRef.current = false

    if (!props.onDismiss || props.toast.duration === undefined || props.toast.duration === null) {
      remainingDurationRef.current = null
      return
    }

    if (props.toast.duration <= 0) {
      remainingDurationRef.current = 0
      return
    }

    remainingDurationRef.current = props.toast.duration
    scheduleDismissTimer(props.toast.duration)

    return () => {
      clearDismissTimer()
    }
  }, [clearDismissTimer, props.onDismiss, props.toast.duration, scheduleDismissTimer])

  return (
    <div
      className="mw-toast-container__item"
      onMouseEnter={() => {
        pointerInsideRef.current = true
        pauseDismissTimer()
      }}
      onMouseLeave={() => {
        pointerInsideRef.current = false
        resumeDismissTimer()
      }}
      onFocusCapture={() => {
        focusInsideRef.current = true
        pauseDismissTimer()
      }}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) {
          return
        }

        focusInsideRef.current = false
        resumeDismissTimer()
      }}
    >
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
