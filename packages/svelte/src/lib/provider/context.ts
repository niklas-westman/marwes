import { getContext, setContext } from "svelte"
import type { MarwesContextValue } from "./types.js"

const CONTEXT_KEY = Symbol("marwes-context")

export function setMarwesContext(value: MarwesContextValue): void {
  setContext(CONTEXT_KEY, value)
}

export function getMarwesContext(): MarwesContextValue {
  const ctx = getContext<MarwesContextValue | undefined>(CONTEXT_KEY)
  if (!ctx) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }
  return ctx
}
