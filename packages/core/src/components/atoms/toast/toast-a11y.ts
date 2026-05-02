import type { ToastA11yProps, ToastOptions } from "./toast-types"

export function resolveToastA11y(opts: ToastOptions): ToastA11yProps {
  const ariaLive = opts.ariaLive ?? "polite"
  return {
    role: ariaLive === "assertive" ? "alert" : "status",
    ariaLive,
    ariaAtomic: true,
  }
}
