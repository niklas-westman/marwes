import type { ResolvedTheme } from "@marwes-ui/core"
import { getMarwesContext } from "./context.js"

export interface UseThemeReturn {
  readonly theme: ResolvedTheme
}

/**
 * Returns a reactive reference to the resolved Marwes theme.
 * Must be called inside a component rendered within MarwesProvider.
 *
 * Access `theme` as a getter to stay reactive:
 * ```ts
 * const { theme } = useTheme();
 * // use theme.color.primary etc.
 * ```
 */
export function useTheme(): UseThemeReturn {
  const ctx = getMarwesContext()
  return {
    get theme() {
      return ctx.state.theme
    },
  }
}
