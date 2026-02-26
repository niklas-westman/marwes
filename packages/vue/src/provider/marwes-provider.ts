import type { Preset, System, ThemeMode, ThemeOverrides } from "@marwes-ui/core"
import { createSystem, switchMode } from "@marwes-ui/core"
import { firstEdition } from "@marwes-ui/presets"
import { computed, defineComponent, h, provide } from "vue"
import { marwesContextKey } from "./marwes-context"

export type MarwesProviderProps = {
  preset?: Preset
  theme?: ThemeOverrides
  mode?: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
}

export const MarwesProvider = defineComponent({
  name: "MarwesProvider",
  props: ["preset", "theme", "mode", "onModeChange"],
  setup(rawProps, { slots }) {
    const props = rawProps as unknown as MarwesProviderProps

    const system = computed<System>(() => {
      const preset = props.preset ?? firstEdition
      const mode = props.mode ?? "light"

      const initialSystem = createSystem({
        preset,
        theme: props.theme ? { ...props.theme, mode } : { mode },
      })

      if (mode === initialSystem.theme.mode) {
        return initialSystem
      }

      return switchMode(initialSystem, mode)
    })

    provide(marwesContextKey, {
      system,
      onModeChange: props.onModeChange,
    })

    return () =>
      h(
        "div",
        {
          class: `mw-theme--${system.value.theme.mode}`,
        },
        slots.default?.(),
      )
  },
})
