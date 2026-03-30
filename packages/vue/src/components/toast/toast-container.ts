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

  if (toast.dataAttributes !== undefined) {
    toastProps.dataAttributes = toast.dataAttributes
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

    function clearTimer() {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle)
        timeoutHandle = undefined
      }
    }

    function syncTimer() {
      clearTimer()

      if (
        !props.onDismiss ||
        props.toast.duration === undefined ||
        props.toast.duration === null ||
        props.toast.duration <= 0
      ) {
        return
      }

      timeoutHandle = setTimeout(() => {
        props.onDismiss?.(props.toast.id)
      }, props.toast.duration)
    }

    onMounted(syncTimer)
    watch(() => [props.toast.id, props.toast.duration, props.onDismiss], syncTimer)
    onBeforeUnmount(clearTimer)

    return () =>
      h("div", { class: "mw-toast-container__item" }, [
        renderToastByIntent(props.toast, props.onDismiss),
      ])
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
