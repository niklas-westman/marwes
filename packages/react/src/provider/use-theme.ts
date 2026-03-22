import type { ResolvedTheme } from "@marwes-ui/core"
import * as React from "react"
import { MarwesContext } from "./marwes-context"

export function useTheme(): ResolvedTheme {
  const ctx = React.useContext(MarwesContext)
  if (!ctx) {
    throw new Error("MarwesProvider is missing. Wrap your app in <MarwesProvider />.")
  }
  return ctx.theme
}
