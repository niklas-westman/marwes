import type { Theme } from "@marwes-ui/core"
import { computed } from "vue"
import { useSystem } from "./use-system"

export function useTheme() {
  const system = useSystem()
  return computed<Theme>(() => system.value.theme)
}
