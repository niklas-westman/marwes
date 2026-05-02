import { Fragment, defineComponent, h, inject, provide, shallowRef } from "vue"
import { createLocalId } from "../../internal/id"
import { ToastContainer } from "./toast-container"
import type {
  ManagedToast,
  ShowToastOptions,
  ToastController,
  ToastProviderProps,
} from "./toast-manager-types"
import { toastContextKey } from "./toast-manager-types"

export const ToastProvider = defineComponent({
  name: "MarwesToastProvider",
  props: ["placement", "maxVisible", "defaultDuration"],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as ToastProviderProps
    const toasts = shallowRef<ManagedToast[]>([])

    function dismiss(id: string) {
      const toast = toasts.value.find((item) => item.id === id)
      toast?.onDismiss?.()
      toasts.value = toasts.value.filter((item) => item.id !== id)
    }

    function clear() {
      for (const toast of toasts.value) {
        toast.onDismiss?.()
      }

      toasts.value = []
    }

    function show(toast: ShowToastOptions): string {
      const id = createLocalId("mw-toast")
      toasts.value = [
        ...toasts.value,
        {
          ...toast,
          id,
          duration:
            toast.duration === undefined
              ? props.defaultDuration === undefined
                ? 4000
                : props.defaultDuration
              : toast.duration,
        },
      ]
      return id
    }

    const controller: ToastController = {
      show,
      dismiss,
      clear,
    }

    provide(toastContextKey, controller)

    return () =>
      h(Fragment, null, [
        ...(slots.default?.() ?? []),
        h(ToastContainer as never, {
          toasts: toasts.value,
          onDismiss: dismiss,
          ...(props.placement ? { placement: props.placement } : {}),
          ...(props.maxVisible !== undefined ? { maxVisible: props.maxVisible } : {}),
        }),
      ])
  },
})

export function useToast(): ToastController {
  const controller = inject(toastContextKey, null)

  if (!controller) {
    throw new Error("ToastProvider is missing. Wrap your app in <ToastProvider />.")
  }

  return controller
}
