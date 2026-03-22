import type { ResolvedTheme } from "@marwes-ui/core"
import { inject } from "vue"
import { marwesContextKey } from "./marwes-context"

export function useTheme(): ResolvedTheme {
  const context = inject(marwesContextKey, null)

  if (!context) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }

  return context.theme.value
}
