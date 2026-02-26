import type { System } from "@marwes-ui/core"
import type { ComputedRef } from "vue"
import { inject } from "vue"
import { marwesContextKey } from "./marwes-context"

export function useSystem(): ComputedRef<System> {
  const context = inject(marwesContextKey, null)

  if (!context) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return context.system
}
