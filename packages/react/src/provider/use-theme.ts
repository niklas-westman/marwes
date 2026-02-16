import type { Theme } from "@marwes-ui/core"
import { useSystem } from "./use-system"

export function useTheme(): Theme {
  return useSystem().theme
}
