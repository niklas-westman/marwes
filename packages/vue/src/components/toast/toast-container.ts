import { computed, defineComponent, h, onBeforeUnmount, onMounted, watch } from "vue"
import { mergeClassNames } from "../../internal/render-utils"
import { Toast } from "./toast"
import type { ManagedToast, ToastContainerProps } from "./toast-manager-types"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "./variants"

function normalizeChildren(value: ManagedToast["children"]): unknown[] {
  if (value === undefined || value === null || value === false) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

function renderToastByIntent(toast: ManagedToast, onDismiss?: (id: string) => void) {
  const component =
    toast.intent === "success"
      ? SuccessToast
      : toast.intent === "error"
        ? ErrorToast
        : toast.intent === "warning"
          ? WarningToast
          : toast.intent === "info"
            ? InfoToast
            : Toast

  const toastProps: Record<string, unknown> = {
    id: toast.id,
  }

  if (toast.className !== undefined) {
    toastProps.className = toast.className
  }

  if (toast.variant !== undefined) {
    toastProps.variant = toast.variant
  }

  if (toast.ariaLive !== undefined) {
    toastProps.ariaLive = toast.ariaLive
  }

  if (onDismiss) {
    toastProps.onDismiss = () => onDismiss(toast.id)
  }

  if (toast.dataAttributes !== undefined || toast.intent !== undefined) {
    toastProps.dataAttributes = {
      ...(toast.dataAttributes ?? {}),
      ...(toast.intent !== undefined ? { "data-intent": toast.intent } : {}),
    }
  }

  return h(component as never, toastProps, {
    default: () => normalizeChildren(toast.children),
    ...(toast.icon !== undefined ? { icon: () => normalizeChildren(toast.icon) } : {}),
    ...(toast.action !== undefined ? { action: () => normalizeChildren(toast.action) } : {}),
  })
}

const ToastViewportItem = defineComponent({
  name: "MarwesToastViewportItem",
  props: ["toast", "onDismiss"],
  setup(rawProps) {
    const props = rawProps as {
      toast: ManagedToast
      onDismiss?: (id: string) => void
    }

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined
    let timerStartedAt: number | null = null
    let remainingDuration: number | null = null
    let pointerInside = false
    let focusInside = false

    function clearTimer() {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle)
        timeoutHandle = undefined
      }

      timerStartedAt = null
    }

    function scheduleTimer(delay: number) {
      if (
        !props.onDismiss ||
        delay <= 0 ||
        pointerInside ||
        focusInside ||
        timeoutHandle !== undefined
      ) {
        return
      }

      timerStartedAt = Date.now()
      timeoutHandle = setTimeout(() => {
        timeoutHandle = undefined
        timerStartedAt = null
        remainingDuration = 0
        props.onDismiss?.(props.toast.id)
      }, delay)
    }

    function pauseTimer() {
      if (timeoutHandle === undefined || timerStartedAt === null) {
        return
      }

      const elapsed = Date.now() - timerStartedAt
      const nextRemainingDuration = remainingDuration ?? 0

      remainingDuration = Math.max(nextRemainingDuration - elapsed, 0)
      clearTimer()
    }

    function resumeTimer() {
      if (pointerInside || focusInside || remainingDuration === null || remainingDuration <= 0) {
        return
      }

      scheduleTimer(remainingDuration)
    }

    function syncTimer() {
      clearTimer()
      pointerInside = false
      focusInside = false

      if (!props.onDismiss || props.toast.duration === undefined || props.toast.duration === null) {
        remainingDuration = null
        return
      }

      if (props.toast.duration <= 0) {
        remainingDuration = 0
        return
      }

      remainingDuration = props.toast.duration
      scheduleTimer(props.toast.duration)
    }

    onMounted(syncTimer)
    watch(() => [props.toast.id, props.toast.duration, props.onDismiss], syncTimer)
    onBeforeUnmount(clearTimer)

    return () =>
      h(
        "div",
        {
          class: "mw-toast-container__item",
          onMouseenter: () => {
            pointerInside = true
            pauseTimer()
          },
          onMouseleave: () => {
            pointerInside = false
            resumeTimer()
          },
          onFocusin: () => {
            focusInside = true
            pauseTimer()
          },
          onFocusout: (event: FocusEvent) => {
            const nextTarget = event.relatedTarget as Node | null

            if (
              event.currentTarget instanceof HTMLElement &&
              event.currentTarget.contains(nextTarget)
            ) {
              return
            }

            focusInside = false
            resumeTimer()
          },
        },
        [renderToastByIntent(props.toast, props.onDismiss)],
      )
  },
})

export const ToastContainer = defineComponent({
  name: "MarwesToastContainer",
  props: ["toasts", "placement", "maxVisible", "className", "onDismiss"],
  setup(rawProps) {
    const props = rawProps as ToastContainerProps

    const visibleToasts = computed(() => {
      if (!props.maxVisible || props.maxVisible <= 0) {
        return props.toasts
      }

      return props.toasts.slice(-props.maxVisible)
    })

    return () =>
      h(
        "div",
        {
          class: mergeClassNames(
            "mw-toast-container",
            `mw-toast-container--${props.placement ?? "top-right"}`,
            props.className,
          ),
        },
        visibleToasts.value.map((toast) =>
          h(ToastViewportItem, {
            key: toast.id,
            toast,
            ...(props.onDismiss ? { onDismiss: props.onDismiss } : {}),
          }),
        ),
      )
  },
})
