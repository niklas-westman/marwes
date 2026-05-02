import * as React from "react"
import { ToastContainer } from "./toast-container"
import type {
  ManagedToast,
  ShowToastOptions,
  ToastController,
  ToastProviderProps,
} from "./toast-manager-types"

const ToastContext = React.createContext<ToastController | null>(null)

export function ToastProvider(props: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = React.useState<ManagedToast[]>([])
  const idRef = React.useRef(0)

  const dismiss = React.useCallback((id: string) => {
    setToasts((currentToasts) => {
      const toast = currentToasts.find((item) => item.id === id)
      toast?.onDismiss?.()
      return currentToasts.filter((item) => item.id !== id)
    })
  }, [])

  const clear = React.useCallback(() => {
    setToasts((currentToasts) => {
      for (const toast of currentToasts) {
        toast.onDismiss?.()
      }

      return []
    })
  }, [])

  const show = React.useCallback(
    (toast: ShowToastOptions) => {
      idRef.current += 1
      const id = `mw-toast-${idRef.current}`

      setToasts((currentToasts) => [
        ...currentToasts,
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
      ])

      return id
    },
    [props.defaultDuration],
  )

  const value = React.useMemo<ToastController>(
    () => ({
      show,
      dismiss,
      clear,
    }),
    [clear, dismiss, show],
  )

  return (
    <ToastContext.Provider value={value}>
      {props.children}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismiss}
        {...(props.placement ? { placement: props.placement } : {})}
        {...(props.maxVisible !== undefined ? { maxVisible: props.maxVisible } : {})}
        {...(props.className ? { className: props.className } : {})}
      />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastController {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error("ToastProvider is missing. Wrap your app in <ToastProvider />.")
  }

  return context
}
